const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const data = await api.location.get({ params: { ...req.query } });
  return res.json(data);
}));

//// LEGACY /////
router.get('/:id', shared.asyncWrapper(async (req, res) => {
  const data = await api.location.get({ params: { ...req.query, id: req.params.id } });
  return res.json(data);
}));

/////////////////

module.exports = router;