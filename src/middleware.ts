// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
   exp?: number;
   role?: string;
}

const PUBLIC_PATHS = [
   "/",
   "/about",
   "/contact",
   "/courses",
   "/help-center",
   "/help-center/details",
   "/help-center/details/",
   "/courses/", 
];
const AUTH_PATHS = ["/login", "/register"];

// Define role-based path patterns
const ROLE_PATHS = {
   admin: ["/admin", "/admin"],
   teacher: ["/teacher", "/teacher"],
   student: ["/student", "/student"],
   parent: ["/parent", "/parent"],
};

// Define role-specific home pages
const ROLE_HOME_PAGES = {
   admin: "/admin",
   teacher: "/teacher",
   student: "/student",
   parent: "/parent",
};

// Helper function to validate token
function isValidToken(tokenValue: string) {
   try {
      // Attempt to decode the token to validate it
      const decoded = jwtDecode<CustomJwtPayload>(tokenValue);

      // Check if token has expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
         return false;
      }

      // Check if it has required fields
      if (!decoded.role) {
         return false;
      }

      return true;
   } catch (error) {
      return false;
   }
}

// Helper function to check if path matches pattern
function matchesPath(pathname: string, pattern: string): boolean {
   // Special handling for course detail pages
   if (pathname.startsWith("/courses/") && pathname.length > 9) {
      return true;
   }

   // Special handling for help-center detail pages
   if (pathname.startsWith("/help-center/details/") && pathname.length > 21) {
      return true;
   }

   // Convert route pattern to regex
   const regexPattern = pattern
      .replace(/\/:slug/, "/[^/]+") // Convert :slug to regex
      .replace(/\*\*/, ".*"); // Convert ** to regex
   const regex = new RegExp(`^${regexPattern}`);
   return regex.test(pathname);
}

export async function middleware(request: NextRequest) {
   const token = request.cookies.get("access_token");
   const { pathname } = request.nextUrl;

   // Allow access to course detail pages regardless of auth status
   if (pathname.startsWith("/courses/") && pathname.length > 9) {
      return NextResponse.next();
   }

   // Allow access to help-center detail pages regardless of auth status
   if (pathname.startsWith("/help-center/details/") && pathname.length > 21) {
      return NextResponse.next();
   }

   // Allow public paths for all users
   if (PUBLIC_PATHS.some((pattern) => matchesPath(pathname, pattern))) {
      return NextResponse.next();
   }

   // Allow access to auth paths without token validation
   if (AUTH_PATHS.includes(pathname)) {
      // Only redirect if token is valid
      if (token && isValidToken(token.value)) {
         try {
            const decodedToken: any = jwtDecode(token.value);
            const homePage =
               ROLE_HOME_PAGES[
                  decodedToken.role as keyof typeof ROLE_HOME_PAGES
               ];
            return NextResponse.redirect(new URL(homePage, request.url));
         } catch (error) {
            // If there's an error decoding, allow access to login/register
            return NextResponse.next();
         }
      }
      // If no token or invalid token, allow access to auth pages
      return NextResponse.next();
   }

   // For protected routes, check if token exists and is valid
   if (!token || !isValidToken(token.value)) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectUrl", pathname);
      return NextResponse.redirect(redirectUrl);
   }

   try {
      const decodedToken: any = jwtDecode(token.value);
      const userRole = decodedToken.role;

      // Check if user is accessing their allowed paths
      const isAccessingOwnRole = ROLE_PATHS[
         userRole as keyof typeof ROLE_PATHS
      ].some((path) => pathname.startsWith(path));

      // Check if user is accessing other role paths
      const isAccessingOtherRoles = Object.entries(ROLE_PATHS)
         .filter(([role]) => role !== userRole)
         .some(([_, paths]) => paths.some((path) => pathname.startsWith(path)));

      // If trying to access other role paths, redirect to their own dashboard
      if (isAccessingOtherRoles || !isAccessingOwnRole) {
         const homePage =
            ROLE_HOME_PAGES[userRole as keyof typeof ROLE_HOME_PAGES];
         return NextResponse.redirect(new URL(homePage, request.url));
      }

      return NextResponse.next();
   } catch (error) {
      // Clear the invalid token cookie
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
   }
}

export const config = {
   matcher: ["/((?!_next/static|favicon.ico|api|images|_next/image|assets).*)"],
};