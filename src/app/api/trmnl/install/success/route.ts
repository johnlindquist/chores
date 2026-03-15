import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getInstallSession,
  deleteInstallSession,
  createPluginInstance,
} from "@/lib/db";

// Schema for the TRMNL success webhook payload
const SuccessPayloadSchema = z.object({
  user: z.object({
    uuid: z.string(),
    plugin_setting_id: z.number().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    time_zone_iana: z.string().optional(),
  }),
});

export async function POST(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Missing or invalid Authorization header");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = authHeader.slice(7); // Remove "Bearer " prefix

  try {
    // Verify the access token exists in our install_sessions
    const session = await getInstallSession(accessToken);
    if (!session) {
      console.error("Access token not found in install_sessions");
      return NextResponse.json(
        { error: "Invalid access token" },
        { status: 401 },
      );
    }

    // Parse the request body
    const body = await request.json();
    const parseResult = SuccessPayloadSchema.safeParse(body);

    if (!parseResult.success) {
      console.error("Invalid payload:", parseResult.error);
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.issues },
        { status: 400 },
      );
    }

    const { user } = parseResult.data;

    // Create the plugin instance
    await createPluginInstance({
      uuid: user.uuid,
      plugin_setting_id: user.plugin_setting_id,
      access_token: accessToken,
      user_email: user.email,
      user_name: user.name,
      time_zone_iana: user.time_zone_iana,
    });

    // Cleanup the install session
    await deleteInstallSession(accessToken);

    console.log(`Plugin instance created: ${user.uuid}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Success webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
