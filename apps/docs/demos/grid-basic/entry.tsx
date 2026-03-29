// @ts-nocheck
import { createRoot } from "remix/component"
// Consumer example from component docs migration
import { Card, Grid, GridItem } from "@lukasmurdock/remix-ui-components"
export function Example() {
  return () => (
    <Grid columns={4} gap="0.6rem">
      <GridItem span={2}>
        <Card>Span 2</Card>
      </GridItem>
      <GridItem span={1}>
        <Card>Span 1</Card>
      </GridItem>
      <GridItem span={1}>
        <Card>Span 1</Card>
      </GridItem>
      <GridItem span={4}>
        <Card>Full row span 4</Card>
      </GridItem>
    </Grid>
  )
}
export function mount(mount: HTMLElement) {
  createRoot(mount).render(<Example />)
}
