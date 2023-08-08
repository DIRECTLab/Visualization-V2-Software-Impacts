// This is where you actually define base routes, all the routes in the file
// example/index.js will be under /example, since we defined it below
// as you add new folders and routes, make sure this is updated
const router = require('express').Router();

// TODO: Add the rest of the routes here
router.use('/user', require('./user'));
router.use('/charger', require('./charger'));
router.use('/charger/status', require('./chargerStatus'));
router.use('/charger/profile', require('./chargingProfile'));
router.use('/charger/location', require('./location'));
router.use('/charger/transaction', require('./transaction'));
router.use('/commands', require('./oneTimeCommands'));


module.exports = router;