import { describe, expect, it } from "vitest"
import {
  calculateFloatingPanelDragHeight,
  canDragFloatingPanelFromContent,
  clampFloatingPanelHeight,
  findNearestFloatingPanelAnchor,
  normalizeFloatingPanelAnchors,
  resolveFloatingPanelHandleDraggingOfContent,
  resolveFloatingPanelHeight,
  resolveFloatingPanelPlacement,
  stepFloatingPanelHeight,
} from "../src/components/FloatingPanel"

describe("floating panel helpers", () => {
  it("resolves defaults", () => {
    expect(resolveFloatingPanelPlacement()).toBe("bottom")
    expect(resolveFloatingPanelPlacement("top")).toBe("top")
    expect(resolveFloatingPanelHandleDraggingOfContent()).toBe(true)
    expect(resolveFloatingPanelHandleDraggingOfContent(false)).toBe(false)
  })

  it("normalizes anchors and falls back for invalid input", () => {
    expect(normalizeFloatingPanelAnchors([320, 120, 120, 480])).toEqual([120, 320, 480])
    expect(normalizeFloatingPanelAnchors([-20, 0, NaN])).toEqual([120, 280, 440])
  })

  it("clamps and resolves current height", () => {
    const anchors = [120, 260, 420]
    expect(clampFloatingPanelHeight(90, anchors)).toBe(120)
    expect(clampFloatingPanelHeight(500, anchors)).toBe(420)
    expect(resolveFloatingPanelHeight({ anchors })).toBe(120)
    expect(resolveFloatingPanelHeight({ anchors, defaultHeight: 260 })).toBe(260)
    expect(resolveFloatingPanelHeight({ anchors, localHeight: 420 })).toBe(420)
    expect(resolveFloatingPanelHeight({ anchors, height: 260 })).toBe(260)
  })

  it("snaps to nearest anchor", () => {
    const anchors = [120, 280, 440]
    expect(findNearestFloatingPanelAnchor(110, anchors)).toBe(120)
    expect(findNearestFloatingPanelAnchor(300, anchors)).toBe(280)
    expect(findNearestFloatingPanelAnchor(430, anchors)).toBe(440)
  })

  it("steps anchors via keymap", () => {
    const anchors = [120, 280, 440]
    expect(stepFloatingPanelHeight(120, "ArrowUp", "bottom", anchors)).toBe(280)
    expect(stepFloatingPanelHeight(280, "ArrowDown", "bottom", anchors)).toBe(120)
    expect(stepFloatingPanelHeight(120, "ArrowDown", "top", anchors)).toBe(280)
    expect(stepFloatingPanelHeight(280, "ArrowUp", "top", anchors)).toBe(120)
    expect(stepFloatingPanelHeight(280, "Home", "bottom", anchors)).toBe(120)
    expect(stepFloatingPanelHeight(280, "End", "bottom", anchors)).toBe(440)
    expect(stepFloatingPanelHeight(280, "Enter", "bottom", anchors)).toBeUndefined()
  })

  it("calculates drag height by placement", () => {
    const anchors = [120, 280, 440]
    expect(calculateFloatingPanelDragHeight(280, 200, 170, "bottom", anchors)).toBe(310)
    expect(calculateFloatingPanelDragHeight(280, 200, 170, "top", anchors)).toBe(250)
  })

  it("only allows content drag at the scroll boundary", () => {
    expect(canDragFloatingPanelFromContent(0, 900, 300, "bottom")).toBe(true)
    expect(canDragFloatingPanelFromContent(20, 900, 300, "bottom")).toBe(false)
    expect(canDragFloatingPanelFromContent(600, 900, 300, "top")).toBe(true)
    expect(canDragFloatingPanelFromContent(200, 900, 300, "top")).toBe(false)
    expect(canDragFloatingPanelFromContent(0, 220, 300, "bottom")).toBe(true)
  })
})
