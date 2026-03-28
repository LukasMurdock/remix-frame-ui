# Textarea

Maturity: experimental

## When to use

- Capture multi-line freeform input such as notes, descriptions, or feedback
- Keep native editing behavior with optional live value wiring

## Import

```ts
import { Textarea } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Textarea } from "@lukasmurdock/remix-ui-components"

export function NotesField() {
  return <Textarea id="notes" name="notes" rows={6} onValueChange={(value) => console.log(value)} />
}
```

## HTML parity

`Textarea` wraps native `<textarea>` and applies shared input styling tokens.

## Runtime notes

Hydration optional. Works server-only unless you add dynamic behavior like `onValueChange` for live character feedback.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via native `<label for>` and `id` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |
| Keyboard input | native multiline editing behavior |

## Keymap spec

- Printable keys: updates value
- `Enter`: inserts line break
- `Tab`: next focus target
