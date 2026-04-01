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
})
