export type Maturity = "experimental" | "stable"
export type ComponentPlatform = "universal" | "mobile"

export type ComponentMetadata = {
  name: string
  maturity: Maturity
  /** @default "universal" */
  platform?: ComponentPlatform
}

import metadata from "./component-metadata.json"

export const componentMetadata: ComponentMetadata[] = metadata as ComponentMetadata[]
