// Builds design tokens for every brand with Style Dictionary 5.
// Input:  src/primitives/*.tokens.json (shared) + src/brands/<brand>.tokens.json (per brand)
// Output: dist/css, dist/js, dist/json
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';

const BRANDS = ['toyota', 'lexus'];
const DEFAULT_BRAND = 'toyota';

// Palette tokens are raw ingredients: components must use semantic names, so palette is not exported.
const notPalette = (token) => token.path[0] !== 'palette';

await rm('dist', { recursive: true, force: true });

for (const brand of BRANDS) {
  const sd = new StyleDictionary({
    source: ['src/primitives/**/*.tokens.json', `src/brands/${brand}.tokens.json`],
    usesDtcg: true,
    log: { warnings: 'error', verbosity: 'default' },
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'lds',
        buildPath: 'dist/css/',
        files: [
          {
            // Stand-alone file for a site that only ever shows this brand
            destination: `${brand}.css`,
            format: 'css/variables',
            filter: notPalette,
            options: { selector: `:root, [data-brand="${brand}"]`, outputReferences: false },
          },
          {
            // Piece of the combined multi-brand file (only the default brand claims :root)
            destination: `.parts/${brand}.css`,
            format: 'css/variables',
            filter: notPalette,
            options: {
              selector:
                brand === DEFAULT_BRAND
                  ? `:root, [data-brand="${brand}"]`
                  : `[data-brand="${brand}"]`,
              outputReferences: false,
            },
          },
        ],
      },
      js: {
        transformGroup: 'js',
        buildPath: 'dist/js/',
        files: [
          { destination: `${brand}.js`, format: 'javascript/es6', filter: notPalette },
          {
            destination: `${brand}.d.ts`,
            format: 'typescript/es6-declarations',
            filter: notPalette,
          },
        ],
      },
      json: {
        transformGroup: 'js',
        buildPath: 'dist/json/',
        files: [{ destination: `${brand}.json`, format: 'json/nested', filter: notPalette }],
      },
    },
  });
  await sd.buildAllPlatforms();
}

// Combined file: default brand first, other brands after it so they win when data-brand is set
const parts = await Promise.all(BRANDS.map((b) => readFile(`dist/css/.parts/${b}.css`, 'utf8')));
await mkdir('dist/css', { recursive: true });
await writeFile('dist/css/tokens.css', parts.join('\n'));
await rm('dist/css/.parts', { recursive: true, force: true });
console.log(`Built tokens for: ${BRANDS.join(', ')}`);
