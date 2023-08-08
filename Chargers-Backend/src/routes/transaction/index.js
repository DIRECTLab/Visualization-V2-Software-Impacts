const router = require("express").Router();
const { Op } = require("sequelize");
const shared = require('../../shared');
const { InvalidRequestError } = require("../../shared/error");
const moment = require('moment');

router.get('/', shared.asyncWrapper(async (req, res) => {

  const { Transaction, Charger, MeterValue, SampledValue } = res.locals.models;
  
  startTime = req.query.start;
  endTime = req.query.end;

  if (!req.query.limit) {
    return res.json(shared.makeResponse({}, "Required limit not included"))
  }

  if (req.query.id) {
    const chargerId = req.query.id;
    // Mark transacations from a day ago as not current, in case the stop transaction was missed
    await Transaction.update({ current: false }, {
      where: {
        ChargerId: chargerId,
        timestampStart: {
          limit: req.query.limit,
          [Op.lte]: moment().subtract(1, 'days').toDate(),
        },
      },
    });
    let transactions = await Transaction.findAll({
      where: {
        timestampStart: {
          [Op.gte]: moment(startTime ?? 0).toDate(),
          [Op.lte]: moment(endTime).toDate()
        },
        ChargerId: chargerId,
      },
      limit: req.query.limit,
      order: [ ['timestampStart', 'DESC'] ],
      include: [{ model: Charger } ],
    });
    return res.json(shared.makeResponse(transactions));
  }

  // Mark transacations from a day ago as not current, in case the stop transaction was missed
  await Transaction.update({ current: false }, {
    where: {
      timestampStart: {
        limit: req.query.limit,
        [Op.lte]: moment().subtract(1, 'days').toDate(),
      },
    },
  });
  let transactions = await Transaction.findAll({
    where: {
      timestampStart: {
        [Op.gte]: moment(startTime ?? 0).toDate(),
        [Op.lte]: moment(endTime).toDate()
      }
    },
    limit: req.query.limit,
    order: [ ['timestampStart', 'DESC'] ],
    include: [{ model: Charger } ],
  });

  return res.json(shared.makeResponse(transactions));
}))

// New transaction
router.post('/', shared.asyncWrapper(async (req, res) => {
  const chargerId = req.body.chargerId;

  const { Transaction, Charger } = res.locals.models;

  const { connectorId, meterStart, timestampStart } = req.body;

  if (!chargerId) {
    throw new InvalidRequestError("Missing required charger Id");
  }

  let errors = [];
  if (!connectorId)
    errors.push("Missing connectorId");
  if (!meterStart)
    errors.push("Missing meter start value (meterStart)");
  if (!timestampStart)
    errors.push("Missing start timestamp (timestamp)");
  
  const charger = await Charger.findByPk(chargerId);
  if (!charger)
    errors.push("No charger with the given id exists");

  if (errors.length)
    throw new InvalidRequestError(errors.join('; '))

  const transaction = await Transaction.create({...req.body, current: true, ChargerId: chargerId });

  return res.json(shared.makeResponse(transaction));
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Transaction } = res.locals.models;
  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "Missing required id"));
  }
  try{
    await Transaction.destroy({
      where: {
        id: req.body.id
      },
    });
  } catch (err) {
    throw new InvalidRequestError(err);
  }

  return res.json(shared.makeResponse("Success"));
}))

router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Transaction } = res.locals.models;

  if (req.body.meterStop){
    const transaction = await Transaction.findByPk(req.body.transactionId)
    if (transaction) {
      const powerConsumed = req.body.meterStop - transaction?.meterStart ?? 0.0;
      await Transaction.update({ ...req.body, powerConsumed: powerConsumed, current: false }, { where: { id: req.body.transactionId } });
    }
  }
  else{
    await Transaction.update(req.body, { where: { id: req.body.transactionId } });
  }

  return res.json(shared.makeResponse("Success"));

}))


module.exports = router;