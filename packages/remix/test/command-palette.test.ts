import { describe, expect, it } from "vitest"
import {
  filterCommands,
  findNextEnabledCommandIndex,
  type CommandItem,
} from "../src/components/CommandPalette"

const commands: CommandItem[] = [
  { id: "create", label: "Create issue", keywords: ["new", "ticket"] },
  { id: "deploy", label: "Open deployments", keywords: ["release"], disabled: true },
  { id: "invite", label: "Invite teammate", keywords: ["member", "user"] },
]

describe("command palette helpers", () => {
  it("filters by label and keywords", () => {
    expect(filterCommands(commands, "invite")).toHaveLength(1)
    expect(filterCommands(commands, "ticket")).toHaveLength(1)
    expect(filterCommands(commands, "")).toHaveLength(3)
  })

  it("moves across enabled commands and skips disabled", () => {
    expect(findNextEnabledCommandIndex(commands, 0, 1)).toBe(2)
    expect(findNextEnabledCommandIndex(commands, 2, 1)).toBe(0)
    expect(findNextEnabledCommandIndex(commands, 2, -1)).toBe(0)
  })
})
