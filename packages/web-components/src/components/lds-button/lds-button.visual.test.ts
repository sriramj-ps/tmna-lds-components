import { page } from 'vitest/browser';
import { beforeAll, expect, test } from 'vitest';
// Only the token variables: proves the component brings its own recipe CSS into its shadow root
import '@tmna-cx-design-system/styles/tokens.css';
// The built, bundler-friendly component (run `nx build web-components` first; Nx does this for you)
import { defineCustomElement } from '../../../components/lds-button.js';

beforeAll(() => defineCustomElement());

// Wait until every <lds-button> has rendered its shadow DOM
async function ready(root: ParentNode) {
  await customElements.whenDefined('lds-button');
  for (const host of Array.from(root.querySelectorAll('lds-button'))) {
    await expect.poll(() => host.shadowRoot?.querySelector('[part="control"]')).toBeTruthy();
  }
}

// One screenshot per brand once the styling repo ships brand themes (data-panda-theme)
test('lds-button looks right', async () => {
  document.body.innerHTML = `
    <div data-testid="stage"
         style="display:inline-flex;gap:8px;padding:8px;font-family:Arial,sans-serif">
      <lds-button>Primary</lds-button>
      <lds-button variant="secondary">Secondary</lds-button>
      <lds-button size="sm">Small</lds-button>
      <lds-button size="lg">Large</lds-button>
      <lds-button disabled>Disabled</lds-button>
    </div>`;
  await ready(document.body);
  await expect.element(page.getByTestId('stage')).toMatchScreenshot('lds-button');
});
