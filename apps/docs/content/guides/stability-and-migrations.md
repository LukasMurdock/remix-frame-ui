# Stability and Migrations

Remix Frame UI is in `0.x`.

## Stability policy

- Stable components are safer for long-lived surfaces
- Experimental components can evolve quickly
- Treat minor updates as potentially breaking while pre-1.0

## Source of truth

- Component maturity: `packages/remix/src/component-metadata.json`
- Migration notes: `MIGRATIONS.md`

## Upgrade workflow

1. Review `MIGRATIONS.md`
2. Update a small surface area first
3. Run typecheck and tests
4. Validate keyboard and screen reader behavior in changed flows
