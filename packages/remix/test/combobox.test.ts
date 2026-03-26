import { describe, expect, it } from "vitest"
import {
  filterComboboxOptions,
  findFirstEnabledIndex,
  findNextEnabledIndex,
  type ComboboxOption,
} from "../src/components/Combobox"

const options: ComboboxOption[] = [
  { id: "1", label: "Ada Lovelace", value: "ada", textValue: "Ada Lovelace" },
  { id: "2", label: "Grace Hopper", value: "grace", textValue: "Grace Hopper", disabled: true },
  { id: "3", label: "Margaret Hamilton", value: "margaret", textValue: "Margaret Hamilton" },
]

describe("combobox helpers", () => {
  it("filters by query and text value", () => {
    expect(filterComboboxOptions(options, "grace")).toHaveLength(1)
    expect(filterComboboxOptions(options, "ham")).toHaveLength(1)
    expect(filterComboboxOptions(options, "")).toHaveLength(3)
  })

  it("finds first enabled option", () => {
    expect(findFirstEnabledIndex(options)).toBe(0)
    expect(findFirstEnabledIndex([{ id: "x", label: "X", value: "x", disabled: true }])).toBe(-1)
  })

  it("moves to next enabled index and skips disabled", () => {
    expect(findNextEnabledIndex(options, 0, 1)).toBe(2)
    expect(findNextEnabledIndex(options, 2, 1)).toBe(0)
    expect(findNextEnabledIndex(options, 2, -1)).toBe(0)
  })
})
