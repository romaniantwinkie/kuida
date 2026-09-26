import { Suspense } from "react";
import { SignInGate } from "@/components/auth/auth-screen";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInGate configured={isSupabaseConfigured()} />
    </Suspense>
  );
}
