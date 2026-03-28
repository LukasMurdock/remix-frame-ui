# ConfigProvider

Maturity: experimental

## When to use

- Wraps application content and sets `lang` and `dir` on the provider root.
- Supports app-level locale, direction, color scheme, reduced motion, and delegated link navigation via `router.navigate` and `onNavigate`.

## Import

```ts
import { ConfigProvider } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { ConfigProvider } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return (
    <ConfigProvider locale="en-US" direction="ltr" navigateMode="internal">
      <main>Settings</main>
    </ConfigProvider>
  )
}
```

## HTML parity

`ConfigProvider` wraps application content and sets `lang` and `dir` on the provider root.

## Runtime notes

Supports app-level locale, direction, color scheme, reduced motion, and delegated link navigation via `router.navigate` and `onNavigate`.

## Accessibility matrix

| Requirement        | Behavior                                                  |
| ------------------ | --------------------------------------------------------- |
| Locale propagation | sets `lang` attribute on provider root                    |
| Directionality     | sets `dir` as `ltr` or `rtl`                              |
| Motion preference  | exposes reduced motion preference through data attributes |
| Keyboard           | preserves nested component keyboard behavior              |

## Keymap spec

- Inherits key handling from nested components
