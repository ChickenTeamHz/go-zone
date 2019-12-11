// import { routerRedux } from 'dva/router'

export default {

  namespace: 'global',

  state: {
    type: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        console.log('location is: %o', location);
        console.log('重定向接收参数：%o', location.state)
        dispatch({
          type: 'redirect',
          payload: location.state,
        })
      });
    },
  },

  effects: {
     // 路由跳转
     * redirect ({ payload }, { put }) {
      yield console.log(payload)
    },
  },

  reducers: {
    changeState(state, {payload}) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
