# TimePicker

Maturity: experimental
Platform: universal

## When to use

- Capture a time-of-day value with native browser controls
- React to immediate input changes and committed value changes

## Import

```ts
import { TimePicker } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { TimePicker } from "@lukasmurdock/remix-ui-components"

export function ReminderTime() {
  return (
    <TimePicker
      id="reminder-time"
      name="reminderTime"
      min="08:00"
      max="20:00"
      step={300}
      onValueChange={(value) => console.log("typing", value)}
      onValueCommit={(value) => console.log("commit", value)}
    />
  )
}
```

## HTML parity

`TimePicker` wraps native `<input type="time">` with min/max/step constraints.

## Runtime notes

Hydration optional for basic usage. Add hydration for `onValueChange`/`onValueCommit` flows and custom parsing feedback.

## Accessibility matrix

| Requirement       | Behavior                                       |
| ----------------- | ---------------------------------------------- |
| Label association | via native `<label for>` and `id`              |
| Constraints       | native `min`, `max`, and `step` semantics      |
| Error wiring      | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `ArrowUp` / `ArrowDown`: increment or decrement segment
- `Tab`: move to next focus target
