import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';

type ButtonArgs = {
  label: string;
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  href?: string;
  onClick?: () => void;
};

const meta = {
  title: 'Core/Button',
  component: 'lds-button',
  args: { label: 'Build & Price', variant: 'primary', size: 'md', disabled: false, onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => html`
    <lds-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      href=${args.href ?? nothing}
      @click=${args.onClick}
      >${args.label}</lds-button
    >
  `,
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

/** Waits for Stencil to upgrade the element and returns its inner control. */
async function control(canvasElement: HTMLElement) {
  const host = canvasElement.querySelector('lds-button') as HTMLElement & {
    componentOnReady?: () => Promise<unknown>;
  };
  await customElements.whenDefined('lds-button');
  await host.componentOnReady?.();
  const inner = host.shadowRoot?.querySelector<HTMLElement>('[part="control"]');
  if (!inner) throw new Error('lds-button did not render its control');
  return inner;
}

export const Primary: Story = {
  play: async ({ canvasElement, args }) => {
    const inner = await control(canvasElement);
    await expect(inner.tagName).toBe('BUTTON');
    await userEvent.click(inner);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = { args: { variant: 'secondary', label: 'Learn more' } };

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center">
      <lds-button size="sm">Small</lds-button>
      <lds-button size="md">Medium</lds-button>
      <lds-button size="lg">Large</lds-button>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const inner = await control(canvasElement);
    await expect(inner).toBeDisabled();
  },
};

export const AsLink: Story = {
  args: { href: '/configurator', label: 'Configure yours' },
  play: async ({ canvasElement }) => {
    const inner = await control(canvasElement);
    await expect(inner.tagName).toBe('A');
    await expect(inner.getAttribute('href')).toBe('/configurator');
  },
};

/**
 * The same recipe as plain CSS classes, for pages that can't run JavaScript (or for
 * markup rendered by another framework). Needs `@tmna-cx-design-system/styles/styles.css`.
 * Prefer `<lds-button>`: it adds keyboard, form and link behaviour on top of the look.
 */
export const CssOnly: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;align-items:center">
      <button class="lds-button lds-button--variant_primary lds-button--size_md">Primary</button>
      <a class="lds-button lds-button--variant_secondary lds-button--size_md" href="#learn-more"
        >Secondary link</a
      >
    </div>
  `,
  play: async ({ canvasElement }) => {
    const [cssButton] = Array.from(canvasElement.querySelectorAll('button'));
    const host = document.createElement('lds-button');
    host.textContent = 'Web component';
    canvasElement.append(host);
    const inner = await control(canvasElement);
    // The class-only button and the web component must look identical
    await expect(getComputedStyle(cssButton).backgroundColor).toBe(
      getComputedStyle(inner).backgroundColor,
    );
    await expect(getComputedStyle(cssButton).paddingInlineStart).toBe(
      getComputedStyle(inner).paddingInlineStart,
    );
    host.remove();
  },
};

/** type="submit" must submit the surrounding form, even from inside shadow DOM. */
export const SubmitsForm: Story = {
  args: { onClick: fn() },
  render: (args) => html`
    <form
      @submit=${(e: SubmitEvent) => {
        e.preventDefault();
        args.onClick?.();
      }}
    >
      <lds-button type="submit">Submit</lds-button>
    </form>
  `,
  play: async ({ canvasElement, args }) => {
    const inner = await control(canvasElement);
    await userEvent.click(inner);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
