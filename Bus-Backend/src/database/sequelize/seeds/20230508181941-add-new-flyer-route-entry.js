'use strict';

const { default: axios } = require('axios');
const moment = require("moment/moment");

const BUS_API_URL = "http://144.39.204.242:11236/bus"

const getBusses = async () => {
  const res = await axios({
    method: 'get',
    url:BUS_API_URL
  });
  return res?.data?.data ?? []
}

const getEntryURL = (busId) => `http://144.39.204.242:11236/bus/${busId}/route/all?limit=25000`;

const getRouteEntries = async (busId) => {
  const res = await axios({
    method: 'get',
    url: getEntryURL(busId),
  });
  return res?.data?.data ?? []
};



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const busses = await getBusses();
    for (let bus of busses){
      let routeEntryData = []
      const routeEntries = await getRouteEntries(bus.id)
      for (let route of routeEntries) {
        routeEntryData.push({
          isActive: route.isActive,
          latitude: route.latitude,
          longitude: route.longitude,
          lineReference: route.lineReference,
          lineName: route.lineName,
          directionReference: route.directionReference,
          speed: route.speed,
          gpsFixTime: moment(route.gpsFixTime).toDate(),
          soc: route.soc,
          wheelBasedVehicleSpeed: route.wheelBasedVehicleSpeed,
          engineSpeed: route.engineSpeed,
          totalVehicleDistance: route.totalVehicleDistance,
          instantaneousPower: route.instantaneousPower,
          tripRegenPower: route.tripRegenPower,
          tripMotorEnergyConsumption: route.tripMotorEnergyConsumption,
          averagePowerKw: route.averagePowerKw,
          timeToEmpty: route.timeToEmpty,
          milesToEmpty: route.milesToEmpty,
          averageSpeed: route.averageSpeed,
          chargingEnergyTransferKwh: route.chargingEnergyTransferKwh,
          dcEnergyConsumptionKwh: route.dcEnergyConsumptionKwh,
          auxInverterEnergyConsumptionKwh: route.auxInverterEnergyConsumptionKwh,
          electricHeaderEnergyConsumptionKwh: route.electricHeaderEnergyConsumptionKwh,
          sysInstantaneousEnergyKwh: route.sysInstantaneousEnergyKwh,
          sysSoc: route.sysSoc,
          time: moment(route.time).toDate(),
          createdAt: moment(route.createdAt).toDate(),
          updatedAt: moment(route.updatedAt).toDate(),
          BusId: route.BusId,
        })
      }
      if (routeEntryData.length === 0) continue;
      await queryInterface.bulkInsert('routeEntry', routeEntryData, {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('routeEntry', null, {});
  }
};
