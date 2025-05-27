import { Op } from "sequelize";
import Statistics from "../models/statistics.js";
import Groups from "../models/group.js";
import OpeningMoves from "../models/openingMoves.js";

const WINDOW_DAYS = 7;
const WEAK_MOVE_THRESHOLD = 0.6;

const getOpeningIdByGroup = async (groupId) => {
  const group = await Groups.findOne({ where: { idGroups: groupId } });
  if (!group || !group.GroupOpening) {
    throw new Error("Группа или назначенный ей дебют не найдены");
  }
  return group.GroupOpening;
};

const getMoveIdsByOpening = async (openingId) => {
  const moves = await OpeningMoves.findAll({
    where: { OpeningID: openingId },
    attributes: ["idOpeningMoves"],
    raw: true
  });
  return moves.map(m => m.idOpeningMoves);
};

// 1. Общая точность по дебюту
export const getOpeningAccuracy = async (userId, groupId) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);

  const [total, correct] = await Promise.all([
    Statistics.count({
      where: { UserID: userId, MoveID: moveIds }
    }),
    Statistics.count({
      where: { UserID: userId, MoveID: moveIds, IsMoveCorrect: true }
    }),
  ]);

  return total > 0 ? correct / total : 0;
};

// 2. Скользящая точность за последние N дней
export const getSlidingAccuracy = async (userId, groupId, windowDays = WINDOW_DAYS) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);
  const since = new Date();
  since.setDate(since.getDate() - windowDays);

  const recent = await Statistics.findAll({
    where: {
      UserID: userId,
      MoveID: moveIds,
      createdAt: { [Op.gte]: since },
    },
  });

  if (recent.length === 0) return 0;
  const correct = recent.filter(r => r.IsMoveCorrect).length;
  return correct / recent.length;
};

// 3. Текущий и максимальный стрик
export const getStreaks = async (userId, groupId) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);

  const stats = await Statistics.findAll({
    where: { UserID: userId, MoveID: moveIds },
    order: [["createdAt", "ASC"]],
  });

  let maxStreak = 0, tempStreak = 0;
  stats.forEach(s => {
    if (s.IsMoveCorrect) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  });

  let currentStreak = 0;
  for (let i = stats.length - 1; i >= 0; i--) {
    if (stats[i].IsMoveCorrect) currentStreak++;
    else break;
  }

  return { currentStreak, maxStreak };
};

// 4. «Западающие» ходы
export const getWeakMoves = async (userId, groupId, weakThreshold = WEAK_MOVE_THRESHOLD) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);

  const stats = await Statistics.findAll({
    where: { UserID: userId, MoveID: moveIds },
  });

  const moveMap = {};
  stats.forEach(s => {
    moveMap[s.MoveID] = moveMap[s.MoveID] || { attempts: 0, correct: 0 };
    moveMap[s.MoveID].attempts++;
    if (s.IsMoveCorrect) moveMap[s.MoveID].correct++;
  });

  return Object.entries(moveMap)
    .map(([moveId, data]) => ({
      moveId: Number(moveId),
      accuracy: data.correct / data.attempts,
      attempts: data.attempts,
    }))
    .filter(m => m.accuracy < weakThreshold)
    .sort((a, b) => a.accuracy - b.accuracy);
};

// 5. Дневная статистика
export const getUserGroupStatistics = async (userId, groupId) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);

  const stats = await Statistics.findAll({
    where: { UserID: userId, MoveID: moveIds },
  });

  const byDay = stats.reduce((acc, rec) => {
    const day = rec.createdAt.toISOString().slice(0, 10);
    acc[day] = acc[day] || { total: 0, correct: 0 };
    acc[day].total++;
    if (rec.IsMoveCorrect) acc[day].correct++;
    return acc;
  }, {});

  return Object.entries(byDay).map(([day, { total, correct }]) => ({
    createdAt: day,
    accuracy: total > 0 ? correct / total : 0,
  }));
};

// 6. Удаление статистики пользователя по группе
export const deleteUserGroupStatistics = async (userId, groupId) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);
  return await Statistics.destroy({
    where: { UserID: userId, MoveID: moveIds },
  });
};

// 7. Среднее время обдумывания
export const getAverageTimeToThink = async (userId, groupId) => {
  const openingId = await getOpeningIdByGroup(groupId);
  const moveIds = await getMoveIdsByOpening(openingId);

  const avg = await Statistics.aggregate("TimeToThink", "avg", {
    where: { UserID: userId, MoveID: moveIds },
  });

  return avg ? parseFloat(avg) : 0;
};

export const createUserStatistics = async (data) => {
	return await Statistics.bulkCreate(data);
};
