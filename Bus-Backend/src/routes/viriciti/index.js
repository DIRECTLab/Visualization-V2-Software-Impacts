const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');

/**
 * Exposes route to get viriciti buses that we know about
 */
router.get("/", shared.asyncWrapper(async (req, res) => {
  const { Viricitibus } = res.locals.models;

  if (req.query.vid) {
    const bus = await Viricitibus.findOne({
      where: {
        vid: req.query.vid
      }
    });
    if (!bus) {
      throw new InvalidRequestError("No bus with that id was found");
    }
    return res.json(shared.makeResponse(bus));
  }


  const entries = await Viricitibus.findAll({
    order: [
      ['createdAt', 'DESC'],
    ]
  });
Viricitibus
  if (!entries) {
      throw new InvalidRequestError("No buses were found");
  }

  return res.json(shared.makeResponse(entries));
}));

router.post("/", shared.asyncWrapper(async (req, res) => {
  const { Viricitibus } = res.locals.models;

    const requiredParams = ['id', 'vid', 'vin', 'name']
    const missingParams = requiredParams.filter(param => req.body[param] === undefined || req.body[param] === null)

    if (missingParams.length > 0) {
        throw new InvalidRequestError(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    const vid = req.body.vid;
    const viricitiBus = await Viricitibus.findByPk(vid);
    
    if (!viricitiBus) {
      try {
        const newBus = await Viricitibus.create(req.body);
        return res.json(shared.makeResponse(newBus));
      } catch (err) {
        throw new InvalidRequestError(err);
      }
    }
    return res.json(shared.makeResponse(viricitiBus));

}));

// Update a bus
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Viricitibus } = res.locals.models;
  const vid = req.body.vid;
  if (!vid) throw new InvalidRequestError("Missing required vid");
  try {
    await Viricitibus.update(req.body, {
      where: {
        vid: vid,
      }
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));

/**
 * URL to remove a bus
 */
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const vid = req.body.vid;

  if (!vid) throw new InvalidRequestError("Missing required id");
  const { Viricitibus } = res.locals.models;

  try {
    Viricitibus.destroy({
      where: {
        vid: vid
      }
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err)
  }
}));


module.exports = router;