import { NextResponse } from "next/server";
import { roleFromUser } from "@/lib/auth-role";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const { data } = await supabase.auth.getUser();
        const role = roleFromUser(data.user);
        const dest = next && next.startsWith("/") ? next : role === "caregiver" ? "/caregiver" : "/agency";
        return NextResponse.redirect(new URL(dest, url.origin));
      }
    }
  }

  const fallback = new URL("/sign-in", url.origin);
  return NextResponse.redirect(fallback);
}
