# @lukasmurdock/remix-ui-core

Low-level accessibility and form helpers used by Remix Frame UI.

## Install

```bash
pnpm add @lukasmurdock/remix-ui-core
```

## Usage

```ts
import { createFieldIds, createAriaFieldState } from "@lukasmurdock/remix-ui-core"

const ids = createFieldIds("email")
const aria = createAriaFieldState({
  descriptionId: ids.descriptionId,
  invalid: false,
})
```
