# First Form

`Form` is stable and works well as the backbone of form flows.

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import { Form, Space, Text } from "@lukasmurdock/remix-ui-components"

export function NewsletterForm() {
  return (
    <Form method="post" action="/subscribe">
      <Space direction="vertical" align="start">
        <Text as="strong">Subscribe to updates</Text>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <button type="submit">Subscribe</button>
      </Space>
    </Form>
  )
}
```

For richer field composition, see `Field`, `Input`, `FormLayout`, and `FormMessage` component pages.
