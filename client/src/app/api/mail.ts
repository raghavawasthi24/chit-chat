import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: "example@gmail.com", // Replace with your email address
      pass: "example", // Replace with the password to your email.
    },
  });

  const mailData = {
    from: "Chat API",
    to: req.body.email,
    subject: "Verify your email",
    text: req.body.message,
  };

  transporter.sendMail(mailData, function (err:any, info:any) {
    if (err) {
      return res.status(500).json({ message: `An error occurred: ${err}` });
    }
    res.status(200).json({ message: info });
  });
}
