// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Result, ResultActions, ResultDescription, ResultTitle } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Result
      tone="success"
      title={<ResultTitle>Deployment succeeded</ResultTitle>}
      description={<ResultDescription>All checks passed and traffic has shifted to the new release.</ResultDescription>}
      actions={
        <ResultActions>
          <button type="button">View rollout</button>
        </ResultActions>
      }
    />
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
