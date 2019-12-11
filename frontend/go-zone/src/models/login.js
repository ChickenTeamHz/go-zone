
export default {

  namespace: 'login',

  state: {
    type: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        console.log('location is: %o', location);
        console.log('重定向接收参数：%o', location.state)
        // 调用 effects 属性中的 query 方法，并将 location.state 作为参数传递 
        dispatch({
          type: 'query',
          payload: location.state,
        })
      });
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      yield console.log('payload is: %o', payload);
   }
  },

  reducers: {
    changeState(state, {payload}) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
