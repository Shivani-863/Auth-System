// Import nodemailer
import nodemailer from "nodemailer";
// Configure the email transport options
export const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the service provider
  auth: {
    user: 'authsystemm@gmail.com', // Replace with your email
    pass: 'smfz tysc diyf rzfd', // Replace with your email password (or an app password for Gmail)
  },
});

