import type { Handle } from "remix/component"
import { Menu, type MenuItem } from "./Menu"
import type { ComponentChildren } from "../types"

export type DropdownProps = {
  label: ComponentChildren
  items: MenuItem[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (id: string) => void
}

export function Dropdown(_handle: Handle) {
  return (props: DropdownProps) => (
    <div className="rf-dropdown">
      <Menu
        triggerLabel={props.label}
        items={props.items}
        {...(props.open !== undefined ? { open: props.open } : {})}
        {...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {})}
        {...(props.onOpenChange ? { onOpenChange: props.onOpenChange } : {})}
        {...(props.onSelect ? { onSelect: props.onSelect } : {})}
      />
    </div>
  )
}
