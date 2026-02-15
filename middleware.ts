import { auth } from '@/lib/auth';
import { PRIVATE_ROUTES } from '@/lib/navigation';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPrivate = PRIVATE_ROUTES.some(r => pathname.startsWith(r));
  if (isPrivate && !req.auth) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next|api/auth|.*\\..*).*)'],
};
