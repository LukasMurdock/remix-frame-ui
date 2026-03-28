# Installation

## Prerequisites

- Node.js `>=20`
- `pnpm`

## Install packages

```bash
pnpm add @lukasmurdock/remix-ui-components @lukasmurdock/remix-ui-styles
```

## First render

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import { Text } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Text>Remix Frame UI is installed.</Text>
}
```

## Local docs

Use the docs app while integrating components:

```bash
pnpm run docs:dev
```
