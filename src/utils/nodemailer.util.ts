import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL
  secure: true,
  auth: {
    user: process.env.REACT_APP_NODEMAILER_EMAIL, // Your Gmail address
    pass:
      process.env.REACT_APP_NODEMAILER_PASS?.startsWith('"') &&
      process.env.REACT_APP_NODEMAILER_PASS?.endsWith('"')
        ? process.env.REACT_APP_NODEMAILER_PASS.slice(1, -1)
        : process.env.REACT_APP_NODEMAILER_PASS,
  },
});

export default transporter;

// NODEMAILER_EMAIL
// NODEMAILER_PASS
