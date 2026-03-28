# Tabs

Maturity: experimental

## When to use

- Switch between related panels where each panel stays in the same page context
- Use overflow menu mode when horizontal space is limited

## Import

```ts
import { Tabs } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```tsx
import { Tabs } from "@lukasmurdock/remix-ui-components"

const items = [
  { id: "overview", label: "Overview", panel: "Overview content" },
  { id: "deployments", label: "Deployments", panel: "Deployments content" },
  { id: "incidents", label: "Incidents", panel: "Incidents content" },
  { id: "settings", label: "Settings", panel: "Settings content" },
  { id: "audit", label: "Audit", panel: "Audit content" },
]

export function ProjectTabs() {
  return <Tabs items={items} overflow="menu" maxVisibleTabs={4} activation="manual" />
}
```

## HTML parity

`Tabs` uses WAI-ARIA tab roles with button triggers and tabpanel containers.

## Runtime notes

Default activation is manual; automatic activation can be enabled. In uncontrolled mode, tab clicks update local component state via `handle.update()`. Use `overflow="menu"` with `maxVisibleTabs` to collapse excess tabs into a More menu while keeping the selected tab visible.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Roles | tablist/tab/tabpanel |
| Selection | `aria-selected` + `aria-controls` |
| Focus management | active tab is tabbable |

## Keymap spec

- Arrow keys: move focus across tabs
- `Enter`/`Space`: activate focused tab in manual mode
- `Home`/`End`: jump to first or last visible tab
