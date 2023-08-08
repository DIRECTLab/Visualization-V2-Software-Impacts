const router = require("express").Router();
const { Op } = require("sequelize");
const shared = require('../../shared');
const moment = require("moment/moment");
const { InvalidRequestError } = require("../../shared/error");

// Gets all profiles for a charger
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { ChargingProfile } = res.locals.models;
  const startTime = req.query.start;
  const endTime = req.query.end;

  if (!req.query.id) {
    return res.json(shared.makeResponse({}, "Did not include a charger id"))
  }

  if (req.query.current) {
    const profile = await ChargingProfile.findOne({
      where: {
        ChargerId: req.query.id,
      },
      order: [ ['createdAt', 'DESC'] ]
    });
  
    if (profile?.cleared){
      return res.json(shared.makeResponse(null));
    }
  
    return res.json(shared.makeResponse(profile));
  }

  if (!req.query.limit) {
    return res.json(shared.makeResponse({}, "Did not include a limit"))
  }

  const profiles = await ChargingProfile.findAll({
    where: {
      ChargerId: req.query.id,
      createdAt: {
        [Op.gte]: moment(startTime ?? 0).toDate(),
        [Op.lte]: moment(endTime).toDate()
      }
    },
    limit: req.query.limit,
    order: [ ['createdAt', 'DESC'] ]
  });

  return res.json(shared.makeResponse(profiles));
}));

// Post a new charge profile for a given charger
router.post('/', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.body.ChargerId;

  if (!chargerId) {
    return res.json(shared.makeResponse({}, "Missing charger id"))
  }

  const { Charger, ChargingProfile } = res.locals.models;

  const requiredParams = ["chargingProfileId", "stackLevel", "chargingProfilePurpose", "chargingProfileKind", "chargingSchedule", "connectorId"]

  const missing = []

  requiredParams.forEach(param => {
    if (req.body[param] === null) missing.push(`Missing required parameter: ${param}`);
  });

  if (missing.length)
    return res.json(shared.makeResponse({}, missing));

  const allowedPurposes = ["ChargePointMaxProfile", "TxDefaultProfile", "TxProfile"];
  const allowedKinds = ["Absolute", "Recurring", "Relative"];

  if (!allowedPurposes.includes(req.body.chargingProfilePurpose))
    return res.json(shared.makeResponse({}, `Purpose (${req.body.chargingProfilePurpose}) is not a valid purpose`));
  
  if (!allowedKinds.includes(req.body.chargingProfileKind))
    return res.json(shared.makeResponse({}, `Kind (${req.body.chargingProfileKind}) is not a valid kind`));

  if (!Charger.findByPk(chargerId))
    return res.json(shared.makeResponse({}, "No charger was found"));
  
  const profile = await ChargingProfile.create({...req.body, manualControl: req.body.manualControl ?? false});


  return res.json(shared.makeResponse(profile));

}))


// Updates handle on profiles for a charger
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.body.ChargerId;
  const { ChargingProfile } = res.locals.models;

  if (!chargerId) {
    return res.json(shared.makeResponse({}, "No charger id was included in the body"));
  }
  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "No profile id to the DB entry was included in the body"));
  }

  if (req.body.accepted) {
    const profiles = await ChargingProfile.update(
      {
        handled: true,
        accepted: req.body.accepted,
      },
      {
        where: {
          ChargerId: chargerId,
          id: req.body.id,
        }
      }
      
    );
    return res.json(shared.makeResponse(profiles));
  }
  else if (req.body.cleared) {
    const profiles = await ChargingProfile.update(
      {  
        cleared: req.body.cleared,
        handled: true 
      },
      {
        where: {
          ChargerId: chargerId,
          id: req.body.id,
        }
      }
    );
    return res.json(shared.makeResponse(profiles));
  }
  else {
    if (req.body.manual) {
      console.log("MANUAL CONTROL ACTIVATED");
    }
    
    const profiles = await ChargingProfile.update(
      {  
        handled: true,
        manualControl: req.body.manual ?? false
      },
      {
        where: {
          ChargerId: chargerId,
          id: req.body.id,
        }
      }
    );
    return res.json(shared.makeResponse(profiles));
  }
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { ChargingProfile } = res.locals.models;
  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "Missing required id"));
  }
  try{
    await ChargingProfile.destroy({
      where: {
        id: req.body.id
      },
    });
  } catch (err) {
    throw new InvalidRequestError(err);
  }

  return res.json(shared.makeResponse("Success"));
}))






module.exports = router;
