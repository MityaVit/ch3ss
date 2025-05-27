import { useState } from "react";
import { Modal } from "../helpers/modal";
import { sendEmailConfirmation, sendPasswordRecoveryLink, createUser, authUser } from "../../api";

export const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const inputClass =
    "p-[1vh] w-full bg-[#505050] text-white rounded-md outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all";
  const disabledButtonClass =
    "bg-[#505050] text-[#818181] cursor-not-allowed transition-none";
  const enabledButtonClass =
    "bg-gradient-to-r from-green-500 via-blue-400 to-purple-500 text-white ring-blue-300 ring-[0.1vh]";
  const baseButtonClass =
    "p-[1.2vh] w-full rounded-md font-semibold transition-all";

  const [currentView, setCurrentView] = useState("login"); // 'login', 'register', 'forgotPassword'
  const [registrationMessage, setRegistrationMessage] = useState("");

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [registerFormData, setRegisterFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    role: "Student",
  });

  const [recoveryFormData, setRecoveryFormData] = useState({
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState("");

  const handleLoginFormInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...loginFormData, [name]: value });
  };

  const handleRecoveryFormInputChange = (e) => {
    const { name, value } = e.target;
    setRecoveryFormData({ ...recoveryFormData, [name]: value });
  };

  const handleRegisterFormInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormData({ ...registerFormData, [name]: value });
  };

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await authUser(loginFormData);
      if (response.status === 200) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoveryFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRecoverySuccess("");
    setIsLoading(true);
    try {
      await sendPasswordRecoveryLink(recoveryFormData.email);
      setRecoverySuccess(
        `Ссылка восстановления пароля была отправлена на почтовый адрес ${recoveryFormData.email}, если есть аккаунт, связанный с ним`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await createUser(registerFormData);
      if (response.status === 201) {
        await sendEmailConfirmation(registerFormData.email);
        setRegistrationMessage(
          "Регистрация успешна! Пожалуйста, проверьте указанную вами почту. На неё должно прийти письмо с ссылкой для подтверждения аккаунта."
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentViewChange = (view) => {
    setCurrentView(view);
    setError("");
    setRecoverySuccess("");
    setRegistrationMessage("");
    setLoginFormData({
      email: "",
      password: "",
    });
    setRegisterFormData({
      username: "",
      password: "",
      email: "",
      confirmPassword: "",
      role: "Student",
    });
    setRecoveryFormData({
      email: "",
    });
    setShowPassword(false);
  };

  const isLoginFormComplete = Object.values(loginFormData).every(
    (value) => value.trim() !== ""
  );
  const isRecoveryFormComplete = Object.values(recoveryFormData).every(
    (value) => value.trim() !== ""
  );
  const isRegisterFormComplete = Object.values(registerFormData).every(
    (value) => value.trim() !== ""
  );

  const renderLoginForm = () => (
    <form className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]" onSubmit={handleLoginFormSubmit}>
      <label className="flex flex-col gap-[0.5vh]">
        <span className="text-[#d3d3d3] font-semibold">Электронная почта</span>
        <input
          type="email"
          name="email"
          value={loginFormData.email}
          onChange={handleLoginFormInputChange}
          placeholder="Введите вашу электронную почту"
          className={inputClass}
          required
        />
      </label>

      <label className="flex flex-col gap-[0.5vh]">
        <span className="text-[#d3d3d3] font-semibold">Пароль</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={loginFormData.password}
            onChange={handleLoginFormInputChange}
            placeholder="Введите ваш пароль"
            className={inputClass}
            required
          />
          <span
            className="absolute top-1/2 right-[1vh] -translate-y-1/2 cursor-pointer text-white text-[1.8vh] select-none"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            onMouseLeave={() => setShowPassword(false)}
            onTouchStart={() => setShowPassword(true)}
            onTouchEnd={() => setShowPassword(false)}
          >
            {showPassword ? "🙉" : "🙈"}
          </span>
        </div>
      </label>

      <button
        disabled={isLoading}
        type="submit"
        className={`${baseButtonClass} ${
          isLoading
            ? disabledButtonClass
            : isLoginFormComplete
            ? enabledButtonClass
            : disabledButtonClass
        }`}
      >
        Войти
      </button>

      <div className="flex justify-between text-[1.7vh] text-[#aaaaaa]">
        <span
          className="hover:text-[#c4c4c4] cursor-pointer"
          onClick={() => handleCurrentViewChange("recovery")}
        >
          Забыли пароль?
        </span>
        <span
          className="hover:text-[#c4c4c4] cursor-pointer"
          onClick={() => handleCurrentViewChange("register")}
        >
          Нет аккаунта?
        </span>
      </div>
    </form>
  );

  const renderRegisterForm = () => {
    if (registrationMessage) {
      return (
        <div className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]">
          <div className="text-green-500 text-[1.7vh]">{registrationMessage}</div>
          <span
            className="hover:text-[#c4c4c4] cursor-pointer text-[1.7vh] text-[#818181]"
            onClick={() => handleCurrentViewChange("login")}
          >
            Вернуться ко входу
          </span>
        </div>
      );
    }
    return (
      <form className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]" onSubmit={handleRegisterFormSubmit}>
        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Имя пользователя</span>
          <input
            type="text"
            name="username"
            value={registerFormData.username}
            onChange={handleRegisterFormInputChange}
            placeholder="Введите ваше имя пользователя"
            className={inputClass}
            required
          />
          <span className="text-[1.4vh] text-[#818181]">
            Латинские буквы, от 3 до 15 символов.
          </span>
        </label>

        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Электронная почта</span>
          <input
            type="email"
            name="email"
            value={registerFormData.email}
            onChange={handleRegisterFormInputChange}
            placeholder="Введите вашу электронную почту"
            className={inputClass}
            required
          />
          <span className="text-[1.4vh] text-[#818181]">
            Формат: example@mail.com.
          </span>
        </label>

        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Пароль</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={registerFormData.password}
              onChange={handleRegisterFormInputChange}
              placeholder="Введите ваш пароль"
              className={inputClass}
              required
            />
            <span
              className="absolute top-1/2 right-[1vh] -translate-y-1/2 cursor-pointer text-white text-[1.8vh] select-none"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              {showPassword ? "🙉" : "🙈"}
            </span>
          </div>
          <span className="text-[1.4vh] text-[#818181]">
            Должен содержать 1 заглавную букву, 1 прописную, 1 цифру, 1 спецсимвол.
          </span>
        </label>

        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Подтвердите пароль</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={registerFormData.confirmPassword}
              onChange={handleRegisterFormInputChange}
              placeholder="Повторите ваш пароль"
              className={inputClass}
              required
            />
            <span
              className="absolute top-1/2 right-[1vh] -translate-y-1/2 cursor-pointer text-white text-[1.8vh] select-none"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              {showPassword ? "🙉" : "🙈"}
            </span>
          </div>
        </label>

        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Роль</span>
          <select
            name="role"
            value={registerFormData.role}
            onChange={handleRegisterFormInputChange}
            className={inputClass}
          >
            <option value="Student">Ученик</option>
            <option value="Coach">Тренер</option>
          </select>
        </label>

        <button
          disabled={isLoading}
          type="submit"
          className={`${baseButtonClass} ${
            isLoading
              ? disabledButtonClass
              : isRegisterFormComplete
              ? enabledButtonClass
              : disabledButtonClass
          }`}
        >
          Зарегистрироваться
        </button>

        <span
          className="hover:text-[#c4c4c4] cursor-pointer text-[1.7vh] text-[#aaaaaa]"
          onClick={() => handleCurrentViewChange("login")}
        >
          Уже есть аккаунт?
        </span>
      </form>
    );
  };

  const renderRecoveryForm = () => {
    if (recoverySuccess) {
      return (
        <div className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]">
          <div className="text-green-500 text-[1.7vh]">{recoverySuccess}</div>
          <span
            className="hover:text-[#c4c4c4] cursor-pointer text-[1.7vh] text-[#818181]"
            onClick={() => handleCurrentViewChange("login")}
          >
            Вернуться ко входу
          </span>
        </div>
      );
    }
    return (
      <form className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]" onSubmit={handleRecoveryFormSubmit}>
        <label className="flex flex-col gap-[0.5vh]">
          <span className="text-[#d3d3d3] font-semibold">Электронная почта</span>
          <input
            type="email"
            name="email"
            value={recoveryFormData.email}
            onChange={handleRecoveryFormInputChange}
            placeholder="Введите вашу электронную почту"
            className={inputClass}
            required
          />
        </label>
        <button
          disabled={isLoading}
          type="submit"
          className={`${baseButtonClass} ${
            isLoading
              ? disabledButtonClass
              : isRecoveryFormComplete
              ? enabledButtonClass
              : disabledButtonClass
          }`}
        >
          Сбросить пароль
        </button>
        <span
          className="hover:text-[#c4c4c4] cursor-pointer text-[1.7vh] text-[#818181]"
          onClick={() => handleCurrentViewChange("login")}
        >
          Вернуться ко входу
        </span>
      </form>
    );
  };

  return (
    <Modal
      title={
        currentView === "login"
          ? "Войти"
          : currentView === "register"
          ? "Регистрация"
          : "Восстановление пароля"
      }
      description={
        currentView === "login"
          ? "Введите вашу электронную почту и пароль для входа."
          : currentView === "register"
          ? "Создайте аккаунт, чтобы начать пользоваться приложением."
          : recoverySuccess
          ? ""
          : "Введите вашу электронную почту для восстановления пароля."
      }
      isOpen={isOpen}
      error={error}
      onClose={() => onClose()}
    >
      {currentView === "login" && renderLoginForm()}
      {currentView === "register" && renderRegisterForm()}
      {currentView === "recovery" && renderRecoveryForm()}
    </Modal>
  );
};
