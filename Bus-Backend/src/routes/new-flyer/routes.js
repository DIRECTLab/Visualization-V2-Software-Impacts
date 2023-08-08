const router = require('express').Router();
const  Sequelize = require('sequelize');
const { Op } = require('sequelize');
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const moment = require('moment');


/**
 * Allows to get every route that the bus has gone on and its parameters during the route.
 */
router.get('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.query.id;
  if (!busId) {
    throw new InvalidRequestError("Missing required bus id");
  }
  const { RouteEntry } = res.locals.models;


  /**
   * Returns non-repeated GPS times
   * params: limit
  */
  if (req.query.useful) {
    if (!req.query.limit) throw new InvalidRequestError("Missing required limit");
    const days = req.query.days;
    const includedFields = Object.keys(RouteEntry.rawAttributes).filter(field => field !== 'gpsFixTime' 
    && field !== 'id' 
    && field !== 'time' 
    && field !== 'createdAt'
    && field !== 'updatedAt');


    let routes = await RouteEntry.findAll({
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('gpsFixTime')), 'gpsFixTime'],
            ...includedFields
        ],
        where: {
            BusId: busId,
            gpsFixTime: {
                [Op.gte]: moment().subtract(days ?? 0, 'days').toDate()
            },
        },
        group: ['gpsFixTime', ...includedFields],
        order: [['gpsFixTime', 'DESC']],
        limit: req.query.limit,
    });
    if (!routes) {
        return res.json(shared.makeResponse({info: "No past routes found"}));
    }
    return res.json(shared.makeResponse(routes));
  }

  /**
   * Gets the most recent update for the bus, this should reflaect its actual SOC most accurately
  */
  if (req.query.recent) {
    const { Bus } = res.locals.models;
    const bus = await Bus.findOne({
      where: {
          id: busId,
      },
    });
    if (!bus) return res.json(shared.makeResponse({info: "No bus found with this id"}));
    const lastRoute = await RouteEntry.findOne({
        where: {
            BusId: busId,
            gpsFixTime: {
                [Op.not]: null,
            }
        },
        order: [['gpsFixTime', 'DESC']],
    });
    if (!lastRoute) return res.json(shared.makeResponse(bus))
    return res.json(shared.makeResponse({lastRoute}))
  }
  
  const startTime = req.query.start;
  const endTime = req.query.end;
  let routes = await RouteEntry.findAll({
      where: {
          BusId: busId,
          time: {
              [Op.gte]: moment(startTime ?? 0).toDate(),
              [Op.lte]: moment(endTime).toDate()
          }
      },
      order: [['gpsFixTime', 'DESC']],
      limit: req.query?.limit ?? 1,
  });

  if (!routes) {
      return res.json(shared.makeResponse({info: "No past routes found"}));
  }

  return res.json(shared.makeResponse(routes));
}));

/**
 * URL to add a new route entry to the bus
 */
router.post('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.BusId;

  if (!busId) {
    throw new InvalidRequestError("Missing required bus id");
  }

  const { RouteEntry } = res.locals.models;

  const requiredParams = ['isActive', 'soc', 'wheelBasedVehicleSpeed', 'engineSpeed', 'totalVehicleDistance', 'instantaneousPower', 'tripRegenPower', 'tripMotorEnergyConsumption', 'averagePowerKw', 'timeToEmpty', 'milesToEmpty', 'averageSpeed', 'chargingEnergyTransferKwh', 'dcEnergyConsumptionKwh', 'auxInverterEnergyConsumptionKwh', 'electricHeaderEnergyConsumptionKwh', 'sysInstantaneousEnergyKwh', 'sysSoc', 'time'];
  const missingParams = requiredParams.filter(param => !req.body[param] && !req.body.bus[param]);

  if (missingParams.length > 0) {
      throw new InvalidRequestError(`Missing required parameters: ${missingParams.join(', ')}`);
  }

  let exists = null;
  if (!req.body.bus.gpsFixTime)
  {
      exists = await RouteEntry.findOne({
          where: {
              time: req.body.time
          }
      });
  } else {
      exists = await RouteEntry.findOne({
          where: {
              time: req.body.bus.gpsFixTime
          }
      });
  }

  const cleanedBus = JSON.parse(req.body.bus);

  delete cleanedBus['id']

  if (!exists) {
     const routeEntry = await RouteEntry.create({...cleanedBus, ...req.body, BusId: busId});

     if (routeEntry) {
          return res.json(shared.makeResponse(routeEntry));
     }
     else {
          throw new InvalidRequestError("Route entry creation failed");
     }
  }

  return res.json(shared.makeResponse(exists));
}));

/**
 * URL to remove a route
 */
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const id = req.body.id;

  if (!id) throw new InvalidRequestError("Missing required id");
  const { RouteEntry } = res.locals.models;

  try {
    RouteEntry.destroy({
      where: {
        id: id
      }
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));

router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { RouteEntry } = res.locals.models;
  const id = req.body.id;
  if (!id) throw new InvalidRequestError("Missing required id");
  try {
    await RouteEntry.update(req.body, {
      where: {
        id: id
      }
    });
    return res.json(shared.makeResponse("Success"))
  } catch (err) {
    throw new InvalidRequestError(err);
  }

}));

module.exports = router;