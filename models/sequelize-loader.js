'use strict';
const Sequelize = require('sequelize');
const { database, dialect, username, password } = require('./sequelizeConfig');

const options = {
  dialect: 'postgres',
  logging: false,
};

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, { ...options,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(database, username, password, { ...options });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize,
};
