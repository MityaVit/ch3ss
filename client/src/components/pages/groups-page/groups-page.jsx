// src/pages/GroupsPage.jsx
import { useState, useEffect } from "react";
import {
  getOwnerGroups,
  deleteGroup,
  getGroupMembers,
  getUserById,
  getUserGroups,
  getGroupById,
  getOpeningById,
  removeGroupMember,
  editGroupName,
} from "../../../api";
import { useAuth } from "../../../AuthProvider";
import { ViewMembersModal } from "../../modals/view-members";
import { EditMembersModal } from "../../modals/edit-members";
import { EditOpeningModal } from "../../modals/edit-opening";
import { CreateGroupModal } from "../../modals/group-creation";
import { JoinGroupModal } from "../../modals/group-join";
import { AreYouSureModal } from "../../modals/are-you-sure";

const GroupsPage = ({ children }) => {
  const { user } = useAuth();
  const isCoach = user?.role === "Coach";

  const [chosenGroup, setChosenGroup] = useState(null);
  const [chosenGroupMembers, setChosenGroupMembers] = useState([]);
  const [chosenGroupMembersDetails, setChosenGroupMembersDetails] = useState([]);
  const [groupOpeningName, setGroupOpeningName] = useState("");

  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupNameInput, setGroupNameInput] = useState("");

  const [ownerGroups, setOwnerGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userGroupsDetails, setUserGroupsDetails] = useState([]);

  const [groupSearchTerm, setGroupSearchTerm] = useState("");
  const [groupPage, setGroupPage] = useState(1);
  const pageSize = 4;

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [joinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [editMembersModalOpen, setEditMembersModalOpen] = useState(false);
  const [editOpeningModalOpen, setEditOpeningModalOpen] = useState(false);
  const [areYouSureModalOpen, setAreYouSureModalOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);

  useEffect(() => {
    if (isCoach) {
      getOwnerGroups(user.idUsers)
        .then((r) => setOwnerGroups(r.data.filter(g => !g.createdBySystem)))
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "Student") {
      getUserGroups(user.idUsers)
        .then((r) => setUserGroups(r.data))
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (userGroups.length) {
      Promise.all(userGroups.map((g) => getGroupById({ groupId: g.idGroup })))
        .then((rs) => setUserGroupsDetails(rs.map((r) => r.data)))
        .catch(console.error);
    }
  }, [userGroups]);

  useEffect(() => {
    if (chosenGroup) {
      getGroupMembers({ groupId: chosenGroup.idGroups })
        .then((r) => setChosenGroupMembers(r.data))
        .catch(console.error);
    }
  }, [chosenGroup]);

  useEffect(() => {
    if (chosenGroupMembers.length) {
      Promise.all(
        chosenGroupMembers.map((m) => getUserById({ userId: m.idMember }))
      )
        .then((rs) => setChosenGroupMembersDetails(rs.map((r) => r.data)))
        .catch(console.error);
    }
  }, [chosenGroupMembers]);

  useEffect(() => {
    if (chosenGroup?.GroupOpening) {
      getOpeningById({ openingId: chosenGroup.GroupOpening })
        .then((o) =>
          setGroupOpeningName(o?.data?.OpeningName || o?.OpeningName || "Нет дебюта")
        )
        .catch(console.error);
    }
  }, [chosenGroup]);

  const formatDate = (ds) =>
    new Date(ds).toLocaleDateString("ru-RU", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const handleDelete = async () => {
    try {
      await deleteGroup(chosenGroup.idGroups);
      setOwnerGroups((ogs) =>
        ogs.filter((g) => g.idGroups !== chosenGroup.idGroups)
      );
      setChosenGroup(null);
    } catch (e) {
      console.error(e);
    } finally {
      setAreYouSureModalOpen(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await removeGroupMember({ groupId: chosenGroup.idGroups, userId: user.idUsers });
      setUserGroupsDetails((prev) => prev.filter((g) => g.idGroups !== chosenGroup.idGroups));
      setChosenGroup(null);
    } catch (e) {
      console.error(e);
    } finally {
      setAreYouSureModalOpen(false);
    }
  };

  const handleSelect = (g) => {
    if (g.idGroups === chosenGroup?.idGroups) return;
    setChosenGroupMembers([]);
    setChosenGroupMembersDetails([]);
    setChosenGroup(g);
    setGroupOpeningName("");
    setGroupPage(1);
  };

  const filteredOwner = ownerGroups.filter((g) =>
    g.GroupName.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );
  const filteredUser = userGroupsDetails.filter((g) =>
    g.GroupName.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  const list = isCoach ? filteredOwner : filteredUser;
  const totalPages = Math.ceil(list.length / pageSize);
  const paginated = list.slice(
    (groupPage - 1) * pageSize,
    groupPage * pageSize
  );

  const handleStartEdit = () => {
    setIsEditingGroupName(true);
    setGroupNameInput(chosenGroup.GroupName);
  };

  const handleGroupNameUpdate = async () => {
    try {
      await editGroupName(chosenGroup.idGroups, groupNameInput);
      setChosenGroup({ ...chosenGroup, GroupName: groupNameInput });
      if (isCoach) {
        setOwnerGroups((prev) =>
          prev.map((g) =>
            g.idGroups === chosenGroup.idGroups ? { ...g, GroupName: groupNameInput } : g
          )
        );
      } else {
        setUserGroupsDetails((prev) =>
          prev.map((g) =>
            g.idGroups === chosenGroup.idGroups ? { ...g, GroupName: groupNameInput } : g
          )
        );
      }
      setIsEditingGroupName(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center overflow-x-hidden">
      {children}

      <div className="flex flex-col md:flex-row gap-8 px-6 py-4 items-center justify-center w-full my-auto">
        {chosenGroup && (
          <div className="flex flex-col items-center bg-[#434343] rounded-lg shadow-lg p-6 w-full md:w-1/2 max-w-md">
            <div className="flex items-center justify-center mb-4">
              {isEditingGroupName ? (
                <>
                  <input
                    type="text"
                    value={groupNameInput}
                    onChange={(e) => setGroupNameInput(e.target.value)}
                    className="text-2xl font-semibold text-center rounded p-1 px-2"
                  />
                  <button
                    onClick={handleGroupNameUpdate}
                    className="ml-2 bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded transition"
                  >
                    Готово
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-white text-center px-2">
                    {chosenGroup.GroupName}
                  </h2>
                  <button
                    onClick={handleStartEdit}
                    className="w-10 h-10 p-2 bg-[#505050] rounded hover:bg-[#585858] transition"
                  >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit members"
                      className="w-full h-full"
                    />
                  </button>
                </>
              )}
            </div>
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-center space-x-2">
                <span className="font-medium text-white">Создана:</span>
                <span className="bg-[#505050] rounded px-2 py-1 text-sm text-white">
                  {formatDate(chosenGroup.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-medium text-white">Участники:</span>
                <span className="text-white">
                  {chosenGroupMembers.length} / {chosenGroup.MaxMembers}
                </span>
                {isCoach && (
                  <button
                    onClick={() => setEditMembersModalOpen(true)}
                    className="w-10 h-10 p-2 bg-[#505050] rounded hover:bg-[#585858] transition"
                  >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit members"
                      className="w-full h-full"
                    />
                  </button>
                )}
                <button
                  onClick={() => setViewMembersModalOpen(true)}
                  className="w-10 h-10 p-2 bg-[#505050] rounded hover:bg-[#585858] transition"
                >
                  <img
                    src="/icons/view.svg"
                    alt="View members"
                    className="w-full h-full"
                  />
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-medium text-white">Дебют:</span>
                <span className="text-white">{groupOpeningName  || "—"}</span>
                {isCoach && (
                  <button
                    onClick={() => setEditOpeningModalOpen(true)}
                    className="w-10 h-10 p-2 bg-[#505050] rounded hover:bg-[#585858] transition"
                  >
                    <img
                      src="/icons/edit.svg"
                      alt="Edit opening"
                      className="w-full h-full"
                    />
                  </button>
                )}
              </div>
            </div>
            {isCoach ? (
              <button
                onClick={() => {
                  setConfirmationAction("delete");
                  setAreYouSureModalOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-[#662222] text-[#B07373] rounded-lg hover:bg-[#663838] transition"
              >
                Удалить группу
              </button>
            ) : (
              <button
                onClick={() => {
                  setConfirmationAction("leave");
                  setAreYouSureModalOpen(true);
                }}
                className="mt-4 px-4 py-2 bg-[#662222] text-[#B07373] rounded-lg hover:bg-[#663838] transition"
              >
                Покинуть группу
              </button>
            )}
          </div>
        )}
        <div className="flex flex-col bg-[#434343] rounded-lg shadow-lg p-6 w-full md:w-1/3 max-w-sm">
          <div className="flex items-center justify-between mb-4 w-full">
            <h3 className="text-xl font-semibold text-white">Ваши группы</h3>
            <button
              onClick={() =>
                isCoach
                  ? setCreateGroupModalOpen(true)
                  : setJoinGroupModalOpen(true)
              }
              className="w-10 h-10 flex items-center justify-center bg-[#505050] rounded-full text-2xl font-bold text-white hover:bg-[#585858] transition"
            >
              +
            </button>
          </div>

          <input
            type="text"
            placeholder="Поиск..."
            value={groupSearchTerm}
            onChange={(e) => setGroupSearchTerm(e.target.value)}
            className="mb-4 px-3 py-2 bg-[#505050] text-[#A69F9F] rounded border border-[#605e5e] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex-1 overflow-y-auto space-y-2 w-full">
            {paginated.length > 0 ? (
              paginated.map((g) => (
                <div
                  key={g.idGroups}
                  onClick={() => handleSelect(g)}
                  className={`p-3 rounded-lg cursor-pointer transition w-full text-center ${
                    chosenGroup?.idGroups === g.idGroups
                      ? "bg-[#585858] border-2 border-indigo-500"
                      : "bg-[#505050] hover:bg-[#585858]"
                  }`}
                >
                  <span className="text-white">{g.GroupName}</span>
                </div>
              ))
            ) : (
              <p className="text-[#818181] text-center">Группы не найдены.</p>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center w-full">
            <button
              onClick={() => setGroupPage((p) => Math.max(p - 1, 1))}
              disabled={groupPage === 1}
              className="px-3 py-1 bg-[#505050] rounded hover:bg-[#585858] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Назад
            </button>
            <span className="text-white">
              {groupPage} / {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setGroupPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={groupPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-[#505050] rounded hover:bg-[#585858] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Вперёд
            </button>
          </div>
        </div>
      </div>
      <CreateGroupModal
        isOpen={createGroupModalOpen}
        onClose={() => setCreateGroupModalOpen(false)}
      />
      <JoinGroupModal
        isOpen={joinGroupModalOpen}
        onClose={() => setJoinGroupModalOpen(false)}
      />
      <ViewMembersModal
        isOpen={viewMembersModalOpen}
        onClose={() => setViewMembersModalOpen(false)}
        groupMembers={chosenGroupMembersDetails.map((d) => ({
          idUsers: d.idUsers,
          username: d.username,
          joinedAt: chosenGroupMembers.find((m) => m.idMember === d.idUsers)
            .createdAt,
        }))}
        groupId={chosenGroup?.idGroups}
      />
      <EditMembersModal
        isOpen={editMembersModalOpen}
        onClose={() => setEditMembersModalOpen(false)}
        groupMembers={chosenGroupMembersDetails}
        groupId={chosenGroup?.idGroups}
      />
      <EditOpeningModal
        isOpen={editOpeningModalOpen}
        onClose={() => setEditOpeningModalOpen(false)}
        onUpdate={(o) => {
          setGroupOpeningName(o.OpeningName);
          setChosenGroup((g) => ({ ...g, GroupOpening: o.idOpenings }));
        }}
        currentOpeningName={groupOpeningName}
        groupId={chosenGroup?.idGroups}
        userId={user.idUsers}
      />
      <AreYouSureModal
        isOpen={areYouSureModalOpen}
        onClose={() => setAreYouSureModalOpen(false)}
        message={
          confirmationAction === "delete"
            ? `Вы хотите удалить группу ${chosenGroup ? chosenGroup.GroupName : ""}?`
            : `Вы хотите покинуть группу ${chosenGroup ? chosenGroup.GroupName : ""}?`
        }
        action={confirmationAction === "delete" ? handleDelete : handleLeaveGroup}
      />
    </div>
  );
};

export default GroupsPage;
