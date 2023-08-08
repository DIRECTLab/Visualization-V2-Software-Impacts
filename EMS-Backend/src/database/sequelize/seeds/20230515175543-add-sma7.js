'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/sma7?limit=25000"

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
    return queryInterface.bulkInsert('sma7', data.map(entry => {
      return {
        id: entry.id,
        status: entry.status,
        acLifetime: entry.acLifetime,
        acPower: entry.acPower,
        acAnVoltage: entry.acAnVoltage,
        acTotalCurrent: entry.acTotalCurrent,
        acFrequency: entry.acFrequency,
        acPhaseACurrent: entry.acPhaseACurrent,
        reactivePower: entry.reactivePower,
        apparentPower: entry.apparentPower,
        powerFactor: entry.powerFactor,
        dcCurrent: entry.dcCurrent,
        dcVoltage: entry.dcVoltage,
        dcPower: entry.dcPower,
        createdAt: moment(entry.createdAt).toDate(),
        updatedAt: moment(entry.updatedAt).toDate(),
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sma7', null, {});
  }
};
