# Toast

Maturity: experimental

## When to use

- Communicate transient feedback for save, queue, background, or failure states
- Use a shared queue when multiple workflows can emit notifications

## Import

```ts
import { ToastViewport, createToastStore } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```ts
import { ToastViewport, createToastStore } from "@lukasmurdock/remix-ui-components"

const store = createToastStore([], { defaultDurationMs: 5000 })
store.show({ id: "save-1", tone: "success", content: "Changes saved" })

const items = store.items()

<ToastViewport
  items={items}
  onPause={(id) => store.pause(id)}
  onResume={(id) => store.resume(id)}
  onDismiss={(id, reason) => store.dismiss(id, reason)}
/>
```

## HTML parity

`ToastViewport` renders semantic list markup with live-region announcements.

## Runtime notes

Supports declarative rendering and imperative store updates with auto-dismiss, plus pause/resume hooks for hover and focus.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Announcements | `aria-live="polite"` default, `assertive` for danger tone |
| Grouping | semantic list of toasts |
| Dismissal | imperative or declarative queue removal |

## Keymap spec

- `Escape`: dismiss focused toast when dismissible
- `Tab`: navigate toast actions
