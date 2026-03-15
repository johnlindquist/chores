import { NextResponse } from "next/server";
import { logEvent } from "@/lib/log-event";

export const BEN_QUOTE_DEPRECATED_RESPONSE = {
  error: "Deprecated",
  message:
    "Ben quote APIs no longer drive TRMNL. TRMNL now shows a daily Book of Mormon scripture footer.",
  replacement: {
    path: "/api/daily-scripture",
    note: "Use this read-only endpoint to preview the scripture selected for a given date and timezone.",
  },
} as const;

export function benQuoteDeprecatedResponse(
  route: "/api/ben-quote" | "/api/quotes",
  method: "GET" | "POST" | "DELETE",
) {
  logEvent("info", {
    event: "ben_quote_api_deprecated",
    route,
    method,
    replacementPath: "/api/daily-scripture",
  });

  return NextResponse.json(BEN_QUOTE_DEPRECATED_RESPONSE, { status: 410 });
}
