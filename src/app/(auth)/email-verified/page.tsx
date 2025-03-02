import React from "react";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerifiedPage() {
  return (
    <AuthWrapper description="Your email has been verified!">
      <p className="text-center my-4">
        You can now sign in and continue using the app.
      </p>
      <Link href="/dashboard">
        <Button className="w-full">Go to Dashboard</Button>
      </Link>
    </AuthWrapper>
  );
}
