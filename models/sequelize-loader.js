'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('schedule_arranger', 'postgres', 'kus10a93w', {
  dialect: 'postgres',
  logging: true,
});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
