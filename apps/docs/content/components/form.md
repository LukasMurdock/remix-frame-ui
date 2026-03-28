# Form

Maturity: stable

## When to use

- Build native form submissions with predictable semantics
- Expose pending and validation states without replacing browser behavior

## Import

```ts
import { Form, FormErrorSummary } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Button, Form, FormErrorSummary } from "@lukasmurdock/remix-ui-components"

export function SignupForm() {
  const errors: string[] = []

  return (
    <Form method="post" action="/signup" busy={false} aria-describedby="signup-errors">
      <FormErrorSummary id="signup-errors" errors={errors} />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <Button type="submit">Create account</Button>
    </Form>
  )
}
```

## HTML parity

`Form` renders a native `<form>` and preserves `action`, `method`, `encType`, and `noValidate` behavior.

## Runtime notes

Use `busy` to express pending submissions via `aria-busy` and a `data-busy` attribute. `FormErrorSummary` renders an alert region for submission validation errors.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Form semantics | native form submission and field grouping |
| Busy state | `aria-busy="true"` when pending |
| Error summary | assertive `role="alert"` region for validation issues |
| Keyboard Enter | submits according to native form rules |

## Keymap spec

- `Enter`: native submit behavior from focused submit-capable controls
