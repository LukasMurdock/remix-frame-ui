// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { RadioGroup } from "@lukasmurdock/remix-ui-components"
const options = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
]
export function BillingCycle() {
  return () => <RadioGroup legend="Billing cycle" name="billingCycle" options={options} />
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<BillingCycle />)
}
