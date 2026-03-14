import { DateTime } from "luxon";
import { type NextRequest, NextResponse } from "next/server";
import { getDailyBookOfMormonScripture } from "@/lib/daily-scripture";
import { getPluginInstance } from "@/lib/db";
import { renderMarkup } from "@/lib/markup-renderer";
import { getTodayChores } from "@/lib/schedule-parser";

export async function POST(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.slice(7);

  try {
    // Parse form data (TRMNL sends application/x-www-form-urlencoded)
    const contentType = request.headers.get("Content-Type") || "";
    let userUuid: string | null = null;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      userUuid = formData.get("user_uuid") as string | null;
    } else if (contentType.includes("application/json")) {
      const body = await request.json();
      userUuid = body.user_uuid;
    }

    if (!userUuid) {
      console.error("Missing user_uuid in request");
      return NextResponse.json({ error: "Missing user_uuid" }, { status: 400 });
    }

    // Get the plugin instance
    const instance = await getPluginInstance(userUuid);
    if (!instance) {
      console.error(`Instance not found: ${userUuid}`);
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 },
      );
    }

    // Verify access token
    if (instance.access_token !== accessToken) {
      console.error("Access token mismatch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get timezone (default to America/Denver if not set)
    const timezone = instance.time_zone_iana || "America/Denver";

    // Get today's date in the user's timezone
    const today = DateTime.now().setZone(timezone);

    // Get today's chores
    const todaySchedule = getTodayChores(instance.schedule_text, timezone);

    // Get daily scripture
    const dailyScripture = getDailyBookOfMormonScripture(today);

    // Render all markup layouts
    const markup = renderMarkup(todaySchedule, today, userUuid, dailyScripture);

    console.log(
      JSON.stringify({
        event: "trmnl_markup_generated",
        userUuid,
        date: today.toISODate(),
        timezone,
        scriptureReference: dailyScripture.reference,
        scriptureIndex: dailyScripture.index,
      }),
    );

    return NextResponse.json(markup);
  } catch (error) {
    console.error("Markup generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
