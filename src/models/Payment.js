const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Payment = sequelize.define('Payment', {
    subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'subscriptions', // 'subscriptions' refers to the table name
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paymentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // Payment status (e.g., pending, completed, failed).
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

module.exports = Payment;
