import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

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
   const { pathname } = request.nextUrl;

   // 1. Check if the requested path is valid; otherwise, redirect to /not-found
   if (!isValidPath(pathname)) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
   }

   // 2. Always allow public paths without any other checks
   if (isPublicPath(pathname)) {
      return NextResponse.next();
   }

   // 3. Get the token
   const token = request.cookies.get("access_token");

   // 4. If no token, redirect to login for non-public paths
   if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
   }

   // 5. Validate token and handle role-based access
   try {
      const decoded = jwtDecode<CustomJwtPayload>(token.value);

      if (!decoded.role || !decoded.exp || decoded.exp < Date.now() / 1000) {
         throw new Error("Invalid token");
      }

      const userRole = decoded.role;
      const userRolePaths = ROLE_PATHS[userRole as keyof typeof ROLE_PATHS] || [];

      // Check if user is accessing their role-specific paths
      if (userRolePaths.some((path) => pathname.startsWith(path))) {
         return NextResponse.next();
      }

      // Redirect to role-specific homepage if accessing unauthorized paths
      return NextResponse.redirect(
         new URL(ROLE_HOME_PAGES[userRole as keyof typeof ROLE_HOME_PAGES], request.url)
      );
   } catch (error) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
   }
}

export const config = {
   matcher: ["/((?!_next/static|favicon.ico|api|images|_next/image|assets).*)"],
};
