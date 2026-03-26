# CommandPalette

Maturity: experimental

## HTML parity

`CommandPalette` is a modal command surface combining searchable input and option list.

## Runtime notes

Controlled open state with callback-driven select and close behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | `role="dialog"` with overlay dismissal |
| Search semantics | combobox input driving listbox results |
| Keyboard support | arrows, Enter, Escape |

## Keymap spec

- `ArrowDown`/`ArrowUp`: navigate commands
- `Enter`: execute selected command
- `Escape`: close palette
