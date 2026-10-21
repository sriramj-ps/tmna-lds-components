import { Component, signal } from '@angular/core';
// Generated standalone wrappers: typed inputs, and the custom element is defined on first use
import { LdsButton } from '@tmna-cx-design-system/angular';

@Component({
  selector: 'app-root',
  imports: [LdsButton],
  template: `
    <main class="page">
      <h1>LDS in Angular</h1>

      <section class="example" aria-labelledby="wrappers-heading">
        <h2 id="wrappers-heading">Standalone wrappers</h2>
        <div class="row">
          <lds-button (click)="clicks.set(clicks() + 1)">Build &amp; Price</lds-button>
          <lds-button variant="secondary" href="#offers">Offers (link)</lds-button>
          <lds-button size="sm" [disabled]="true">Disabled</lds-button>
          <span>Clicked {{ clicks() }} times</span>
        </div>
      </section>

      <form class="row" (submit)="submit($event)" data-smoke>
        <label>ZIP code <input name="zip" value="75024" inputmode="numeric" /></label>
        <lds-button type="submit">Get a quote</lds-button>
        <output data-smoke-result>{{ result() }}</output>
      </form>
    </main>
  `,
})
export class App {
  protected readonly clicks = signal(0);
  protected readonly result = signal('');

  // <lds-button type="submit"> submits its form like a native button, even from inside shadow DOM
  protected submit(event: Event) {
    event.preventDefault();
    const zip = new FormData(event.target as HTMLFormElement).get('zip');
    this.result.set(`Submitted ZIP ${String(zip)}`);
  }
}
