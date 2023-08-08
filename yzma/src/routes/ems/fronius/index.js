const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const data = await api.fronius.get({ params: {...req.query}});
  return res.json(data);
}));

////// LEGACY
router.get('/:id', shared.asyncWrapper(async (req, res) => {
  const id = req.params.id;
  const limit = req.query?.limit ?? 1;
  const data = await api.fronius.get({ params: {model: id, limit: limit}});
  return res.json(data);
}));
//////

module.exports = router;