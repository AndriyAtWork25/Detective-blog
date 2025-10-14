// src/utils/mailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,  // your email
    pass: process.env.EMAIL_PASS,  // password or app password
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
