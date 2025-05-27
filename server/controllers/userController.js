import UserService from "../services/userService.js";
import jwt from "jsonwebtoken";
import AuthService from "../services/authService.js";

export const fetchUsers = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    if (!users) {
      throw new Error("Getting the users failed!");
    }
    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Getting the users failed!",
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = await UserService.createUser(req.body);
    if (!user) {
      throw new Error("User creation failed!");
    }
    res.status(201).json({
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred" ,
      error: "User creation failed!",
    });
  }
};

export const authUser = async (req, res) => {
  try {
    const userData = req.body;
    const result = await UserService.loginUser(userData);
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }
    if (result.activated === false) {
      const activationToken = jwt.sign(
        { id: result.user.idUsers },
        process.env.JWT_SECRET,
        { expiresIn: process.env.CONFIRM_TOKEN_TTL }
      );
      const activationLink = `http://localhost:5173/email-activation?token=${activationToken}`;
      await AuthService.sendActivationEmail(result.user.email, activationLink);
      return res.status(403).json({
        message: "Аккаунт не активирован! Новая ссылка для активации была отправлена на вашу электронную почту, указанную при регистрации."
      });
    }
    const user = result.user;
    const payload = { id: user.idUsers, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ user, token });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Unknown error occured",
      error: "Login failed!",
    });
  }
};

export const fetchUserByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const { passwordHash, ...userWithoutSensitiveData } = user.dataValues;
    res.status(200).json(userWithoutSensitiveData);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching user data failed!",
    });
  }
};

export const fetchUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const { passwordHash, ...userWithoutSensitiveData } = user.dataValues;
    res.status(200).json(userWithoutSensitiveData);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching user data failed!",
    });
  }
};

export const fetchUsernameByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const username = await UserService.getUsernameByUserId(userId);
    res.status(200).json(username);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching username failed!",
    });
  }
}
