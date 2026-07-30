import { NextRequest, NextResponse } from "next/server";
import { TEAM_MEMBERS } from "@/config/team";
import { STATUS_VALUES } from "@/types";
import { getAllStatuses, setStatus } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const statuses = await getAllStatuses();
  return NextResponse.json({ members: statuses });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);

  const name = typeof body?.name === "string" ? body.name : "";
  const status = body?.status;
  const tugas = typeof body?.tugas === "string" ? body.tugas.trim().slice(0, 60) : "";

  if (!TEAM_MEMBERS.includes(name as (typeof TEAM_MEMBERS)[number])) {
    return NextResponse.json({ error: "Nama tidak dikenali." }, { status: 400 });
  }

  if (!STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const updated = await setStatus(name, status, tugas);
  return NextResponse.json({ member: updated });
}
