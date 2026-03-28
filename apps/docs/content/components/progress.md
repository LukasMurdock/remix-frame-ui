# Progress

Maturity: experimental

## When to use

- Communicate completion of long-running operations
- Provide compact read-only status indicators in dashboards and forms

## Import

```ts
import { Progress } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Progress } from "@lukasmurdock/remix-ui-components"

export function UploadProgress() {
  return <Progress label="Upload" value={72} max={100} tone="success" showValue />
}
```

## HTML parity

`Progress` renders a visual meter with native `role="progressbar"` semantics.

## Runtime notes

Clamps values between 0 and max and optionally shows percentage text.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Range semantics | exposes `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` |
| Tone feedback | supports neutral, success, warning, and danger tones |
| Label context | optional visible label and percentage display |

## Keymap spec

- No dedicated key handling; informational component only
