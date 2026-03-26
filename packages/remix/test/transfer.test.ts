import { describe, expect, it } from "vitest"
import {
  moveTransferKeys,
  partitionTransferItems,
  resolveTransferMoveKeys,
  resolveTransferSelectedKeys,
  resolveTransferTargetKeys,
  type TransferItem,
} from "../src/components/Transfer"

const items: TransferItem[] = [
  { key: "a", label: "Alpha" },
  { key: "b", label: "Beta", disabled: true },
  { key: "c", label: "Gamma" },
]

describe("transfer helpers", () => {
  it("normalizes target and selected keys", () => {
    expect(resolveTransferTargetKeys(items, ["a", "x", "a"])).toEqual(["a"])
    expect(resolveTransferSelectedKeys(items, ["c", "z", "c"])).toEqual(["c"])
  })

  it("partitions items by target keys", () => {
    const result = partitionTransferItems(items, ["c"])
    expect(result.sourceItems.map((item) => item.key)).toEqual(["a", "b"])
    expect(result.targetItems.map((item) => item.key)).toEqual(["c"])
  })

  it("resolves movable keys and applies movement", () => {
    expect(resolveTransferMoveKeys(items, ["a", "b"], ["c"], "right")).toEqual(["a"])
    expect(resolveTransferMoveKeys(items, ["c"], ["c"], "left")).toEqual(["c"])

    expect(moveTransferKeys(["c"], ["a"], "right")).toEqual(["c", "a"])
    expect(moveTransferKeys(["c", "a"], ["c"], "left")).toEqual(["a"])
  })
})
