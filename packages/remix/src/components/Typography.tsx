import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type TextElement = "p" | "span" | "strong" | "em" | "small"

export type HeadingProps = {
  level?: HeadingLevel
  id?: string
  children: ComponentChildren
}

export type TextProps = {
  as?: TextElement
  truncate?: boolean
  children: ComponentChildren
}

export type CodeProps = {
  block?: boolean
  children: ComponentChildren
}

export function resolveHeadingLevel(level?: HeadingLevel): HeadingLevel {
  return level ?? 2
}

export function resolveTextElement(element?: TextElement): TextElement {
  return element ?? "p"
}

export function resolveTextTruncate(truncate?: boolean): boolean {
  return truncate ?? false
}

export function resolveCodeBlock(block?: boolean): boolean {
  return block ?? false
}

export function Heading(_handle: Handle) {
  return (props: HeadingProps) => {
    const level = resolveHeadingLevel(props.level)
    const className = "rf-typography-heading"

    if (level === 1)
      return (
        <h1 id={props.id} className={className}>
          {props.children}
        </h1>
      )
    if (level === 2)
      return (
        <h2 id={props.id} className={className}>
          {props.children}
        </h2>
      )
    if (level === 3)
      return (
        <h3 id={props.id} className={className}>
          {props.children}
        </h3>
      )
    if (level === 4)
      return (
        <h4 id={props.id} className={className}>
          {props.children}
        </h4>
      )
    if (level === 5)
      return (
        <h5 id={props.id} className={className}>
          {props.children}
        </h5>
      )
    return (
      <h6 id={props.id} className={className}>
        {props.children}
      </h6>
    )
  }
}

export function Text(_handle: Handle) {
  return (props: TextProps) => {
    const as = resolveTextElement(props.as)
    const truncate = resolveTextTruncate(props.truncate)
    const className = "rf-typography-text"

    if (as === "span")
      return (
        <span className={className} data-truncate={truncate ? "true" : "false"}>
          {props.children}
        </span>
      )
    if (as === "strong")
      return (
        <strong className={className} data-truncate={truncate ? "true" : "false"}>
          {props.children}
        </strong>
      )
    if (as === "em")
      return (
        <em className={className} data-truncate={truncate ? "true" : "false"}>
          {props.children}
        </em>
      )
    if (as === "small")
      return (
        <small className={className} data-truncate={truncate ? "true" : "false"}>
          {props.children}
        </small>
      )
    return (
      <p className={className} data-truncate={truncate ? "true" : "false"}>
        {props.children}
      </p>
    )
  }
}

export function Code(_handle: Handle) {
  return (props: CodeProps) => {
    if (resolveCodeBlock(props.block)) {
      return (
        <pre className="rf-typography-pre">
          <code className="rf-typography-code">{props.children}</code>
        </pre>
      )
    }

    return <code className="rf-typography-code">{props.children}</code>
  }
}

export function Typography(handle: Handle) {
  const renderText = Text(handle)
  return (props: TextProps) => renderText(props)
}
