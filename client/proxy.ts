import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTES = {
  protected: ["/dashboard", "/settings"],
  exclusive: ["/auth", "/"], // Routes only accessible by GUESTS
  public: ["/meet"],
};

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("better-auth.session_data")?.value;
  const { pathname } = req.nextUrl;

  // 1. Check if route is protected
  const isProtected = ROUTES.protected.some((route) => 
    pathname.startsWith(route)
  );

  // 2. Check if route is exclusive (Auth pages)
  // FIX: Handle root "/" specifically so it doesn't match everything
  const isExclusive = ROUTES.exclusive.some((route) => {
    return route === "/" ? pathname === "/" : pathname.startsWith(route);
  });

  // 3. Handle Protected Routes
  if (isProtected) {
    if (!token) {
      // Detect if this is a prefetch to avoid console spam
      const isPrefetch = req.headers.get("next-router-prefetch");
      if (!isPrefetch) {
        console.log(`[Middleware] No token on protected route: ${pathname}, redirecting...`);
      }
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Optional: Server-side session validation
    // Note: This adds latency. Only enable if strict security is required here.
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_API}/get-session`,
        {
          headers: req.headers,
        }
      );

      if (!response.ok) {
        const res = NextResponse.redirect(new URL("/auth", req.url));
        res.cookies.delete("better-auth.session_data");
        return res;
      }
    } catch (error) {
      // On network error, we might want to allow them through or fail safe
      // Here we fail safe to auth
      const res = NextResponse.redirect(new URL("/auth", req.url));
      res.cookies.delete("better-auth.session_data");
      return res;
    }
    
    return NextResponse.next();
  }

  // 4. Handle Exclusive Routes (Redirect logged-in users away from /auth or /)
  if (isExclusive && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 5. Allow all other traffic (Public routes, assets, etc)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};