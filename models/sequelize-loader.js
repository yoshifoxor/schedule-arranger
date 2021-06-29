'use strict';
const Sequelize = require('sequelize');
const { database, dialect, username, password } = require('./sequelizeConfig');

const sequelize = new Sequelize(database, username, password, {
  dialect: dialect,
  logging: false,
});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize,
};
