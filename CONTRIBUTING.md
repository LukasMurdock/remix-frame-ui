# Contributing

## Maturity labels

- Every component must declare `experimental` or `stable` in code metadata.
- Docs derive maturity labels from package metadata.

## Breaking changes in 0.x

- Any breaking public API change requires migration notes before release.
- Migration notes must be committed with the implementation.

## Quality gates

- Typecheck, tests, build, and docs build must pass before release.
- Accessibility keyboard and screen reader checks are release-blocking.
