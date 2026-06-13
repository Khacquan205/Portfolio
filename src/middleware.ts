/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Not authenticated → redirect to home
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Authenticated but not owner → redirect to home
    const email = token.email as string | undefined;
    if (!email || !ALLOWED_EMAILS.includes(email)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
