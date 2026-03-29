// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Tree } from "@lukasmurdock/remix-ui-components"
const nodes = [
  {
    id: "projects",
    label: "Projects",
    children: [
      { id: "roadmap", label: "Roadmap" },
      { id: "launch", label: "Launch" },
    ],
  },
]
export function ProjectTree() {
  return () => <Tree nodes={nodes} defaultExpandedIds={["projects"]} onSelect={(id) => console.log(id)} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<ProjectTree />)
}
