import { NextResponse } from "next/server";
import { getTrips } from "./data";

export async function GET() {
  return NextResponse.json(getTrips());
}
