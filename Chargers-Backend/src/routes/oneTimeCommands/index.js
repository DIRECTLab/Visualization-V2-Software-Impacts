const router = require("express").Router();
const { Op } = require("sequelize");
const shared = require('../../shared');
const moment = require('moment');
const { InvalidRequestError } = require("../../shared/error");

// Gets the unhandled one time commands for a charger
router.get('/', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.query.chargerId;

  if (!chargerId) throw new InvalidRequestError("Did not include charger id");
  const limit = req.query.limit;

  const startTime = req.query.start;
  const endTime = req.query.end;
  
  const { OneTimeCommand } = res.locals.models;

  const commands = await OneTimeCommand.findAll({
    where: {
      ChargerId: chargerId,
      handled: false,
      createdAt: {
        [Op.gte]: moment(startTime ?? 0).toDate(),
        [Op.lte]: moment(endTime).toDate()
      },
    },
    limit: limit ?? 1
  });

  return res.json(shared.makeResponse(commands));
}));

// Add a new command to a charger
router.post('/', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.body.chargerId;

  const { Charger, OneTimeCommand } = res.locals.models;

  if (!req.body.chargerId) 
    throw new InvalidRequestError("No charger id was included in the request")

  if (!await Charger.findByPk(chargerId))
    throw new InvalidRequestError("No charger found")
  
  if (!req.body.command)
    throw new InvalidRequestError("Missing required command")
  
  if (req.body.command === "ClearChargingProfile") {
    const { ChargingProfile } = res.locals.models;
    ChargingProfile.update({ cleared: true }, {
      where: {
        ChargerId: chargerId
      }
    });
  }
  
  const command = await OneTimeCommand.create({...req.body, ChargerId: chargerId});

  return res.json(shared.makeResponse(command));
}));

// update a one time command (marking complete)
router.patch('/', shared.asyncWrapper(async (req, res) => {

  const { OneTimeCommand } = res.locals.models;

  if (!req.body.id)
    throw new InvalidRequestError("Missing command id")


  await OneTimeCommand.update({ ...req.body, handled: req.body.handled ?? true }, {
    where: {
      id: req.body.id,
    }
  });
  return res.json(shared.makeResponse("Success"))
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { OneTimeCommand } = res.locals.models;
  if (!req.body.id) {
    throw new InvalidRequestError("Did not include required one time command id");
  }
  try {
    await OneTimeCommand.destroy({
      where: {
        id: req.body.id,
      },
    });
  } catch (err) {
    throw new InvalidRequestError(err);
  }
  return res.json(shared.makeResponse("Success"));
}));

module.exports = router;
