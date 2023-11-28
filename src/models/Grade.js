const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
const Enrollment=require("./Enrollment")
const Exam=require("./Exam")

const Grade = sequelize.define(
  "Grade",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    MarksObtained:{
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

// // Grade & Exam (One -> Many)
// Exam.hasMany(Grade)
// Grade.belongsTo(Exam);

// // Grade & Enrollment (One -> One) every enrollment(student) has one grade and every grade has one enrollment(student)
// Enrollment.hasOne(Grade);
// Grade.belongsTo(Enrollment);

module.exports = Grade;
