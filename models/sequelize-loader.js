'use strict';
const config = require('../config');
const options = { dialect: 'postgres', operatorsAliases: false };
const Sequelize = require('sequelize');
const sequelize = (process.env.DATABASE_URL) ?
  new Sequelize(process.env.DATABASE_URL, options) :
  new Sequelize(config.db.database, config.db.username, config.db.password, options);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
