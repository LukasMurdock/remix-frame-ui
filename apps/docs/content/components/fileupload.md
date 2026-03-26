# FileUpload

Maturity: experimental

## HTML parity

`FileUpload` wraps native `<input type="file">` with support for `multiple`, `accept`, and `capture`.

## Runtime notes

Hydration optional for basic file selection. Add runtime behavior for previews and upload progress.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label association | via native `<label for>` and `id` |
| File constraints | native `accept`, `multiple`, and `capture` attributes |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `Tab`: next focus target
- `Enter` / `Space`: opens native file picker
