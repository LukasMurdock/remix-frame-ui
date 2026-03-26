# Result

Maturity: experimental

## HTML parity

`Result` presents outcome states like success, warning, and failure with optional actions.

## Runtime notes

Tone controls announcement role and visual emphasis for critical outcomes.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Outcome semantics | uses `status` for info/success, `alert` for warning/danger |
| Content structure | supports title, optional description, and optional actions |
| Action affordance | actions are explicit controls adjacent to outcome content |

## Keymap spec

- `Tab`: move to action controls when present
- `Enter`/`Space`: activate focused action control
