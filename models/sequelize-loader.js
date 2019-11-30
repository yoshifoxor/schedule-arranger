'use strict';
const fs = require('fs');
const Sequelize = require('sequelize');
const db = { database: "schedule_arranger", username: "postgres", password: "" };
let config = (fs.statSync('config.js').isFile()) ? require('../config') : { db };
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
