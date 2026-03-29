# DateRangePicker

Maturity: experimental
Platform: universal

## When to use

- Capture start and end dates in one interaction
- Store range values as ISO date pairs

## Import

```ts
import { DateRangePicker } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`DateRangePicker` composes a trigger input and calendar dialog to choose start/end dates.

## Runtime notes

Hydration required for interactive range selection and keyboard grid movement.

## Accessibility matrix

| Requirement       | Behavior                                                   |
| ----------------- | ---------------------------------------------------------- |
| Trigger semantics | input exposes `aria-haspopup="dialog"` and `aria-expanded` |
| Range highlight   | selected boundary days and in-range days use visual states |
| Keyboard support  | arrow key movement and `Escape` close within the calendar  |

## Keymap spec

- `ArrowDown` / `Enter` / `Space` on trigger: open calendar
- `Arrow` keys in grid: move focused day
- `Enter` / `Space`: select day for start/end range
- `Escape`: close calendar
