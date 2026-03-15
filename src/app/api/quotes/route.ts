import { benQuoteDeprecatedResponse } from "@/lib/ben-quote-deprecation";

export async function GET() {
  return benQuoteDeprecatedResponse("/api/quotes", "GET");
}

export async function POST() {
  return benQuoteDeprecatedResponse("/api/quotes", "POST");
}

export async function DELETE() {
  return benQuoteDeprecatedResponse("/api/quotes", "DELETE");
}
