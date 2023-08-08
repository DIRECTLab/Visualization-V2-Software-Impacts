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

const getGPSURL = (busId) => `http://144.39.204.242:11236/viriciti/gps/${busId}?limit=25000`;

const getAllGPS = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getGPSURL(busId),
  });
  return res?.data?.data ?? []
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses) {
      let gpsData = []
      const allGPSValues = await getAllGPS(bus.vid)
      for (let value of allGPSValues) {
        gpsData.push({
          time: moment(value.time).toDate(),
          lat: value.lat,
          long: value.long,
          createdAt: moment(value.createdAt).toDate(),
          updatedAt: moment(value.updatedAt).toDate(),
          ViricitibusVid: value.ViricitibusVid
        });
      }
      if (gpsData.length === 0) continue;
      await queryInterface.bulkInsert('gps', gpsData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gps', null, {})
  }
};
