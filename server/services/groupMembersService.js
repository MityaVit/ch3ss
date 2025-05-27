import GroupMembers from "../models/groupMembers.js";

const getAllGroupMembers = async (groupId) => {
  try {
    const members = await GroupMembers.findAll({
      where: {
        idGroup: groupId,
      },
    });

    return members;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserGroups = async (userId) => {
  try {
    const groups = await GroupMembers.findAll({
      where: {
        idMember: userId,
      },
    });

    return groups;
  } catch (error) {
    throw new Error(error);
  }
};

const addGroupMember = async (groupId, userId) => {
  try {
    const currentCount = await GroupMembers.count({ where: { idGroup: groupId } });
    if (currentCount >= parseInt(process.env.MAX_GROUP_SIZE, 10)) {
      throw new Error("Группа переполнена.");
    }
    const member = await GroupMembers.create({
      idGroup: groupId,
      idMember: userId,
    });

    return member;
  } catch (error) {
    throw new Error(error);
  }
};

const removeGroupMember = async (groupId, userId) => {
  try {
    const member = await GroupMembers.destroy({
      where: {
        idGroup: groupId,
        idMember: userId,
      },
    });

    return member;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  removeGroupMember,
  addGroupMember,
  getUserGroups,
  getAllGroupMembers,
};
