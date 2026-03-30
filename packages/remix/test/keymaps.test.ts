import { describe, expect, it } from "vitest"
import { componentKeymaps } from "../src/keymaps"

describe("component keymaps", () => {
  it("defines required keyboard contract entries", () => {
    expect(componentKeymaps.Button).toContain("Enter")
    expect(componentKeymaps.Checkbox).toContain("Space")
    expect(componentKeymaps.Combobox).toContain("Escape")
    expect(componentKeymaps.Autocomplete).toContain("Tab")
    expect(componentKeymaps.DatePicker).toContain("PageDown")
    expect(componentKeymaps.DateRangePicker).toContain("ArrowRight")
    expect(componentKeymaps.Dialog).toContain("Escape")
    expect(componentKeymaps.Tabs).toContain("ArrowLeft")
    expect(componentKeymaps.Menu).toContain("Escape")
  })
})
