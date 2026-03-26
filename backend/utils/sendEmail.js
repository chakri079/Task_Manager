const nodemailer = require('nodemailer');
const dns = require('dns');

// Force IPv4 because Render's free tier has issues reaching some SMTP servers over IPv6
dns.setDefaultResultOrder('ipv4first');

const sendEmail = async (options) => {
  // Manually enforce IPv4 resolution to bypass Render IPv6 routing issues
  const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const { address } = await dns.promises.lookup(host, { family: 4 });

  // Create a transporter using ethereal email or a real service
  // For production, use a real email service provider via environment variables
  const transporter = nodemailer.createTransport({
    host: address,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      servername: host,
      rejectUnauthorized: false
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
