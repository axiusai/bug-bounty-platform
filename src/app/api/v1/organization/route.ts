import { NextResponse } from "next/server";
import { successResponse } from "@/shared/responses/api-response";

export async function GET() {
  return NextResponse.json(successResponse({ message: "Organization API - not implemented" }));
}
