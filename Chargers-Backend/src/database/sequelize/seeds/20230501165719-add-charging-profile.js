'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const CHARGER_API_URL = "http://144.39.204.242:11236/charger"
const getChargers = async () => {
  const res = await axios({
    method: 'get',
    url:CHARGER_API_URL
  });
  return res?.data?.data ?? []
}


const getProfileURl = (chargerId) => `http://144.39.204.242:11236/charger/${chargerId}/profile?limit=25000`

const getAllProfiles = async (chargerId) => {
  const res = await axios({
    method: 'get',
    url:getProfileURl(chargerId)
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const chargers = await getChargers();
    for (let charger of chargers) {
      let profileData = []
      const allProfiles = await getAllProfiles(charger.id)

      for (let profile of allProfiles){
        profileData.push({
          chargingProfileId: profile.chargingProfileId,
          stackLevel: profile.stackLevel,
          chargingProfilePurpose: profile.chargingProfilePurpose,
          chargingProfileKind: profile.chargingProfileKind,
          chargingSchedule: profile.chargingSchedule,
          connectorId: profile.connectorId,
          handled: profile.handled,
          cleared: profile.cleared,
          accepted: profile.accepted,
          manualControl: profile.manualControl,
          createdAt: moment(profile.createdAt).toDate(),
          updatedAt: moment(profile.updatedAt).toDate(),
          ChargerId: profile.ChargerId,
        })
      }
      if (profileData.length === 0){
        continue;
      }
      await queryInterface.bulkInsert('chargingprofile', profileData, {}, { chargingSchedule: {type: new Sequelize.JSON()}})
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('chargingprofile', null, {});
  }
};
