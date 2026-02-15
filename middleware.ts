// middleware.ts — protects PRIVATE_ROUTES
import { auth } from '@/lib/auth';
import { PRIVATE_ROUTES } from '@/lib/navigation';

export default auth((req) => {
  const isPrivate = PRIVATE_ROUTES.some((r) => req.nextUrl.pathname.startsWith(r));
  if (isPrivate && !req.auth) {
    return Response.redirect(new URL('/login', req.nextUrl.origin));
  }
});

export const config = {
  matcher: ['/((?!_next|api/auth|.*\\..*).*)'],
};
