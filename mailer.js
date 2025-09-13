// backend/mailer.js
import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "info@pyxelane.com", // your email
    pass: process.env.EMAIL_PASSWORD, // store password in .env
  },
});

// Function to send email
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Pyxelane" <info@pyxelane.com>', // sender info
      to, // recipient
      subject,
      text, // plain text
      html, // HTML content
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
