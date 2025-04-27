import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('user_id')?.value; // ini baca cookie token

  const isLoginPage = request.nextUrl.pathname === '/login';

  // Kalau belum login dan bukan di /login, redirect
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Kalau sudah login atau memang di /login, biarkan lanjut
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercept semua path kecuali:
     * - /_next/ (file bawaan nextjs)
     * - /static/ (asset static)
     * - /favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};