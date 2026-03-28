# @remix-frame-ui/core

Low-level accessibility and form helpers used by Remix Frame UI.

## Install

```bash
pnpm add @remix-frame-ui/core
```

## Usage

```ts
import { createFieldIds, createAriaFieldState } from "@remix-frame-ui/core"

const ids = createFieldIds("email")
const aria = createAriaFieldState({
  descriptionId: ids.descriptionId,
  invalid: false,
})
```
