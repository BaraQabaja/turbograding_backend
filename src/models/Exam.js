const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const Exam = sequelize.define(
  "exam",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    exam_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    DateConducted:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    OutOfWhat:{//the make out of 10 or 5 or 100...
      type: DataTypes.INTEGER,
      allowNull: false,

    }
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);



module.exports = Exam;
