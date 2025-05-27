import User from "../models/user.js";
import bcrypt from "bcrypt";
import userValidator from "../utils/userValidator.js";
import { Op } from "sequelize";

const getAllUsers = async () => {
  return await User.findAll();
};

const getUserById = async (idUsers) => {
  if (!idUsers) {
    throw new Error("Требуется ID пользователя!");
  }
  return await User.findOne({ where: { idUsers } });
};

const getUsernameByUserId = async (idUsers) => {
  if (!idUsers) {
    throw new Error("Требуется ID пользователя!");
  }
  const user = await User.findOne({ where: { idUsers } });
  if (!user) {
    throw new Error("Пользователь не найден!");
  }
  return user.username;
};

const getUserByUsername = async (username) => {
  if (!username) {
    throw new Error("Необходимо имя пользователя!");
  }
  return await User.findOne({ where: { username } });
};

const getUserPasswordHash = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }
  return user.passwordHash;
};

const doPasswordsMatch = async (password, email) => {
  if (!email || !password) {
    throw new Error("Все поля обязательны!");
  }
  const passwordHash = await getUserPasswordHash(email);
  if (!passwordHash) {
    return false;
  }
  return bcrypt.compare(password, passwordHash);
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;
  const passwordsMatch = await doPasswordsMatch(password, email);
  if (!passwordsMatch) {
    throw new Error("Пользователь с указанным email или паролем не найден.");
  }
  const user = await getUserByEmail(email);
  if (!user.activated) {
    return { user, activated: false };
  }
  return { user, activated: true };
};

const createPasswordHash = async (password) => {
  const result = userValidator.isPasswordStrong(password);

  if (!result.strong) {
    throw new Error(
      `Пароль недостаточно надежен, требования: ${result.errors.join(", ")}`
    );
  }

  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const createUser = async (userData) => {
  try {
    const { username, password, role, email } = userData;

    const hashedPassword = await createPasswordHash(password);
    const validatedEmail = await userValidator.isEmailValid(email);
    const validatedUsername = await userValidator.isUsernameValid(username);

    const user = await User.create({
      username: validatedUsername,
      email: validatedEmail,
      passwordHash: hashedPassword,
      role: role.toLowerCase() || "",
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, data) => {
  return await User.update(data, { where: { idUsers: id } });
};

const deleteUser = async (id) => {
  return await User.destroy({ where: { idUsers: id } });
};

const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error("Email обязателен!");
  }
  return await User.findOne({ where: { email } });
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() }
    }
  });
  if (!user) {
    throw new Error("Недействительный или просроченный токен");
  }
  const hashedPassword = await createPasswordHash(newPassword);
  await updateUser(user.idUsers, { passwordHash: hashedPassword, resetToken: null, resetTokenExpires: null });
  return user;
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserByUsername,
  getUserByEmail,
  resetPassword,
  getUsernameByUserId,
};
