import { AttachInternals, Component, Element, Host, Prop, h } from '@stencil/core';
import {
  button,
  type ButtonVariant as RecipeVariants,
} from '@tmna-cx-design-system/styles/recipes';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Compile-time guard: these unions must stay identical to the recipe's variants.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const variantsMatch: Same<ButtonVariant, NonNullable<RecipeVariants['variant']>> = true;
const sizesMatch: Same<ButtonSize, NonNullable<RecipeVariants['size']>> = true;
void variantsMatch;
void sizesMatch;

/**
 * Primary call-to-action button. Renders a native `<button>`, or an `<a>` when `href` is set.
 *
 * @slot - Button label
 * @part control - The inner `<button>` or `<a>`, for rare site-level overrides
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

  /** Visual style: `primary` (filled) or `secondary` (outlined). */
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
    // e.g. "lds-button lds-button--variant_primary lds-button--size_md"
    const classes = button({ variant: this.variant, size: this.size });
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
