import { describe, expect, it } from "vitest"
import {
  nextSort,
  sortRows,
  type DataGridRow,
  type DataGridSort,
} from "../src/components/DataGridLite"

const rows: DataGridRow[] = [
  { key: "a", cells: { name: "Deploy 3", duration: "91s" }, sortValues: { duration: 91 } },
  { key: "b", cells: { name: "Deploy 1", duration: "132s" }, sortValues: { duration: 132 } },
  { key: "c", cells: { name: "Deploy 2", duration: "64s" }, sortValues: { duration: 64 } },
]

describe("data grid helpers", () => {
  it("cycles sort states for a column", () => {
    let current: DataGridSort | undefined
    current = nextSort(current, "name")
    expect(current).toEqual({ columnKey: "name", direction: "asc" })
    current = nextSort(current, "name")
    expect(current).toEqual({ columnKey: "name", direction: "desc" })
    current = nextSort(current, "name")
    expect(current).toBeUndefined()
  })

  it("sorts rows by numeric sortValue", () => {
    const asc = sortRows(rows, { columnKey: "duration", direction: "asc" })
    expect(asc.map((row) => row.key)).toEqual(["c", "a", "b"])

    const desc = sortRows(rows, { columnKey: "duration", direction: "desc" })
    expect(desc.map((row) => row.key)).toEqual(["b", "a", "c"])
  })

  it("returns original order when sort is undefined", () => {
    const unsorted = sortRows(rows, undefined)
    expect(unsorted.map((row) => row.key)).toEqual(["a", "b", "c"])
  })
})
