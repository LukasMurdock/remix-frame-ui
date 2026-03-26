import { describe, expect, it } from "vitest"
import {
  flattenTreeSelectIds,
  resolveTreeSelectLabel,
  resolveTreeSelectValue,
  toggleTreeSelectExpanded,
  type TreeSelectNode,
} from "../src/components/TreeSelect"

const nodes: TreeSelectNode[] = [
  {
    id: "projects",
    label: "Projects",
    children: [
      { id: "alpha", label: "Alpha" },
      { id: "beta", label: "Beta" },
    ],
  },
  { id: "settings", label: "Settings" },
]

describe("tree select helpers", () => {
  it("flattens node ids", () => {
    expect(flattenTreeSelectIds(nodes)).toEqual(["projects", "alpha", "beta", "settings"])
  })

  it("resolves selected value and label", () => {
    expect(resolveTreeSelectValue(nodes)).toBe("projects")
    expect(resolveTreeSelectValue(nodes, "settings")).toBe("settings")
    expect(resolveTreeSelectLabel(nodes, "beta", "Choose")).toBe("Beta")
    expect(resolveTreeSelectLabel(nodes, undefined, "Choose")).toBe("Choose")
  })

  it("toggles expanded ids", () => {
    expect(toggleTreeSelectExpanded([], "projects")).toEqual(["projects"])
    expect(toggleTreeSelectExpanded(["projects", "settings"], "projects")).toEqual(["settings"])
  })
})
