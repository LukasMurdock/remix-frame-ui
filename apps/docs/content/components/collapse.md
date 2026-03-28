# Collapse

Maturity: experimental

## When to use

- Renders native `<details>` and `<summary>` semantics for disclosure content.
- Use `open` for initial expansion state.

## Import

```ts
import { Collapse } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Collapse } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <Collapse title="Deployment checklist" open>
      Run tests, build docs, and confirm accessibility before merge.
    </Collapse>
  )
}
```

## HTML parity

`Collapse` renders native `<details>` and `<summary>` semantics for disclosure content.

## Runtime notes

Use `open` for initial expansion state. Native details behavior handles keyboard and pointer interactions without custom hydration.

## Accessibility matrix

| Requirement          | Behavior                                             |
| -------------------- | ---------------------------------------------------- |
| Disclosure semantics | native summary controls details visibility           |
| Keyboard Enter/Space | toggles summary using native browser behavior        |
| State reflection     | expansion state reflected by native `open` attribute |

## Keymap spec

- `Enter`: toggles disclosure when summary is focused
- `Space`: toggles disclosure when summary is focused
