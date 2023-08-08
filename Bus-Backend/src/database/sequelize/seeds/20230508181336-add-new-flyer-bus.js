'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/bus"

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
    return queryInterface.bulkInsert('bus', busses.map(bus => {
      return {
        id: bus.id,
        createdAt: moment(bus.createdAt).toDate(),
        updatedAt: moment(bus.updatedAt).toDate()
      }
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('bus', null, {});
  }
};
