# Descriptions

Maturity: experimental

## HTML parity

`Descriptions` presents read-only label/value pairs in a dense, scannable detail layout.

## Runtime notes

Supports grid columns, item spans, horizontal/vertical layouts, compact density, optional header metadata, responsive collapse breakpoints, and empty state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Semantic pairs | uses `dl` with `dt` and `dd` entries |
| Section title | optional heading for detail context |
| Responsive grouping | item spans maintain logical label/value grouping |

## Keymap spec

- Uses native document navigation
- Does not add custom key handlers
