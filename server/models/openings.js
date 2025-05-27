import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Openings = sequelize.define('Openings', {
    idOpenings: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    OpeningName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    as: {
        type: DataTypes.ENUM('w', 'b'),
        allowNull: false,
    },
    createdBySystem: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

export default Openings;