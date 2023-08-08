// This is where you actually define base routes, all the routes in the file
// example/index.js will be under /example, since we defined it below
// as you add new folders and routes, make sure this is updated
const router = require('express').Router();

// EMS
router.use('/user', require('./user'));
router.use('/fronius', require('./ems/fronius'));
router.use('/gustav', require('./ems/gustavKlein'));
router.use('/leviton', require('./ems/leviton'));
router.use('/sma7', require('./ems/sma7'));
router.use('/sma50', require('./ems/sma50'));
router.use('/yaskawa', require('./ems/yaskawa'));
//

// Bus
router.use('/new-flyer', require('./bus/new-flyer'));
router.use('/new-flyer/route', require('./bus/new-flyer/routes'));

router.use('/viriciti', require('./bus/viriciti'));
router.use('/viriciti/current', require('./bus/viriciti/current'));
router.use('/viriciti/energy-used-per-day', require('./bus/viriciti/energyUsedPerDay'));
router.use('/viriciti/gps', require('./bus/viriciti/gps'));
router.use('/viriciti/odo', require('./bus/viriciti/odo'));
router.use('/viriciti/power', require('./bus/viriciti/power'));
router.use('/viriciti/soc', require('./bus/viriciti/soc'));
router.use('/viriciti/speed', require('./bus/viriciti/speed'));
router.use('/viriciti/voltage', require('./bus/viriciti/voltage'));
//

// Chargers
router.use('/charger', require('./charger/charger'));
router.use('/location', require('./charger/location'));
router.use('/profile', require('./charger/profile'));
router.use('/status', require('./charger/status'));
router.use('/transaction', require('./charger/transaction'));
//


/////// LEGACY ROUTES /////////
// EMS
router.use('/evr/fronius', require('./ems/fronius'));
router.use('/evr/gustav', require('./ems/gustavKlein'));
router.use('/evr/leviton', require('./ems/leviton'));
router.use('/evr/sma7', require('./ems/sma7'));
router.use('/evr/sma50', require('./ems/sma50'));
router.use('/evr/yaskawa', require('./ems/yaskawa'));
//

// Bus
router.use('/bus', require('./bus/new-flyer'));
router.use('/bus/:id', require('./bus/new-flyer/routes'));

router.use('/viriciti/energy_used_per_day', require('./bus/viriciti/energyUsedPerDay'));
//

// Chargers
router.use('/charger/:id', require('./charger/charger'));
router.use('/charger/:id/profile', require('./charger/profile'));
router.use('/charger/:id/status', require('./charger/status'));
router.use('/charger/:id/transaction', require('./charger/transaction'));
router.use('/charger/transaction', require('./charger/transaction'));

//

module.exports = router;