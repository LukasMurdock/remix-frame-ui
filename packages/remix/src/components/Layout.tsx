import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type LayoutDirection = "row" | "column"

export type LayoutProps = {
  children: ComponentChildren
  direction?: LayoutDirection
  hasSider?: boolean
}

export type LayoutSectionProps = {
  children: ComponentChildren
}

export type LayoutSiderProps = {
  children: ComponentChildren
  width?: string
  collapsed?: boolean
}

export function resolveLayoutDirection(direction?: LayoutDirection): LayoutDirection {
  return direction ?? "column"
}

export function resolveLayoutHasSider(hasSider?: boolean): boolean {
  return hasSider ?? false
}

export function resolveLayoutSiderWidth(width?: string): string {
  return width ?? "16rem"
}

export function resolveLayoutSiderCollapsed(collapsed?: boolean): boolean {
  return collapsed ?? false
}

export function Layout(_handle: Handle) {
  return (props: LayoutProps) => (
    <section className="rf-layout" data-direction={resolveLayoutDirection(props.direction)} data-has-sider={resolveLayoutHasSider(props.hasSider) ? "true" : "false"}>
      {props.children}
    </section>
  )
}

export function LayoutHeader(_handle: Handle) {
  return (props: LayoutSectionProps) => <header className="rf-layout-header">{props.children}</header>
}

export function LayoutContent(_handle: Handle) {
  return (props: LayoutSectionProps) => <main className="rf-layout-content">{props.children}</main>
}

export function LayoutFooter(_handle: Handle) {
  return (props: LayoutSectionProps) => <footer className="rf-layout-footer">{props.children}</footer>
}

export function LayoutSider(_handle: Handle) {
  return (props: LayoutSiderProps) => {
    const collapsed = resolveLayoutSiderCollapsed(props.collapsed)
    const width = resolveLayoutSiderWidth(props.width)

    return (
      <aside className="rf-layout-sider" data-collapsed={collapsed ? "true" : "false"} style={`--rf-layout-sider-width: ${width};`} hidden={collapsed}>
        {props.children}
      </aside>
    )
  }
}
