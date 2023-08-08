const router = require('express').Router();
const  Sequelize = require('sequelize');
const { Op } = require('sequelize');
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const moment = require('moment');




/**
 * Returns all registered buses
 */
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Bus } = res.locals.models;

  if (req.query.id) {
    const bus = await Bus.findOne({
      where: {
        id: req.query.id
      }
    });
    if (!bus) {
      throw new InvalidRequestError("No bus with that id was found");
    }
    return res.json(shared.makeResponse(bus));
  }

  const buses = await Bus.findAll({
      order: [
          ['createdAt', 'DESC'],
      ]
  });

  if (!buses) {
      throw new InvalidRequestError("No buses found");
  }

  return res.json(shared.makeResponse(buses));

}));


/**
 * URL to add a new bus to the database.
 */
router.post('/', shared.asyncWrapper(async (req, res) => {
  const id = req.body.id;

  const { Bus } = res.locals.models;

  if (!id) {
    throw new InvalidRequestError("Missing required id");
  }

  if (await Bus.findByPk(id)) {
    throw new InvalidRequestError("Bus with that id already exists");
  }

  try {
    const bus = await Bus.create(req.body);
    return res.json(shared.makeResponse(bus));
  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

/**
 * URL to remove a bus
 */
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const id = req.body.id;

  if (!id) throw new InvalidRequestError("Missing required id");
  const { Bus } = res.locals.models;

  try {
    Bus.destroy({
      where: {
        id: id
      }
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));


module.exports = router;