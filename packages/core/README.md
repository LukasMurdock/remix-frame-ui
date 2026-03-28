# @lukasmurdock/core

Low-level accessibility and form helpers used by Remix Frame UI.

## Install

```bash
pnpm add @lukasmurdock/core
```

## Usage

```ts
import { createFieldIds, createAriaFieldState } from "@lukasmurdock/core"

const ids = createFieldIds("email")
const aria = createAriaFieldState({
  descriptionId: ids.descriptionId,
  invalid: false,
})
```
