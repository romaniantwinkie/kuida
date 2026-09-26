import { Suspense } from "react";
import { SignInGate } from "@/components/auth/auth-screen";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInGate />
    </Suspense>
  );
}
