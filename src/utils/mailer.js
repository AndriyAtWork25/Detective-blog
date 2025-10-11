// src/utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // можна змінити на інший SMTP (наприклад, Mailtrap для тестів)
  auth: {
    user: process.env.EMAIL_USER,  // твій email
    pass: process.env.EMAIL_PASS,  // пароль або App Password
  },
});

export const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Sherlock's Blog" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("📩 Email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
