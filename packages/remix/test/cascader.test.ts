import { describe, expect, it } from "vitest"
import {
  findCascaderOptionIndex,
  findNextEnabledCascaderOption,
  isCascaderLeaf,
  resolveCascaderColumns,
  resolveCascaderPath,
  resolveCascaderPathLabels,
  resolveCascaderTriggerLabel,
  shouldCascaderCommitSelection,
  type CascaderOption,
} from "../src/components/Cascader"

const options: CascaderOption[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      {
        value: "platform",
        label: "Platform",
        children: [{ value: "api", label: "API" }],
      },
    ],
  },
  { value: "design", label: "Design" },
]

describe("cascader helpers", () => {
  it("resolves valid path segments", () => {
    expect(resolveCascaderPath(options, ["engineering", "platform", "api"])).toEqual([
      "engineering",
      "platform",
      "api",
    ])
    expect(resolveCascaderPath(options, ["engineering", "unknown", "api"])).toEqual(["engineering"])
  })

  it("resolves columns and path labels", () => {
    expect(resolveCascaderColumns(options, ["engineering", "platform"]).length).toBe(3)
    expect(resolveCascaderPathLabels(options, ["engineering", "platform", "api"])).toEqual([
      "Engineering",
      "Platform",
      "API",
    ])
  })

  it("resolves trigger label and selection behavior", () => {
    expect(resolveCascaderTriggerLabel(options, ["engineering", "platform"], "Select")).toBe("Engineering / Platform")
    expect(resolveCascaderTriggerLabel(options, [], "Select")).toBe("Select")

    expect(shouldCascaderCommitSelection({ value: "leaf", label: "Leaf" })).toEqual({ commit: true, close: true })
    expect(
      shouldCascaderCommitSelection({ value: "parent", label: "Parent", children: [{ value: "x", label: "X" }] }),
    ).toEqual({ commit: false, close: false })
    expect(
      shouldCascaderCommitSelection(
        { value: "parent", label: "Parent", children: [{ value: "x", label: "X" }] },
        true,
      ),
    ).toEqual({ commit: true, close: false })
  })

  it("detects leaf nodes", () => {
    expect(isCascaderLeaf({ value: "a", label: "A" })).toBe(true)
    expect(isCascaderLeaf({ value: "b", label: "B", children: [{ value: "c", label: "C" }] })).toBe(false)
  })

  it("finds option indexes and next enabled option", () => {
    const column: CascaderOption[] = [
      { value: "engineering", label: "Engineering" },
      { value: "design", label: "Design", disabled: true },
      { value: "ops", label: "Ops" },
    ]

    expect(findCascaderOptionIndex(column, "design")).toBe(1)
    expect(findCascaderOptionIndex(column, "missing")).toBe(-1)

    expect(findNextEnabledCascaderOption(column, 0, 1)).toBe(2)
    expect(findNextEnabledCascaderOption(column, 2, 1)).toBe(0)
    expect(findNextEnabledCascaderOption(column, 0, -1)).toBe(2)
    expect(findNextEnabledCascaderOption([{ value: "only", label: "Only", disabled: true }], 0, 1)).toBe(-1)
  })
})
