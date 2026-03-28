import type { Handle } from "remix/component"
import type { ComponentChildren } from "../types"

export type StatisticTrend = "up" | "down" | "neutral"

export type StatisticProps = {
  label: ComponentChildren
  value: ComponentChildren
  prefix?: ComponentChildren
  suffix?: ComponentChildren
  caption?: ComponentChildren
  /** @default "neutral" */
  trend?: StatisticTrend
}

export function resolveStatisticTrend(trend?: StatisticTrend): StatisticTrend {
  return trend ?? "neutral"
}

export function Statistic(_handle: Handle) {
  return (props: StatisticProps) => (
    <section className="rf-statistic" data-trend={resolveStatisticTrend(props.trend)}>
      <p className="rf-statistic-label">{props.label}</p>
      <p className="rf-statistic-value">
        {props.prefix ? <span className="rf-statistic-prefix">{props.prefix}</span> : null}
        <span>{props.value}</span>
        {props.suffix ? <span className="rf-statistic-suffix">{props.suffix}</span> : null}
      </p>
      {props.caption ? <p className="rf-statistic-caption">{props.caption}</p> : null}
    </section>
  )
}
