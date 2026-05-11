import { NextResponse } from "next/server";
import { materialsData } from "../../../lib/data";

export async function GET() {
  // Simulasi waktu delay fetch dari Headless CMS
  await new Promise((resolve) => setTimeout(resolve, 300));
  return NextResponse.json(materialsData);
}
