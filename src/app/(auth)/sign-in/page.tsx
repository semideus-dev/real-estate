"use client";

import Link from "next/link";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { PiSpinner } from "react-icons/pi";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: () => {
            setPending(true);
          },

          onSuccess: () => {
            toast("Signed in successfully!");
            router.push("/dashboard");
            router.refresh();
          },
          onError: (error) => {
            toast("Sign in failed!", {
              description: error.error.message ?? "Something went wrong.",
            });
          },
        }
      );

      setPending(false);
    } catch (e) {
      toast("Sign in failed!", {
        description: "Please check your credientials and try again.",
      });
    }
  };

  return (
    <AuthWrapper
      title="Sign In"
      description="Enter your credientials to sign in."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    className="border-zinc-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  {/* <Link href="/forgot-password" className="text-sm">
                    Forgot password?
                  </Link> */}
                </div>
                <FormControl>
                  <Input
                    type="password"
                    className="border-zinc-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full text-white"
            disabled={form.formState.isSubmitting}
          >
            {pending ? <PiSpinner className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/sign-up"
            className="text-zinc-900 hover:underline underline-offset-4 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
