'use strict';


const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/viriciti/bus/all"

const getBusses = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    return queryInterface.bulkInsert('viricitibus', busses.map(bus => {
      return {
        vid: bus.vid,
        id: bus.id,
        vin: bus.vin,
        name: bus.name,
        createdAt: moment(bus.createdAt).toDate(),
        updatedAt: moment(bus.updatedAt).toDate()
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('viricitibus', null, {});
  }
};
