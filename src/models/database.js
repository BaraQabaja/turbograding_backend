const config = require('../config');

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: 'postgres',
        port: 5432, //should be remove
        dialectOptions: {
            ssl: { rejectUnauthorized: false }
        } //should be remove
    });

module.exports = sequelize;

