'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/gustav?limit=25000"

const getGustavKleinData = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = await getGustavKleinData();
    return queryInterface.bulkInsert('gustavKlein', data.map(entry => {
      return {
        id: entry.id,
        measuredPower: entry.measuredPower,
        measuredVoltage: entry.measuredVoltage,
        measuredAmp: entry.measuredAmp,
        createdAt: moment(entry.createdAt).toDate(),
        updatedAt: moment(entry.updatedAt).toDate(),
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gustavKlein', null, {});
  }
};
