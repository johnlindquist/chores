import { type NextRequest, NextResponse } from "next/server";
import { getCurrentBenQuote, setCurrentBenQuote } from "@/lib/db";
import { z } from "zod";

const UpdateQuoteSchema = z.object({
  quote: z.string(),
});

// GET - Get current quote
export async function GET() {
  try {
    const quote = await getCurrentBenQuote();
    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Get quote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Update current quote (requires passcode if ADMIN_PASSCODE is set)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = UpdateQuoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // Check passcode if configured
    const adminPasscode = process.env.ADMIN_PASSCODE;
    if (adminPasscode && body.passcode !== adminPasscode) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quote } = parseResult.data;
    await setCurrentBenQuote(quote);

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error("Update quote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
