# lds-button

<!-- Auto Generated Below -->


## Overview

Primary call-to-action button. Renders a native `<button>`, or an `<a>` when `href` is set.

## Properties

| Property   | Attribute  | Description                                                | Type                              | Default     |
| ---------- | ---------- | ---------------------------------------------------------- | --------------------------------- | ----------- |
| `disabled` | `disabled` | Disables the button. Ignored when `href` is set.           | `boolean`                         | `false`     |
| `href`     | `href`     | When set, renders a link instead of a button.              | `string \| undefined`             | `undefined` |
| `size`     | `size`     | Size of the button.                                        | `"lg" \| "md" \| "sm"`            | `'md'`      |
| `target`   | `target`   | Link target, e.g. `_blank`. Only used with `href`.         | `string \| undefined`             | `undefined` |
| `type`     | `type`     | Native button type. `submit` submits the surrounding form. | `"button" \| "reset" \| "submit"` | `'button'`  |
| `variant`  | `variant`  | Visual style. Values come from the brand's tokens.         | `"primary" \| "secondary"`        | `'primary'` |


## Slots

| Slot | Description  |
| ---- | ------------ |
|      | Button label |


## Shadow Parts

| Part        | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `"control"` | The inner `<button>` or `<a>`, for rare site-level overrides |


----------------------------------------------


