const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  }
});

const sendEmail = async ({ receipients, subject, message }) => {
  return await transport.sendMail({
    from: process.env.MAIL_FROM_ADDRESS,
    to: receipients,
    subject: subject,
    text: message,
    html: message
  });
};

module.exports = { sendEmail };