import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/api/auth', '/api', '/_next', '/favicon.ico'];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Skip middleware for root path - let it redirect naturally
  if (pathname === '/') {
    return NextResponse.next();
  }
  
  // For protected routes, check for any auth-related cookies
  const authCookies = [
    'better-auth.session_token',
    'better-auth.session',
    'authjs.session-token',
    'next-auth.session-token'
  ];
  
  const hasSession = authCookies.some(cookieName => request.cookies.has(cookieName));
  
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};