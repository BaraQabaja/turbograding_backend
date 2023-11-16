const config = require('../config');

const Sequelize = require('sequelize');

//! on Development
// const sequelize = new Sequelize(
//     config.db.database,
//     config.db.username,
//     config.db.password,
//     {
//         host: config.db.host,
//         dialect: 'postgres',
//         port: 5432, //should be remove
//         dialectOptions: {
//             // ssl: { rejectUnauthorized: false }
//         } //should be remove
//     });

//! on production
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< This is important
      },
    },
    // other configurations...
  });
  

module.exports = sequelize;

