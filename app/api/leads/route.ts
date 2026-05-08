import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    auditId?: string;
    companyName?: string;
    role?: string;
  };

  if (!body.email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    lead: {
      email: body.email,
      auditId: body.auditId ?? null,
      companyName: body.companyName ?? null,
      role: body.role ?? null,
    },
  });
}
