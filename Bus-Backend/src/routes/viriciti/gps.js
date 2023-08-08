const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const moment = require('moment');

/**
 * Get request to get the gps of the bus
 */
router.get("/", shared.asyncWrapper(async (req, res) => {
  const { Gps } = res.locals.models;
  const busId = req.query.vid;

  if (!busId) throw new InvalidRequestError("No bus vid was given");
  if (!req.query.limit) throw new InvalidRequestError("No limit was found");

  if (req.query.time) {
    try {
      const entry = await Gps.findOne({
        where: {
          ViricitibusVid: busId,
          time: req.query.time,
        },
      });
      return res.json(shared.makeResponse(entry));
    } catch (err) {
      throw new InvalidRequestError(err);
    }
  }

  const startTime = req.query.start;
  const endTime = req.query.end;
  const entries = await Gps.findAll({
    where: {
      ViricitibusVid: busId,
      time: {
        [Op.gte]: moment(startTime ?? 0).toDate(),
        [Op.lte]: moment(endTime).toDate()
      },
    },
    limit: req.query.limit,
    order: [['time', "DESC"]]
  });

  if (!entries || entries.length === 0) {
    throw new InvalidRequestError(`No entries were found for bus with id: ${busId}`)
  }
  return res.json(shared.makeResponse(entries));
}));

/**
 * URL to add new gps
 */
router.post('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.vid;
  const { Viricitibus, Gps } = res.locals.models;

  const requiredParams = ['time', 'lat', 'long', 'vid']
  const missingParams = requiredParams.filter(param => req.body[param] === undefined || req.body[param] === null)

  if (missingParams.length > 0) {
    throw new InvalidRequestError(`Missing required parameters: ${missingParams.join(', ')}`);
  }

  const bus = await Viricitibus.findOne({
    where: {
      vid: busId
    }
  })

  if (!bus) {
    throw new InvalidRequestError(`Could not find bus with ${busId}`)
  }

  const entry = await Gps.findOne({
    where: {
      time: req.body.time,
      lat: req.body.lat,
      long: req.body.long,
    }
  });

  if (!entry) {
    try {
      const current = await Gps.create({...req.body, ViricitibusVid: busId});
      return res.json(shared.makeResponse(current));
    } catch (err) {
      throw new InvalidRequestError(err);
    }
  }

  return res.json(shared.makeResponse(entry));
}));


router.delete('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.vid;
  if (!busId) throw new InvalidRequestError("Missing bus vid");
  const time = req.body.time;
  if (!time) throw new InvalidRequestError("Missing time");
  const { Gps } = res.locals.models;

  try {
    Gps.destroy({
      where: {
        time: time,
        ViricitibusVid: busId,
      }
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err)
  }

}));


router.patch('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.vid;
  const time = req.body.time;

  if (!busId) throw new InvalidRequestError("Missing bus vid");
  if (!time) throw new InvalidRequestError("Missing time");
  const { Gps } = res.locals.models;

  try {
    Gps.update(req.body, {
      where: {
        time: time,
        ViricitibusVid: busId,
      }
    })
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

module.exports = router;