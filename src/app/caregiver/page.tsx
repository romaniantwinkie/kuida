import type { Metadata } from "next";
import { CaregiverHome } from "@/components/caregiver/home";
import { personLabel } from "@/lib/auth-role";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Kuidao · Caregiver",
};

export default async function CaregiverPage() {
  const supabase = await createClient();
  let name = "";
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (data.user) name = personLabel(data.user);
  }
  return <CaregiverHome name={name} />;
}
