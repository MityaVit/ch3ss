import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const OpeningMoves = sequelize.define("OpeningMoves", {
  idOpeningMoves: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  OpeningID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
    references: {
      model: "Openings",
      key: "idOpenings",
    },
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  FEN: {
    type: DataTypes.STRING(92),
    allowNull: false,
  },
  MoveNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false,
});

export default OpeningMoves;
