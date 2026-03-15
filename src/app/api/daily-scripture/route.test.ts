import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/log-event", () => ({
  logEvent: vi.fn(),
}));

const baseUrl = "http://localhost";

describe("GET /api/daily-scripture", () => {
  it("returns deterministic scripture data for a valid date and timezone", async () => {
    const request = new NextRequest(
      `${baseUrl}/api/daily-scripture?timezone=America/Denver&date=2026-01-02`,
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      timezone: "America/Denver",
      dateKey: "2026-01-02",
      reference: "2 Nephi 3:21",
    });
    expect(body.text).toContain(
      "Because of their faith their words shall proceed forth out of my mouth",
    );
    expect(body.text.length).toBeGreaterThan(body.compactText.length);
  });

  it("rejects an invalid timezone", async () => {
    const request = new NextRequest(
      `${baseUrl}/api/daily-scripture?timezone=Not/AZone&date=2026-01-02`,
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      error: "Invalid timezone",
      timezone: "Not/AZone",
    });
  });

  it("rejects an impossible calendar date", async () => {
    const request = new NextRequest(
      `${baseUrl}/api/daily-scripture?timezone=America/Denver&date=2026-02-31`,
    );

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toMatchObject({
      error: "Invalid date",
      date: "2026-02-31",
    });
  });

  it("rejects a malformed date format", async () => {
    const response = await GET(
      new NextRequest(
        `${baseUrl}/api/daily-scripture?timezone=America/Denver&date=03-14-2026`,
      ),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Invalid date",
      date: "03-14-2026",
    });
  });
});
