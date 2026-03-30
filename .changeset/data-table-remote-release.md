---
"@lukasmurdock/remix-ui-components": minor
---

Add remote-ready DataTable support with server mode pagination metadata.

`DataTable` now supports `dataMode="server"` and `totalRows` so apps can handle
paging/sorting/filtering with backend data while keeping table interactions
controlled.

Also add `filterText` and `filterColumnKeys` for built-in client query filtering,
plus docs demo updates showing a remote table workflow.
