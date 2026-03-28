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

## Formatting

- Install dependencies with `pnpm install` to enable git hooks via Husky.
- Pre-commit runs `lint-staged` and formats staged code/config files with Prettier.
- Run `pnpm run format` to format supported files manually.

## Releases

- Add a changeset for any pull request that changes public package behavior.
- Create one with `pnpm changeset` and choose the appropriate bump level.
- Merges to `main` run two release workflows:
  - stable: opens/updates a version PR and publishes once merged
  - canary: publishes snapshot builds to npm under the `canary` tag
- `NPM_TOKEN` must be an automation token that does not require interactive OTP.
