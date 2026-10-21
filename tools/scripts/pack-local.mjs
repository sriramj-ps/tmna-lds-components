// Packs every publishable LDS package into dist/local-packs/ as it would be published, so a real
// app (an AEM clientlib build, a React or Angular app) can try LDS before a release:
//
//   pnpm nx run-many -t build
//   pnpm pack:local
//
// Then point the app at the tarballs with the overrides printed at the end (also written to
// dist/local-packs/overrides.json). See the "Guides/Test locally" page in Storybook.
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const out = join(root, 'dist/local-packs');
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));

// Publishable packages: not private, under packages/. Angular publishes ng-packagr's dist/
// (its nx-release-publish packageRoot); the rest publish their own folder.
const projects = readdirSync(join(root, 'packages'), { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() && existsSync(join(root, 'packages', entry.name, 'package.json')),
  )
  .map((entry) => {
    const dir = join(root, 'packages', entry.name);
    const manifest = readJson(join(dir, 'package.json'));
    const packageRoot = manifest.nx?.targets?.['nx-release-publish']?.options?.packageRoot;
    return {
      dir,
      manifest,
      publishDir: packageRoot ? packageRoot.replace('{projectRoot}', dir) : dir,
    };
  })
  .filter(({ manifest }) => !manifest.private);

const versions = Object.fromEntries(
  projects.map(({ manifest }) => [manifest.name, manifest.version]),
);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const overrides = {};
for (const { dir, manifest, publishDir } of projects) {
  if (!existsSync(join(publishDir, 'package.json'))) {
    throw new Error(
      `${manifest.name}: ${publishDir} is missing. Run \`pnpm nx run-many -t build\` first.`,
    );
  }
  const before = new Set(readdirSync(out));
  if (publishDir === dir) {
    // pnpm pack swaps workspace: and catalog: versions for real ones, as a publish would
    execFileSync('pnpm', ['pack', '--pack-destination', out], { cwd: dir, stdio: 'ignore' });
  } else {
    // A build output folder is not a workspace project, so swap workspace: versions ourselves
    const temp = mkdtempSync(join(tmpdir(), 'lds-pack-'));
    cpSync(publishDir, temp, { recursive: true });
    const published = readJson(join(temp, 'package.json'));
    for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
      for (const [name, range] of Object.entries(published[field] ?? {})) {
        if (range.startsWith('workspace:')) published[field][name] = `^${versions[name]}`;
      }
    }
    delete published.devDependencies;
    delete published.nx;
    writeFileSync(join(temp, 'package.json'), `${JSON.stringify(published, null, 2)}\n`);
    execFileSync('npm', ['pack', '--pack-destination', out], { cwd: temp, stdio: 'ignore' });
    rmSync(temp, { recursive: true, force: true });
  }
  const [tarball] = readdirSync(out).filter((file) => !before.has(file));
  overrides[manifest.name] = `file:${join(out, tarball)}`;
}

writeFileSync(join(out, 'overrides.json'), `${JSON.stringify(overrides, null, 2)}\n`);
console.log(`Packed ${projects.length} packages into ${out}\n`);
console.log(
  'Add to your app\'s package.json ("overrides" for npm, "pnpm": { "overrides" } for pnpm):',
);
console.log(JSON.stringify(overrides, null, 2));
