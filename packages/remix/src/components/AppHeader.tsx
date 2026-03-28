import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type AppHeaderDensity = "comfortable" | "compact"

export type AppHeaderProps = {
  brand?: ComponentChildren
  title?: ComponentChildren
  subtitle?: ComponentChildren
  nav?: ComponentChildren
  actions?: ComponentChildren
  account?: ComponentChildren
  sticky?: boolean
  density?: AppHeaderDensity
}

export function resolveAppHeaderDensity(density?: AppHeaderDensity): AppHeaderDensity {
  return density ?? "comfortable"
}

export function resolveAppHeaderSticky(sticky?: boolean): boolean {
  return sticky ?? false
}

export function AppHeader(_handle: Handle) {
  return (props: AppHeaderProps) => {
    const density = resolveAppHeaderDensity(props.density)
    const sticky = resolveAppHeaderSticky(props.sticky)

    return (
      <header className="rf-app-header" data-density={density} data-sticky={sticky ? "true" : "false"}>
        <div className="rf-app-header-top">
          <div className="rf-app-header-branding">
            {props.brand ? <div className="rf-app-header-brand">{props.brand}</div> : null}
            {props.title || props.subtitle ? (
              <div className="rf-app-header-text">
                {props.title ? <h1 className="rf-app-header-title">{props.title}</h1> : null}
                {props.subtitle ? <p className="rf-app-header-subtitle">{props.subtitle}</p> : null}
              </div>
            ) : null}
          </div>

          {props.actions || props.account ? (
            <div className="rf-app-header-right">
              {props.actions ? <div className="rf-app-header-actions">{props.actions}</div> : null}
              {props.account ? <div className="rf-app-header-account">{props.account}</div> : null}
            </div>
          ) : null}
        </div>

        {props.nav ? <nav className="rf-app-header-nav">{props.nav}</nav> : null}
      </header>
    )
  }
}
