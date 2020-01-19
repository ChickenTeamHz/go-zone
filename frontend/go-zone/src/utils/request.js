import axios from 'axios';

// 全局默认配置
axios.defaults.baseURL = '/api';
axios.defaults.timeout = 10000;

function transformUrl(url, id) {
  if (url.indexOf('{0}') !== -1) {
    return url.replace('{0}', id)
  } else {
    return url
  }
}

// 请求body拦截器
axios.interceptors.request.use(config => {
  let newConfig = config;
  newConfig.headers['token'] = sessionStorage.getItem('token')
  newConfig.headers['user'] = sessionStorage.getItem('name')
  return newConfig;
});

// 返回拦截器
axios.interceptors.response.use(config => {
  if (config.headers['content-type'] === 'application/octet-stream') {
    return {
      data: config.data,
      type: 'file'
    }
  } else {
    return config.data
  }
});


const get = (url, parmas, others = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(transformUrl(url, others.id), {
      params: parmas,
      ...others
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err);
      });
  });
};

const Delete = (url, parmas, others) => {
  return new Promise((resolve, reject) => {
    axios.delete(transformUrl(url, others.id), {
      params: parmas,
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err);
      });
  });
};
const post = (url, params, others = {}) => {
  return new Promise((resolve, reject) => {
    axios.post(transformUrl(url, others.id), params)
      .then(res => {
        if (res) {
          resolve(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const put = (url, params, others = {}) => {
  return new Promise((resolve, reject) => {
    axios.put(transformUrl(url, others.id), params)
      .then(res => {
        if (res) {
          resolve(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

export default { Delete, get, post, put};
