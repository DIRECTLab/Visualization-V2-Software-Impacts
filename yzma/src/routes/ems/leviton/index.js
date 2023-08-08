const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const data = await api.leviton.get({ params: {...req.query}});
  return res.json(data);
}));


///// LEGACY
router.get('/evr/current', shared.asyncWrapper(async (req, res) => {
  const data = await api.leviton.get({ params: {current: true}});
  return res.json(data);
}));

router.get('/evr', shared.asyncWrapper(async (req, res) => {
  const data = await api.leviton.get({ params: {...req.query}});
  return res.json(data);
}));
/////

module.exports = router;