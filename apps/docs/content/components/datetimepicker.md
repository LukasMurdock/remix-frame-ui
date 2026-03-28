# DateTimePicker

Maturity: experimental

## When to use

- Capture date and time together while keeping native input behavior
- Submit either split fields (`dateName`/`timeName`) or a combined hidden value (`name`)

## Import

```ts
import { DateTimePicker } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { DateTimePicker } from "@lukasmurdock/remix-ui-components"

export function IncidentDateTime() {
  return (
    <DateTimePicker
      id="incident-at"
      name="occurredAt"
      dateName="occurredDate"
      timeName="occurredTime"
      onValueChange={(value) => console.log(value)}
    />
  )
}
```

## HTML parity

`DateTimePicker` composes native date and time inputs and emits a combined local datetime value.

## Runtime notes

Hydration optional for native behavior. Use hydration when listening to `onValueChange`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Native semantics | uses native `date` and `time` inputs |
| Combined submission | optional hidden input supports single `name` payload |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `Tab`: move between date and time fields
- `Arrow` keys: adjust focused field segments
