import { fetchCreateAlbum, fetchAlbumList, fetchDeleteAlbum, fetchUpdateAlbum } from '../services/api';

export default {
  namespace: 'album',
  state: {
    list: [],
  },
  effects: {
    *fetchCreateAlbum({ payload },{ call }) {
      const response = yield call(fetchCreateAlbum,payload);
      if(response && response.code === 0) {
        return Promise.resolve('创建成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    *fetchAlbumList(_,{ call, put }) {
      const response = yield call(fetchAlbumList);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveList',
          payload: response.data || [],
        })
        return Promise.resolve();
      }
      return Promise.reject(response.message || '请求失败');
    },
    *fetchDeleteAlbum({ payload }, { call }) {
      const response = yield call(fetchDeleteAlbum, payload);
      if(response && response.code === 0) {
        return Promise.resolve('删除成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    *fetchUpdateAlbum({ payload }, { call }) {
      const response = yield call(fetchUpdateAlbum, ...payload);
      if(response && response.code === 0) {
        return Promise.resolve('修改成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload || [],
      };
    },
  },
};

