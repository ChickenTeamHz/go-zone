import { routerRedux } from 'dva/router'
import service from '../services/index'

const { 
  UserService
}  = service

export default {

  namespace: 'login',

  state: {
    type: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {

    },
  },

  effects: {
    * login({ payload }, { call }) {
      console.log(UserService)
      const res = yield call(UserService.login, payload);
      console.log(res)
    },
     // 路由跳转
     * toLoginPage ({ payload }, { put }) {
       console.log(333)
      yield put( routerRedux.push('/login'))
    },
  },

  reducers: {
    changeState(state, {payload}) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
