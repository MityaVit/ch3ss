import Openings from "../models/openings.js";
import OpeningMoves from "../models/openingMoves.js";
import { Op } from "sequelize";
import Groups from "../models/group.js";
import GroupMembers from "../models/groupMembers.js";

const getOpeningById = async (id) => {
  try {
    return await Openings.findOne({ where: { idOpenings: id } });
  } catch (error) {
    throw new Error(error);
  }
};

const getOpeningByName = async (name) => {
  try {
    const openings = await Openings.findOne({
      where: {
        name,
      },
    });

    return openings;
  } catch (error) {
    throw new Error(error);
  }
};

const getCoachOpenings = async (userId) => {
  try {
    const openings = await Openings.findAll({
      where: {
        [Op.or]: [
          { createdBySystem: true },
          { createdBy: userId }
        ]
      }
    });
    return openings;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOpening = async (openingId, updateData) => {
  try {
    const [numRows, updated] = await Openings.update(
      updateData,
      { where: { idOpenings: openingId }, returning: true }
    );
    if (numRows === 0 && (!updated || updated.length === 0)) {
      throw new Error("Не удалось обновить дебют!");
    }
    return updated[0] || await Openings.findOne({ where: { idOpenings: openingId } });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCustomOpening = async (openingId, userId) => {
  try {
    // Check ownership of the opening
    const opening = await Openings.findOne({ where: { idOpenings: openingId } });
    if (!opening) {
      throw new Error("Дебют не найден!");
    }
    if (opening.createdBySystem == true) {
      throw new Error("Системные дебюты не могут быть удалены!");
    }
    if (opening.createdBy !== userId) {
      throw new Error("Пользователь не может удалить чужой дебют!");
    }
    const result = await Openings.destroy({
      where: {
        idOpenings: openingId,
      },
    });
    if (!result) {
      throw new Error("Не удалось удалить дебют!");
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserOpenings = async (userId) => {
  try {
    const groupMemberships = await GroupMembers.findAll({
      where: { idMember: userId },
      attributes: ["idGroup"],
    });
    const groupIds = groupMemberships.map(m => m.idGroup);
    if (!groupIds.length) return [];
    const groupsWithOpenings = await Groups.findAll({
      where: {
        idGroups: groupIds,
        GroupOpening: { [Op.ne]: null }
      },
      attributes: ["idGroups", "GroupOpening"],
    });
    if (!groupsWithOpenings.length) return [];
    const openingIds = groupsWithOpenings.map(g => g.GroupOpening).filter(id => id);
    if (!openingIds.length) return [];
    const openings = await Openings.findAll({
      where: { idOpenings: openingIds }
    });
    const openingMap = {};
    openings.forEach(op => {
      openingMap[op.idOpenings] = op;
    });
    const results = groupsWithOpenings.map(group => ({
      groupId: group.idGroups,
      opening: openingMap[group.GroupOpening] || null,
    }));
    return results;
  } catch (error) {
    throw new Error(error);
  }
};

const createCustomOpening = async (userId, openingName, as, movesArray) => {
  const count = await Openings.count({ where: { createdBy: userId } });
  if (count >= parseInt(process.env.MAX_CUSTOM_OPENINGS_COUNT, 10)) {
    throw new Error(`Пользователь не может создавать более ${process.env.MAX_CUSTOM_OPENINGS_COUNT} дебютов`);
  }
  if (movesArray.length <= 6) {
    throw new Error("Дебют должен содержать не менее 7 ходов");
  }
  const opening = await Openings.create({
    OpeningName: openingName,
    as,
    createdBySystem: false,
    createdBy: userId
  });
  
  const movesToCreate = movesArray.map(move => ({
    ...move,
    OpeningID: opening.idOpenings
  }));
  await OpeningMoves.bulkCreate(movesToCreate);
  return opening;
};

const getUserOpeningsByGroupId = async (userId, groupId) => {
  try {
    const membership = await GroupMembers.findOne({ where: { idGroup: groupId, idMember: userId } });
    if (!membership) {
      throw new Error("Пользователь не принадлежит к данной группе");
    }
    const group = await Groups.findOne({
      where: { idGroups: groupId },
      attributes: ["GroupOpening"],
    });
    if (!group || !group.GroupOpening) {
      throw new Error("Группа или назначенный ей дебют не найдены");
    }
    const openingId = group.GroupOpening;
    const openings = await Openings.findAll({
      where: { idOpenings: openingId },
    });
    return openings;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getOpeningById,
  getOpeningByName,
  getCoachOpenings,
  updateOpening,
  deleteCustomOpening,
  getUserOpenings,
  createCustomOpening,
  getUserOpeningsByGroupId,
};
