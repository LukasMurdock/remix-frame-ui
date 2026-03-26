import { describe, expect, it } from "vitest"
import { resolveConfirmDialogDefaults, type ConfirmDialogProps } from "../src/components/ConfirmDialog"

function createProps(overrides: Partial<ConfirmDialogProps> = {}): ConfirmDialogProps {
  return {
    open: true,
    title: "Delete item",
    onClose: () => {},
    ...overrides,
  }
}

describe("confirm dialog defaults", () => {
  it("defaults labels and disables backdrop dismissal", () => {
    const defaults = resolveConfirmDialogDefaults(createProps())
    expect(defaults.confirmLabel).toBe("Confirm")
    expect(defaults.cancelLabel).toBe("Cancel")
    expect(defaults.dismissOnBackdrop).toBe(false)
  })

  it("allows overriding labels and backdrop dismissal", () => {
    const defaults = resolveConfirmDialogDefaults(
      createProps({ confirmLabel: "Delete", cancelLabel: "Keep", dismissOnBackdrop: true }),
    )

    expect(defaults.confirmLabel).toBe("Delete")
    expect(defaults.cancelLabel).toBe("Keep")
    expect(defaults.dismissOnBackdrop).toBe(true)
  })
})
