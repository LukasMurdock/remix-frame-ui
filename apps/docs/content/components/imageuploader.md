# ImageUploader

Maturity: experimental
Platform: mobile

## When to use

- Capture and preview multiple image files in mobile creation flows.
- Provide lightweight upload status and per-image removal before submit.

## Import

```ts
import { ImageUploader } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { ImageUploader } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <ImageUploader
      maxCount={6}
      upload={async (file) => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return {
          src: URL.createObjectURL(file),
          alt: file.name,
          fileName: file.name,
        }
      }}
    />
  )
}
```

## HTML parity

`ImageUploader` renders a native file input workflow with image-preview tiles and remove controls.

## Runtime notes

Supports controlled/uncontrolled value, async `beforeUpload` transforms, queue events (`onUploadQueueChange`), overflow handling (`onCountExceed`), and built-in `ImageViewer` previews from thumbnail taps.

## Accessibility matrix

| Requirement           | Behavior                                             |
| --------------------- | ---------------------------------------------------- |
| File picker semantics | uses native `input[type="file"]` under the add tile  |
| Status feedback       | each tile exposes upload state text via live updates |
| Remove actions        | each image includes a labeled remove button          |

## Keymap spec

- `Tab` / `Shift+Tab`: move through add and remove controls
- `Enter` / `Space`: open native file picker from add tile
