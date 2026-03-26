import { describe, expect, it } from "vitest"
import { resolveStatisticTrend } from "../src/components/Statistic"

describe("statistic helpers", () => {
  it("defaults trend to neutral", () => {
    expect(resolveStatisticTrend()).toBe("neutral")
  })

  it("keeps explicit trend", () => {
    expect(resolveStatisticTrend("up")).toBe("up")
    expect(resolveStatisticTrend("down")).toBe("down")
  })
})
