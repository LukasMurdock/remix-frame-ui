# Radio

Maturity: experimental

## When to use

- Collect exactly one value from a known set of options
- Use `RadioGroup` when options share one legend and validation context

## Import

```ts
import { Radio, RadioGroup } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { RadioGroup } from "@lukasmurdock/remix-ui-components"

const options = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]

export function BillingCycle() {
  return <RadioGroup legend="Billing cycle" name="billingCycle" options={options} />
}
```

## HTML parity

`Radio` uses native `<input type="radio">`; `RadioGroup` composes a native `<fieldset>` and `<legend>`.

## Runtime notes

Group behavior depends on shared `name` and browser-native exclusivity. `RadioGroup` supports orientation and `onValueChange` hooks for app state wiring.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Group labeling | native legend support |
| Error support | optional group-level error description |
| Single selection | native radio semantics |

## Keymap spec

- `Tab`: enters/leaves group
- Arrow keys: browser native radio navigation
