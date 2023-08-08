const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { Op, fn, col } = require('sequelize');
const moment = require("moment/moment");


router.get('/', shared.asyncWrapper(async (req, res) => {
  const { LevitonEntry } = res.locals.models;

  let recentPowerConsumed;

  if (req.query.alive) {
    const alive = await LevitonEntry.findOne({
      order: [['timestamp', 'DESC']],
    });

    if (alive.timestamp < moment.utc().subtract(21, 'seconds')) {
      return res.json(shared.makeResponse({ 'active': false }))
    }

    return res.json(shared.makeResponse({ 'active': true }))

  }

  const startTime = req.query.start;
  const endTime = req.query.end;

  if (req.query.current) {
    const recentPowerConsumed = await LevitonEntry.findOne({
      order: [['timestamp', 'DESC']],
    })

    if (!recentPowerConsumed) {
      throw new InvalidRequestError("No power draw has been found");
    }

    return res.json(shared.makeResponse(recentPowerConsumed));
  }

  if (req.query.page && req.query.pageSize) {
    const offset = req.query.page * req.query.pageSize;
    const limit = req.query.pageSize;


    recentPowerConsumed = await LevitonEntry.findAll({
      where: {
        timestamp: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime ?? moment.now()).toDate(),
        },
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

  } else {
    if (!req.query.limit) throw new InvalidRequestError("No limit was included");
    
    recentPowerConsumed = await LevitonEntry.findAll({
      where: {
        timestamp: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime ?? moment.now()).toDate(),
        }
      },
      limit: req.query.limit,
      order: [['timestamp', 'DESC']],
    })
  }



  if (!recentPowerConsumed) {
    throw new InvalidRequestError("No power draw has been found");
  }

  return res.json(shared.makeResponse(recentPowerConsumed));
}));

router.post('/', shared.asyncWrapper(async (req, res) => {
  const { LevitonEntry } = res.locals.models;

  const entry = await LevitonEntry.findOne({
    where: {
      timestamp: req.body.timestamp
    }
  })
  if (entry) return res.json(shared.makeResponse(entry));

  if (!entry) {
    try {
      const entry = await LevitonEntry.create(req.body);
      return res.json(shared.makeResponse(entry));
    } catch (err) {
      throw new InvalidRequestError(err);
    }

  }
}))

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { LevitonEntry } = res.locals.models;
  if (!req.body.timestamp) throw new InvalidRequestError("Missing required timestamp");

  try {
    await LevitonEntry.destroy({
      where: {
        timestamp: req.body.timestamp,
      },
    });
  } catch (err) {
    throw new InvalidRequestError(err)
  }
  return res.json(shared.makeResponse("Success"));
}));

router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { LevitonEntry } = res.locals.models;
  if (!req.body.timestamp) throw new InvalidRequestError("Missing required timestamp");

  try {
    await LevitonEntry.update(req.body, {
      where: {
        timestamp: req.body.timestamp,
      }
    });
  } catch (err) {
    throw new InvalidRequestError(err)
  }
  return res.json(shared.makeResponse("Success"));
}));

module.exports = router;