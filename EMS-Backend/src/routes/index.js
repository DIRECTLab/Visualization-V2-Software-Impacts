// This is where you actually define base routes, all the routes in the file
// example/index.js will be under /example, since we defined it below
// as you add new folders and routes, make sure this is updated
const router = require('express').Router();

// TODO: Add the rest of the routes here
router.use('/user', require('./user'));
router.use('/fronius', require('./fronius'));
router.use('/gustav', require('./gustavKlein'));
router.use('/leviton', require('./leviton'));
router.use('/sma7', require('./sma7'));
router.use('/sma50', require('./sma50'));
router.use('/yaskawa', require('./yaskawa'));

module.exports = router;