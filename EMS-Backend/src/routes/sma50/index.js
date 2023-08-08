const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { Op, fn, col } = require('sequelize');
const moment = require("moment/moment");


router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Sma50 } = res.locals.models;

  const startTime = req.query.start;
  const endTime = req.query.end;

  if (req.query.alive) {
    const alive = await Sma50.findOne({
      order: [['createdAt', 'DESC']],
    });


    if (alive.createdAt < moment.utc().subtract(21, 'seconds')) {
      return res.json(shared.makeResponse({ 'active': false }))
    }

    return res.json(shared.makeResponse({ 'active': true }))
  }

  let data;
  if (req.query.page && req.query.pageSize) {

    const offset = req.query.page * req.query.pageSize;
    const limit = req.query.pageSize;

    data = await Sma50.findAll({
      where: {
        updatedAt: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime).toDate(),
        }
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    })  
  } else {
    if (!req.query.limit) throw new InvalidRequestError("No limit was included");
    data = await Sma50.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime).toDate(),
        }
      },
      limit: req.query.limit,
      order: [['createdAt', 'DESC']],
    })
  }


  if (!data) {
    throw new InvalidRequestError("No power draw has been found");
  }

  return res.json(shared.makeResponse(data));
}));


router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Sma50 } = res.locals.models;

  try {
    const entry = await Sma50.create(req.body);
    return res.json(shared.makeResponse(entry));
  } catch (err) {
    throw new InvalidRequestError(err);
  }

}))


router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Sma50 } = res.locals.models;
  if (!req.body.id) throw new InvalidRequestError("Missing required id");

  try {
    await Sma50.destroy({
      where: {
        id: req.body.id,
      },
    });
  } catch (err) {
    throw new InvalidRequestError(err)
  }
  return res.json(shared.makeResponse("Success"));
}));


router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Sma50 } = res.locals.models;
  if (!req.body.id) throw new InvalidRequestError("Missing required id");

  try {
    await Sma50.update(req.body, {
      where: {
        id: req.body.id,
      }
    });
  } catch (err) {
    throw new InvalidRequestError(err)
  }
  return res.json(shared.makeResponse("Success"));
}));

module.exports = router;