// Bundles src/index.css (+ its @imports) into dist/foundation.css and a minified copy.
import { bundle, browserslistToTargets } from 'lightningcss';
import { mkdir, writeFile } from 'node:fs/promises';
import browserslist from 'browserslist';

// Browsers we support (keep in sync with the sites' support policy)
const targets = browserslistToTargets(
  browserslist(['last 2 versions', 'Safari >= 16', 'not dead']),
);

await mkdir('dist', { recursive: true });
for (const minify of [false, true]) {
  const { code } = bundle({ filename: 'src/index.css', minify, targets });
  await writeFile(minify ? 'dist/foundation.min.css' : 'dist/foundation.css', code);
}
console.log('Built dist/foundation.css and dist/foundation.min.css');
