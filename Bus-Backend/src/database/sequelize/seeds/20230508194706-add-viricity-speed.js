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

const getSpeedURL = (busId) => `http://144.39.204.242:11236/viriciti/speed/${busId}?limit=25000`;

const getAllSpeed = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getSpeedURL(busId),
  });
  return res?.data?.data ?? []
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses) {
      let speedData = []
      const allspeedValues = await getAllSpeed(bus.vid)
      for (let value of allspeedValues) {
        speedData.push({
          time: moment(value.time).toDate(),
          value: value.value,
          createdAt: moment(value.createdAt).toDate(),
          updatedAt: moment(value.updatedAt).toDate(),
          ViricitibusVid: value.ViricitibusVid
        });
      }
      if (speedData.length === 0) continue;
      await queryInterface.bulkInsert('speed', speedData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('speed', null, {})
  }
};
