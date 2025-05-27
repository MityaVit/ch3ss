import React, { useState } from "react";
import { Modal } from "../helpers/modal";
import { redeemGroupCode } from "../../api";
import { useAuth } from "../../AuthProvider";

export const JoinGroupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { user } = useAuth();

  const [groupJoinFormData, setGroupJoinFormData] = useState({
    code: "",
  });

  const [error, setError] = useState("");

  const handleGroupJoinFormInputChange = (e) => {
    const { name, value } = e.target;
    setGroupJoinFormData({ ...groupJoinFormData, [name]: value });
  };

  const handleGroupJoinFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await redeemGroupCode(groupJoinFormData.code, user.idUsers);
      if (response.status === 201) {
        onClose();
        window.location.reload();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const isGroupJoinFormComplete = Object.values(groupJoinFormData).every(
    (value) => value.trim() !== ""
  );

  const renderGroupJoinForm = () => (
    <form
      className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]"
      onSubmit={handleGroupJoinFormSubmit}
    >
      <label className="flex flex-col gap-[0.5vh]">
        <span className="text-[#d3d3d3] font-semibold">Group Code</span>
        <input
          type="text"
          name="code"
          value={groupJoinFormData.code}
          onChange={handleGroupJoinFormInputChange}
          placeholder="Enter the group code"
          className="p-[1vh] w-full bg-[#505050] text-white rounded-md outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all"
          required
        />
      </label>

      <button
        type="submit"
        className={`p-[1.2vh] w-full rounded-md font-semibold transition-all 
            ${
              isGroupJoinFormComplete
                ? "bg-gradient-to-r from-green-500 via-blue-400 to-purple-500 text-white ring-blue-300 ring-[0.1vh]"
                : "bg-[#505050] text-[#818181] cursor-not-allowed transition-none"
            }`}
      >
        Join
      </button>
    </form>
  );

  return (
    <Modal
      title={"Присоединиться к группе"}
      isOpen={isOpen}
      onClose={() => onClose()}
      description={
        "Введите код группы для присоединения. Если у вас нет кода, попросите его у тренера."
      }
      error={error}
    >
      {renderGroupJoinForm()}
    </Modal>
  );
};
