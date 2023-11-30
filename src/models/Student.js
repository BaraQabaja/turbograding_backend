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
    universityID:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      allowNull: false,
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

    primaryKey: ['id', 'universityID'],//composite primary key
  }
);
// // University & Student (One -> Many)
// University.hasMany(Student)
// Student.belongsTo(University);


module.exports = Student;
