# Migration Notes

## Unreleased

- Upgraded `@remix-frame-ui/remix` to `remix@3.0.0-alpha.4`.
- Migrated component host usage from removed props to mixins:
  - `on={{ ... }}` -> `mix={[on(...)]}`
  - `connect={...}` -> `mix={[ref(...)]}`
- Replaced legacy `remix/interaction/keys` usage with direct `event.key` checks.
- Updated `@remix-frame-ui/remix/client` exports to include `run`, `navigate`, and `link` from `remix/component`.
- Updated `@remix-frame-ui/remix/server` exports to include `renderToStream`, `renderToString`, and `ResolveFrameContext` from `remix/component/server`.

## 0.1.0

- Initial pre-release scaffold for `@remix-frame-ui/*` packages.
