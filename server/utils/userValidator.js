import User from "../models/user.js";

const emailFitsThePattern = (email) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase());
};

const usernameFitsThePattern = (username) => {
  const pattern = /^[a-zA-Z][a-zA-Z0-9_]{2,15}$/;
  return pattern.test(String(username).toLowerCase());
};

const hasTooManyRepeatingChars = (username) => /(.)\1{4,}/.test(username);

const isEmailValid = async (email) => {
  if (!email) {
    throw new Error("Email не указан.");
  }

  if (!emailFitsThePattern(email)) {
    throw new Error("Email не соответствует шаблону.");
  }

  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new Error("Email уже используется!");
  }

  return email;
};

const isUsernameValid = async (username) => {
  if (!username || !usernameFitsThePattern(username)) {
    throw new Error("Неверное имя пользователя. Оно должно содержать от 3 до 15 латинских символов.");
  }

  if (hasTooManyRepeatingChars(username)) {
    throw new Error("Слишком много повторяющихся символов.");
  }

  const user = await User.findOne({ where: { username } });
  if (user) {
    throw new Error("Имя пользователя уже используется!");
  }

  return username;
};

const isPasswordStrong = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("минимум 8 символов");
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("минимум 1 цифра");
  }

  if (!/(?=.*[!@#$%^&*])/.test(password)) {
    errors.push("минимум 1 специальный символ (!@#$%^&*)");
  }

  if (!/(?=.*[a-zа-яё])/.test(password)) {
    errors.push("минимум 1 строчная буква");
  }

  if (!/(?=.*[A-ZА-ЯЁ])/.test(password)) {
    errors.push("минимум 1 заглавная буква");
  }

  if (errors.length === 0) {
    return { strong: true };
  }

  return { strong: false, errors };
};

export default {
  isEmailValid,
  isUsernameValid,
  isPasswordStrong,
};
