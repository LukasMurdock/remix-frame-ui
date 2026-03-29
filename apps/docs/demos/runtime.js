/**
 * @typedef {(demoId: string, mount: HTMLElement) => void} RuntimeMount
 */

function resolveRuntimeMount() {
  const runtimeMount = window.__docsMountRuntimeDemoById
  if (typeof runtimeMount !== "function") {
    throw new Error("Docs runtime mount API is unavailable.")
  }
  return /** @type {RuntimeMount} */ (runtimeMount)
}

export function mountRuntimeDemo(demoId, mount) {
  if (!(mount instanceof HTMLElement)) {
    throw new Error("Demo mount target is invalid for " + demoId + ".")
  }

  const runtimeMount = resolveRuntimeMount()
  runtimeMount(demoId, mount)
}
