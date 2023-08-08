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

const getCurrentURL = (busId) => `http://144.39.204.242:11236/viriciti/current/${busId}?limit=25000`;

const getAllCurrentData = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getCurrentURL(busId),
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses) {
      let currentData = []
      const allCurrentValues = await getAllCurrentData(bus.vid)
      for (let current of allCurrentValues) {
        currentData.push({
          time: moment(current.time).toDate(),
          value: current.value,
          createdAt: moment(current.createdAt).toDate(),
          updatedAt: moment(current.updatedAt).toDate(),
          ViricitibusVid: current.ViricitibusVid
        });
      }
      if (currentData.length === 0) continue;
      await queryInterface.bulkInsert('current', currentData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('current', null, {});
  }
};
