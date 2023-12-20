const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");


const Custom = sequelize.define(
  "Custom",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    gradeInstruction:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default",

    },
    feedbackInstruction:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default",

    },
    aiInstruction:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "default",

    },
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);



module.exports = Custom;
