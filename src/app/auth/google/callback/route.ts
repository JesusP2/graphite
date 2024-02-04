// Create a Route Handler `app/callback/route.js`
import { NextRequest, NextResponse } from "next/server";
import { workos, clientId } from "@/lib/auth/workos";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // The authorization code returned by AuthKit
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(JSON.stringify({ error: "No code provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  });

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecretKey());

  const url = new URL(req.url);
  url.searchParams.delete("code");

  url.pathname = "/";
  const response = NextResponse.redirect(url);

  console.log('setting cookie')
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "lax",
  });

  return response;
}
