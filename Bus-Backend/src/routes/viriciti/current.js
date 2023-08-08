const router = require('express').Router();
const shared = require('../../shared');
const { Op } = require('sequelize');
const moment = require('moment');
const { InvalidRequestError } = require('../../shared/error');

/**
 * Get request to return the current (amps) from the bus
 */
router.get("/", shared.asyncWrapper(async (req, res) => {
  const { Current } = res.locals.models;
  const busId = req.query.vid;

  const startTime = req.query.start;
  const endTime = req.query.end;

  if (!busId) throw new InvalidRequestError("No bus vid was provided");
  if (!req.query.limit) throw new InvalidRequestError("No limit was given");



  const entries = await Current.findAll({
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
    throw new InvalidRequestError(`No entries were found for bus with id: ${busId} `)
  }
  return res.json(shared.makeResponse(entries));
}));


/**
 * URL to add new current entry to Ogden bus
 */
router.post('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.vid;
  if (!busId) throw new InvalidRequestError("No bus vid was provided");


  const { Viricitibus, Current } = res.locals.models;

  const requiredParams = ['time', 'value', 'vid']
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

  const current = await Current.findOne({
    where: {
      time: req.body.time,
      value: req.body.value,
    }
  });

  if (!current) {
    try {
      const current = await Current.create({...req.body, ViricitibusVid: busId});
      return res.json(shared.makeResponse(current));
    } catch (err) {
      throw new InvalidRequestError(err);
    }
  }
  return res.json(shared.makeResponse(current));
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const busId = req.body.vid;
  if (!busId) throw new InvalidRequestError("Missing bus vid");
  const time = req.body.time;
  if (!time) throw new InvalidRequestError("Missing time");
  const { Current } = res.locals.models;

  try {
    Current.destroy({
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
  const { Current } = res.locals.models;

  try {
    Current.update(req.body, {
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