# Transfer

Maturity: experimental

## HTML parity

`Transfer` moves selected items between available and chosen lists.

## Runtime notes

Supports controlled and uncontrolled target/selection state, disabled items, and list-level empty state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Selection semantics | each row uses a native checkbox |
| Movement controls | explicit left/right move buttons |
| Disabled items | disabled rows are non-interactive |

## Keymap spec

- `Tab`: move through row checkboxes and transfer buttons
- `Space`: toggle focused checkbox
- `Enter`: activate move buttons
