import { expect, test } from 'vitest';
import manifest from '../dist/custom-elements.json';
import '../register/index.js';

// Every component in the manifest must be defined by the one-line `register` import
test('register defines every LDS custom element', () => {
  const tags = manifest.modules.flatMap((m) =>
    (m.declarations ?? []).flatMap((d) => ('tagName' in d && d.tagName ? [d.tagName] : [])),
  );
  expect(tags.length).toBeGreaterThan(0);
  for (const tag of tags) expect(customElements.get(tag), tag).toBeDefined();
});
