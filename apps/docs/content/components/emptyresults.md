# EmptyResults

Maturity: experimental

## HTML parity

`EmptyResults` communicates filtered/no-match states with optional recovery action.

## Runtime notes

`EmptyResults` is static by default and supports interactive actions when provided.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Status semantics | `role="status"` with polite updates |
| Message hierarchy | title + supporting description |
| Recovery path | optional clear/reset action region |

## Keymap spec

- Keyboard behavior is inherited from child action controls.
