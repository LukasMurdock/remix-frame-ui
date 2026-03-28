# @lukasmurdock/remix

Component library for `remix/component` applications.

## Install

```bash
pnpm add @lukasmurdock/remix @lukasmurdock/styles
```

## Usage

```tsx
import "@lukasmurdock/styles/src/index.css"
import { Button, Input } from "@lukasmurdock/remix"

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

- Package exports include `@lukasmurdock/remix/server` and `@lukasmurdock/remix/client`.
- Most components are currently marked `experimental`.
