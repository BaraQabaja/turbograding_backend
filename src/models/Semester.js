const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const Semester = sequelize.define(
  "Semester",
  {
   
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    Semester_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },

 
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);


module.exports = Semester;
