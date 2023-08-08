'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/sma50?limit=25000"

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
    return queryInterface.bulkInsert('sma50', data.map(entry => {
      return {
        id: entry.id,
        status: entry.status,
        acLifetime: entry.acLifetime,
        acPower: entry.acPower,
        acAnVoltage: entry.acAnVoltage,
        acBnVoltage: entry.acBnVoltage,
        acCnVoltage: entry.acCnVoltage,
        acAbVoltage: entry.acAbVoltage,
        acBcVoltage: entry.acBcVoltage,
        acCaVoltage: entry.acCaVoltage,
        acTotalCurrent: entry.acTotalCurrent,
        acFrequency: entry.acFrequency,
        acPhaseACurrent: entry.acPhaseACurrent,
        acPhaseBCurrent: entry.acPhaseBCurrent,
        acPhaseCCurrent: entry.acPhaseCCurrent,
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
    await queryInterface.bulkDelete('sma50', null, {});
  }
};
