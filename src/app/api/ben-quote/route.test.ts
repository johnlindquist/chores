import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

describe("/api/ben-quote", () => {
  it("returns a structured 410 response for every supported method", async () => {
    for (const handler of [GET, POST]) {
      const response = await handler();

      expect(response.status).toBe(410);
      await expect(response.json()).resolves.toMatchObject({
        error: "Deprecated",
        replacement: {
          path: "/api/daily-scripture",
        },
      });
    }
  });
});
