'use strict';
const { default: axios } = require('axios');
const moment = require("moment/moment");

const BUS_URL = "http://144.39.204.242:11236/viriciti/bus/all"

const getBusses = async () => {
  const res = await axios({
    method: 'get',
    url:BUS_URL
  });
  return res?.data?.data ?? []
}

const getEnergyUsedURL = (busId) => `http://144.39.204.242:11236/viriciti/energy_used_per_day/${busId}?limit=25000`;

const getAllEnergyUsed = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getEnergyUsedURL(busId),
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses) {
      let energyUsedPerDayData = []
      const allEnergyUsed = await getAllEnergyUsed(bus.vid)
      for (let value of allEnergyUsed) {
        energyUsedPerDayData.push({
          time: moment(value.time).toDate(),
          value: value.value,
          createdAt: moment(value.createdAt).toDate(),
          updatedAt: moment(value.updatedAt).toDate(),
          ViricitibusVid: value.ViricitibusVid
        });
      }
      if (energyUsedPerDayData.length === 0) continue;
      await queryInterface.bulkInsert('energyUsedPerDay', energyUsedPerDayData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('energyUsedPerDay', null, {})
  }
};
