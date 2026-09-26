import { AuthScreen } from "@/components/auth/auth-screen";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function CaregiverSignup() {
  return <AuthScreen role="caregiver" defaultTab="signup" configured={isSupabaseConfigured()} />;
}