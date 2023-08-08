'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("sma7", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {type: Sequelize.STRING},
      acLifetime: {type: Sequelize.FLOAT},
      acPower: {type: Sequelize.FLOAT},
      acAnVoltage: {type: Sequelize.FLOAT},
      acTotalCurrent: {type: Sequelize.FLOAT},
      acFrequency: {type: Sequelize.FLOAT},
      acPhaseACurrent: {type: Sequelize.FLOAT},
      reactivePower: {type: Sequelize.FLOAT},
      apparentPower: {type: Sequelize.FLOAT},
      powerFactor: {type: Sequelize.FLOAT},
      dcCurrent: {type: Sequelize.FLOAT},
      dcVoltage: {type: Sequelize.FLOAT},
      dcPower: {type: Sequelize.FLOAT},
    });    
},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("sma7");
  }
};
