# NumberInput

Maturity: experimental

## When to use

- Capture numeric values with native min/max/step constraints
- Use browser-native increment and decrement interactions

## Import

```ts
import { NumberInput } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { NumberInput } from "@lukasmurdock/remix-ui-components"

export function SeatsField() {
  return <NumberInput id="seats" name="seats" min={1} max={200} step={1} defaultValue={25} />
}
```

## HTML parity

`NumberInput` wraps native `<input type="number">` with min/max/step support.

## Runtime notes

Hydration optional unless you add dynamic increment/decrement behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via native `<label for>` and `id` |
| Value constraints | native `min`, `max`, and `step` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `ArrowUp`: increment by step
- `ArrowDown`: decrement by step
- `Tab`: next focus target
