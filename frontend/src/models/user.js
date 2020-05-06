import { router } from 'umi';
import { fetchLogin, fetchRegister, fetchForgetRegister, fecthProfile } from '../services/api';
import { getPageQuery } from '../utils/utils';
import { setToken } from '../utils/authToken';

export default {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetchLogin({ payload }, { call }) {
      const response = yield call(fetchLogin, payload);
      if(response && response.code === 0){
        const { token } = response.data || {};
        setToken(token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        router.replace(redirect || '/');
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
    *fetchForgetRegister({ payload }, { call }) {
      const response = yield call(fetchForgetRegister, payload);
      if(response && response.code === 0){
        return Promise.resolve(response.data || {})
      }
      return Promise.reject(response.message || '提交失败');
    },
    *fetchProfile(_,{ call, put }) {
      const response = yield call(fecthProfile);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveCurrentUser',
          payload: response.data || {},
        })
        return Promise.resolve();
      }
      return Promise.reject(response.message || '请求失败');
    },
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },
  },
};

