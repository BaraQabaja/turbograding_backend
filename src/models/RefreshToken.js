const { DataTypes } = require('sequelize');
const sequelize = require('./database');


module.exports = (sequelize, DataTypes) => {
    const RefreshToken = sequelize.define('RefreshToken', {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      // Optionally, you can add an expiration date for the refresh token as well.
    });
  
    RefreshToken.associate = (models) => {
      RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
  
    return RefreshToken;
  };
  