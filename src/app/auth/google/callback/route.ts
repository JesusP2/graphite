// Create a Route Handler `app/callback/route.js`
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { createUser } from "@/lib/auth/user";
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

  const { user, dbUser } = await createUser(code)

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getJwtSecretKey());

  const url = new URL(req.url);
  url.searchParams.delete("code");

  const userOrgDomain = dbUser[0]?.domain;
  if (userOrgDomain) {
    url.pathname = `/organization/${userOrgDomain}/overview`;
  } else {
    url.pathname = "/organization/search";
  }
  const response = NextResponse.redirect(url);

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
