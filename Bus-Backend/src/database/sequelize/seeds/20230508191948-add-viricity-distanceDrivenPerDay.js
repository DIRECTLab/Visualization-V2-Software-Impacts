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

const getDistanceDrivenURl = (busId) => `http://144.39.204.242:11236/viriciti/distance_driven_per_day/${busId}?limit=25000`;

const getAllDistanceDrivenData = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getDistanceDrivenURl(busId),
  });
  return res?.data?.data ?? []
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { // THIS CURRENTLY DOES NOT WORK FIX THIS LATER
    console.log("Distance driven per day currently not working")
    // const busses = await getBusses();
    // for (let bus of busses) {
    //   let distanceDrivenData = []
    //   const allDrivenData = await getAllDistanceDrivenData(bus.vid)
    //   for (let value of allDrivenData) {
    //     distanceDrivenData.push({
    //       time: moment(value.time).toDate(),
    //       value: value.value,
    //       createdAt: moment(value.createdAt).toDate(),
    //       updatedAt: moment(value.updatedAt).toDate(),
    //       ViricitibusVid: value.ViricitibusVid
    //     });
    //   }
    //   if (distanceDrivenData.length === 0) continue;
    //   await queryInterface.bulkInsert('distanceDrivenPerDay', distanceDrivenData, {});
    // }
  },

  async down (queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('distanceDrivenPerDay', null, {})
  }
};
