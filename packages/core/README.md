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

## Headless table primitives

```ts
import { createTableDataController, nextTableSort, toggleTableSelectionKey } from "@lukasmurdock/remix-ui-core"

const sort = nextTableSort(undefined, "name")
const selected = toggleTableSelectionKey(new Set<string>(), "row-1", "single")

const controller = createTableDataController({
  initialQuery: { page: 1, pageSize: 10 },
  load: async ({ query, signal }) => {
    const response = await fetch(`/api/rows?page=${query.page}&size=${query.pageSize}`, { signal })
    return response.json()
  },
})
```
