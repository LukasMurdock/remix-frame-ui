// @vitest-environment jsdom

import { describe, expect, it } from "vitest"

async function loadRuntime() {
  if (!("adoptedStyleSheets" in document)) {
    Object.defineProperty(document, "adoptedStyleSheets", {
      value: [],
      writable: true,
    })
  }

  if (typeof CSSStyleSheet === "undefined") {
    ;(globalThis as { CSSStyleSheet?: unknown }).CSSStyleSheet = class CSSStyleSheet {
      replaceSync() {}
    }
  }

  const { createRoot } = await import("remix/component")
  const { DataTable } = await import("../src/components/DataTable")
  return { createRoot, DataTable }
}

async function flushWork(root: { flush: () => void }, turns = 3) {
  for (let index = 0; index < turns; index += 1) {
    root.flush()
    await Promise.resolve()
  }
}

describe("data table integration", () => {
  it("avoids duplicate data loads across imperative rerenders", async () => {
    const { createRoot, DataTable } = await loadRuntime()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const columns = [{ key: "name", header: "Name", sortable: true }]
    const calls: Array<{ sourceId: string; filterText: string | undefined }> = []

    const createDataSource = (sourceId: string) => ({
      fetch: async (query: { filterText?: string }) => {
        calls.push({ sourceId, filterText: query.filterText })
        return {
          rows: [
            {
              key: sourceId,
              cells: { name: sourceId },
              sortValues: { name: sourceId },
            },
          ],
          totalRows: 1,
        }
      },
    })

    try {
      root.render(
        <DataTable
          columns={columns}
          rows={[]}
          dataSource={createDataSource("source-0")}
          filterText="query-0"
          pageSize={5}
          defaultSort={{ columnKey: "name", direction: "asc" }}
        />,
      )
      await flushWork(root)

      for (let step = 1; step <= 3; step += 1) {
        root.render(
          <DataTable
            columns={columns}
            rows={[]}
            dataSource={createDataSource(`source-${step}`)}
            filterText={`query-${step}`}
            pageSize={5}
            defaultSort={{ columnKey: "name", direction: "asc" }}
          />,
        )
        await flushWork(root)
      }

      expect(calls).toHaveLength(4)
      expect(calls.map((call) => call.filterText)).toEqual(["query-0", "query-1", "query-2", "query-3"])
      expect(container.textContent).toContain("source-3")
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("does not loop on pagination with recreated dataSource wrappers", async () => {
    const { createRoot, DataTable } = await loadRuntime()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const columns = [{ key: "name", header: "Name", sortable: true }]
    const rowsByPage = {
      1: [{ key: "p1-a", cells: { name: "Page 1" }, sortValues: { name: "Page 1" } }],
      2: [{ key: "p2-a", cells: { name: "Page 2" }, sortValues: { name: "Page 2" } }],
    }
    const calls: number[] = []

    const fetchRows = async (query: { page: number }) => {
      calls.push(query.page)
      const rows = rowsByPage[query.page as 1 | 2] ?? []
      return { rows, totalRows: 2 }
    }

    let page = 1
    const render = () => {
      root.render(
        <DataTable
          columns={columns}
          rows={[]}
          dataSource={{ fetch: fetchRows }}
          page={page}
          onPageChange={(nextPage) => {
            page = nextPage
            render()
          }}
          pageSize={1}
        />,
      )
    }

    try {
      render()
      await flushWork(root)
      expect(container.textContent).toContain("Page 1")

      const nextButton = [...container.querySelectorAll("button")].find((button) =>
        (button.textContent ?? "").includes("Next"),
      )
      expect(nextButton).toBeTruthy()

      nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
      await flushWork(root, 6)

      expect(container.textContent).toContain("Page 2")
      expect(calls).toEqual([1, 2])
    } finally {
      root.dispose()
      container.remove()
    }
  })

  it("does not loop on uncontrolled server pagination", async () => {
    const { createRoot, DataTable } = await loadRuntime()

    const container = document.createElement("div")
    document.body.appendChild(container)
    const root = createRoot(container)

    const columns = [{ key: "name", header: "Name", sortable: true }]
    const calls: number[] = []

    const dataSource = {
      fetch: async (query: { page: number }) => {
        calls.push(query.page)
        const pageLabel = query.page === 1 ? "Page 1" : "Page 2"
        return {
          rows: [{ key: String(query.page), cells: { name: pageLabel }, sortValues: { name: pageLabel } }],
          totalRows: 2,
        }
      },
    }

    try {
      root.render(<DataTable columns={columns} rows={[]} dataSource={dataSource} pageSize={1} />)
      await flushWork(root)
      expect(container.textContent).toContain("Page 1")

      const nextButton = [...container.querySelectorAll("button")].find((button) =>
        (button.textContent ?? "").includes("Next"),
      )
      expect(nextButton).toBeTruthy()

      nextButton?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }))
      await flushWork(root, 6)

      expect(container.textContent).toContain("Page 2")
      expect(calls).toEqual([1, 2])
    } finally {
      root.dispose()
      container.remove()
    }
  })
})
