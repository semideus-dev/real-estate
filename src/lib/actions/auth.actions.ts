"use server";

import { Resend } from "resend";

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
}

export async function sendEmail({ to, subject, text }: SendEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: to.toLowerCase().trim(),
      subject: subject.trim(),
      react: text.trim(),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return {
      success: true,
      message: Response.json({ data }, { status: 200 }),
    };
  } catch (e) {
    console.log(e);

    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
