const shared = require('../../../shared');
const api = require('../api');
const router = require('express').Router();



router.get('/', shared.asyncWrapper(async (req, res) => {
  const splitUrl = req.originalUrl.split('/')
  let data;
  if (splitUrl[2]){ // LEGACY
    data = await api.status.get({ params: { ...req.query, id: splitUrl[2] } });
  } else { // New method
    data = await api.status.get({ params: { ...req.query } });
  }
  return res.json(data);
}));


module.exports = router;