# @remix-frame-ui/remix

Component library for `remix/component` applications.

## Install

```bash
pnpm add @remix-frame-ui/remix @remix-frame-ui/styles
```

## Usage

```tsx
import "@remix-frame-ui/styles/src/index.css"
import { Button, Input } from "@remix-frame-ui/remix"

export function FormRow() {
  return (
    <div>
      <Input name="email" type="email" />
      <Button type="submit">Continue</Button>
    </div>
  )
}
```

## Notes

- Package exports include `@remix-frame-ui/remix/server` and `@remix-frame-ui/remix/client`.
- Most components are currently marked `experimental`.
