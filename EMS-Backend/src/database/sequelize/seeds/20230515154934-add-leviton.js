'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/leviton/evr?limit=25000"

const getLevitionData = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = await getLevitionData();
    return queryInterface.bulkInsert('levitonEntry', data.map(entry => {
      return {
        timestamp: moment(entry.timestamp).toDate(),
        power: entry.power,
        createdAt: moment(entry.createdAt).toDate(),
        updatedAt: moment(entry.updatedAt).toDate(),
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('levitonEntry', null, {});
  }
};
