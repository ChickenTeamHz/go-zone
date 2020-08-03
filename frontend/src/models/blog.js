import {
  fetchUploadImg, fetchCreateArtical, fetchSaveArtical, fetchTagList, fetchCategoryList, fetchArticals, fetchArticalDetail, fetchUpdateArticalLikes, fetchArticalLikes, fetchCreateComment, fetchArticalComments,
} from '../services/api';

export default {
  namespace: 'blog',
  state: {
    list: {
      items: [],
      total: 0,
    },
    detail: {},
    tags: [],
    categorys: [],
    comments: [],
  },
  effects: {
    // 上传图片
    *fetchUploadImg({ payload },{ call }) {
      const response = yield call(fetchUploadImg,payload);
      if(response && response.code === 0) {
        return Promise.resolve(response.data || {});
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 发布文章
    *fetchCreateArtical({ payload },{ call }) {
      const response = yield call(fetchCreateArtical,payload);
      if(response && response.code === 0) {
        return Promise.resolve('发布成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 保存文章到草稿箱
    *fetchSaveArtical({ payload },{ call }) {
      const response = yield call(fetchSaveArtical,...payload);
      if(response && response.code === 0) {
        return Promise.resolve(response.data || '保存成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取所有标签
    *fetchTagList(_,{ call, put }) {
      const response = yield call(fetchTagList);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveTags',
          payload: response.data || [],
        })
        return Promise.resolve('请求成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取所有分类
    *fetchCategoryList(_,{ call, put }) {
      const response = yield call(fetchCategoryList);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveCategorys',
          payload: response.data || [],
        })
        return Promise.resolve('请求成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取文章列表
    *fetchArticals({ payload },{ call, put }) {
      const response = yield call(fetchArticals, payload);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveList',
          payload: response.data || {},
        })
        return Promise.resolve('请求成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取文章详情
    *fetchArticalDetail({ payload },{ call, put }) {
      const response = yield call(fetchArticalDetail, ...payload);
      if(response && response.code === 0) {
        yield put ({
          type: 'saveDetail',
          payload: response.data || {},
        })
        return Promise.resolve('请求成功');
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 获取文章用户点赞情况
    *fetchArticalLikes({ payload },{ call, put }) {
      const response = yield call(fetchArticalLikes, payload);
      if(response && response.code === 0) {
        return Promise.resolve(response.data || {});
      }
      return Promise.reject(response.message || '请求失败');
    },
    // 点赞
    *fetchUpdateArticalLikes({ payload },{ call }) {
      const response = yield call(fetchUpdateArticalLikes,payload);
      if(response && response.code === 0) {
        return Promise.resolve('点赞成功');
      }
      return Promise.reject(response.message || '点赞失败');
    },
    // 评论
    *fetchCreateComment({ payload },{ call }) {
      const response = yield call(fetchCreateComment,payload);
      if(response && response.code === 0) {
        return Promise.resolve('评论成功');
      }
      return Promise.reject(response.message || '评论失败');
    },
    // 获取评论内容
    *fetchArticalComments({ payload }, { call, put }) {
      const response = yield call(fetchArticalComments, payload);
      if(response && response.code === 0) {
        yield put({
          type: 'saveComments',
          payload: response.data || [],
        })
        return Promise.reject('获取评论内容成功'); 
      }
      return Promise.reject(response.message || '获取评论内容失败'); 
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        list: payload || {},
      };
    },
    saveTags(state, { payload }) {
      return {
        ...state,
        tags: payload,
      }
    },
    saveCategorys(state, { payload }) {
      return {
        ...state,
        categorys: payload,
      }
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: payload,
      }
    },
    saveComments(state, { payload }) {
      return {
        ...state,
        comments: payload,
      }
    },
    clearDetail(state) {
      return {
        ...state,
        detail: {},
        comments: [],
      }
    },
  },
};

