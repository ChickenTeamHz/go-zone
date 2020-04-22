import { fetchLogin, fetchRegister } from '../services/api';

export default {
  namespace: 'user',
  state: {},
  effects: {
    *fetchLogin({ payload }, { call }) {
      const response = yield call(fetchLogin, payload);
      if(response && response.code === 0){
        return Promise.resolve(response.data || {})
      }
      return Promise.reject(response.message || '登录失败');
    },
    *fetchRegister({ payload }, { call }) {
      const response = yield call(fetchRegister, payload);
      if(response && response.code === 0){
        return Promise.resolve('注册成功')
      }
      return Promise.reject(response.message || '注册失败');
    },
  },
};

