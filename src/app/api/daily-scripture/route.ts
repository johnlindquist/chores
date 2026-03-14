import { DateTime } from "luxon";
import { type NextRequest, NextResponse } from "next/server";
import { getDailyBookOfMormonScripture } from "@/lib/daily-scripture";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const timezone = url.searchParams.get("timezone") || "America/Denver";
  const dateParam = url.searchParams.get("date");

  const date = dateParam
    ? DateTime.fromISO(dateParam, { zone: timezone })
    : DateTime.now().setZone(timezone);

  if (!date.isValid) {
    return NextResponse.json(
      { error: "Invalid date. Expected YYYY-MM-DD." },
      { status: 400 },
    );
  }

  const scripture = getDailyBookOfMormonScripture(date);

  return NextResponse.json({
    ok: true,
    timezone,
    ...scripture,
  });
}
