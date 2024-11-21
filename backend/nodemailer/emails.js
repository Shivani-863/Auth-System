import { transporter } from "./nodemailer.js";
import {VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE,WELCOME_MAIL_TEMPLATE} from "../nodemailer/emailTemplates.js"
export const sendVerificationEmail=(email,verificationToken)=>{
let verificationMail = {
  from: 'authsystemm@gmail.com', // Sender's email address
  to: email, // Recipient's email address
  subject: 'Verify Your Email', // Subject line
  text: ' ', // Plain text body
  html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken), // HTML body
  category:"Email Verification"
};
// Send the email
 transporter.sendMail(verificationMail, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent:', info.response);
});
};
export const sendWelcomeEmail=(email,name)=>{
  let WelcomeMail = {
  from: 'authsystemm@gmail.com', // Sender's email address
  to: email, // Recipient's email address
  subject: 'Welcome to Auth System', // Subject line
  text: ' ', // Plain text body
  html: WELCOME_MAIL_TEMPLATE.replace("{name}",name), // HTML body
  category:"Welcome Email"
}
transporter.sendMail(WelcomeMail, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent:', info.response);
});
};
export const sendResetPasswordEmail=(email,resetURL)=>{
  let ResetMail = {
  from: 'authsystemm@gmail.com', // Sender's email address
  to: email, // Recipient's email address
  subject: 'Reset Password link', // Subject line
  text: ' ', // Plain text body
  html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL), // HTML body
  category:"Reset Password Mail"
}
transporter.sendMail(ResetMail, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent:', info.response);
});
};

export const sendResetPasswordSuccessEmail=(email)=>{
  let ResetSuccessMail = {
  from: 'authsystemm@gmail.com', // Sender's email address
  to: email, // Recipient's email address
  subject: 'Password Reset Successfully!!', // Subject line
  text: ' ', // Plain text body
  html: PASSWORD_RESET_SUCCESS_TEMPLATE, // HTML body
  category:"Reset Successful Mail"
}
transporter.sendMail(ResetSuccessMail, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error);
  }
  console.log('Email sent:', info.response);
});
};

