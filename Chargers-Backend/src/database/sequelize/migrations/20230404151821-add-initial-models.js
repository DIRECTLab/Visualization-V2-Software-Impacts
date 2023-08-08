'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const shared = {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      }
    };

    await queryInterface.createTable("User", {
      ...shared,
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING },
    });

    await queryInterface.createTable('location', {
      ...shared,
      name: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Un-named location' },
      siteId: { type: Sequelize.STRING(50) },
    });

    await queryInterface.createTable("charger", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: { type: Sequelize.STRING, primaryKey: true, allowNull: false },
      chargerName: { type: Sequelize.STRING },
      latitude: { type: Sequelize.FLOAT },
      longitude: { type: Sequelize.FLOAT },
      LocationId: {
        type: Sequelize.INTEGER,
        references: {
          model: "location",
          key: 'id',
        },
        onUpdate: 'cascade',
      }

    });

    await queryInterface.createTable('chargerstatus', {
      ...shared,
      connected: { type: Sequelize.BOOLEAN, allowNull: false },
      statusTime: { type: Sequelize.DATE, allowNull: false },
      status: {type: Sequelize.STRING, defaultValue: 'unknown' },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      },
    });

    await queryInterface.createTable('chargingprofile', {
      ...shared,
      chargingProfileId: { type: Sequelize.INTEGER },
      stackLevel: { type: Sequelize.INTEGER },
      chargingProfilePurpose: { type: Sequelize.STRING(30) },
      chargingProfileKind: { type: Sequelize.STRING(30) },
      chargingSchedule: { type: Sequelize.JSON },
      connectorId: { type: Sequelize.INTEGER },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false, },
      cleared: { type: Sequelize.BOOLEAN, defaultValue: false, },
      accepted: { type: Sequelize.BOOLEAN, defaultValue: true},
      manualControl: { type: Sequelize.BOOLEAN, defaultValue: false},
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    await queryInterface.createTable('onetimecommand', {
      ...shared,
      command: { type: Sequelize.STRING(30), allowNull: false },
      handled: { type: Sequelize.BOOLEAN, defaultValue: false },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    await queryInterface.createTable('transaction', {
      ...shared,
      connectorId: { type: Sequelize.INTEGER, allowNull: false },
      meterStart: { type: Sequelize.INTEGER, allowNull: false },
      timestampStart: { type: Sequelize.DATE, allowNull: false },
      meterStop: { type: Sequelize.INTEGER },
      timestampEnd: { type: Sequelize.DATE },
      current: { type: Sequelize.BOOLEAN },
      powerConsumed: { type: Sequelize.INTEGER },
      ChargerId: {
        type: Sequelize.STRING,
        references: {
          model: "charger",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });


    await queryInterface.createTable('metervalue', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      timestamp: { type: Sequelize.DATE },
      TransactionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "transaction",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });

    await queryInterface.createTable('sampledvalue', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      value: { type: Sequelize.STRING(50) },
      context: { type: Sequelize.STRING(20) },
      valueFormat: { type: Sequelize.STRING(14) },
      measurand: { type: Sequelize.STRING(40) },
      location: { type: Sequelize.STRING(10) },
      unit: { type: Sequelize.STRING(15) },
      MeterValueId: {
        type: Sequelize.INTEGER,
        references: {
          model: "metervalue",
          key: 'id',
        },
        onUpdate: 'cascade',
      }
    });



  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("User");
    await queryInterface.dropTable("charger");
    await queryInterface.dropTable('chargerstatus');
    await queryInterface.dropTable('chargingprofile');
    await queryInterface.dropTable('onetimecommand');
    await queryInterface.dropTable('transaction');
    await queryInterface.dropTable('metervalue');
    await queryInterface.dropTable('sampledvalue');

    await queryInterface.removeColumn('charger', 'LocationId');
    await queryInterface.dropTable('location');

  }
};
