const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Subscription = sequelize.define('subscriptions', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // 'users' refers to the table name
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // Current status of the subscription (e.g., active, cancelled).
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

module.exports = Subscription;
