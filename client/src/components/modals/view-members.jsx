// src/components/modals/view-members.jsx
import { Modal } from "../helpers/modal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";

export const ViewMembersModal = ({ isOpen, onClose, groupMembers, groupId }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Просмотр участников">
      {!groupMembers || groupMembers.length === 0 ? (
        <span className="text-[#818181]">
          В вашей группе пока нет участников.
        </span>
      ) : (
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {groupMembers.map((member, idx) => (
            <div
              key={`${member.idUsers}-${idx}`}
              className="bg-[#505050] rounded-lg p-4 flex flex-col items-center"
            >
              <span className="text-white text-lg font-medium">
                {member.username}
                {user.idUsers === member.idUsers && (
                  <small className="text-xs text-gray-400 italic ml-1">(Вы)</small>
                )}
              </span>
              <div className="w-full flex items-center justify-between mt-2">
                <span className="text-[#8f8f8f] text-sm">
                  Присоединился: {formatDate(member.joinedAt)}
                </span>
                {user.role === "Coach" && user.idUsers !== member.idUsers && (
                  <button
                    onClick={() =>
                      navigate(`/analytics?studentId=${member.idUsers}${groupId ? `&groupId=${groupId}` : ""}`)
                    }
                    className="bg-indigo-500 text-white text-xs px-2 py-1 rounded hover:bg-indigo-400 transition"
                  >
                    Посмотреть статистику
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
