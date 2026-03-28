# First Page

This example uses stable primitives to build a basic page shell.

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import {
  Heading,
  Layout,
  LayoutContent,
  LayoutHeader,
  Link,
  Space,
  Text,
} from "@lukasmurdock/remix-ui-components"

export function HomePage() {
  return (
    <Layout>
      <LayoutHeader>
        <Heading level={1}>Dashboard</Heading>
      </LayoutHeader>
      <LayoutContent>
        <Space direction="vertical" align="start">
          <Text>Ship with stable primitives first.</Text>
          <Link href="/settings">Go to settings</Link>
        </Space>
      </LayoutContent>
    </Layout>
  )
}
```

Next: add form controls with `Form`, then layer in experimental components for richer workflows.
