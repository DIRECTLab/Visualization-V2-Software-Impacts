// This is where you actually define base routes, all the routes in the file
// example/index.js will be under /example, since we defined it below
// as you add new folders and routes, make sure this is updated
const router = require('express').Router();

// TODO: Add the rest of the routes here
router.use('/user', require('./user'));
router.use('/new-flyer', require('./new-flyer'));
router.use('/new-flyer/route', require('./new-flyer/routes'));
router.use('/viriciti', require('./viriciti'));
router.use('/viriciti/current', require('./viriciti/current'));
router.use('/viriciti/energy-used-per-day', require('./viriciti/energyUsedPerDay'));
router.use('/viriciti/gps', require('./viriciti/gps'));
router.use('/viriciti/odo', require('./viriciti/odo'));
router.use('/viriciti/power', require('./viriciti/power'));
router.use('/viriciti/soc', require('./viriciti/soc'));
router.use('/viriciti/speed', require('./viriciti/speed'));
router.use('/viriciti/voltage', require('./viriciti/voltage'));






module.exports = router;