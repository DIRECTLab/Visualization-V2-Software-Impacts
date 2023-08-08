const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { Op, fn, col } = require('sequelize');
const moment = require("moment/moment");

/**
 * Exposes an endpoint to query all model names
 */
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Fronius } = res.locals.models;

  if (req.query.model) {
    const id = req.query.model.toLowerCase();
    const startTime = req.query.start;
    const endTime = req.query.end;

    if (req.query.alive) {
      const alive = await Fronius.findOne({
          where: {
              model: id
          },
          order: [['createdAt', 'DESC']],
      })

      if (alive.createdAt < moment.utc().subtract(21, 'seconds')) {
          return res.json(shared.makeResponse({'active': false}))
      }

      return res.json(shared.makeResponse({'active': true}))
    }
    
    let fronius;
    if (req.query.page && req.query.pageSize) {

      const offset = req.query.page * req.query.pageSize;
      const limit = req.query.pageSize;
  
      fronius = await Fronius.findAll({
        where: {
          updatedAt: {
            [Op.gte]: moment(startTime ?? 0).toDate(),
            [Op.lte]: moment(endTime).toDate(),
          },
          model: id,
        },
        limit,
        offset,
        order: [['createdAt', 'DESC']],
      })  
    } else{

      if (!req.query.limit) {
        throw new InvalidRequestError("No limit was included with the request");
      }
      fronius = await Fronius.findAll({
        where: {
          model: id,
          updatedAt: {
            [Op.gte]: moment(startTime ?? 0).toDate(),
            [Op.lte]: moment(endTime).toDate(),
          }
        },
        limit: req.query.limit,
        order: [['createdAt', 'DESC']],
      })
    }

    if (!fronius) {
      throw new InvalidRequestError("No fronius data was found");
    }
    return res.json(shared.makeResponse(fronius));
  }


  const values = await Fronius.findAll({
    where: {
      model: {
        [Op.ne]: null
      }
    },
    attributes: [
      [fn('DISTINCT', col('model')), 'model'],
      'model'
    ],
  });

  if (!values) {
    throw new InvalidRequestError("There are no fronius models reporting");
  }

  return res.json(shared.makeResponse(values));
}));


/**
 * POST endpoint for Fronius
 */
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Fronius } = res.locals.models;

  const entry = await Fronius.create(req.body);

  if (!entry) {
      throw new InvalidRequestError("No Yaskawa entry was created")
  }

  return res.json(shared.makeResponse(entry));
}))

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Fronius } = res.locals.models;

  if (req.body.id){
    try{
      await Fronius.destroy({
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
  const { Fronius } = res.locals.models;

  if (req.body.id){
    try {
      await Fronius.update(req.body, {
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



module.exports = router;