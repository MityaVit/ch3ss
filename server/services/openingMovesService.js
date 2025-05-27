import OpeningMoves from "../models/openingMoves.js";

const getOpeningMovesByOpeningId = async (openingId) => {
  return await OpeningMoves.findAll({
    where: { OpeningID: openingId },
    order: [['MoveNumber', 'ASC']]
  });
};

const updateOpeningMoves = async (openingId, openingMoves) => {
  try {
    if (!openingId) {
      throw new Error("Отсутствует openingId");
    }
    if (!Array.isArray(openingMoves)) {
      throw new Error("Входные openingMoves должны быть массивом");
    }
    
    const movesToCreate = [];
    for (const move of openingMoves) {
      const { Description, FEN, MoveNumber } = move;
      if (Description === undefined || FEN === undefined || MoveNumber === undefined) {
        throw new Error("Отсутствует обязательное поле в ходе: " + JSON.stringify(move));
      }
      movesToCreate.push({ OpeningID: openingId, Description, FEN, MoveNumber });
    }

    await OpeningMoves.destroy({ where: { OpeningID: openingId } });
    const createdMoves = await OpeningMoves.bulkCreate(movesToCreate);
    return createdMoves;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getOpeningMovesByOpeningId,
  updateOpeningMoves,
};
