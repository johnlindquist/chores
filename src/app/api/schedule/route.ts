import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPluginInstance, updateScheduleText } from "@/lib/db";
import { getWeekPreview } from "@/lib/schedule-parser";

const UpdateScheduleSchema = z.object({
  uuid: z.string(),
  schedule_text: z.string(),
  passcode: z.string().optional(),
});

// GET - Get schedule for an instance
export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get("uuid");

  if (!uuid) {
    return NextResponse.json({ error: "Missing uuid" }, { status: 400 });
  }

  try {
    const instance = await getPluginInstance(uuid);
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    const timezone = instance.time_zone_iana || "America/Denver";
    const preview = getWeekPreview(instance.schedule_text, timezone, 7);

    return NextResponse.json({
      schedule_text: instance.schedule_text,
      timezone,
      plugin_setting_id: instance.plugin_setting_id,
      preview: preview.map((day) => ({
        date: day.date.toFormat("ccc LLL d"),
        dateIso: day.date.toISODate(),
        kids: day.schedule.kids,
      })),
    });
  } catch (error) {
    console.error("Get schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Update schedule for an instance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = UpdateScheduleSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { uuid, schedule_text, passcode } = parseResult.data;

    // Optional passcode verification
    const adminPasscode = process.env.ADMIN_PASSCODE;
    if (adminPasscode && passcode !== adminPasscode) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
    }

    const instance = await getPluginInstance(uuid);
    if (!instance) {
      return NextResponse.json({ error: "Instance not found" }, { status: 404 });
    }

    await updateScheduleText(uuid, schedule_text);

    const timezone = instance.time_zone_iana || "America/Denver";
    const preview = getWeekPreview(schedule_text, timezone, 7);

    return NextResponse.json({
      success: true,
      preview: preview.map((day) => ({
        date: day.date.toFormat("ccc LLL d"),
        dateIso: day.date.toISODate(),
        kids: day.schedule.kids,
      })),
    });
  } catch (error) {
    console.error("Update schedule error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
