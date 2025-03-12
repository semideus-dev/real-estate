"use client";

import { authClient } from "@/lib/auth-client";

import Link from "next/link";
import AuthWrapper from "@/components/auth/auth-wrapper";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PiSpinner } from "react-icons/pi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await authClient.signUp.email(
        {
          email: data.email,
          name: data.username,
          password: data.password,
        },
        {
          onRequest: () => {
            setPending(true);
          },
          onSuccess: () => {
            toast("Account created successfully!", {
              description: "Please check your email to verify your account.",
            });
          },
          onError: (error) => {
            toast("Account creation failed!", {
              description: error.error.message ?? "Something went wrong.",
            });
          },
        }
      );
      setPending(false);
    } catch (e) {
      console.log(e)
      toast("Account creation failed!", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <AuthWrapper
      title="Sign Up"
      description="Create an account to get started."
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="border-zinc-100" {...field} />
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
            {pending ? <PiSpinner className="animate-spin" /> : "Sign Up"}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?
          <Link
            href="/sign-in"
            className="text-zinc-900 hover:underline underline-offset-4 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthWrapper>
  );
}
