import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizationUrl } from './lib/auth';

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get('token');
  if (!token) {
    const authUrl = getAuthorizationUrl();
    return new Response(null, {
      status: 302,
      headers: {
        Location: authUrl,
      },
    });
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/organization/:path*'],
};
