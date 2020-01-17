import { routerRedux } from 'dva/router'

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
