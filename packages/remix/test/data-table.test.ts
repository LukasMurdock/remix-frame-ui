import { describe, expect, it } from "vitest"
import {
  clampDataTablePage,
  paginateDataTableRows,
  resolveDataTablePageSize,
  resolveDataTableTotalPages,
  type DataTableRow,
} from "../src/components/DataTable"

const rows: DataTableRow[] = [
  { key: "a", cells: { name: "A" } },
  { key: "b", cells: { name: "B" } },
  { key: "c", cells: { name: "C" } },
  { key: "d", cells: { name: "D" } },
]

describe("data table helpers", () => {
  it("normalizes page size", () => {
    expect(resolveDataTablePageSize()).toBe(10)
    expect(resolveDataTablePageSize(0)).toBe(1)
    expect(resolveDataTablePageSize(7.9)).toBe(7)
  })

  it("resolves total pages", () => {
    expect(resolveDataTableTotalPages(0, 10)).toBe(1)
    expect(resolveDataTableTotalPages(25, 10)).toBe(3)
  })

  it("clamps page bounds", () => {
    expect(clampDataTablePage(undefined, 3)).toBe(1)
    expect(clampDataTablePage(-4, 3)).toBe(1)
    expect(clampDataTablePage(7, 3)).toBe(3)
    expect(clampDataTablePage(2, 3)).toBe(2)
  })

  it("paginates rows by page and page size", () => {
    expect(paginateDataTableRows(rows, 1, 2).map((row) => row.key)).toEqual(["a", "b"])
    expect(paginateDataTableRows(rows, 2, 2).map((row) => row.key)).toEqual(["c", "d"])
  })
})
