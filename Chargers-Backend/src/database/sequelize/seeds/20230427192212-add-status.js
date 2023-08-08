'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/charger"
const getStatusURL = (chargerId) => `http://144.39.204.242:11236/charger/${chargerId}/status?limit=25000`



const getChargers = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}

const getAllStatus = async (chargerId) => {
  const res = await axios({
    method: 'get',
    url:getStatusURL(chargerId)
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const chargers = await getChargers();
    for (let charger of chargers) {
      let statusData = []
      const allStatus = await getAllStatus(charger.id)
      for (let stat of allStatus){
        statusData.push({
          connected: stat.connected,
          statusTime: moment(stat.statusTime).toDate(),
          status: stat.status,
          createdAt: moment(stat.createdAt).toDate(),
          updatedAt: moment(stat.updatedAt).toDate(),
          ChargerId: charger.id,
        })
      }
      await queryInterface.bulkInsert('chargerstatus', statusData)
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chargerstatus', null, {});
  }
};
