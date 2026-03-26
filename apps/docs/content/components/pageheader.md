# PageHeader

Maturity: experimental

## HTML parity

`PageHeader` composes native heading and metadata text with optional action region.

## Runtime notes

`PageHeader` is layout-focused and does not require hydration unless actions are interactive.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Heading semantics | renders title as top-level heading |
| Supporting text | optional subtitle paragraph |
| Action placement | actions are grouped in dedicated region |

## Keymap spec

- Keyboard behavior is inherited from child action controls.
