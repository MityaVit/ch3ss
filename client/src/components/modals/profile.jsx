import React, { useState } from "react";
import { Modal } from "../helpers/modal";
import { useAuth } from "../../AuthProvider";
import { logoutUser } from "../../api/users";
import { AreYouSureModal } from "./are-you-sure";

export const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logoutUser();
    onClose();
    window.location.reload();
  };

  return (
    <>
      {!showConfirm && (
        <Modal
          title="Профиль"
          isOpen={isOpen}
          onClose={() => onClose()}
        >
          <div className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]">
            <div className="flex flex-col gap-[0.5vh]">
              <span className="text-[#d3d3d3] font-semibold">Имя пользователя</span>
              <span className="p-[1vh] w-full bg-[#505050] text-white rounded-md">
                {user?.username}
              </span>
            </div>
            <div className="flex flex-col gap-[0.5vh]">
              <span className="text-[#d3d3d3] font-semibold">Электронная почта</span>
              <span className="p-[1vh] w-full bg-[#505050] text-white rounded-md">
                {user?.email}
              </span>
            </div>
            <div className="flex flex-col gap-[0.5vh]">
              <span className="text-[#d3d3d3] font-semibold">Роль</span>
              <span className="p-[1vh] w-full bg-[#505050] text-white rounded-md">
                {user?.role === "Coach" ? "Тренер" : "Ученик"}
              </span>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-[1.2vh] w-full rounded-md font-semibold bg-red-500 text-white"
            >
              Выйти
            </button>
          </div>
        </Modal>
      )}
      <AreYouSureModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        message="Это действие приведёт к выходу из аккаунта на этом устройстве"
        action={handleLogout}
      />
    </>
  );
};
