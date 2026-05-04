import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/convert",
  "/pdf_convert",
  "/word_convert",
  "/privacy",
  "/terms",
  "/tokusho",
  "/compile",
  "/api/webhook",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      // API routes: return 401
      if (request.nextUrl.pathname.startsWith("/api/")) {
        await auth.protect();
      } else {
        // Page routes: redirect to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
