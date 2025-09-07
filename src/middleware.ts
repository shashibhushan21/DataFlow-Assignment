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
  
  // Check for any cookie that looks like a session token
  const cookies = request.cookies.getAll();
  const hasSession = cookies.some(cookie => 
    cookie.name.includes('session') || 
    cookie.name.startsWith('better-auth') ||
    cookie.value.length > 50 // Long encrypted tokens
  );
  
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};