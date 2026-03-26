# Progress

Maturity: experimental

## HTML parity

`Progress` renders a visual meter with native `role="progressbar"` semantics.

## Runtime notes

Clamps values between 0 and max and optionally shows percentage text.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Range semantics | exposes `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` |
| Tone feedback | supports neutral, success, warning, and danger tones |
| Label context | optional visible label and percentage display |

## Keymap spec

- No dedicated key handling; informational component only
