import { DateTime } from "luxon";
import { getDefaultSchedule } from "@/lib/db";
import { getDailyBookOfMormonScripture } from "@/lib/daily-scripture";
import { renderMarkup } from "@/lib/markup-renderer";
import { getTodayChores } from "@/lib/schedule-parser";

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  const timezone = "America/Denver";
  const today = DateTime.now().setZone(timezone);
  const schedule = getTodayChores(getDefaultSchedule(), timezone);
  const scripture = getDailyBookOfMormonScripture(today);
  const markup = renderMarkup(schedule, today, "preview-local", scripture);

  const variants = [
    { label: "Full (800×480)", html: markup.markup, width: 800, height: 480 },
    {
      label: "Half Horizontal (800×240)",
      html: markup.markup_half_horizontal,
      width: 800,
      height: 240,
    },
    {
      label: "Half Vertical (400×480)",
      html: markup.markup_half_vertical,
      width: 400,
      height: 480,
    },
    {
      label: "Quadrant (400×240)",
      html: markup.markup_quadrant,
      width: 400,
      height: 240,
    },
  ];

  return (
    <div style={{ padding: 32, background: "#1a1a1a", minHeight: "100vh" }}>
      <h1
        style={{
          color: "#fff",
          fontFamily: "system-ui",
          marginBottom: 8,
        }}
      >
        TRMNL Preview — {today.toFormat("cccc, LLL d yyyy")}
      </h1>
      <p style={{ color: "#888", fontFamily: "system-ui", marginBottom: 32 }}>
        Showing default schedule for {timezone}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        {variants.map((v) => (
          <div key={v.label}>
            <h3
              style={{
                color: "#aaa",
                fontFamily: "system-ui",
                marginBottom: 8,
              }}
            >
              {v.label}
            </h3>
            <div
              style={{
                width: v.width,
                height: v.height,
                border: "2px solid #444",
                overflow: "hidden",
                background: "#fff",
              }}
              dangerouslySetInnerHTML={{ __html: v.html }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
