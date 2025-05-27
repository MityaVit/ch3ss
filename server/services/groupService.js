import Groups from "../models/group.js";
import GroupCodes from "../models/groupCodes.js";

const editGroupName = async (groupId, newGroupName) => {
  const group = await Groups.findOne({ where: { idGroups: groupId } });
  if (!group) {
    throw new Error("Группа не найдена!");
  }
  group.GroupName = newGroupName;
  await group.save();
  return group;
}

const getGroupById = async (id) => {
  return await Groups.findOne({ where: { idGroups: id } });
};

const getGroupByGroupName = async (groupName) => {
  return await Groups.findOne({ where: { groupName } });
};

const getGroupOwner = async (groupId) => {
  const group = await Groups.findOne({ where: { idGroups: groupId } });
  if (!group) {
    throw new Error("Группы не найдены!");
  }
  return group.OwnerID;
};

const getOwnerGroups = async (ownerId) => {
  const groups = await Groups.findAll({ where: { ownerId } });
  return groups;
};

const createGroup = async (groupData) => {
  try {
    const { groupName, maxMembers, ownerId } = groupData;
    const groupCount = await Groups.count({ where: { OwnerID: ownerId } });
    if (groupCount >= parseInt(process.env.MAX_GROUPS_COUNT, 10)) {
      throw new Error("Достигнуто максимальное количество групп! (5)");
    }
    const group = await Groups.create({
      GroupName: groupName,
      MaxMembers: maxMembers,
      OwnerID: ownerId,
    });
    return group;
  } catch (error) {
    throw new Error(error);
  }
};

const getGroupByCode = async (code) => {
  try {
    const group = await GroupCodes.findOne({ where: { code } });
    return group;
  } catch (error) {
    throw new Error(error);
  }
};

const createGroupCode = async (groupCodeData) => {
  try {
    const groupId = groupCodeData;

    const groupCode = await GroupCodes.create({
      groupId: groupId,
    });

    return groupCode;
  } catch (error) {
    throw new Error(error);
  }
};

const updateGroup = async (id, data) => {
  return await Groups.update(data, { where: { id } });
};

const deleteGroup = async (groupId) => {
  return await Groups.destroy({ where: { idGroups: groupId } });
};

const addGroupOpening = async (groupId, openingId) => {
  try {
    const opening = await Groups.create({
      idGroup: groupId,
      idOpening: openingId,
    });

    return opening;
  } catch (error) {
    throw new Error(error);
  }
};

const updateGroupOpening = async (groupId, openingId) => {
  const result = await Groups.update(
    { GroupOpening: openingId },
    { where: { idGroups: groupId } }
  );
  return result;
};

export default {
  addGroupOpening,
  getGroupById,
  createGroup,
  updateGroup,
  updateGroupOpening,
  deleteGroup,
  getGroupByGroupName,
  getGroupByCode,
  createGroupCode,
  getGroupOwner,
  getOwnerGroups,
  editGroupName,
};
