import { useState, type FormEvent } from 'react';
// 2a. React wrappers: typed props and React-style events. Works in React 18 and 19.
import { LdsButton } from '@tmna-cx-design-system/react';
// 2b. Or the custom elements themselves (React 19 renders them natively). `register` defines
//     every <lds-*> tag; the `jsx` types give <lds-button> autocomplete and type errors.
import '@tmna-cx-design-system/web-components/register';
import type {} from '@tmna-cx-design-system/web-components/jsx';

export function App() {
  const [clicks, setClicks] = useState(0);
  const [result, setResult] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const zip = new FormData(event.currentTarget).get('zip');
    setResult(`Submitted ZIP ${String(zip)}`);
  };

  return (
    <main className="page">
      <h1>LDS in React</h1>

      <section className="example" aria-labelledby="wrappers-heading">
        <h2 id="wrappers-heading">1. React wrappers (recommended)</h2>
        <div className="row">
          <LdsButton onClick={() => setClicks((n) => n + 1)}>Build &amp; Price</LdsButton>
          <LdsButton variant="secondary" href="#offers">
            Offers (link)
          </LdsButton>
          <span>Clicked {clicks} times</span>
        </div>
      </section>

      <section className="example" aria-labelledby="elements-heading">
        <h2 id="elements-heading">2. Custom elements with typed JSX (React 19)</h2>
        <div className="row">
          <lds-button variant="secondary" size="lg">
            Learn more
          </lds-button>
          <lds-button size="sm" disabled>
            Disabled
          </lds-button>
        </div>
      </section>

      <form className="row" onSubmit={submit} data-smoke>
        <label>
          ZIP code <input name="zip" defaultValue="75024" inputMode="numeric" />
        </label>
        <LdsButton type="submit">Get a quote</LdsButton>
        <output data-smoke-result>{result}</output>
      </form>
    </main>
  );
}
