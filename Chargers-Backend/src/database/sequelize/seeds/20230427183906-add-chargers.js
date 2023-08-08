'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/charger"
const getChargers = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const chargers = await getChargers();
    return queryInterface.bulkInsert('Charger', chargers.map(charger => {
      return {
        id: charger.id,
        chargerName: charger.chargerName,
        latitude: charger.latitude,
        longitude: charger.longitude,
        createdAt: moment(charger.createdAt).toDate(),
        updatedAt: moment(charger.updatedAt).toDate(),
        LocationId: charger.LocationId
      }
    }));
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Charger', null, {});
  }
};
