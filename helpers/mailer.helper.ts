import User from "@/models/user.model";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const handleEmailSend = async ({ email, emailType, userId }: any) => {
  try {
    const hasToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hasToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hasToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "78dcb3d3861c80",
        pass: "7377cc9e8d4d2c",
      },
    });

    const mailOptions = {
      from: "tushar@tushar.ai", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "verify your email" : "Rest your Password", // Subject line
      //   text: "Hello world?", // plain text body

      html: `<p>Click  <a href=${
        process.env.DOMAIN
      }verifyemail?token=${hasToken}>here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser <br/>${
        process.env.DOMAIN
      }/verifyemail?token=${hasToken} </p>`, // html body
    };
    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
