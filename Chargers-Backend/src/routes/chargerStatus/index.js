const router = require("express").Router();
const { Op } = require("sequelize");
const shared = require('../../shared');
const moment = require("moment/moment");
const { InvalidRequestError } = require("../../shared/error");


router.get('/', shared.asyncWrapper(async (req, res) => {

  const { ChargerStatus } = res.locals.models;

  const startTime = req.query.start;
  const endTime = req.query.end;

  if (!req.query.limit && !req.query.recent) {
    return res.json(shared.makeResponse({}, "Did not include a limit"))
  }
  const limit = req.query.limit;
  const recent = req.query.recent ?? false

  if (req.query.id) {
    if (recent) {
      const status = await ChargerStatus.findOne({
        where: {
          ChargerId: req.query.id
        },
        order: [['statusTime', 'DESC']],
      });
      return res.json(shared.makeResponse(status));  
    } else {
      const status = await ChargerStatus.findAll({
        where: {
          ChargerId: req.query.id,
          statusTime: {
            [Op.gte]: moment(startTime ?? 0).toDate(),
            [Op.lte]: moment(endTime).toDate(),
          }
        },
        order: [['statusTime', 'DESC']],
        limit: limit
      });
      return res.json(shared.makeResponse(status));
    }
  } else {
    return res.json(shared.makeResponse({}, "Did not include a charger id"))
  }
}));

// Posts a status by charger
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Charger, ChargerStatus } = res.locals.models;

  if (!req.body.id)
    return res.json(shared.makeResponse({}, "Missing required id"));

  let charger = await Charger.findByPk(req.body.id);

  if (!charger) {
    try {
      charger = await Charger.create({id: req.body.id, chargerName: req.body.id});
    } catch (err) {
      throw new InvalidRequestError(err)
    }
  }

  try {
    const status = await ChargerStatus.create({connected: req.body.connected, statusTime: moment(req.body.statusTime).toDate(), status: req.body.status, ChargerId: req.body.id});
    return res.json(status)
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));

// Delete a charger status
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { ChargerStatus } = res.locals.models;

  if (req.body.id){
    try{
      await ChargerStatus.destroy({
        where: {
          id: req.body.id,
        },
      });
    } catch (err) {
      throw new InvalidRequestError(err)
    }
    
    return res.json(shared.makeResponse("Success"));
  }
  else{
    return res.json(shared.makeResponse({}, "Missing required id"));
  }

}))


router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { ChargerStatus } = res.locals.models;

  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "Missing required id"))
  }

  try {
    await ChargerStatus.update(req.body, {
      where: {
        id: req.body.id,
      },
    })
  } catch (err) {
    throw new InvalidRequestError(err);
  }
  return res.json(shared.makeResponse("Success"))

}));

module.exports = router;