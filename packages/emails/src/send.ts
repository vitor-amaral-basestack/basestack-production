// Utils
import nodemailer from "nodemailer";

export interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
}
export interface SendEmail {
  html: string;
  options: SendEmailOptions;
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT) ?? 465,
  secure: !!process.env.EMAIL_SMTP_SECURE ?? true,
  auth: {
    user: process.env.EMAIL_SMTP_AUTH_USER,
    pass: process.env.EMAIL_SMTP_AUTH_PASSWORD,
  },
});

export const sendEmail = async ({ html, options }: SendEmail) => {
  if (!process.env.EMAIL_SMTP_HOST) {
    throw new Error("EMAIL_SMTP_HOST is not defined");
  }

  // This code is needed to work with Next.js API routes
  return await new Promise((resolve, reject) => {
    transporter.sendMail({ ...options, html }, (error, info) => {
      if (error) {
        console.error("The email could not be sent, error = ", error);
        reject(error);
      } else {
        console.log("The email was sent successfully, info = ", info);
        resolve(info);
      }
    });
  });
};
