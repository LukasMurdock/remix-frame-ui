# DatePicker

Maturity: experimental

## When to use

- Select a single calendar date with keyboard and pointer support
- Accept or emit ISO date strings (`YYYY-MM-DD`)

## Import

```ts
import { DatePicker } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { DatePicker } from "@lukasmurdock/remix-ui-components"

export function ScheduleDate() {
  return (
    <DatePicker
      id="release-date"
      name="releaseDate"
      min="2026-01-01"
      max="2026-12-31"
      onValueChange={(value) => console.log(value)}
    />
  )
}
```

## HTML parity

`DatePicker` composes an input-like trigger with a calendar dialog for date selection.

## Runtime notes

Hydration required for calendar navigation, keyboard movement, and date selection.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger semantics | input exposes `aria-haspopup="dialog"` and `aria-expanded` |
| Calendar semantics | popup uses `role="dialog"` and labeled month heading |
| Keyboard support | arrow keys, page keys, and enter/space selection |

## Keymap spec

- `ArrowDown` / `Enter` / `Space` on trigger: open calendar
- `Arrow` keys in grid: move focused day
- `PageUp` / `PageDown`: previous/next month
- `Enter` / `Space`: select focused day
- `Escape`: close calendar
