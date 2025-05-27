import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { activateAccount } from "../../../api/auth";

export const EmailActivationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (token && !calledRef.current) {
      calledRef.current = true;
      activateAccount(token)
        .then(() => {
          setMessage("Ваш email был успешно подтверждён. Автоматическая переадресация на домашную страницу через 4 секунды...");
          setTimeout(() => navigate("/home"), 4000);
        })
        .catch((err) => setError(err.message));
    } else if (!token) {
      setError("Activation token is missing.");
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#393939]">
      <div className="bg-[#434343] p-[2vh] px-[2vw] rounded-lg shadow-lg w-[90vw] sm:w-[40vw] md:w-[30vw] text-center">
        {error && <div className="text-red-500 text-[2vh] mb-[2vh]">{error}</div>}
        {message && <div className="text-green-500 text-[2vh] mb-[2vh]">{message}</div>}
        {!error && !message && (
          <div className="text-white text-[2vh]">Activating your account...</div>
        )}
      </div>
    </div>
  );
};

export default EmailActivationPage;
