# Divider

Maturity: experimental

## HTML parity

`Divider` renders a separator element for visual and optional semantic grouping.

## Runtime notes

Use horizontal dividers between stacked sections and vertical dividers between inline groups. Set `decorative={false}` to expose separator semantics and optionally provide `ariaLabel` for assistive context.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Separator semantics | uses `role="separator"` when not decorative |
| Orientation | supports horizontal and vertical orientation |
| Decorative mode | hidden from assistive tech by default |

## Keymap spec

- No component-level key bindings.
