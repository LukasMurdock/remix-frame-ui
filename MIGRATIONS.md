# Migration Notes

## Unreleased

- Renamed published packages:
  - `@lukasmurdock/core` -> `@lukasmurdock/remix-ui-core`
  - `@lukasmurdock/styles` -> `@lukasmurdock/remix-ui-styles`
  - `@lukasmurdock/remix` -> `@lukasmurdock/remix-ui-components`
- Upgraded `@lukasmurdock/remix-ui-components` to `remix@3.0.0-alpha.4`.
- Migrated component host usage from removed props to mixins:
  - `on={{ ... }}` -> `mix={[on(...)]}`
  - `connect={...}` -> `mix={[ref(...)]}`
- Replaced legacy `remix/interaction/keys` usage with direct `event.key` checks.
- Updated `@lukasmurdock/remix-ui-components/client` exports to include `run`, `navigate`, and `link` from `remix/component`.
- Updated `@lukasmurdock/remix-ui-components/server` exports to include `renderToStream`, `renderToString`, and `ResolveFrameContext` from `remix/component/server`.

## 0.1.0

- Initial pre-release scaffold for `@lukasmurdock/*` packages.
