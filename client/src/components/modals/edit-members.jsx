// src/components/modals/edit-members.jsx
import { useState, useEffect } from "react";
import { Modal } from "../helpers/modal";
import { useAuth } from "../../AuthProvider";
import {
  createGroupCode,
  fetchGroupCodes,
  removeGroupMember,
  removeGroupCode,
} from "../../api";
import { AreYouSureModal } from "./are-you-sure";

export const EditMembersModal = ({ isOpen, onClose, groupMembers, groupId }) => {
  const { user } = useAuth();
  const isCoach = user?.role === "Coach";

  const [groupCodes, setGroupCodes] = useState([]);
  const [error, setError] = useState("");
  const [copiedCodeIds, setCopiedCodeIds] = useState([]);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [codeToDelete, setCodeToDelete] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    const load = async () => {
      try {
        const res = await fetchGroupCodes(groupId);
        setGroupCodes(res.data);
        setError("");
      } catch (e) {
        setError(e.message);
      }
    };
    load();
  }, [groupId]);

  const handleCreateGroupCode = async () => {
    try {
      const res = await createGroupCode(groupId);
      setGroupCodes((prev) => [...prev, res.data]);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    setTimeout(() => {
      setCopiedCodeIds((prev) => prev.filter((cid) => cid !== id));
    }, 5000);
  };

  const handleDeleteCode = async (id) => {
    try {
      await removeGroupCode(id);
      setGroupCodes((prev) =>
        prev.filter((c) => c.idGroupCodes !== id)
      );
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  const confirmMemberRemoval = async () => {
    try {
      await removeGroupMember({ groupId, userId: memberToRemove.idUsers });
      onClose();
      window.location.reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setMemberToRemove(null);
    }
  };

  return (
    <>
      {!memberToRemove && !codeToDelete && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Редактировать участников"
        >
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}
          {isCoach && (
            <button
              onClick={handleCreateGroupCode}
              className="w-full mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition"
            >
              Создать код приглашения
            </button>
          )}
          <div className="space-y-4 max-h-60 overflow-y-auto mb-6">
            {groupMembers && groupMembers.length > 0 ? (
              groupMembers.map((m, idx) => (
                <div
                  key={m.idUsers}
                  className="bg-[#505050] rounded-lg p-4 flex flex-col items-center"
                >
                  <span className="text-white font-medium text-lg">
                    {idx + 1}. {m.username}
                    {m.idUsers === user.idUsers && (
                      <small className="text-xs text-gray-400 italic ml-1">
                        (Вы)
                      </small>
                    )}
                  </span>
                  {isCoach && m.idUsers !== user.idUsers && (
                    <button
                      onClick={() => setMemberToRemove(m)}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition"
                    >
                      Исключить
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#818181] text-center">
                В вашей группе пока нет участников.
              </p>
            )}
          </div>
          {isCoach && (
            <div className="space-y-2">
              <h3 className="text-gray-300 font-semibold">
                Коды приглашений
              </h3>
              <div className="max-h-40 overflow-y-auto space-y-3">
                {groupCodes && groupCodes.length > 0 ? (
                  groupCodes.map((c, idx) => (
                    <div
                      key={c.idGroupCodes}
                      className="bg-[#505050] rounded-lg p-4 flex items-center"
                    >
                      <span className="text-white font-medium">
                        {idx + 1}. {c.Code}
                      </span>
                      <div className="ml-auto flex space-x-2">
                        {copiedCodeIds.includes(c.idGroupCodes) ? (
                          <span className="px-2 py-1 bg-green-600 text-white text-sm rounded">
                            Скопировано!
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleCopyCode(c.Code, c.idGroupCodes)
                            }
                            className="px-2 py-1 bg-[#818181] text-white text-sm rounded hover:bg-[#6a6a6a] transition"
                          >
                            Копировать
                          </button>
                        )}
                        <button
                          onClick={() => setCodeToDelete(c)}
                          className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500 transition"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[#818181] text-center">
                    Нет доступных кодов.
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      )}
      {memberToRemove && (
        <AreYouSureModal
          isOpen={true}
          onClose={() => setMemberToRemove(null)}
          message={`Исключить ${memberToRemove.username}?`}
          action={confirmMemberRemoval}
        />
      )}
      {codeToDelete && (
        <AreYouSureModal
          isOpen={true}
          onClose={() => setCodeToDelete(null)}
          message="Удалить этот код?"
          action={async () => {
            await handleDeleteCode(codeToDelete.idGroupCodes);
            setCodeToDelete(null);
          }}
        />
      )}
    </>
  );
};
