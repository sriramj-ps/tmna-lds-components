import { AttachInternals, Component, Element, Host, Prop, h } from '@stencil/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Primary call-to-action button. Renders a native <button>, or an <a> when `href` is set.
 *
 * @slot - Button label
 * @part control - The inner <button> or <a>, for rare site-level overrides
 */
@Component({
  tag: 'lds-button',
  styleUrl: 'lds-button.css',
  shadow: { delegatesFocus: true },
  formAssociated: true,
})
export class LdsButton {
  @Element() el!: HTMLElement;
  @AttachInternals() internals!: ElementInternals;

  /** Visual style. Values come from the brand's tokens. */
  @Prop({ reflect: true }) variant: ButtonVariant = 'primary';

  /** Size of the button. */
  @Prop({ reflect: true }) size: ButtonSize = 'md';

  /** Disables the button. Ignored when `href` is set. */
  @Prop({ reflect: true }) disabled = false;

  /** Native button type. `submit` submits the surrounding form. */
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  /** When set, renders a link instead of a button. */
  @Prop() href?: string;

  /** Link target, e.g. `_blank`. Only used with `href`. */
  @Prop() target?: string;

  // A <button> inside shadow DOM can't see the outer <form>, so we forward it via ElementInternals.
  private handleClick = (event: MouseEvent) => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const form = this.internals.form;
    if (!form) return;
    if (this.type === 'submit') form.requestSubmit();
    if (this.type === 'reset') form.reset();
  };

  render() {
    const classes = {
      control: true,
      [`control--${this.variant}`]: true,
      [`control--${this.size}`]: true,
    };
    return (
      <Host onClick={this.handleClick}>
        {this.href ? (
          <a
            part="control"
            class={classes}
            href={this.href}
            target={this.target}
            rel={this.target === '_blank' ? 'noopener noreferrer' : undefined}
          >
            <slot />
          </a>
        ) : (
          <button part="control" class={classes} type="button" disabled={this.disabled}>
            <slot />
          </button>
        )}
      </Host>
    );
  }
}
