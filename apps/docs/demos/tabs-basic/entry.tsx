// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Tabs } from "@lukasmurdock/remix-ui-components"
const items = [
  { id: "overview", label: "Overview", panel: "Overview content" },
  { id: "deployments", label: "Deployments", panel: "Deployments content" },
  { id: "incidents", label: "Incidents", panel: "Incidents content" },
  { id: "settings", label: "Settings", panel: "Settings content" },
  { id: "audit", label: "Audit", panel: "Audit content" },
]
export function ProjectTabs() {
  return () => <Tabs items={items} overflow="menu" maxVisibleTabs={4} activation="manual" />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ProjectTabs />)
}
