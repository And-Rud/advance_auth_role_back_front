const nodemailer = require("nodemailer");
require("dotenv").config();

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.EMAIL,
      to: to,
      subject: "Activations accaunt on" + process.env.API_URL,
      text: "hi",
      html: `<div><h1>For activation enter a link</h1>
      <a href="${link}">${link}</a>
      </div>`,
    });
  }
}

module.exports = new MailService();
