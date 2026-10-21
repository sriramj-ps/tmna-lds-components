import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 1. Design tokens (--lds-* variables), once per app
import '@tmna-cx-design-system/styles/tokens.css';
import './page.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
