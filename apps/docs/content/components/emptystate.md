# EmptyState

Maturity: experimental

## HTML parity

`EmptyState` renders status-oriented content with optional action slot.

## Runtime notes

`EmptyState` is static by default and only hydrates if action content requires it.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Status semantics | container uses `role="status"` |
| Readable hierarchy | title + description grouping |
| Action support | optional action region for recovery path |

## Keymap spec

- Keyboard behavior depends on provided action controls.
