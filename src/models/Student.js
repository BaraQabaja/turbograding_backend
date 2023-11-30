const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
// const University=require("./University")

const Student = sequelize.define(
  "student",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      // autoIncrement: true,
      primaryKey:true,
      allowNull: false,

    },
    universityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,


    },
    fist_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
    indexes: [
      {
        unique: true,
        fields: ["id", "universityId"],
      },
    ],
    
  }
);

// // Add a unique constraint for the composite primary key
// Student.addIndex(
//   ["id", "universityId"],
//   { unique: true, name: "unique_student_university" }
// );



module.exports = Student;
