import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();
  
  const isLoginPage = url.pathname === '/login';
  const isAdminRoute = url.pathname.startsWith('/admin');

  // mana token mu? hemmmp!! 👀 
  if (isAdminRoute && !token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isLoginPage && token) {
    url.pathname = '/admin/editions';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};