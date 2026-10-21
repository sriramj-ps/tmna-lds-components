import { defineRecipe } from '../define-recipe';

/**
 * Call-to-action button. Used by the `lds-button` web component (inside its shadow DOM)
 * and directly as CSS classes on plain HTML pages.
 *
 * Every value is a token from @tmna/panda-preset-base. Brand-specific colours will move to
 * semantic tokens once the styling repo publishes them.
 */
export const button = defineRecipe({
  className: 'button',
  description: 'LDS call-to-action button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderWidth: '1',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: '1',
    fontFamily: 'sans',
    fontWeight: 'semibold',
    lineHeight: 'tight',
    textDecoration: 'none',
    cursor: 'click',
    transitionProperty: 'background-color, color, box-shadow',
    transitionDuration: 'fast',
    transitionTimingFunction: 'default',
    _focusVisible: {
      outlineWidth: '2',
      outlineStyle: 'solid',
      outlineColor: 'black',
      outlineOffset: '1',
    },
    _disabled: {
      cursor: 'disabled',
      opacity: '0.5',
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'black',
        color: 'white',
        _hover: { boxShadow: 'md' },
      },
      secondary: {
        backgroundColor: 'white',
        color: 'black',
        borderColor: 'black',
        _hover: { backgroundColor: 'black', color: 'white' },
      },
    },
    size: {
      sm: { paddingInline: '4', paddingBlock: '2', fontSize: '0' },
      md: { paddingInline: '5', paddingBlock: '3', fontSize: '1' },
      lg: { paddingInline: '7', paddingBlock: '4', fontSize: '2' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
