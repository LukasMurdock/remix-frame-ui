# Migration Notes

## Unreleased

- Upgraded `@lukasmurdock/remix` to `remix@3.0.0-alpha.4`.
- Migrated component host usage from removed props to mixins:
  - `on={{ ... }}` -> `mix={[on(...)]}`
  - `connect={...}` -> `mix={[ref(...)]}`
- Replaced legacy `remix/interaction/keys` usage with direct `event.key` checks.
- Updated `@lukasmurdock/remix/client` exports to include `run`, `navigate`, and `link` from `remix/component`.
- Updated `@lukasmurdock/remix/server` exports to include `renderToStream`, `renderToString`, and `ResolveFrameContext` from `remix/component/server`.

## 0.1.0

- Initial pre-release scaffold for `@lukasmurdock/*` packages.
