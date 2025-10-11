// src/emails/account.js

// ------------------ Verification Email ------------------
export const sendVerificationEmail = async (email, token) => {
  try {
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const verificationUrl = `http://localhost:5000/api/auth/verify-email?token=${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; background: #f8f9fa; border: 1px solid #ddd;">
        <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
        <p style="font-size: 16px; color: #555;">Hello 👋,</p>
        <p style="font-size: 16px; color: #555;">
          Thank you for registering on <strong>Sherlocks Blog</strong>! Please confirm your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold;">
            Verify My Email
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">
          If the button doesn’t work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; color: #555; word-break: break-all;">${verificationUrl}</p>
        <p style="font-size: 13px; color: #aaa; text-align: center;">© 2025 Sherlocks Blog. All rights reserved.</p>
      </div>
    `;

    await sgMail.send({
      to: email,
      from: 'andriy3388@gmail.com', // обов'язково підтверджений емейл у SendGrid
      subject: 'Please verify your email',
      text: `Hello! Please verify your email by visiting this link: ${verificationUrl}`,
      html: htmlContent,
      mail_settings: {
        sandbox_mode: { enable: false } // ✅ лист реально відправляється
      }
    });

    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error.response?.body || error);
  }
};

