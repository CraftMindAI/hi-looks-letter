import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";

export async function requireAdmin(
  request: NextRequest
): Promise<{ uid: string } | { error: NextResponse }> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }
}
