// pages/api/send-email.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Optional: for safety, set types for body
type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body as ContactFormData;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create email transporter using Gmail + app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // ✅ use .env.local
        pass: process.env.GMAIL_PASS,
      },
    });

    // Define the email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // send to your own email
      subject: `New Contact Form Submission from ${name}`,
      text: `
You received a new contact form submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Message:
${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send email.' });
  }
}
