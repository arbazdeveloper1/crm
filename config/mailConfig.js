import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailAccounts = {
  "support@myflysupports.com": process.env.EMAIL_PASS1,
  "e-tickets@myflysupports.com": process.env.EMAIL_PASS2,
};

const createTransporter = (fromEmail) => {
  if (!emailAccounts[fromEmail]) {
    throw new Error("Unauthorized email");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: fromEmail,
      pass: emailAccounts[fromEmail],
    },
  });
};


export default createTransporter;
