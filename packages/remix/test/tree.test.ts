import { describe, expect, it } from "vitest"
import { flattenTreeNodeIds, resolveTreeSelectedId, toggleTreeExpanded, type TreeNode } from "../src/components/Tree"

const nodes: TreeNode[] = [
  {
    id: "projects",
    label: "Projects",
    children: [
      { id: "project-a", label: "Project A" },
      { id: "project-b", label: "Project B" },
    ],
  },
  { id: "settings", label: "Settings" },
]

describe("tree helpers", () => {
  it("flattens nested ids", () => {
    expect(flattenTreeNodeIds(nodes)).toEqual(["projects", "project-a", "project-b", "settings"])
  })

  it("resolves selected id", () => {
    expect(resolveTreeSelectedId(nodes)).toBe("projects")
    expect(resolveTreeSelectedId(nodes, "settings")).toBe("settings")
  })

  it("toggles expanded ids", () => {
    expect(toggleTreeExpanded([], "projects")).toEqual(["projects"])
    expect(toggleTreeExpanded(["projects", "settings"], "projects")).toEqual(["settings"])
  })
})
