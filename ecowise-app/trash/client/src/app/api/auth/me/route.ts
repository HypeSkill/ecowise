import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    user: {
      id: "demo-user",
      name: "EcoWise Demo",
      email: "demo@ecowise.ai",
    },
  });
}
