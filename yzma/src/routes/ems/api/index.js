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
    .catch(e => {
      // if (!e.response) {
      //   console.error(e)
      // }
      return e.response?.data ?? [];
    });
};

// const getApiBase = () => 'http://144.39.204.242:11236';
const getApiBase = () => 'http://localhost:11237'
const r = requestGenerator(getApiBase);

const api = {
  yaskawa: ({
    get: r('get', 'yaskawa'),
  }),
  gustav_klein: ({
    get: r('get', 'gustav'),
  }),
  fronius: ({
    get: r('get', 'fronius'),
  }),
  sma50: ({
    get: r('get', 'sma50'),
  }),
  sma7: ({
    get: r('get', 'sma7'),
  }),
  leviton: ({
    get: r('get', 'leviton'),
  })
}

module.exports = api
