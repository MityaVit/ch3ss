import jwt from "jsonwebtoken";
import crypto from "crypto";
import UserService from "../services/userService.js";
import AuthService from "../services/authService.js";

export async function sendPasswordRecoveryEmail(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Необходима почта" });
  }
  try {
    const user = await UserService.getUserByEmail(email);
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpires = Date.now() + Number(process.env.RESET_TOKEN_TTL);
      user.resetToken = resetToken;
      user.resetTokenExpires = resetTokenExpires;
      await user.save();
      
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      await AuthService.sendPasswordResetEmail(email, resetLink);
    }
    res.json({ message: "Если аккаунт зарегистрирован, письмо с ссылкой для сброса пароля было отправлено на почту, указанную при регистрации." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось отправить ссылку для сброса пароля." });
  }
}

export async function sendEmailConfirmationEmail(req, res) {
  const { email } = req.body;
  try {
    const user = await UserService.getUserByEmail(email);
    if (user) {
      const token = jwt.sign({ id: user.idUsers }, process.env.JWT_SECRET, {
        expiresIn: process.env.CONFIRM_TOKEN_TTL,
      });
      const activationLink = `http://localhost:5173/email-activation?token=${token}`;
      await AuthService.sendActivationEmail(email, activationLink);
    }
    res.json({ message: "Если аккаунт зарегистрирован, письмо с ссылкой для подтверждения было отправлено на почту, указанную при регистрации." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Не удалось отправить ссылку для подтверждения почты." });
  }
}

export async function activateAccountHandler(req, res) {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Необходим токен активации." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    await AuthService.activateAccount(payload.id);
    res.status(200).json({ message: "Аккаунт активирован успешно." });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Не удалось активировать аккаунт.",
    });
  }
}

export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Необходимы токен и новый пароль." });
  }
  try {
    await UserService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Пароль изменён успешно." });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Произошла неизвестная ошибка.",
      error: "Изменение пароля не удалось.",
    });
  }
}
