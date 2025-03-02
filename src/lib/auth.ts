import { db } from "@/lib/db";
import { openAPI } from "better-auth/plugins";
import { sendEmail } from "@/lib/actions/auth.actions";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth, BetterAuthOptions } from "better-auth";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
      },
    },
  },
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: url,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.BETTER_AUTH_EMAIL_VERIFICATION_CALLBACK_URL}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        text: verificationUrl,
      });
    },
  },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
