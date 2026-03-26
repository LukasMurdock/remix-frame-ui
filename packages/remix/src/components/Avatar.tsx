import type { Handle } from "remix/component"

export type AvatarSize = "sm" | "md" | "lg"
export type AvatarStatus = "online" | "offline" | "busy"

export type AvatarProps = {
  name: string
  src?: string
  alt?: string
  size?: AvatarSize
  square?: boolean
  status?: AvatarStatus
}

export function resolveAvatarSize(size?: AvatarSize): AvatarSize {
  return size ?? "md"
}

export function resolveAvatarSquare(square?: boolean): boolean {
  return square ?? false
}

export function getAvatarInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) return "?"
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("")
}

export function Avatar(_handle: Handle) {
  return (props: AvatarProps) => {
    const size = resolveAvatarSize(props.size)
    const square = resolveAvatarSquare(props.square)
    const initials = getAvatarInitials(props.name)
    const alt = props.alt ?? props.name

    return (
      <span className="rf-avatar" data-size={size} data-shape={square ? "square" : "circle"} data-status={props.status}>
        {props.src ? <img src={props.src} alt={alt} className="rf-avatar-image" /> : <span className="rf-avatar-fallback">{initials}</span>}
      </span>
    )
  }
}
