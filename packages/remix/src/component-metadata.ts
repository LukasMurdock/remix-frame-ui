export type Maturity = "experimental" | "stable"

export type ComponentMetadata = {
  name: string
  maturity: Maturity
}

import metadata from "./component-metadata.json"

export const componentMetadata: ComponentMetadata[] = metadata as ComponentMetadata[]
