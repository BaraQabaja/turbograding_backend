const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Message = sequelize.define(
  "Message",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,

    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  {
    createdAt:true,
    updatedAt:true,
  }
  
);


module.exports = Message;
