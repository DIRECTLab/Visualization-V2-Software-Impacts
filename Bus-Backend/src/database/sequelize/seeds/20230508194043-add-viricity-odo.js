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

const getOdoURL = (busId) => `http://144.39.204.242:11236/viriciti/odo/${busId}?limit=25000`;

const getAllOdo = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getOdoURL(busId),
  });
  return res?.data?.data ?? []
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses) {
      let odoData = []
      const allodoValues = await getAllOdo(bus.vid)
      for (let value of allodoValues) {
        odoData.push({
          time: moment(value.time).toDate(),
          value: value.value,
          createdAt: moment(value.createdAt).toDate(),
          updatedAt: moment(value.updatedAt).toDate(),
          ViricitibusVid: value.ViricitibusVid
        });
      }
      if (odoData.length === 0) continue;
      await queryInterface.bulkInsert('odo', odoData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('odo', null, {})
  }
};
