# RangeSlider

Maturity: experimental

## HTML parity

`RangeSlider` provides dual-thumb range selection for minimum and maximum values.

## Runtime notes

Both thumbs are clamped and ordered so the start value never exceeds the end value.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Slider semantics | uses two native `input[type="range"]` controls |
| Value integrity | start and end values are normalized and clamped |
| Assistive labels | supports explicit start and end labels |

## Keymap spec

- `ArrowLeft` / `ArrowDown`: decrement focused thumb
- `ArrowRight` / `ArrowUp`: increment focused thumb
- `Home` / `End`: move focused thumb to bounds
