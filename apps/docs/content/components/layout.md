# Layout

Maturity: stable

## When to use

- Provides semantic shell regions with `LayoutHeader`, `LayoutSider`, `LayoutContent`, and `LayoutFooter`.
- Use `direction` and `hasSider` to define high-level page scaffolding.

## Import

```ts
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, LayoutSider } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Layout hasSider>
      <LayoutHeader>
        <strong>Workspace</strong>
        <button type="button">Toggle sidebar</button>
      </LayoutHeader>
      <Layout direction="row" hasSider>
        <LayoutSider width="16rem">Sidebar</LayoutSider>
        <LayoutContent>Main content</LayoutContent>
      </Layout>
      <LayoutFooter>Footer utilities</LayoutFooter>
    </Layout>
  )
}
```

## HTML parity

`Layout` provides semantic shell regions with `LayoutHeader`, `LayoutSider`, `LayoutContent`, and `LayoutFooter`.

## Runtime notes

Use `direction` and `hasSider` to define high-level page scaffolding. `LayoutSider` supports width customization and collapsed state.

## Accessibility matrix

| Requirement        | Behavior                                                     |
| ------------------ | ------------------------------------------------------------ |
| Landmark semantics | uses native `header`, `aside`, `main`, and `footer` elements |
| Sidebar state      | collapsed sider maps to `hidden` behavior                    |
| Keyboard           | no component-level key handling                              |

## Keymap spec

- No component-level key bindings.
