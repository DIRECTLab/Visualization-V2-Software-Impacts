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
const getApiBase = () => 'http://localhost:11239'
const r = requestGenerator(getApiBase);

const api = {
  charger: ({
    get: r('get', 'charger'),
  }),
  status: ({
    get: r('get', 'charger/status'),
  }),
  profile: ({
    get: r('get', 'charger/profile'),
  }),
  location: ({
    get: r('get', 'charger/location'),
  }),
  transaction: ({
    get: r('get', 'charger/transaction'),
  }),
}

module.exports = api
