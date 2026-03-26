import { describe, expect, it } from "vitest"
import {
  clampDataTablePage,
  composeDataTableRowFilter,
  createDataTableContainsFilter,
  createDataTableEqualsFilter,
  filterDataTableRows,
  paginateDataTableRows,
  resolveDataTableCellText,
  resolveDataTablePageSize,
  resolveDataTableTotalPages,
  type DataTableRow,
} from "../src/components/DataTable"

const rows: DataTableRow[] = [
  { key: "a", cells: { name: "Release 1.0", status: "Success" }, sortValues: { status: "success" } },
  { key: "b", cells: { name: "Release 1.1", status: "Failed" }, sortValues: { status: "failed" } },
  { key: "c", cells: { name: "Release 1.2", status: "Running" }, sortValues: { status: "running" } },
  { key: "d", cells: { name: "Release 1.3", status: "Success" }, sortValues: { status: "success" } },
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

  it("filters rows with a rowFilter predicate", () => {
    expect(filterDataTableRows(rows).map((row) => row.key)).toEqual(["a", "b", "c", "d"])
    expect(filterDataTableRows(rows, (row) => row.key === "b" || row.key === "d").map((row) => row.key)).toEqual([
      "b",
      "d",
    ])
  })

  it("resolves text values from row cells and sortValues", () => {
    const firstRow = rows[0]!
    expect(resolveDataTableCellText(firstRow, "name")).toBe("Release 1.0")
    expect(resolveDataTableCellText(firstRow, "status")).toBe("success")
    expect(resolveDataTableCellText(firstRow, "unknown")).toBe("")
  })

  it("creates contains and equals filters", () => {
    const queryFilter = createDataTableContainsFilter(["name"], "1.2")
    expect(queryFilter).toBeTypeOf("function")
    expect(filterDataTableRows(rows, queryFilter).map((row) => row.key)).toEqual(["c"])

    const statusFilter = createDataTableEqualsFilter("status", "success", "all")
    expect(statusFilter).toBeTypeOf("function")
    expect(filterDataTableRows(rows, statusFilter).map((row) => row.key)).toEqual(["a", "d"])

    expect(createDataTableContainsFilter(["name"], " ")).toBeUndefined()
    expect(createDataTableEqualsFilter("status", "all", "all")).toBeUndefined()
    expect(createDataTableEqualsFilter("status", 1, "1")).toBeUndefined()
  })

  it("composes row filters", () => {
    const queryFilter = createDataTableContainsFilter(["name"], "1")
    const statusFilter = createDataTableEqualsFilter("status", "success")
    const combined = composeDataTableRowFilter(queryFilter, statusFilter)

    expect(combined).toBeTypeOf("function")
    expect(filterDataTableRows(rows, combined).map((row) => row.key)).toEqual(["a", "d"])
    expect(composeDataTableRowFilter(queryFilter)).toBe(queryFilter)
    expect(composeDataTableRowFilter(undefined, undefined)).toBeUndefined()
  })
})
