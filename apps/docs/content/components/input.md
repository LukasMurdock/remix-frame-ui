# Input

Maturity: experimental

## When to use

- Capture short freeform text, email, password, URL, phone, or search values
- Pair with `Field` when you need label/description/error wiring

## Import

```ts
import { Input } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Input } from "@lukasmurdock/remix-ui-components"

export function EmailField() {
  return <Input id="email" name="email" type="email" required placeholder="you@company.com" />
}
```

## HTML parity

`Input` is a native `<input>` wrapper limited to text-like types in v1.

## Runtime notes

No hydration required unless composed with dynamic event behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via `<label for>` and `id` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |
| Keyboard input | native text editing behavior |

## Keymap spec

- Printable keys: updates value
- `Tab`: next focus target
