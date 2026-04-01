---
"@lukasmurdock/remix-ui-components": patch
---

Fix a DataTable pagination update loop in Bun HMR by preventing stale server query state from overwriting local page transitions while a page change is in flight.
