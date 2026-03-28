# Runtime and Hydration

Remix Frame UI is designed around native HTML semantics first.

## Mental model

- Render semantic HTML by default
- Add runtime behavior only where interaction needs it
- Keep simple surfaces server-rendered when possible

## Client and server exports

Use package entry points when you need explicit runtime wiring:

```ts
import { run, navigate, link } from "@lukasmurdock/remix-ui-components/client"
import { renderToStream } from "@lukasmurdock/remix-ui-components/server"
```

## Practical advice

- Start with static markup and CSS
- Add interactive components (`Dialog`, `Popover`, `Combobox`, etc.) incrementally
- Validate keyboard behavior and screen reader semantics for every interactive flow
