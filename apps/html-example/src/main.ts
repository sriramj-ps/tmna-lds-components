// 1. Design tokens (--lds-* variables) + every LDS recipe as plain classes.
//    A page that only uses <lds-*> elements can import the smaller tokens.css instead:
//    the components bring their own recipe CSS inside their shadow DOM.
import '@tmna-cx-design-system/styles/styles.css';
import './page.css';
// 2. Register the components this page uses. One import per component keeps the bundle small.
import { defineCustomElement as defineLdsButton } from '@tmna-cx-design-system/web-components/components/lds-button.js';

defineLdsButton();

// <lds-button type="submit"> submits its form like a native button, even from inside shadow DOM
const form = document.querySelector<HTMLFormElement>('#quote-form');
const result = document.querySelector<HTMLOutputElement>('#quote-result');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const zip = new FormData(form).get('zip');
  if (result) result.value = `Submitted ZIP ${String(zip)}`;
});
