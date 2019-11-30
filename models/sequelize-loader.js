'use strict';
const Sequelize = require('sequelize');
const config = require('../config');
const sequelize = new Sequelize(
  `postgres://${config.db.username}:${config.db.password}@localhost:5432/${config.db.database}`,
  {
    operatorsAliases: false
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
