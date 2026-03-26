import type { RemixNode } from "remix/component"

export type ComponentChildren = RemixNode

export type Renderable<Props> = (props: Props) => unknown

export type ComponentHandle = {
  id: string
  signal: AbortSignal
  update(): Promise<AbortSignal> | void
}
