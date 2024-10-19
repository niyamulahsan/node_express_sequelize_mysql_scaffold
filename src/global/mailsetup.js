const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // CREATE A TRANSPORT
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // DEFINE EMAIL OPTION
  const emailOption = {
    from: `Test mail suppport <${process.env.MAIL_FROM_ADDRESS}>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
    html: option.message,
  };

  return await transport.sendMail(emailOption);
};

module.exports = sendEmail;
