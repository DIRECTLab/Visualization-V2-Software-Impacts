const Sequelize = require('sequelize');

const modelName = 'Viricitibus';
module.exports = sequelize => ({
  modelName,
  associate: ({
    Viricitibus, 
    Current, 
    DistanceDrivenPerDay, 
    EnergyUsedPerDay, 
    Gps,
    Odo,
    Power,
    Soc,
    Speed,
    Voltage 
  }) => {
    Viricitibus.hasMany(Current);
    Viricitibus.hasMany(DistanceDrivenPerDay);
    Viricitibus.hasMany(EnergyUsedPerDay);
    Viricitibus.hasMany(Gps);
    Viricitibus.hasMany(Odo);
    Viricitibus.hasMany(Power);
    Viricitibus.hasMany(Soc);
    Viricitibus.hasMany(Speed);
    Viricitibus.hasMany(Voltage);
  },
  model: sequelize
    .define(modelName, {
      vid: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      id: { type: Sequelize.STRING, allowNull: false, unqiue: true },
      vin: { type: Sequelize.STRING, allowNull: false, unique: true },
      name: { type: Sequelize.STRING }
    },
    {
      freezeTableName: true,
      tableName: 'viricitibus',
    }),
});
