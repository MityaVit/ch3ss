import React, { useState } from "react";
import { Modal } from "../helpers/modal";
import { createGroup, addGroupMember } from "../../api";
import { useAuth } from "../../AuthProvider";

export const CreateGroupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const { user } = useAuth();

  const [groupCreationFormData, setLoginFormData] = useState({
    groupName: "",
  });

  const handleGroupCreationFormInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData({ ...groupCreationFormData, [name]: value });
  };

  const handleGroupCreationFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const groupData = { ...groupCreationFormData, ownerId: user.idUsers, maxMembers: 30 };
      const response = await createGroup(groupData);
      if (response.status === 201) {
        await addGroupMember({ groupId: response.data.idGroups, userId: user.idUsers });
        onClose();
        window.location.reload();
      }
     } catch (error) {
        throw error;
      }
  };

  const isGroupCreationFormComplete = Object.values(groupCreationFormData).every(
    (value) => value.trim() !== ""
  );

  const renderGroupCreationForm = () => (
    <form
      className="flex flex-col gap-[2.5vh] text-[1.8vh] p-[1vw]"
      onSubmit={handleGroupCreationFormSubmit}
    >
      <label className="flex flex-col gap-[0.5vh]">
        <span className="text-[#d3d3d3] font-semibold">Название группы</span>
        <input
          type="text"
          name="groupName"
          value={groupCreationFormData.groupName}
          onChange={handleGroupCreationFormInputChange}
          placeholder="Введите название новой группы"
          className="p-[1vh] w-full bg-[#505050] text-white rounded-md outline-none border border-[#6a6a6a] focus:border-[#818181] focus:bg-[#585858] transition-all"
          required
        />
      </label>

      <button
        type="submit"
        className={`p-[1.2vh] w-full rounded-md font-semibold transition-all 
            ${
              isGroupCreationFormComplete
                ? "bg-gradient-to-r from-green-500 via-blue-400 to-purple-500 text-white ring-blue-300 ring-[0.1vh]"
                : "bg-[#505050] text-[#818181] cursor-not-allowed transition-none"
            }`}
      >
        Создать
      </button>
    </form>
  );

  return (
    <Modal
      title={ "Создание группы" }
      isOpen={isOpen}
      onClose={() => onClose()}
    >
      {renderGroupCreationForm()}
    </Modal>
  );
};
