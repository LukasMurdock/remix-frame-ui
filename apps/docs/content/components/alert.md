# Alert

Maturity: experimental

## HTML parity

`Alert` renders semantic status regions and supports tone-based announcement roles.

## Runtime notes

`Alert` is non-modal and supports optional dismiss actions through an explicit callback.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role mapping | `status` for info/success, `alert` for warning/danger |
| Dismiss affordance | optional labeled dismiss button |
| Content semantics | title and body remain readable by assistive tech |

## Keymap spec

- `Tab`: navigate to dismiss button when present
- `Enter`/`Space`: activate dismiss button
