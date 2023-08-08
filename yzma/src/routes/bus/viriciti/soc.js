const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const data = await api.viriciti.getSoc({ params: { ...req.query } });
  return res.json(data);
}));

//// LEGACY /////
router.get('/:id', shared.asyncWrapper(async (req, res) => {
  const data = await api.viriciti.getSoc({ params: { ...req.query, vid: req.params.id }});
  return res.json(data);
}));

/////////////////

module.exports = router;