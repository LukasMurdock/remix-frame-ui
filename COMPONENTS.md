# Component Priorities

This document defines the highest-value component roadmap for Remix Frame UI.

## Prioritization Principles

- Favor components that unlock real product workflows over broad checkbox coverage.
- Build dependency-heavy primitives first to reduce rework.
- Keep accessibility and keyboard interaction release-blocking for interactive components.

## Tier 1: Workflow Unlockers

1. `Popover`
2. `Tooltip`
3. `Dropdown`
4. `Combobox` / `Autocomplete`
5. `CommandPalette`
6. `DataGridLite` (sortable/selectable, loading/empty states)

Why this tier first:

- These components unlock search, assignment, contextual actions, and data workflows used in most applications.

## Tier 2: Form and Data Depth

1. `Textarea`
2. `Switch`
3. `Slider`
4. `NumberInput`
5. `FileUpload`
6. `DatePicker`
7. `DateRangePicker`
8. `FormFieldset`
9. `FormMessage`
10. `FormLayout`
11. `Pagination`
12. `Tag` / `Chip`
13. `Badge`

## Tier 3: App Shell and Navigation

1. `Drawer`
2. `Breadcrumbs`
3. `Stepper`
4. `SideNav`
5. `TopNav`
6. `Tabs` enhancements (overflow, orientation, edge-case keyboard behavior)

## Tier 4: Feedback and Async States

1. `Progress`
2. `Skeleton`
3. `Spinner`
4. `Result` / `StatusPage`
5. `InlineNotice`
6. `Banner`
7. `ConfirmDialog` preset built on `Dialog`

## Recommended Build Sequence

1. Overlay primitives polish (`Popover`, positioning, focus and dismissal behavior)
2. Selection primitives (`ListBox`, `Combobox`, `CommandPalette`)
3. Data display core (`DataGridLite`, `Pagination`, sorting affordances)
4. Date and time (`Calendar`, `DatePicker`, `DateRangePicker`)
5. Fill-ins and polish components

## Quality Gates Per Interactive Component

- Keyboard interaction contract specified and tested
- Screen reader semantics validated
- Axe checks included in CI
- Docs include HTML parity, runtime notes, and accessibility matrix
- At least one live demo in docs
