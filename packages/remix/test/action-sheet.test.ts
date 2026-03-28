import { describe, expect, it } from "vitest"
import {
  resolveActionSheetCancelText,
  resolveActionSheetCloseOnAction,
  resolveActionSheetDismissOnBackdrop,
  resolveActionSheetDismissOnEscape,
  resolveActionSheetShowCancelButton,
} from "../src/components/ActionSheet"

describe("action sheet helpers", () => {
  it("resolves dismissal defaults", () => {
    expect(resolveActionSheetDismissOnBackdrop()).toBe(true)
    expect(resolveActionSheetDismissOnBackdrop(false)).toBe(false)
    expect(resolveActionSheetDismissOnEscape()).toBe(true)
    expect(resolveActionSheetDismissOnEscape(false)).toBe(false)
  })

  it("resolves action and cancel defaults", () => {
    expect(resolveActionSheetShowCancelButton()).toBe(true)
    expect(resolveActionSheetShowCancelButton(false)).toBe(false)
    expect(resolveActionSheetCloseOnAction()).toBe(true)
    expect(resolveActionSheetCloseOnAction(false)).toBe(false)
    expect(resolveActionSheetCancelText()).toBe("Cancel")
    expect(resolveActionSheetCancelText("Dismiss")).toBe("Dismiss")
  })
})
