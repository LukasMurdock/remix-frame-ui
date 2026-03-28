# Checkbox

Maturity: experimental

## When to use

- Capture boolean opt-in or opt-out values
- Support multi-select checklists where each option is independent

## Import

```ts
import { Checkbox } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Checkbox } from "@lukasmurdock/remix-ui-components"

export function TermsCheckbox() {
  return (
    <Checkbox id="terms" name="terms" required>
      I agree to the terms
    </Checkbox>
  )
}
```

## HTML parity

`Checkbox` renders native `<input type="checkbox">` and keeps default submit value `on` when no value is provided.

## Runtime notes

Hydration optional. Static checked state works server-only.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native checkbox role |
| Checked state | native `checked` / `defaultChecked` |
| Submission | native name/value semantics |

## Keymap spec

- `Space`: toggles checked state
