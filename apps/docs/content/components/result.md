# Result

Maturity: experimental

## When to use

- Presents outcome states like success, warning, and failure with optional actions.
- Tone controls announcement role and visual emphasis for critical outcomes.

## Import

```ts
import { Result } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Result, ResultActions, ResultDescription, ResultTitle } from "@lukasmurdock/remix-ui-components"

const title = <ResultTitle>Deployment succeeded</ResultTitle>
const description = <ResultDescription>All checks passed and traffic has shifted to the new release.</ResultDescription>
const actions = (
  <ResultActions>
    <button type="button">View rollout</button>
  </ResultActions>
)

export function Example() {
  return <Result tone="success" title={title} description={description} actions={actions} />
}
```

## HTML parity

`Result` presents outcome states like success, warning, and failure with optional actions.

## Runtime notes

Tone controls announcement role and visual emphasis for critical outcomes. For composition-heavy screens, use `ResultTitle`, `ResultDescription`, and `ResultActions` primitives.

## Accessibility matrix

| Requirement       | Behavior                                                   |
| ----------------- | ---------------------------------------------------------- |
| Outcome semantics | uses `status` for info/success, `alert` for warning/danger |
| Content structure | supports title, optional description, and optional actions |
| Action affordance | actions are explicit controls adjacent to outcome content  |

## Keymap spec

- `Tab`: move to action controls when present
- `Enter`/`Space`: activate focused action control
