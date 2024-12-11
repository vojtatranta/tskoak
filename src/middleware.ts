import NextAuth from "next-auth";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import i18nMiddleware, { config as i18nConfig } from "./middlewares/i18n";
import { routing } from "./i18n/routing";

const basePaths = ["/login", "/auth", "/answer"];
const locales = routing.locales;

function isPublicPath(path: string): boolean {
  // Remove leading slash for easier matching
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  // Check if path starts with locale prefix
  const hasLocalePrefix = locales.some((locale) =>
    normalizedPath.startsWith(`${locale}/`)
  );

  // If path has locale prefix, remove it before checking base paths
  const pathWithoutLocale = hasLocalePrefix
    ? normalizedPath.slice(3) // Remove locale prefix (e.g., "en/", "cs/", "sk/")
    : normalizedPath;

  return basePaths.some((publicPath) => {
    const normalizedPublicPath = publicPath.startsWith("/")
      ? publicPath.slice(1)
      : publicPath;
    return pathWithoutLocale.startsWith(normalizedPublicPath);
  });
}

export default async function authMiddleware(request: NextRequest) {
  // First apply i18n middleware
  let response = i18nMiddleware(request);

  // If the path is public, just return the i18n response
  if (isPublicPath(request.nextUrl.pathname)) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated and path is not public, redirect to login
  if (!user) {
    console.error("User is not authenticated in middleware, going to login");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, continue with the request
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/(cs|en|sk)/:path*"],
};
// https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=709743336135-vcbk30pj2t6fumb7kg1r4qr98cvhki7t.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fgoogle&code_challenge=GE3CdV-Fxr_hWQEqEIDjMxBvS0VlkkSNKT5BLaOlYtw&code_challenge_method=S256&scope=openid+profile+email
