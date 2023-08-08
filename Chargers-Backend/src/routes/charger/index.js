const router = require("express").Router();
const shared = require('../../shared');
const { InvalidRequestError } = require("../../shared/error");



// Get all chargers
router.get('/', shared.asyncWrapper(async (req, res) => {

  const { Charger } = res.locals.models;

  if (req.query.id) {
    const charger = await Charger.findByPk(req.query.id);
    return res.json(shared.makeResponse(charger));
  }

  const chargers = await Charger.findAll();
  return res.json(shared.makeResponse(chargers));
}));

// Add new charger
router.post('/', shared.asyncWrapper(async (req, res) => {

  const { Charger } = res.locals.models;

  const { id, chargerName } = req.body;

  if (!id)
    return res.json(shared.makeResponse({}, "Missing required id"));
  
  if (await Charger.findByPk(id))
    return res.json(shared.makeResponse({}, "Charger with given id already exists"));
  
  try {
    const charger = await Charger.create(req.body);
    return res.json(shared.makeResponse(charger));
  } catch (err) {
    throw new InvalidRequestError(err)
  }
  

}));

// Update a charger
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;

  if (req.body.id){
    try {
      await Charger.update(req.body, {
        where: {
          id: req.body.id,
        }
      });
    } catch (err) {
      throw new InvalidRequestError(err)
    }
    return res.json(shared.makeResponse("Success"));
  } else {
    return res.json(shared.makeResponse({}, "Missing required id"));
  }
}));

// Delete a charger
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;

  if (req.body.id){
    try{
      await Charger.destroy({
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


module.exports = router;
