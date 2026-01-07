import { type NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { z } from "zod";

interface Quote {
  id: number;
  quote: string;
  added_by: string | null;
  created_at: Date;
}

const AddQuoteSchema = z.object({
  quote: z.string().min(1),
  added_by: z.string().optional(),
});

// GET - Get all quotes or random quote
export async function GET(request: NextRequest) {
  const random = request.nextUrl.searchParams.get("random");

  try {
    if (random === "true") {
      const result = await sql<Quote>`
        SELECT * FROM ben_quotes ORDER BY RANDOM() LIMIT 1
      `;
      return NextResponse.json(result.rows[0] || null);
    }

    const result = await sql<Quote>`
      SELECT * FROM ben_quotes ORDER BY created_at DESC
    `;
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Get quotes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = AddQuoteSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.issues },
        { status: 400 }
      );
    }

    const { quote, added_by } = parseResult.data;

    const result = await sql<Quote>`
      INSERT INTO ben_quotes (quote, added_by)
      VALUES (${quote}, ${added_by || null})
      RETURNING *
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Add quote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a quote
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    await sql`DELETE FROM ben_quotes WHERE id = ${Number.parseInt(id, 10)}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete quote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
