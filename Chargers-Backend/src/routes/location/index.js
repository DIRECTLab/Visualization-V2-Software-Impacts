const router = require("express").Router();
const shared = require('../../shared');
const { InvalidRequestError } = require("../../shared/error");


// Get all locations
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Location, Charger } = res.locals.models;

  if (req.query.id) {
    const location = await Location.findByPk(req.query.id, {
      include: [Charger]
    });
    return res.json(shared.makeResponse(location));
  }

  const locations = await Location.findAll({
    include: [Charger]
  });
  return res.json(shared.makeResponse(locations));
}));

// Create new location
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Location } = res.locals.models;
  if (!req.body.name) {
    return res.json(shared.makeResponse({}, "No name was given"))
  }

  if (await Location.findOne({ where: { name: req.body.name }}) !== null)
    return res.json(shared.makeResponse({}, 'Location already exists'));
  const location = await Location.create(req.body);
  return res.json(shared.makeResponse(location));
}));

// Patch location
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Location } = res.locals.models;

  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "No location id was given"))
  }

  const location = await Location.update(req.body, {
    where: {
      id: req.body.id
    }
  });
  return res.json(shared.makeResponse(location));
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Location } = res.locals.models;
  if (!req.body.id) {
    return res.json(shared.makeResponse({}, "Missing required id"));
  }
  try{
    await Location.destroy({
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
