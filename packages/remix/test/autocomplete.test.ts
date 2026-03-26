import { describe, expect, it } from "vitest"
import { resolveAutocompleteCommit, type AutocompleteOption } from "../src/components/Autocomplete"

const options: AutocompleteOption[] = [
  { id: "1", label: "Ada Lovelace", value: "ada", textValue: "Ada Lovelace" },
  { id: "2", label: "Grace Hopper", value: "grace", textValue: "Grace Hopper", disabled: true },
  { id: "3", label: "Margaret Hamilton", value: "margaret", textValue: "Margaret Hamilton" },
]

describe("autocomplete helpers", () => {
  it("commits highlighted enabled option", () => {
    const commit = resolveAutocompleteCommit(options, 0, "ad")
    expect(commit.value).toBe("ada")
    expect(commit.option?.id).toBe("1")
  })

  it("falls back to free text when highlighted option is disabled", () => {
    const commit = resolveAutocompleteCommit(options, 1, "gr")
    expect(commit.value).toBe("gr")
    expect(commit.option).toBeUndefined()
  })

  it("falls back to free text when no option is highlighted", () => {
    const commit = resolveAutocompleteCommit(options, -1, "custom value")
    expect(commit.value).toBe("custom value")
    expect(commit.option).toBeUndefined()
  })
})
