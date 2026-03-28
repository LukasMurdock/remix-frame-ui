# Autocomplete

Maturity: experimental

## When to use

- Uses input + listbox semantics and allows free-text entry.
- Requires a visible `label`, supports controlled and uncontrolled values, and emits commit events for suggestions or free text.

## Import

```ts
import { Autocomplete } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Autocomplete } from "@lukasmurdock/remix-ui-components"

const options = [
  { id: "us", label: "United States", value: "us" },
  { id: "ca", label: "Canada", value: "ca" },
  { id: "jp", label: "Japan", value: "jp" },
]

export function Example() {
  return <Autocomplete label="Country" options={options} defaultValue="ca" />
}
```

## HTML parity

`Autocomplete` uses input + listbox semantics and allows free-text entry.

## Runtime notes

Requires a visible `label`, supports controlled and uncontrolled values, and emits commit events for suggestions or free text.

## Accessibility matrix

| Requirement      | Behavior                                                            |
| ---------------- | ------------------------------------------------------------------- |
| Input role       | `role="combobox"` with listbox relationship                         |
| Input labeling   | visible label is required and bound to input `id`                   |
| Option semantics | rendered as `role="option"` entries                                 |
| Keyboard support | arrow navigation, Enter commit, Tab suggestion commit, Escape close |

## Keymap spec

- `ArrowDown`/`ArrowUp`: move active suggestion
- `Enter`: commit active suggestion or current free text
- `Tab`: commit highlighted suggestion
- `Escape`: close suggestions
