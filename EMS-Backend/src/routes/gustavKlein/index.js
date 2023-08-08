const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { Op, fn, col } = require('sequelize');
const moment = require("moment/moment");


/**
 * GET endpoint to retrieve Gustav-Klein Entries
 */

router.get('/', shared.asyncWrapper(async (req, res) => {
  const { GustavKlein } = res.locals.models;

  if (req.query.alive) {
    const alive = await GustavKlein.findOne({
      order: [['createdAt', 'DESC']],
    })

    if (alive.createdAt < moment.utc().subtract(21, 'seconds')) {
      return res.json(shared.makeResponse({ 'active': false }))
    }

    return res.json(shared.makeResponse({ 'active': true }))
  }


  const startTime = req.query.start;
  const endTime = req.query.end;

  let gustav;
  if (req.query.page && req.query.pageSize) {

    const offset = req.query.page * req.query.pageSize;
    const limit = req.query.pageSize;

    gustav = await GustavKlein.findAll({
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
    if (!req.query.limit) throw new InvalidRequestError("Missing required limit");
    gustav = await GustavKlein.findAll({
      where: {
        updatedAt: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime).toDate(),
        }
      },
      limit: req.query.limit,
      order: [['createdAt', 'DESC']],
    })
  }
  if (!gustav) {
    throw new InvalidRequestError("No Gustav-Klein Entries were found");
  }

  return res.json(shared.makeResponse(gustav));
}));


router.post('/', shared.asyncWrapper(async (req, res) => {
  const { GustavKlein } = res.locals.models;


  const entry = await GustavKlein.create(req.body);

  if (!entry) {
    throw new InvalidRequestError("No Gustav-Klein entry was created")
  }

  return res.json(shared.makeResponse(entry));
}))


router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { GustavKlein } = res.locals.models;
  if (!req.body.id) throw new InvalidRequestError("Missing required id");

  try {
    await GustavKlein.destroy({
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
  const { GustavKlein } = res.locals.models;
  if (!req.body.id) throw new InvalidRequestError("Missing required id");

  try {
    await GustavKlein.update(req.body, {
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