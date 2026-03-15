import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPluginInstance, deletePluginInstance } from "@/lib/db";

const UninstallPayloadSchema = z.object({
  user_uuid: z.string(),
});

export async function POST(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.slice(7);

  try {
    // Parse the request body
    const body = await request.json();
    const parseResult = UninstallPayloadSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid payload:", parseResult.error);
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { user_uuid } = parseResult.data;

    // Verify the access token matches the stored one
    const instance = await getPluginInstance(user_uuid);
    if (!instance) {
      console.error(`Instance not found: ${user_uuid}`);
      // Return success anyway - maybe already deleted
      return NextResponse.json({ success: true });
    }

    if (instance.access_token !== accessToken) {
      console.error("Access token mismatch for uninstall");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the instance
    await deletePluginInstance(user_uuid);

    console.log(`Plugin instance deleted: ${user_uuid}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Uninstall webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
