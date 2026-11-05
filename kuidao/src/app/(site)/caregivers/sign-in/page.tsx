import { SignInForm } from "@/components/sign-in-form";

export const metadata = { title: "Caregiver log in" };

export default function CaregiverSignInPage() {
  return <SignInForm audience="caregiver" />;
}
