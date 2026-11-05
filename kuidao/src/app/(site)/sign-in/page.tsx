import { SignInForm } from "@/components/sign-in-form";

export const metadata = { title: "Agency log in" };

export default function AgencySignInPage() {
  return <SignInForm audience="agency" />;
}
