import { DateTime, IANAZone } from "luxon";
import { type NextRequest, NextResponse } from "next/server";
import { getDailyBookOfMormonScripture } from "@/lib/daily-scripture";
import { logEvent } from "@/lib/log-event";

function badRequest(payload: Record<string, unknown>) {
  logEvent("error", {
    event: "daily_scripture_bad_request",
    ...payload,
  });

  return NextResponse.json(payload, { status: 400 });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const timezone = url.searchParams.get("timezone") || "America/Denver";
  const dateParam = url.searchParams.get("date");

  try {
    if (!IANAZone.isValidZone(timezone)) {
      return badRequest({
        error: "Invalid timezone",
        message: "Expected a valid IANA timezone such as America/Denver.",
        timezone,
      });
    }

    if (dateParam && !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return badRequest({
        error: "Invalid date",
        message: "Expected date in YYYY-MM-DD format.",
        date: dateParam,
      });
    }

    const date = dateParam
      ? DateTime.fromISO(dateParam, { zone: timezone })
      : DateTime.now().setZone(timezone);

    if (!date.isValid) {
      return badRequest({
        error: "Invalid date",
        message:
          date.invalidExplanation || "Expected date in YYYY-MM-DD format.",
        date: dateParam,
      });
    }

    const scripture = getDailyBookOfMormonScripture(date);

    logEvent("info", {
      event: "daily_scripture_resolved",
      timezone,
      dateKey: scripture.dateKey,
      scriptureReference: scripture.reference,
      scriptureIndex: scripture.index,
      scriptureTotal: scripture.total,
      scriptureTextLength: scripture.text.length,
      scriptureCompactTextLength: scripture.compactText.length,
    });

    return NextResponse.json({
      ok: true,
      timezone,
      ...scripture,
    });
  } catch (error) {
    logEvent("error", {
      event: "daily_scripture_failed",
      timezone,
      date: dateParam,
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to compute daily scripture.",
      },
      { status: 500 },
    );
  }
}
