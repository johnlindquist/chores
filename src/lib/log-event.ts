export type LogLevel = "info" | "error";

export interface StructuredLogEvent {
  event: string;
  [key: string]: unknown;
}

export function logEvent(level: LogLevel, payload: StructuredLogEvent): void {
  const line = JSON.stringify({
    level,
    ts: new Date().toISOString(),
    ...payload,
  });

  const stream = level === "error" ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
}
