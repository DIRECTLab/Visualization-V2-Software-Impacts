'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/location"
const getLocation = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const locations = await getLocation();
    return queryInterface.bulkInsert('location', locations.reverse().map(location => {
      return {
        name: location.name,
        siteId: location.siteId,
        createdAt: moment(location.createdAt).toDate(),
        updatedAt: moment(location.updatedAt).toDate(),
      }
    }));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('location', null, {});
  }
};
