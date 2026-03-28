import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type DataListItem = {
  id: string
  title: ComponentChildren
  description?: ComponentChildren
  meta?: ComponentChildren
  actions?: ComponentChildren
}

export type DataListProps = {
  items: DataListItem[]
  /** @default "No items found." */
  emptyState?: ComponentChildren
}

export function DataList(_handle: Handle) {
  return (props: DataListProps) => {
    if (props.items.length === 0) {
      return <section className="rf-data-list-empty">{props.emptyState ?? "No items found."}</section>
    }

    return (
      <ul className="rf-data-list" role="list">
        {props.items.map((item) => (
          <li key={item.id} className="rf-data-list-item">
            <div>
              <h3 className="rf-data-list-title">{item.title}</h3>
              {item.description ? <p className="rf-data-list-description">{item.description}</p> : null}
            </div>
            <div className="rf-data-list-right">
              {item.meta ? <p className="rf-data-list-meta">{item.meta}</p> : null}
              {item.actions ? <div className="rf-data-list-actions">{item.actions}</div> : null}
            </div>
          </li>
        ))}
      </ul>
    )
  }
}
