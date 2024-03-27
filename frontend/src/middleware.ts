import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    const session = request.cookies.get('mysession');
    if (session !== null) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.redirect(new URL('/login', request.url));
  }
}
