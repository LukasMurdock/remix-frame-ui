# @lukasmurdock/remix-ui-components

Component library for `remix/component` applications.

## Install

```bash
pnpm add @lukasmurdock/remix-ui-components @lukasmurdock/remix-ui-styles
```

## Usage

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import { Button, Input } from "@lukasmurdock/remix-ui-components"

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

- Package exports include `@lukasmurdock/remix-ui-components/server` and `@lukasmurdock/remix-ui-components/client`.
- Most components are currently marked `experimental`.
