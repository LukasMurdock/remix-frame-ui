export type RuntimeDemoSource = {
  mountFunctionName: string
  source: string
}

export function parseRuntimeDemoMounts(source: string): Map<string, string>
export function buildRuntimeDemoSourceMap(source: string): Map<string, RuntimeDemoSource>
export function serializeJsonForHtml(value: unknown): string
