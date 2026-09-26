import { AuthScreen } from "@/components/auth/auth-screen";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AgencySignup() {
  return <AuthScreen role="agency" defaultTab="signup" configured={isSupabaseConfigured()} />;
}
