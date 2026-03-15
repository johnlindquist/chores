import { benQuoteDeprecatedResponse } from "@/lib/ben-quote-deprecation";

export async function GET() {
  return benQuoteDeprecatedResponse("/api/ben-quote", "GET");
}

export async function POST() {
  return benQuoteDeprecatedResponse("/api/ben-quote", "POST");
}
