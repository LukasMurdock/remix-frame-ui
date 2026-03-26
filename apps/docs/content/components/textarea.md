# Textarea

Maturity: experimental

## HTML parity

`Textarea` wraps native `<textarea>` and applies shared input styling tokens.

## Runtime notes

Hydration optional. Works server-only unless you add dynamic behavior.

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
