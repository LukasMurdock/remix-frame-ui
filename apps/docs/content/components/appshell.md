# AppShell

Maturity: experimental

## HTML parity

`AppShell` provides application layout structure with header, sidebar, and main content regions.

## Runtime notes

Supports collapsible sidebar state and left or right sidebar placement.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark structure | uses header, aside, and main semantic regions |
| Sidebar control | sidebar can be collapsed for dense app layouts |
| Reading order | preserves logical source order for assistive tech |

## Keymap spec

- No built-in key handling; keyboard behavior is delegated to slotted controls
