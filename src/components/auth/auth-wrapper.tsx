import React from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface AuthWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export default function AuthWrapper({
  children,
  description,
  title = "APS Trust",
}: AuthWrapperProps) {
  return (
    <Card className="w-full max-w-md shadow-lg border-zinc-100">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center my-4">
          <Image
            src="/logo.svg"
            width={60}
            height={60}
            alt="logo"
            className="invert"
          />
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
