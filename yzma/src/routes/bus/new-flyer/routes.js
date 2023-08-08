const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const splitUrl = req.originalUrl.split('/')

  if (splitUrl[2] && !req.query.id) {
    const data = await api.newFlyer.getRoutes({ params: { ...req.query, id: splitUrl[2].split('?')[0] } });
    return res.json(data);  
  }

  const data = await api.newFlyer.getRoutes({ params: { ...req.query } });
  return res.json(data);
}));

//// LEGACY /////

// Route to get the last route entry for the legacy code
router.get('/:id', shared.asyncWrapper(async (req, res) => {

  const data = await api.newFlyer.getRoutes({ params: { ...req.query, id: req.params.id, limit: req.query?.limit ?? 1 } });
  return res.json(data);
}));

// Route to get all of the route entries for the legacy code
router.get('/:id/all', shared.asyncWrapper(async (req, res) => {
  const splitUrl = req.originalUrl.split('/')
  const data = await api.newFlyer.getRoutes({ params: { ...req.query, id: splitUrl[2], limit: req.query?.limit ?? 1 } });
  return res.json(data);
}));

router.get('/:id/useful', shared.asyncWrapper(async (req, res) => {
  const splitUrl = req.originalUrl.split('/')
  const data = await api.newFlyer.getRoutes({ params: { ...req.query, id: splitUrl[2], limit: req.query?.limit ?? 1, useful: true } });
  return res.json(data);
}));

/////////////////

module.exports = router;