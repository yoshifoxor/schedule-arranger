'use strict';
const fs = require('fs');
const Sequelize = require('sequelize');
const db = { database: "schedule_arranger", username: "postgres", password: "" };

const config = fs.existsSync('../config.js') ? require('../config.js') : { db };

let sequelize;
try {
  sequelize = new Sequelize(
    `postgres://${config.db.username}:${config.db.password}@localhost:5432/${config.db.database}`,
    {
      operatorsAliases: false
    }
  );
} catch (error) {
  console.error(error);
}

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
