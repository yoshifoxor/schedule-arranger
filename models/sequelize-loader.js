'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('secret_board', 'postgres', 'kus10a93w', {
  dialect: 'postgres',
  logging: true,
  operatorsAliases: false
});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
