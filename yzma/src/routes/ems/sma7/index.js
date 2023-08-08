const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const data = await api.sma7.get({ params: {...req.query}});
  return res.json(data);
}));

module.exports = router;