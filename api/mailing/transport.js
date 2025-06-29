import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.STMP_SERVER,
  port:  process.env.MAIL_PORT, // or 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user:  process.env.MAIL_USERNAME,
    pass:  process.env.MAIL_PASSWORD,
  },
})