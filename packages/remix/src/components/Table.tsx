import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type TableColumn = {
  key: string
  header: ComponentChildren
  align?: "left" | "center" | "right"
}

export type TableRow = {
  key: string
  cells: Record<string, ComponentChildren>
}

export type TableProps = {
  caption?: ComponentChildren
  columns: TableColumn[]
  rows: TableRow[]
  emptyState?: ComponentChildren
}

export function Table(_handle: Handle) {
  return (props: TableProps) => (
    <div className="rf-table-wrap" role="region" aria-label="Data table">
      <table className="rf-table">
        {props.caption ? <caption>{props.caption}</caption> : null}
        <thead>
          <tr>
            {props.columns.map((column) => (
              <th key={column.key} scope="col" data-align={column.align ?? "left"}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.length === 0 ? (
            <tr>
              <td colSpan={props.columns.length} className="rf-table-empty">
                {props.emptyState ?? "No rows"}
              </td>
            </tr>
          ) : (
            props.rows.map((row) => (
              <tr key={row.key}>
                {props.columns.map((column) => (
                  <td key={`${row.key}-${column.key}`} data-align={column.align ?? "left"}>
                    {row.cells[column.key] ?? null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
