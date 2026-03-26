# AppProvider

Maturity: experimental

## HTML parity

`AppProvider` wraps application content to set locale, direction, and app-level interaction defaults.

## Runtime notes

Supports `lang` and `dir` metadata, color scheme and reduced motion hints, and optional delegated internal link handling through `onNavigate`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Locale propagation | sets `lang` attribute on provider root |
| Directionality | sets `dir` as `ltr` or `rtl` |
| Motion preference | can reduce animations/transitions for nested content |

## Keymap spec

- Inherits key handling from nested components
- Does not override default keyboard navigation
