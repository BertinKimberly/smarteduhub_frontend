import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

interface CustomJwtPayload {
   exp?: number;
   role?: string;
}

// Define public paths that should be accessible without authentication
const PUBLIC_PATHS = [
   "/",
   "/about",
   "/contact",
   "/courses",
   "/help-center",
   "/login",
   "/register",
   "/auth/callback",
];

// Define role-based path patterns
const ROLE_PATHS = {
   admin: ["/admin"],
   teacher: ["/teacher"],
   student: ["/student"],
   parent: ["/parent"],
};

// Define role-specific home pages
const ROLE_HOME_PAGES = {
   admin: "/admin",
   teacher: "/teacher",
   student: "/student",
   parent: "/parent",
};

// Simple function to check if a path should be publicly accessible
function isPublicPath(pathname: string): boolean {
   if (PUBLIC_PATHS.includes(pathname)) return true;
   if (pathname.startsWith("/courses/")) return true;
   if (pathname.startsWith("/help-center/details/")) return true;
   return false;
}

// Simple function to check if a path is an auth page
function isAuthPath(pathname: string): boolean {
   return pathname === "/login" || pathname === "/register";
}

// Function to check if a path is valid (exists in the app)
function isValidPath(pathname: string): boolean {
   return (
      isPublicPath(pathname) ||
      Object.values(ROLE_PATHS).some((paths) =>
         paths.some((path) => pathname.startsWith(path))
      )
   );
}

export async function middleware(request: NextRequest) {
   // Handle i18n first
   const handleI18nRouting = createIntlMiddleware(routing);
   const response = await handleI18nRouting(request);

   // Get the pathname directly from the request URL
   const pathname = request.nextUrl.pathname;
   const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:\/|$)/, "/");

   // 1. Check if the requested path is valid; otherwise, redirect to /not-found
   if (!isValidPath(pathnameWithoutLocale)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
   }

   // 2. Get the token first to check authentication status
   const token = request.cookies.get("access_token");

   // 3. If token exists and user tries to access auth pages, redirect to their role homepage
   if (token && isAuthPath(pathnameWithoutLocale)) {
      try {
         const decoded = jwtDecode<CustomJwtPayload>(token.value);
         if (decoded.role && decoded.exp && decoded.exp > Date.now() / 1000) {
            return NextResponse.redirect(
               new URL(
                  ROLE_HOME_PAGES[decoded.role as keyof typeof ROLE_HOME_PAGES],
                  request.url
               )
            );
         }
      } catch (error) {
         // If token is invalid, continue to auth pages
      }
   }

   // 4. Always allow public paths without any other checks
   if (isPublicPath(pathnameWithoutLocale)) {
      return response;
   }

   // 5. Handle non-public paths when no token exists
   if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   // 6. Validate token and handle role-based access
   try {
      const decoded = jwtDecode<CustomJwtPayload>(token.value);

      if (!decoded.role || !decoded.exp || decoded.exp < Date.now() / 1000) {
         throw new Error("Invalid token");
      }

      const userRole = decoded.role;
      const userRolePaths =
         ROLE_PATHS[userRole as keyof typeof ROLE_PATHS] || [];

      // Check if user is accessing their role-specific paths
      if (
         userRolePaths.some((path) => pathnameWithoutLocale.startsWith(path))
      ) {
         return response;
      }

      // Redirect to role-specific homepage if accessing unauthorized paths
      return NextResponse.redirect(
         new URL(
            ROLE_HOME_PAGES[userRole as keyof typeof ROLE_HOME_PAGES],
            request.url
         )
      );
   } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
   }
}

export const config = {
   matcher: [
      "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
      "/:locale(en|es|rw|mn)(.*)",
   ],
};
