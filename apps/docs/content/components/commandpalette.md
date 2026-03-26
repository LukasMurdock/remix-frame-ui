# CommandPalette

Maturity: experimental

## HTML parity

`CommandPalette` is a modal command surface combining searchable input and option list.

## Runtime notes

Controlled open state with callback-driven select and close behavior. Search input keeps active option linkage through `aria-activedescendant` and supports Home/End in result lists.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | `role="dialog"` with overlay dismissal |
| Search semantics | combobox input driving listbox results |
| Keyboard support | arrows, Enter, Escape |

## Keymap spec

- `ArrowDown`/`ArrowUp`: navigate commands
- `Home`/`End`: jump to first or last enabled result
- `Enter`: execute selected command
- `Escape`: close palette
