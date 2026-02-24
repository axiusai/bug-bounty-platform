import { NextResponse } from "next/server";
import { openApiSpec } from "@/shared/openapi/spec";

export async function GET() {
  return NextResponse.json(openApiSpec);
}
