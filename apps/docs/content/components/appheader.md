# AppHeader

Maturity: experimental

## When to use

- Provides a top application bar with brand, title, nav, and action slots.
- Supports compact density and optional sticky mode for persistent page chrome.

## Import

```ts
import { AppHeader } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`AppHeader` provides a top application bar with brand, title, nav, and action slots.

## Runtime notes

Supports compact density and optional sticky mode for persistent page chrome.

## Accessibility matrix

| Requirement           | Behavior                                                     |
| --------------------- | ------------------------------------------------------------ |
| Landmark semantics    | uses native `header` and optional `nav` regions              |
| Information hierarchy | separates brand/title metadata from actions/account controls |
| Responsive structure  | supports dense and compact header treatments                 |

## Keymap spec

- No custom key handling; keyboard behavior comes from slotted controls
