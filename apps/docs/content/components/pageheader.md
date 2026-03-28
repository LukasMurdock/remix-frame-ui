# PageHeader

Maturity: experimental

## When to use

- Composes native heading and metadata text with optional action region.
- Is layout-focused and does not require hydration unless actions are interactive.

## Import

```ts
import { PageHeader } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { PageHeader } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <PageHeader
      title="Deployments"
      subtitle="Track release progress"
      actions={<button type="button">Create deployment</button>}
    />
  )
}
```

## HTML parity

`PageHeader` composes native heading and metadata text with optional action region.

## Runtime notes

`PageHeader` is layout-focused and does not require hydration unless actions are interactive.

## Accessibility matrix

| Requirement       | Behavior                                |
| ----------------- | --------------------------------------- |
| Heading semantics | renders title as top-level heading      |
| Supporting text   | optional subtitle paragraph             |
| Action placement  | actions are grouped in dedicated region |

## Keymap spec

- Keyboard behavior is inherited from child action controls.
