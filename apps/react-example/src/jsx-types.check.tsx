// Compile-time check of @tmna-cx-design-system/web-components/jsx. Never rendered or bundled:
// `nx typecheck react-example` fails if the shipped JSX types stop catching mistakes.
import type {} from '@tmna-cx-design-system/web-components/jsx';

export const valid = (
  <lds-button variant="secondary" size="sm" type="submit">
    OK
  </lds-button>
);

// @ts-expect-error "blue" is not a button variant
export const wrongVariant = <lds-button variant="blue">Bad</lds-button>;

// @ts-expect-error lds-button has no "color" prop
export const unknownProp = <lds-button color="red">Bad</lds-button>;
