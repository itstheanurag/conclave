import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROUTES = {
  protected: ["/dashboard", "/settings"],
  exclusive: ["/auth", "/"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("better-auth.session")?.value;
  const path = req.nextUrl.pathname;

  console.log("Middleware running for:", path, "Token exists:", !!token);

  const isProtected = ROUTES.protected.some((route) => path.startsWith(route));
  const isExclusive = ROUTES.exclusive.some((route) => path.startsWith(route));

  // Handle protected routes
  if (isProtected) {
    if (!token) {
      console.log("No token, redirecting to /auth");
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    try {
      // Validate with your Hono backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_API}/get-session`,
        {
          headers: {
            cookie: `better-auth.session=${token}`,
          },
        }
      );

      //   console.log(JSON.stringify(response))

      //   console.log("Session validation response:", response);

      if (!response.ok) {
        console.log("Invalid session, redirecting to /auth");
        // Clear the invalid cookie
        const response = NextResponse.redirect(new URL("/auth", req.url));
        response.cookies.delete("better-auth.session");
        return response;
      }

      // Session is valid, allow access
      //   console.log("Valid session, allowing access");
      return NextResponse.next();
    } catch (error) {
      //   console.error("Session validation error:", error);
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("better-auth.session");
      return response;
    }
  }

  // Handle exclusive routes (auth pages)
  if (isExclusive && token) {
    // Don't validate here, just check if token exists
    // Let the client-side handle validation
    // console.log("Token exists on exclusive route, redirecting to /dashboard");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
