# Statistic

Maturity: experimental

## When to use

- Renders semantic text blocks for label, value, and optional supporting caption.
- Supports prefix and suffix tokens around values and trend metadata for visual direction cues.

## Import

```ts
import { Statistic } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Statistic, StatisticTrend } from "@lukasmurdock/remix-ui-components"

const trend: StatisticTrend = "up"

export function Example() {
  return <Statistic label="Success rate" value="99.95" suffix="%" trend={trend} caption="Last 24h" />
}
```

## HTML parity

`Statistic` renders semantic text blocks for label, value, and optional supporting caption.

## Runtime notes

Supports prefix and suffix tokens around values and trend metadata for visual direction cues.

## Accessibility matrix

| Requirement   | Behavior                                      |
| ------------- | --------------------------------------------- |
| Semantic text | native text elements for value communication  |
| Trend hinting | optional data-trend metadata for visual state |
| Keyboard      | static content with no custom key handlers    |

## Keymap spec

- No component-level key bindings.
