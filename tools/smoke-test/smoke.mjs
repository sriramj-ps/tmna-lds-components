#!/usr/bin/env node
// Production-build smoke test for the example apps (HTML, React, Angular):
//
//   lds-smoke <built site folder>        e.g. lds-smoke dist   |   lds-smoke dist/browser
//
// Serves the folder, opens it in Chromium and fails when:
//   - the page throws, or the LDS token variables are missing
//   - an <lds-*> element never renders its shadow DOM, or its recipe CSS is not applied
//   - the page's smoke form (form[data-smoke]) does not submit through its <lds-button type="submit">
//     and print something into [data-smoke-result]
// This is what consumers do, so it catches broken exports, tree-shaken registration and missing CSS.
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { preview } from 'vite';

const outDir = resolve(process.argv[2] ?? 'dist');
const failures = [];

const server = await preview({
  configFile: false,
  logLevel: 'warn',
  build: { outDir },
  preview: { port: 0, open: false },
});
const url = server.resolvedUrls?.local[0];
// PW_CHROMIUM_PATH lets CI images with a preinstalled Chromium skip the Playwright download
const browser = await chromium.launch({
  executablePath: process.env['PW_CHROMIUM_PATH'] || undefined,
});

try {
  const page = await browser.newPage();
  page.on('pageerror', (error) => failures.push(`page error: ${error.message}`));
  await page.goto(url);

  const tokens = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--lds-colors-black').trim(),
  );
  if (!tokens)
    failures.push(
      'token variables (--lds-*) are missing: load @tmna-cx-design-system/styles/tokens.css',
    );

  const tags = await page.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll('*')]
        .map((el) => el.localName)
        .filter((n) => n.startsWith('lds-')),
    ),
  ]);
  if (tags.length === 0) failures.push('no <lds-*> elements on the page');

  for (const tag of tags) {
    const rendered = await page
      .waitForFunction(
        (t) =>
          [...document.querySelectorAll(t)].every((el) => el.shadowRoot?.querySelector('[part]')),
        tag,
        { timeout: 10_000 },
      )
      .then(
        () => true,
        () => false,
      );
    if (!rendered) {
      failures.push(
        `<${tag}> never rendered: is it registered (register, wrapper or loader import)?`,
      );
      continue;
    }
    // The component's recipe CSS (class .lds-<name>) must be inside its shadow root
    const styled = await page.evaluate((t) => {
      const root = document.querySelector(t).shadowRoot;
      const rules = (list) =>
        [...list].flatMap((r) => [r, ...(r.cssRules ? rules(r.cssRules) : [])]);
      const sheets = [...root.adoptedStyleSheets, ...root.styleSheets];
      const hasRecipe = sheets.some((s) =>
        rules(s.cssRules).some((r) => r.selectorText?.includes(`.${t}`)),
      );
      return hasRecipe && root.querySelector('[part]').classList.contains(t);
    }, tag);
    if (!styled) failures.push(`<${tag}> rendered without its recipe styles`);
  }

  if (await page.locator('form[data-smoke]').count()) {
    // Find it by property: wrappers set `type` as a property, so there may be no attribute
    const submit = await page.evaluateHandle(() =>
      [...document.querySelectorAll('form[data-smoke] lds-button')].find(
        (el) => el.type === 'submit',
      ),
    );
    if (!submit.asElement()) {
      failures.push('form[data-smoke] has no rendered <lds-button type="submit">');
    } else {
      await submit.asElement().click();
      const result = await page
        .waitForFunction(
          () => document.querySelector('[data-smoke-result]')?.textContent?.trim(),
          null,
          { timeout: 5_000 },
        )
        .then(
          (h) => h.jsonValue(),
          () => '',
        );
      if (!result)
        failures.push('form[data-smoke] did not submit through <lds-button type="submit">');
    }
  }
} finally {
  await browser.close();
  await new Promise((done) => server.httpServer.close(done));
}

if (failures.length) {
  console.error(`✖ Smoke test failed for ${outDir}\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}
console.log(`✔ Smoke test passed for ${outDir}`);
