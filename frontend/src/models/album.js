import {
  fetchCreateAlbum,
  fetchAlbumList,
  fetchDeleteAlbum,
  fetchUpdateAlbum,
  fetchUploadPhotos,
  fetchPhotos,
  fetchDeletePhotos,
  fetchMovePhotos,
} from '../services/api';

export default {
  namespace: 'album',
  state: {
    list: [],
    detail: {
      album: {},
      photoList: [],
    },
  },
  effects: {
    // 创建相册
    *fetchCreateAlbum({ payload },{ call }) {
      const response = yield call(fetchCreateAlbum,payload);
      if(response && response.code === 0) {
        return Promise.resolve('创建成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取相册列表
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
    // 删除相册
    *fetchDeleteAlbum({ payload }, { call }) {
      const response = yield call(fetchDeleteAlbum, payload);
      if(response && response.code === 0) {
        return Promise.resolve('删除成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 更新相册
    *fetchUpdateAlbum({ payload }, { call }) {
      const response = yield call(fetchUpdateAlbum, ...payload);
      if(response && response.code === 0) {
        return Promise.resolve('修改成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 上传照片
    *fetchUploadPhotos({ payload }, { call }) {
      const response = yield call(fetchUploadPhotos, ...payload);
      if(response && response.code === 0) {
        return Promise.resolve('上传成功');
      }
      return Promise.reject(response.message || '上传失败');
    },
    // 获取相册照片
    *fetchPhotos({ payload },{ call, put }) {
      const response = yield call(fetchPhotos, payload);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveDetail',
          payload: response.data || {},
        })
        return Promise.resolve();
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 删除照片
    *fetchDeletePhotos({ payload }, { call }) {
      const response = yield call(fetchDeletePhotos, ...payload);
      if(response && response.code === 0) {
        return Promise.resolve('删除成功');
      }
      return Promise.reject(response.message || '删除失败');
    },
    // 移动照片
    *fetchMovePhotos({ payload }, { call }) {
      const response = yield call(fetchMovePhotos, ...payload);
      if(response && response.code === 0) {
        return Promise.resolve('移动照片成功');
      }
      return Promise.reject(response.message || '移动照片失败');
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload || [],
      };
    },
    saveDetail(state, { payload }) {
      const { album = {}, photoList = []} = payload;
      return {
        ...state,
        detail: {
          album,
          photoList,
        },
      }
    },
    clearDetail(state) {
      return {
        ...state,
        detail: {
          album: {},
          photoList: [],
        },
      }
    },
  },
};

