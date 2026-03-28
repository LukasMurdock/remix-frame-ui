# Slider

Maturity: experimental

## When to use

- Select a single numeric value within a bounded range
- Provide fast keyboard and pointer adjustments for relative values

## Import

```ts
import { Slider } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Slider } from "@lukasmurdock/remix-ui-components"

export function VolumeSlider() {
  return <Slider id="volume" name="volume" min={0} max={100} step={5} defaultValue={60} />
}
```

## HTML parity

`Slider` wraps native `<input type="range">` for continuous or stepped selection.

## Runtime notes

Hydration optional unless you need live value updates via `onValueChange`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Native semantics | uses native range input with `slider` role mapping |
| Value constraints | supports `min`, `max`, and `step` |
| Error wiring | supports `aria-describedby` and `aria-invalid` |

## Keymap spec

- `ArrowLeft` / `ArrowDown`: decrement value
- `ArrowRight` / `ArrowUp`: increment value
- `Home` / `End`: jump to min or max
