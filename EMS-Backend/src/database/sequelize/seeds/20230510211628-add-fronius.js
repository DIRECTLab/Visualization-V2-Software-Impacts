'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const API_URL = "http://144.39.204.242:11236/evr/fronius"

const getModelNames = async () => {
  const res = await axios({
    method: 'get',
    url:API_URL
  });
  return res?.data?.data ?? []
}

const getModelInfoURL = (modelName) => `http://144.39.204.242:11236/evr/fronius/${modelName}?limit=25000`;

const getModelInfo = async (modelName) => {
  const res = await axios({
    method: 'get',
    url: getModelInfoURL(modelName)
  });
  return res?.data?.data ?? []
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const modelNames = await getModelNames();
    for (let {model} of modelNames) {
      const modelInfo = await getModelInfo(model);
      await queryInterface.bulkInsert('fronius', modelInfo.map(entry => {
        return {
          id: entry.id,
          model: entry.model,
          status: entry.status,
          acTotalCurrent: entry.acTotalCurrent,
          acPhaseACurrent: entry.acPhaseACurrent,
          acPhaseBCurrent: entry.acPhaseBCurrent,
          acPhaseCCurrent: entry.acPhaseCCurrent,
          acAbVoltage: entry.acAbVoltage,
          acBcVoltage: entry.acBcVoltage,
          acCaVoltage: entry.acCaVoltage,
          acAnVoltage: entry.acAnVoltage,
          acBnVoltage: entry.acBnVoltage,
          acCnVoltage: entry.acCnVoltage,
          acPower: entry.acPower,
          acFrequency: entry.acFrequency,
          apparentPower: entry.apparentPower,
          reactivePower: entry.reactivePower,
          powerFactor: entry.powerFactor,
          acLifetime: entry.acLifetime,
          dcCurrent: entry.dcCurrent,
          dcVoltage: entry.dcVoltage,
          dcPower: entry.dcPower,
          flags: JSON.stringify(entry.flags),
          createdAt: moment(entry.createdAt).toDate(),
          updatedAt: moment(entry.updatedAt).toDate(),
        }
      }));
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('fronius', null, {});
  }
};
