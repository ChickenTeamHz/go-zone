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
      const res = yield call(UserService.login, payload);
      if (res.code === 0) {
        let token = res.data.token
        window.sessionStorage.setItem('token', token)
      } else {
        return res.code
      }
      
    },
    * register({ payload }, { call }) {
      const res = yield call(UserService.register, payload);
      return res.code
    },
     // 路由跳转
     * toLoginPage ({ payload }, { put }) {
       console.log(333)
      yield put( routerRedux.push('/login'))
    },
    getCode() {
      return Math.trunc(Math.random() * 9000 + 1000)
    }
  },

  reducers: {
    changeState(state, {payload}) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
