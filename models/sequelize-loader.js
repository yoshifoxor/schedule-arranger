'use strict';
const { Sequelize, DataTypes } = require('sequelize');
let host = null;
let password = null;
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  host = process.env.POSTGRES_HOST;
  password = process.env.POSTGRES_PASSWORD;
}

const { database, dialect, username } = {
  database: 'schedule_arranger',
  dialect: 'postgres',
  username: 'postgres',
};
const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};
const defaultOptions = { logging: false };

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      ...defaultOptions,
      dialectOptions,
    })
  : new Sequelize(database, username, password, {
      ...defaultOptions,
      host,
      dialect,
    });

module.exports = { sequelize, DataTypes };
