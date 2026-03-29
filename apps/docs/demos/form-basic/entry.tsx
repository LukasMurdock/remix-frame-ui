// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Button, Form, FormErrorSummary } from "@lukasmurdock/remix-ui-components"
export function SignupForm() {
  const errors: string[] = []
  return () => (
    <Form method="post" action="/signup" busy={false} aria-describedby="signup-errors">
      <FormErrorSummary id="signup-errors" errors={errors} />
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />
      <Button type="submit">Create account</Button>
    </Form>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<SignupForm />)
}
