/**
 * Structured Logger
 * Replaces console.log/error with a structured JSON format suitable for production ingest.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

function formatMessage(level: LogLevel, message: string, meta?: any) {
  const timestamp = new Date().toISOString();
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...(meta ? { meta } : {}),
  });
}

export const logger = {
  info: (message: string, meta?: any) => {
    console.log(formatMessage("info", message, meta));
  },
  warn: (message: string, meta?: any) => {
    console.warn(formatMessage("warn", message, meta));
  },
  error: (message: string, error?: any, meta?: any) => {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, ...meta }
        : { error, ...meta };

    console.error(formatMessage("error", message, errorDetails));
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(formatMessage("debug", message, meta));
    }
  },
};
