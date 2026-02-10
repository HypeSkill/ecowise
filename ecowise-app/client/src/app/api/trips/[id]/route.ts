import { NextResponse } from "next/server";
import { deleteTrip } from "../data";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const deleted = deleteTrip(params.id);
  return NextResponse.json({ success: deleted });
}
