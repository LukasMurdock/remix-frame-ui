---
"@lukasmurdock/remix-ui-components": patch
---

Fix DataTable scheduler recursion in Bun HMR by deferring data source controller updates outside render in imperative mount flows.
