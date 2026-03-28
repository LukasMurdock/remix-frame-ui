# FileUpload

Maturity: experimental

## When to use

- Wraps native `<input type="file">` with support for `multiple`, `accept`, and `capture`.
- Hydration optional for basic file selection.

## Import

```ts
import { FileUpload } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { FileUpload } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <FileUpload name="attachments" accept={[".png", ".jpg", ".pdf"]} multiple />
}
```

## HTML parity

`FileUpload` wraps native `<input type="file">` with support for `multiple`, `accept`, and `capture`.

## Runtime notes

Hydration optional for basic file selection. Add runtime behavior for previews and upload progress.

## Accessibility matrix

| Requirement       | Behavior                                              |
| ----------------- | ----------------------------------------------------- |
| Label association | via native `<label for>` and `id`                     |
| File constraints  | native `accept`, `multiple`, and `capture` attributes |
| Error wiring      | supports `aria-describedby` and `aria-invalid`        |

## Keymap spec

- `Tab`: next focus target
- `Enter` / `Space`: opens native file picker
