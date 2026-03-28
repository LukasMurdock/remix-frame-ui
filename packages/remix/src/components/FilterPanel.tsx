import { on, type Handle } from "remix/component"
import type { ComponentChildren } from "../types"
import { Drawer, type DrawerCloseReason, type DrawerProps } from "./Drawer"

export type FilterPanelCloseReason = DrawerCloseReason | "apply" | "clear"

type FilterPanelDrawerOptions = Omit<DrawerProps, "children" | "title" | "onClose">

export type FilterPanelProps = FilterPanelDrawerOptions & {
  open: boolean
  onClose: (reason: FilterPanelCloseReason) => void
  children: ComponentChildren
  /** @default "Filters" */
  title?: ComponentChildren
  description?: ComponentChildren
  actions?: ComponentChildren
  /** @default "Apply filters" */
  applyLabel?: ComponentChildren
  /** @default "Clear" */
  clearLabel?: ComponentChildren
  /** @default true */
  closeOnApply?: boolean
  /** @default false */
  closeOnClear?: boolean
  /** @default true */
  showApplyButton?: boolean
  /** @default true */
  showClearButton?: boolean
  onApply?: () => void
  onClear?: () => void
  /** @default "Filter controls" */
  fieldsLabel?: string
}

export function resolveFilterPanelTitle(title?: ComponentChildren): ComponentChildren {
  return title === undefined ? "Filters" : title
}

export function resolveFilterPanelApplyLabel(label?: ComponentChildren): ComponentChildren {
  return label === undefined ? "Apply filters" : label
}

export function resolveFilterPanelClearLabel(label?: ComponentChildren): ComponentChildren {
  return label === undefined ? "Clear" : label
}

export function resolveFilterPanelCloseOnApply(value?: boolean): boolean {
  return value ?? true
}

export function resolveFilterPanelCloseOnClear(value?: boolean): boolean {
  return value ?? false
}

export function resolveFilterPanelShowApplyButton(value?: boolean): boolean {
  return value ?? true
}

export function resolveFilterPanelShowClearButton(value?: boolean): boolean {
  return value ?? true
}

export function FilterPanel(handle: Handle) {
  const renderDrawer = Drawer(handle)

  return (props: FilterPanelProps) => {
    const closeOnApply = resolveFilterPanelCloseOnApply(props.closeOnApply)
    const closeOnClear = resolveFilterPanelCloseOnClear(props.closeOnClear)
    const showApplyButton = resolveFilterPanelShowApplyButton(props.showApplyButton)
    const showClearButton = resolveFilterPanelShowClearButton(props.showClearButton)

    const drawerProps: DrawerProps = {
      open: props.open,
      onClose: (reason: DrawerCloseReason) => props.onClose(reason),
      title: resolveFilterPanelTitle(props.title),
      children: (
        <section className="rf-filter-panel" aria-label={props.fieldsLabel ?? "Filter controls"}>
          {props.description ? <p className="rf-filter-panel-description">{props.description}</p> : null}
          <div className="rf-filter-panel-fields">{props.children}</div>
          {props.actions ? <div className="rf-filter-panel-actions-extra">{props.actions}</div> : null}
          {showApplyButton || showClearButton ? (
            <div className="rf-filter-panel-actions">
              {showClearButton ? (
                <button
                  type="button"
                  className="rf-button"
                  data-variant="outline"
                  mix={[
                    on("click", () => {
                      props.onClear?.()
                      if (closeOnClear) props.onClose("clear")
                    }),
                  ]}
                >
                  {resolveFilterPanelClearLabel(props.clearLabel)}
                </button>
              ) : null}
              {showApplyButton ? (
                <button
                  type="button"
                  className="rf-button"
                  mix={[
                    on("click", () => {
                      props.onApply?.()
                      if (closeOnApply) props.onClose("apply")
                    }),
                  ]}
                >
                  {resolveFilterPanelApplyLabel(props.applyLabel)}
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      ),
    }

    if (props.position !== undefined) drawerProps.position = props.position
    if (props.closeLabel !== undefined) drawerProps.closeLabel = props.closeLabel
    if (props.showCloseButton !== undefined) drawerProps.showCloseButton = props.showCloseButton
    if (props.dismissOnBackdrop !== undefined) drawerProps.dismissOnBackdrop = props.dismissOnBackdrop
    if (props.dismissOnEscape !== undefined) drawerProps.dismissOnEscape = props.dismissOnEscape
    if (props.restoreFocus !== undefined) drawerProps.restoreFocus = props.restoreFocus
    if (props.container !== undefined) drawerProps.container = props.container
    if (props.ariaLabel !== undefined) drawerProps.ariaLabel = props.ariaLabel
    if (props.ariaLabelledBy !== undefined) drawerProps.ariaLabelledBy = props.ariaLabelledBy

    return renderDrawer(drawerProps)
  }
}
