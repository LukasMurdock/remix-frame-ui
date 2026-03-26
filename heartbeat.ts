#!/usr/bin/env bun

type SessionStatus =
  | { type: "idle" }
  | { type: "busy" }
  | { type: "retry"; attempt: number; message: string; next: number }

type Session = {
  id: string
  title: string
  time: {
    created: number
    updated: number
  }
}

const PRIORITY_PROMPT =
  "Before proceeding, pause and evaluate: Of all possible next steps, which one is the highest-priority and most critical? Consider urgency, dependencies, and potential impact. Select exactly one action, state it, and briefly justify your choice."

const GRILL_PROMPT = `Interview me relentlessly about every aspect of this plan until
we reach a shared understanding. Walk down each branch of the design
tree resolving dependencies between decisions one by one.

If a question can be answered by exploring the codebase, explore
the codebase instead.

For each question, provide your recommended answer.`

const ACCEPT_AND_BEGIN_PROMPT = "Accept all and begin"

const DEFAULT_BASE_URL = process.env.OPENCODE_SERVER_URL ?? "http://127.0.0.1:4096"
const DEFAULT_DIRECTORY = process.env.HEARTBEAT_DIRECTORY
const DEFAULT_IDLE_MINUTES = Number(process.env.HEARTBEAT_IDLE_MINUTES ?? 8)
const DEFAULT_INTERVAL_SECONDS = Number(process.env.HEARTBEAT_INTERVAL_SECONDS ?? 60)
const DEFAULT_COOLDOWN_MINUTES = Number(process.env.HEARTBEAT_COOLDOWN_MINUTES ?? 20)

function usageAndExit(): never {
  console.log(
    [
      "Usage:",
      "  bun heartbeat.ts --session <session-id> [--url <server-url>] [--idle-minutes <n>] [--interval-seconds <n>] [--cooldown-minutes <n>] [--once]",
      "",
      "Env:",
      "  OPENCODE_SERVER_URL         Default: http://127.0.0.1:4096",
      "  OPENCODE_SERVER_USERNAME    Optional basic auth username (default: opencode)",
      "  OPENCODE_SERVER_PASSWORD    Optional basic auth password",
      "  HEARTBEAT_DIRECTORY         Optional project directory for multi-project servers",
      "  HEARTBEAT_IDLE_MINUTES      Default: 8",
      "  HEARTBEAT_INTERVAL_SECONDS  Default: 60",
      "  HEARTBEAT_COOLDOWN_MINUTES  Default: 20",
    ].join("\n"),
  )
  process.exit(1)
}

function decodeBase64Url(input: string): string {
  let value = input.replace(/-/g, "+").replace(/_/g, "/")
  while (value.length % 4 !== 0) value += "="
  return Buffer.from(value, "base64").toString("utf8")
}

function parseSessionUrl(rawUrl: string): {
  baseUrl: string
  sessionID?: string
  directory?: string
} {
  try {
    const url = new URL(rawUrl)
    const parts = url.pathname.split("/").filter(Boolean)
    const sessionIndex = parts.indexOf("session")
    if (sessionIndex === -1) {
      return { baseUrl: `${url.origin}${url.pathname.replace(/\/$/, "")}` }
    }

    const sessionID = parts[sessionIndex + 1]
    const maybeEncodedDirectory = parts[0]
    const directory = maybeEncodedDirectory
      ? decodeBase64Url(maybeEncodedDirectory)
      : undefined

    return { baseUrl: url.origin, sessionID, directory }
  } catch {
    return { baseUrl: rawUrl }
  }
}

function withDirectory(path: string, directory?: string): string {
  if (!directory) return path
  const separator = path.includes("?") ? "&" : "?"
  return `${path}${separator}directory=${encodeURIComponent(directory)}`
}

function getArg(name: string): string | undefined {
  const index = Bun.argv.indexOf(name)
  if (index === -1) return undefined
  return Bun.argv[index + 1]
}

function hasFlag(name: string): boolean {
  return Bun.argv.includes(name)
}

function normalizeEpochMs(timestamp: number): number {
  return timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp
}

function formatMs(ms: number): string {
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return `${minutes}m ${seconds}s`
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getAuthHeader(): string | undefined {
  const password = process.env.OPENCODE_SERVER_PASSWORD
  if (!password) return undefined
  const username = process.env.OPENCODE_SERVER_USERNAME ?? "opencode"
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
}

async function api<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const authHeader = getAuthHeader()
  const headers = new Headers(init?.headers)
  headers.set("Content-Type", "application/json")
  if (authHeader) headers.set("Authorization", authHeader)

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${body}`)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

async function heartbeatOnce(params: {
  baseUrl: string
  sessionID: string
  directory?: string
  idleThresholdMs: number
  cooldownMs: number
  lastHeartbeatAt: number
}) {
  const {
    baseUrl,
    sessionID,
    directory,
    idleThresholdMs,
    cooldownMs,
    lastHeartbeatAt,
  } = params
  const statuses = await api<Record<string, SessionStatus>>(
    baseUrl,
    withDirectory("/session/status", directory),
  )
  const status = statuses[sessionID]

  if (status && status.type !== "idle") {
    console.log(
      `[${new Date().toISOString()}] Session ${sessionID} is ${status.type}; skipping`,
    )
    return { heartbeated: false, nextLastHeartbeatAt: lastHeartbeatAt }
  }

  if (!status) {
    console.log(
      `[${new Date().toISOString()}] No live status entry for ${sessionID}; using timestamp fallback`,
    )
  }

  let session: Session
  try {
    session = await api<Session>(
      baseUrl,
      withDirectory(`/session/${encodeURIComponent(sessionID)}`, directory),
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes("404")) {
      console.log(`[${new Date().toISOString()}] Session not found: ${sessionID}`)
      return { heartbeated: false, nextLastHeartbeatAt: lastHeartbeatAt }
    }
    throw error
  }

  const updatedAtMs = normalizeEpochMs(session.time.updated)
  const idleMs = Date.now() - updatedAtMs
  const cooldownActive = lastHeartbeatAt > 0 && Date.now() - lastHeartbeatAt < cooldownMs

  if (idleMs < idleThresholdMs) {
    console.log(
      `[${new Date().toISOString()}] Session ${sessionID} idle ${formatMs(idleMs)} (< threshold); skipping`,
    )
    return { heartbeated: false, nextLastHeartbeatAt: lastHeartbeatAt }
  }

  if (cooldownActive) {
    const remainingMs = cooldownMs - (Date.now() - lastHeartbeatAt)
    console.log(
      `[${new Date().toISOString()}] Cooldown active (${formatMs(remainingMs)} remaining); skipping`,
    )
    return { heartbeated: false, nextLastHeartbeatAt: lastHeartbeatAt }
  }

  console.log(
    `[${new Date().toISOString()}] Heartbeat -> prompting session ${sessionID} (${session.title})`,
  )

  async function sendPrompt(step: string, text: string) {
    console.log(`[${new Date().toISOString()}] ${step}`)
    await api(
      baseUrl,
      withDirectory(`/session/${encodeURIComponent(sessionID)}/message`, directory),
      {
      method: "POST",
      body: JSON.stringify({
        parts: [{ type: "text", text }],
      }),
      },
    )
  }

  await sendPrompt("Step 1/3: Priority prompt", PRIORITY_PROMPT)
  await sendPrompt("Step 2/3: Grill prompt", GRILL_PROMPT)
  await sendPrompt("Step 3/3: Accept-and-begin prompt", ACCEPT_AND_BEGIN_PROMPT)

  console.log(`[${new Date().toISOString()}] All 3 heartbeat prompts sent successfully`)
  return { heartbeated: true, nextLastHeartbeatAt: Date.now() }
}

async function main() {
  const rawUrl = getArg("--url") ?? DEFAULT_BASE_URL
  const parsed = parseSessionUrl(rawUrl)
  const sessionID =
    getArg("--session") ?? process.env.HEARTBEAT_SESSION_ID ?? parsed.sessionID
  if (!sessionID) usageAndExit()

  const baseUrl = parsed.baseUrl
  const directory = getArg("--directory") ?? DEFAULT_DIRECTORY ?? parsed.directory
  const idleMinutes = Number(getArg("--idle-minutes") ?? DEFAULT_IDLE_MINUTES)
  const intervalSeconds = Number(
    getArg("--interval-seconds") ?? DEFAULT_INTERVAL_SECONDS,
  )
  const cooldownMinutes = Number(
    getArg("--cooldown-minutes") ?? DEFAULT_COOLDOWN_MINUTES,
  )
  const once = hasFlag("--once")

  if (
    Number.isNaN(idleMinutes) ||
    Number.isNaN(intervalSeconds) ||
    Number.isNaN(cooldownMinutes)
  ) {
    throw new Error("All numeric flags must be valid numbers")
  }

  const idleThresholdMs = idleMinutes * 60_000
  const intervalMs = intervalSeconds * 1000
  const cooldownMs = cooldownMinutes * 60_000

  console.log(`Heartbeat watcher started for session: ${sessionID}`)
  console.log(
    `Server: ${baseUrl} | idle threshold: ${idleMinutes}m | interval: ${intervalSeconds}s | cooldown: ${cooldownMinutes}m`,
  )
  if (directory) {
    console.log(`Directory scope: ${directory}`)
  }

  let lastHeartbeatAt = 0

  while (true) {
    try {
      const result = await heartbeatOnce({
        baseUrl,
        sessionID,
        directory,
        idleThresholdMs,
        cooldownMs,
        lastHeartbeatAt,
      })
      lastHeartbeatAt = result.nextLastHeartbeatAt
      if (once) break
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Heartbeat error:`,
        error instanceof Error ? error.message : error,
      )
      if (once) process.exit(1)
    }

    await sleep(intervalMs)
  }
}

await main()
