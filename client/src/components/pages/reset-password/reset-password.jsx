import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../api/auth";

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(token, formData.newPassword);
      setSuccess("Пароль успешно изменён. Теперь вы можете авторизоваться.");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#393939]">
      <div className="bg-[#434343] p-[2vh] px-[2vw] rounded-lg shadow-lg w-[90vw] sm:w-[40vw] md:w-[30vw]">
        <h1 className="text-white text-center text-[3vh] mb-[2vh]">Изменение пароля</h1>
        {error && <div className="text-red-500 text-center mb-[1vh]">{error}</div>}
        {success && <div className="text-green-500 text-center mb-[1vh]">{success}</div>}
        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[2vh]">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Новый пароль"
                className="p-[1vh] w-full bg-[#505050] text-white rounded-md outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all"
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Подтверждение пароля"
                className="p-[1vh] w-full bg-[#505050] text-white rounded-md outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all"
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
            <button
              type="submit"
              disabled={isLoading}
              className={`p-[1.2vh] rounded-md font-semibold transition-all ${
                isLoading
                  ? "bg-[#505050] text-[#818181]"
                  : "bg-gradient-to-r from-green-500 via-blue-400 to-purple-500 text-white"
              }`}
            >
              {isLoading ? "Загрузка..." : "Изменить пароль"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
