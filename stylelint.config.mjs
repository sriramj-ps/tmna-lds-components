/** Shared Stylelint rules for every package's CSS. */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-strict-value'],
  ignoreFiles: ['**/dist/**', '**/www/**', '**/node_modules/**', '**/src/generated/**'],
  rules: {
    // Design-system rule: colours, type and spacing MUST come from tokens (var(--lds-...))
    'scale-unlimited/declaration-strict-value': [
      [
        '/color$/',
        'fill',
        'stroke',
        'font-family',
        'font-size',
        'font-weight',
        'line-height',
        '/^margin/',
        '/^padding/',
        'gap',
        'border-radius',
        'box-shadow',
      ],
      {
        ignoreValues: [
          '0',
          'auto',
          'inherit',
          'initial',
          'unset',
          'none',
          'transparent',
          'currentcolor',
          'normal',
        ],
        // allow calc(var(--lds-...)) etc.; raw colour functions are blocked by the rules below
        ignoreFunctions: true,
        expandShorthand: true,
        disableFix: true,
        message:
          'Use a design token, e.g. var(--lds-...), instead of a raw value for "${property}"',
      },
    ],
    // No raw colours anywhere: hex, named colours or colour functions
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
    ],
    // @import './x.css' (bundled by Lightning CSS)
    'import-notation': 'string',
    // Our custom-property naming: --lds-<group>-<name>
    'custom-property-pattern': [
      '^(lds|_)[a-z0-9-]*$',
      { message: 'Custom properties start with --lds-' },
    ],
    // Web components use :host and ::slotted
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['host', 'host-context'] }],
    'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: ['slotted', 'part'] }],
  },
};
