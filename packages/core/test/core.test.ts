import { describe, expect, it } from "vitest"
import {
  assertNativeInputType,
  createAriaFieldState,
  createFieldIds,
  createTableDataController,
  getCheckboxSubmissionValue,
  nextTableSort,
  normalizeTableSelectionMode,
  setMultipleTableSelection,
  setSingleTableSelection,
  sortTableRows,
  toggleTableSelectionKey,
} from "../src/index"

describe("core helpers", () => {
  it("creates stable field ids", () => {
    expect(createFieldIds("name")).toEqual({
      inputId: "name-input",
      descriptionId: "name-description",
      errorId: "name-error",
    })
  })

  it("builds aria state", () => {
    expect(createAriaFieldState({ descriptionId: "d", errorId: "e", invalid: true })).toEqual({
      "aria-describedby": "d e",
      "aria-invalid": "true",
    })
  })

  it("preserves native checkbox value default", () => {
    expect(getCheckboxSubmissionValue()).toBe("on")
    expect(getCheckboxSubmissionValue("yes")).toBe("yes")
  })

  it("rejects unsupported input type", () => {
    expect(() => assertNativeInputType("number")).toThrowError("Unsupported input type: number")
  })
})

describe("table sorting helpers", () => {
  it("cycles table sort state", () => {
    expect(nextTableSort(undefined, "name")).toEqual({ columnKey: "name", direction: "asc" })
    expect(nextTableSort({ columnKey: "name", direction: "asc" }, "name")).toEqual({
      columnKey: "name",
      direction: "desc",
    })
    expect(nextTableSort({ columnKey: "name", direction: "desc" }, "name")).toBeUndefined()
    expect(nextTableSort({ columnKey: "name", direction: "desc" }, "age")).toEqual({
      columnKey: "age",
      direction: "asc",
    })
  })

  it("sorts rows with stable ordering for equal values", () => {
    const rows = [
      { id: "a", value: 2 },
      { id: "b", value: 1 },
      { id: "c", value: 2 },
    ]

    const ascending = sortTableRows(rows, { columnKey: "value", direction: "asc" }, (row) => row.value)
    const descending = sortTableRows(rows, { columnKey: "value", direction: "desc" }, (row) => row.value)

    expect(ascending.map((row) => row.id)).toEqual(["b", "a", "c"])
    expect(descending.map((row) => row.id)).toEqual(["a", "c", "b"])
  })
})

describe("table selection helpers", () => {
  it("normalizes selection mode", () => {
    expect(normalizeTableSelectionMode(undefined)).toBe("none")
    expect(normalizeTableSelectionMode("single")).toBe("single")
    expect(normalizeTableSelectionMode("multiple")).toBe("multiple")
    expect(normalizeTableSelectionMode("invalid")).toBe("none")
  })

  it("toggles selection keys for none/single/multiple modes", () => {
    expect(toggleTableSelectionKey(new Set(["a"]), "a", "none")).toEqual(new Set())
    expect(toggleTableSelectionKey(undefined, "a", "single")).toEqual(new Set(["a"]))
    expect(toggleTableSelectionKey(new Set(["a"]), "a", "single")).toEqual(new Set())
    expect(toggleTableSelectionKey(new Set(["a"]), "b", "single")).toEqual(new Set(["b"]))
    expect(toggleTableSelectionKey(new Set(["a"]), "b", "multiple")).toEqual(new Set(["a", "b"]))
    expect(toggleTableSelectionKey(new Set(["a", "b"]), "b", "multiple")).toEqual(new Set(["a"]))
  })

  it("sets single and multiple selections", () => {
    expect(setSingleTableSelection("row-1")).toEqual(new Set(["row-1"]))
    expect(setSingleTableSelection(undefined)).toEqual(new Set())
    expect(setMultipleTableSelection(["row-1", "row-2", "row-1"])).toEqual(new Set(["row-1", "row-2"]))
  })
})

describe("table data controller", () => {
  it("resets page when sort or filter changes", () => {
    const controller = createTableDataController<
      { page: number; sort?: { columnKey: string; direction: "asc" | "desc" }; filterText?: string },
      string
    >({
      initialQuery: { page: 3 },
      autoLoad: false,
      load: async () => "ok",
      getPage: (query) => query.page,
      setPage: (query, page) => ({ ...query, page }),
      getSort: (query) => query.sort,
      getFilter: (query) => query.filterText,
      resetPageOnSortChange: true,
      resetPageOnFilterChange: true,
    })

    controller.setQuery((query) => ({
      ...query,
      sort: { columnKey: "name", direction: "asc" },
      page: 4,
    }))
    expect(controller.getSnapshot().query.page).toBe(1)

    controller.setQuery((query) => ({
      ...query,
      filterText: "release",
      page: 2,
    }))
    expect(controller.getSnapshot().query.page).toBe(1)

    controller.dispose()
  })

  it("ignores stale response from aborted request", async () => {
    const resolvers = new Map<number, (value: string) => void>()

    const controller = createTableDataController<{ page: number }, string>({
      initialQuery: { page: 0 },
      autoLoad: false,
      load: ({ query }) => {
        return new Promise((resolve) => {
          resolvers.set(query.page, resolve)
        })
      },
    })

    controller.setQuery((query) => ({ ...query, page: 1 }))
    controller.setQuery((query) => ({ ...query, page: 2 }))

    const resolvePageOne = resolvers.get(1)
    const resolvePageTwo = resolvers.get(2)
    expect(resolvePageOne).toBeDefined()
    expect(resolvePageTwo).toBeDefined()

    resolvePageOne?.("page-one")
    await Promise.resolve()
    expect(controller.getSnapshot().result).toBeUndefined()

    resolvePageTwo?.("page-two")
    await Promise.resolve()
    expect(controller.getSnapshot().result).toBe("page-two")
    expect(controller.getSnapshot().status).toBe("success")

    controller.dispose()
  })

  it("cancels in-flight request and does not apply late result", async () => {
    let resolveRequest: ((value: string) => void) | undefined

    const controller = createTableDataController<{ page: number }, string>({
      initialQuery: { page: 1 },
      autoLoad: false,
      load: () => {
        return new Promise((resolve) => {
          resolveRequest = resolve
        })
      },
    })

    controller.reload()
    expect(controller.getSnapshot().isLoading).toBe(true)

    controller.cancel()
    expect(controller.getSnapshot().isLoading).toBe(false)
    expect(controller.getSnapshot().status).toBe("idle")

    resolveRequest?.("late-result")
    await Promise.resolve()
    expect(controller.getSnapshot().result).toBeUndefined()
    expect(controller.getSnapshot().status).toBe("idle")

    controller.dispose()
  })
})
