'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/yaskawa?limit=25000"

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
    return queryInterface.bulkInsert('yaskawa', data.map(entry => {
      return {
        id: entry.id,
        status: entry.status,
        dailyEnergy: entry.dailyEnergy,
        lifetimeEnergy: entry.lifetimeEnergy,
        powerModuleHeatsinkTemperature: entry.powerModuleHeatsinkTemperature,
        internalInverterTemperature: entry.internalInverterTemperature,
        activeAcPower: entry.activeAcPower,
        apparentAcPower: entry.apparentAcPower,
        gridVoltageUab: entry.gridVoltageUab,
        gridVoltageUbc: entry.gridVoltageUbc,
        gridVoltageUca: entry.gridVoltageUca,
        gridACurrent: entry.gridACurrent,
        gridBCurrent: entry.gridBCurrent,
        gridCCurrent: entry.gridCCurrent,
        dcVoltageMPPTZone1: entry.dcVoltageMPPTZone1,
        dcCurrentMPPTZone1: entry.dcCurrentMPPTZone1,
        dcVoltageMPPTZone2: entry.dcVoltageMPPTZone2,
        dcCurrentMPPTZone2: entry.dcCurrentMPPTZone2,
        gridFrequency: entry.gridFrequency,
        register0x34: entry.register0x34,
        register0x35: entry.register0x35,
        register0x36: entry.register0x36,
        register0x37: entry.register0x37,
        register0x38: entry.register0x38,
        register0x39: entry.register0x39,
        register0x3a: entry.register0x3a,
        createdAt: moment(entry.createdAt).toDate(),
        updatedAt: moment(entry.updatedAt).toDate(),
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('yaskawa', null, {});
  }
};
