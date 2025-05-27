import User from "../models/user.js";
import nodemailer from "nodemailer";
import { createTransporter } from "../mailer/config.js";

const FROM = '"Ch3ss" <no-reply@chess.com>';

export const activateAccount = async (userId) => {
  try {
    const user = await User.findOne({ where: { idUsers: userId } });
    if (!user) {
      throw new Error("Пользователь не найден!");
    }
    if (user.activated == true) {
      throw new Error("Учетная запись уже активирована!");
    }

    user.activated = true;
    await user.save();
  } catch (error) {
    throw new Error(error);
  }
};

export async function sendPasswordResetEmail(email, resetLink) {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Сброс пароля",
    text: `Пожалуйста, используйте следующую ссылку для сброса пароля (одноразовое использование): ${resetLink}`,
    html: `<b>Сбросьте пароль, нажав <a href="${resetLink}">здесь</a></b>`,
  });
  const previewURL = nodemailer.getTestMessageUrl(info);
  console.log("Ссылка предпросмотра для сброса пароля:", previewURL);
}

export async function sendActivationEmail(email, activationLink) {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: FROM,
    to: email,
    subject: "Подтверждение электронной почты",
    text: `Пожалуйста, активируйте вашу учетную запись, используя следующую ссылку: ${activationLink}`,
    html: `<b>Активируйте вашу учетную запись, нажав <a href="${activationLink}">здесь</a></b>`,
  });
  const previewURL = nodemailer.getTestMessageUrl(info);
  console.log("Ссылка предпросмотра для подтверждения электронной почты:", previewURL);
}

export default {
  activateAccount,
  sendPasswordResetEmail,
  sendActivationEmail,
};
