const config = require("../config");

const Sequelize = require("sequelize");

if (config.app.mode == "development") {
  //! on Development
  const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      dialect: "postgres",
      port: 5432, //should be remove
      dialectOptions: {
        // ssl: { rejectUnauthorized: false }
      }, //should be remove
    }
  );
  module.exports = sequelize;
} else if (config.app.mode == "production") {
  //! on production
  const sequelize = new Sequelize(config.db.db_url, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< This is important
      },
    },
    pool: {
      max: 20, // Adjust as needed
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // other configurations...
  });
  module.exports = sequelize;
}
