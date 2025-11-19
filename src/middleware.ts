// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './auth';

export const runtime = 'edge'; // Explicitly use Edge Runtime

export async function middleware(req: NextRequest) {
  const session = await auth();
  const isAuthed = !!session?.user;
  const path = req.nextUrl.pathname;

  const protectedPaths = ['/account', '/orders', '/builder'];
  
  if (protectedPaths.some((p) => path.startsWith(p)) && !isAuthed) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

