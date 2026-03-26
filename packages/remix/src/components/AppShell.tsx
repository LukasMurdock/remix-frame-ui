import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type AppShellSidebarPosition = "left" | "right"

export type AppShellProps = {
  header?: ComponentChildren
  sidebar?: ComponentChildren
  children: ComponentChildren
  sidebarCollapsed?: boolean
  sidebarPosition?: AppShellSidebarPosition
  sidebarWidth?: string
}

export function resolveAppShellSidebarState(collapsed?: boolean): "collapsed" | "expanded" {
  return collapsed ? "collapsed" : "expanded"
}

export function resolveAppShellSidebarPosition(position?: AppShellSidebarPosition): AppShellSidebarPosition {
  return position ?? "left"
}

export function resolveAppShellSidebarWidth(width?: string): string {
  return width ?? "16rem"
}

export function AppShell(_handle: Handle) {
  return (props: AppShellProps) => {
    const hasSidebar = props.sidebar !== undefined
    const sidebarState = resolveAppShellSidebarState(props.sidebarCollapsed)
    const sidebarPosition = resolveAppShellSidebarPosition(props.sidebarPosition)
    const sidebarWidth = resolveAppShellSidebarWidth(props.sidebarWidth)

    return (
      <section
        className="rf-app-shell"
        data-has-sidebar={hasSidebar ? "true" : "false"}
        data-sidebar-state={sidebarState}
        data-sidebar-position={sidebarPosition}
        style={`--rf-app-shell-sidebar-width: ${sidebarWidth};`}
      >
        {props.header ? <header className="rf-app-shell-header">{props.header}</header> : null}

        <div className="rf-app-shell-body">
          {hasSidebar ? (
            <aside className="rf-app-shell-sidebar" hidden={sidebarState === "collapsed"}>
              {props.sidebar}
            </aside>
          ) : null}
          <main className="rf-app-shell-main">{props.children}</main>
        </div>
      </section>
    )
  }
}
