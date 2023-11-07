const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Plan = sequelize.define('Plan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // Duration in days
        allowNull: false
    },
    questions: {
        type: DataTypes.INTEGER, // Number of questions can be grad
        allowNull: false
    },
    assignments: {
        type: DataTypes.INTEGER, // Number of assignments can be grad
        allowNull: false
    }
}, {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

module.exports = Plan;
