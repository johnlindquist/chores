import { type NextRequest, NextResponse } from "next/server";
import { createInstallSession } from "@/lib/db";

const TRMNL_OAUTH_URL = "https://usetrmnl.com/oauth/token";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const installationCallbackUrl = searchParams.get("installation_callback_url");

  if (!code || !installationCallbackUrl) {
    return NextResponse.json(
      { error: "Missing code or installation_callback_url" },
      { status: 400 }
    );
  }

  const clientId = process.env.TRMNL_CLIENT_ID;
  const clientSecret = process.env.TRMNL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing TRMNL_CLIENT_ID or TRMNL_CLIENT_SECRET env vars");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    // Exchange code for access_token via TRMNL OAuth endpoint
    const oauthResponse = await fetch(TRMNL_OAUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!oauthResponse.ok) {
      const errorText = await oauthResponse.text();
      console.error("TRMNL OAuth error:", errorText);
      return NextResponse.json(
        { error: "OAuth token exchange failed" },
        { status: 500 }
      );
    }

    const oauthData = await oauthResponse.json();
    const accessToken = oauthData.access_token;

    if (!accessToken) {
      console.error("No access_token in OAuth response:", oauthData);
      return NextResponse.json(
        { error: "No access token received" },
        { status: 500 }
      );
    }

    // Store the access token in install_sessions for later verification
    await createInstallSession(accessToken);

    // Redirect back to TRMNL
    return NextResponse.redirect(installationCallbackUrl);
  } catch (error) {
    console.error("Installation error:", error);
    return NextResponse.json(
      { error: "Installation failed" },
      { status: 500 }
    );
  }
}
