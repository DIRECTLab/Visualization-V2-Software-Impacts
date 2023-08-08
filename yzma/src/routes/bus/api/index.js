const { default: axios } = require('axios');


const methods = {
  get: 'get',
};

const requestGenerator = (getBase) => (method, uri) => (data = {}) => {
  let requestPromise;
  switch (method) {
    case methods.get:
      requestPromise = axios[method](`${getBase()}/${uri}`, {...data});
      break;
    default:
      requestPromise = axios[method](`${getBase()}/${uri}`, data);
      break;
  }
  return requestPromise
    .then(({ data }) => data)
    .catch(e => e.response.data);
};

// const getApiBase = () => 'http://144.39.204.242:11236';
const getApiBase = () => 'http://localhost:11238'
const r = requestGenerator(getApiBase);

const api = {
  newFlyer: {
    get: r('get', 'new-flyer'),
    getRoutes: r('get', 'new-flyer/route'),
  },
  viriciti: {
    get: r('get', 'viriciti'),
    getCurrent: r('get', 'viriciti/current'),
    getEnergyUsedPerDay: r('get', 'viriciti/energy-used-per-day'),
    getGps: r('get', 'viriciti/gps'),
    getOdo: r('get', 'viriciti/odo'),
    getPower: r('get', 'viriciti/power'),
    getSoc: r('get', 'viriciti/soc'),
    getSpeed: r('get', 'viriciti/speed'),
    getVoltage: r('get', 'viriciti/voltage'),
  }
}

module.exports = api
