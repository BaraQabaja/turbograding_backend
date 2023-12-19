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
