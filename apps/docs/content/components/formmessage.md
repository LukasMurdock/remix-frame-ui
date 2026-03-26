# FormMessage

Maturity: experimental

## HTML parity

`FormMessage` renders contextual helper or validation text tied to form controls.

## Runtime notes

Tone drives live-region behavior: error is assertive, success and warning are polite.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Helper messaging | passive text for hints and guidance |
| Validation urgency | `error` uses `role="alert"` with assertive live updates |
| Status updates | `success` and `warning` use polite status updates |

## Keymap spec

- No dedicated key handling; follows associated control focus order
