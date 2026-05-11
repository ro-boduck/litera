import { NextResponse } from "next/server";
import { materialDetailData } from "../../../../lib/data";

export async function GET(request, { params }) {
  const { id } = await params;
  
  // Simulasi waktu delay fetch dari Headless CMS
  await new Promise((resolve) => setTimeout(resolve, 300));

  const data = materialDetailData[id];
  if (!data) {
    return NextResponse.json({ error: "Materi tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(data);
}
