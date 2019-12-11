
export default {

  namespace: 'global',

  state: {
    type: 1
  },

  subscriptions: {
    setup ({ dispatch, history }) {

    },
  },

  effects: {
  },

  reducers: {
    changeState(state, {payload}) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
