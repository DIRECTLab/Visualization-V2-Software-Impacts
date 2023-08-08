'use strict';

const moment = require("moment/moment");
const { default: axios } = require('axios');

const CHARGER_API_URL = "http://144.39.204.242:11236/charger"
const getChargers = async () => {
  const res = await axios({
    method: 'get',
    url:CHARGER_API_URL
  });
  return res?.data?.data ?? []
}

const getTransactionURL = (chargerId) => `http://144.39.204.242:11236/charger/${chargerId}/transaction?limit=25000`

const getAllTransactions = async (chargerId) => {
  const res = await axios({
    method: 'get',
    url:getTransactionURL(chargerId)
  });
  return res?.data?.data.reverse() ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const chargers = await getChargers();
    for (let charger of chargers) {
      let transactionData = []

      const allTransactions = await getAllTransactions(charger.id);

      for (let transaction of allTransactions){
        transactionData.push({
          connectorId: transaction.connectorId,
          meterStart: transaction.meterStart,
          timestampStart: transaction.timestampStart,
          meterStop: transaction.meterStop,
          timestampEnd: transaction.timestampEnd,
          current: transaction.current,
          powerConsumed: transaction.powerConsumed,
          createdAt: moment(transaction.createdAt).toDate(),
          updatedAt: moment(transaction.updatedAt).toDate(),
          ChargerId: transaction.ChargerId,
        })
      }
      if (transactionData.length === 0){
        continue;
      }
      await queryInterface.bulkInsert('transaction', transactionData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transaction', null, {});

  }
};
