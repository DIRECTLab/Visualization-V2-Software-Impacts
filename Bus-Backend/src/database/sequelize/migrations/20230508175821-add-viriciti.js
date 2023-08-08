'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("viricitibus", {
      vid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true
      },

      id: { allowNull: false, type: Sequelize.STRING },
      vin: { allowNull: false, type: Sequelize.STRING },
      name: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.createTable("current", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },

      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable("distanceDrivenPerDay", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("energyUsedPerDay", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("gps", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      lat: { type: Sequelize.FLOAT, allowNull: false },
      long: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("odo", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("power", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("soc", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("speed", {
      time: { 
        type: Sequelize.DATE, 
        allowNull: false,
        primaryKey: true 
      },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });

    await queryInterface.createTable("voltage", {
      time: { type: Sequelize.DATE, allowNull: false },
      value: { type: Sequelize.FLOAT, allowNull: false },
      
      ViricitibusVid: {
        type: Sequelize.STRING,
        references: {
          model: 'viricitibus',
          key: 'vid',
        },
        onUpdate: 'cascade',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("voltage");
    await queryInterface.dropTable("speed");
    await queryInterface.dropTable("soc");
    await queryInterface.dropTable("power");
    await queryInterface.dropTable("odo");
    await queryInterface.dropTable("gps");
    await queryInterface.dropTable("energyUsedPerDay");
    await queryInterface.dropTable("distanceDrivenPerDay");
    await queryInterface.dropTable("current");
    await queryInterface.dropTable("viricitiBus");
  }
};

