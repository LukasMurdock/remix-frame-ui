import { on, type Handle } from "remix/component"

export type PaginationItem = number | "ellipsis"

export type PaginationProps = {
  page: number
  totalPages: number
  siblingCount?: number
  onPageChange?: (page: number) => void
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 1) return 1
  if (page < 1) return 1
  if (page > totalPages) return totalPages
  return page
}

export function buildPaginationItems(totalPages: number, currentPage: number, siblingCount = 1): PaginationItem[] {
  const clampedCurrent = clampPage(currentPage, totalPages)
  const safeSibling = siblingCount < 0 ? 0 : siblingCount
  if (totalPages <= 1) return [1]

  const items: PaginationItem[] = [1]
  const start = Math.max(2, clampedCurrent - safeSibling)
  const end = Math.min(totalPages - 1, clampedCurrent + safeSibling)

  if (start > 2) {
    items.push("ellipsis")
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page)
  }

  if (end < totalPages - 1) {
    items.push("ellipsis")
  }

  items.push(totalPages)
  return items
}

export function Pagination(handle: Handle) {
  return (props: PaginationProps) => {
    const totalPages = Math.max(1, props.totalPages)
    const currentPage = clampPage(props.page, totalPages)
    const items = buildPaginationItems(totalPages, currentPage, props.siblingCount ?? 1)

    const goTo = (page: number) => {
      const next = clampPage(page, totalPages)
      if (next === currentPage) return
      props.onPageChange?.(next)
      handle.update()
    }

    return (
      <nav className="rf-pagination" aria-label="Pagination">
        <button
          type="button"
          className="rf-button rf-focus-ring"
          data-variant="outline"
          disabled={currentPage <= 1}
          mix={[on("click", () => goTo(currentPage - 1))]}
        >
          Previous
        </button>

        <ol className="rf-pagination-list">
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <li key={`ellipsis-${index}`} className="rf-pagination-ellipsis" aria-hidden="true">
                ...
              </li>
            ) : (
              <li key={`page-${item}`}>
                <button
                  type="button"
                  className="rf-pagination-page rf-focus-ring"
                  data-current={item === currentPage ? "true" : "false"}
                  aria-current={item === currentPage ? "page" : undefined}
                  mix={[on("click", () => goTo(item))]}
                >
                  {item}
                </button>
              </li>
            ),
          )}
        </ol>

        <button
          type="button"
          className="rf-button rf-focus-ring"
          data-variant="outline"
          disabled={currentPage >= totalPages}
          mix={[on("click", () => goTo(currentPage + 1))]}
        >
          Next
        </button>
      </nav>
    )
  }
}
