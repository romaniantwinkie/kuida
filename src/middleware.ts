import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEMO_COOKIE, roleFromUser } from "@/lib/auth-role";
import { supabaseEnv } from "@/lib/supabase/env";

type PendingCookie = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  const env = supabaseEnv();
  const pending: PendingCookie[] = [];
  let response = NextResponse.next({ request });

  const apply = (res: NextResponse) => {
    pending.forEach(({ name, value, options }) => {
      res.cookies.set(name, value, options);
    });
    return res;
  };

  let user = null;
  if (env) {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          pending.splice(0, pending.length, ...cookiesToSet);
          response = NextResponse.next({ request });
          apply(response);
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { pathname } = request.nextUrl;
  const role = roleFromUser(user);
  const agencyPath = pathname === "/agency" || pathname.startsWith("/agency/");
  const caregiverPath = pathname === "/caregiver" || pathname.startsWith("/caregiver/");

  const go = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    return apply(NextResponse.redirect(url));
  };

  if (agencyPath) {
    if (request.nextUrl.searchParams.get("demo") === "1") {
      const url = request.nextUrl.clone();
      url.searchParams.delete("demo");
      const redirect = NextResponse.redirect(url);
      apply(redirect);
      redirect.cookies.set(DEMO_COOKIE, "1", {
        path: "/",
        sameSite: "lax",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
      });
      return redirect;
    }
    if (request.cookies.get(DEMO_COOKIE)?.value === "1" || role === "agency") {
      return apply(response);
    }
    if (role === "caregiver") return go("/caregiver");
    return go("/sign-in");
  }

  if (caregiverPath) {
    if (role === "caregiver") return apply(response);
    if (role === "agency") return go("/agency");
    return go("/sign-in", "?role=caregiver");
  }

  return apply(response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
