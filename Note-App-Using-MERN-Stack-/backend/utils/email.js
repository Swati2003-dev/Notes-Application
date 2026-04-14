import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (options) => {
  const { data, error } = await resend.emails.send({
    from: "Notes Application <onboarding@resend.dev>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });

  if (error) {
    throw new Error(error.message);
  }
};
