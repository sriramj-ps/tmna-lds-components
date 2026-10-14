import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, test } from 'vitest';
import { LdsButton } from './index';

// Lets React's act() work outside a test-renderer environment
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

test('LdsButton passes props to <lds-button> and forwards clicks', async () => {
  const container = document.createElement('div');
  document.body.append(container);
  let clicks = 0;

  await act(async () => {
    createRoot(container).render(
      <LdsButton variant="secondary" size="lg" onClick={() => clicks++}>
        Build &amp; Price
      </LdsButton>,
    );
  });

  const host = container.querySelector('lds-button');
  expect(host).not.toBeNull();
  await customElements.whenDefined('lds-button');
  await expect.poll(() => host?.shadowRoot?.querySelector('button')).toBeTruthy();

  expect(host?.getAttribute('variant')).toBe('secondary');
  expect(host?.getAttribute('size')).toBe('lg');
  expect(host?.textContent).toBe('Build & Price');

  host?.shadowRoot?.querySelector('button')?.click();
  expect(clicks).toBe(1);
});
