import { stringify } from 'qs';
import request from '../utils/request';
import HOST from './host';


// 登录
export async function fetchLogin(params) {
  return request(`${HOST}/user/login`,{
    method: 'POST',
    body: params,
  })
}

// 注册
export async function fetchRegister(params) {
  return request(`${HOST}/user/register`,{
    method: 'POST',
    body: params,
  })
}

// 忘记密码
export async function fetchForgetRegister(params) {
  return request(`${HOST}/user/reset`,{
    method: 'POST',
    body: params,
  })
}

// 获取用户信息
export async function fecthProfile(){
  return request(`${HOST}/user/profile`);
}

// 更新用户信息
export async function fetchUpdateUser(params) {
  return request(`${HOST}/user`,{
    method: 'PUT',
    body: params,
  })
}

// 更新用户密码信息
export async function fetchUpdatePassword(params) {
  return request(`${HOST}/user/password`,{
    method: 'PUT',
    body: params,
  })
}

// 更换头像
export async function fetchUpdateAvatar(params) {
  return request(`${HOST}/user/avatar`,{
    method: 'POST',
    body: params,
  })
}

// 上传文件
export async function fetchBase64Request(params) {
  return request(`${HOST}/upload/base64`, {
    method: 'POST',
    body: params,
  });
};

// 创建相册
export async function fetchCreateAlbum(params) {
  return request(`${HOST}/albums`,{
    method: 'POST',
    body: params,
  });
}

// 获取相册内容
export async function fetchAlbumList() {
  return request(`${HOST}/albums`);
}

// 删除相册
export async function fetchDeleteAlbum(id) {
  return request(`${HOST}/albums/${id}`,{
    method: 'DELETE',
  });
}

// 修改相册
export async function fetchUpdateAlbum(id,params) {
  return request(`${HOST}/albums/${id}`,{
    method: 'PUT',
    body: params,
  });
}

// 上传相册照片
export async function fetchUploadPhotos(id, params) {
  return request(`${HOST}/albums/${id}/photos`,{
    method: 'POST',
    body: params,
  })
}

// 获取相册照片
export async function fetchPhotos(id) {
  return request(`${HOST}/albums/${id}/photos`)
}

// 删除相册照片
export async function fetchDeletePhotos(id, params) {
  return request(`${HOST}/albums/${id}/photos`,{
    method: 'DELETE',
    body: params,
  })
}

// 移动相册照片
export async function fetchMovePhotos(id, params) {
  return request(`${HOST}/albums/${id}/photos`,{
    method: 'PUT',
    body: params,
  })
}

// 上传图片
export async function fetchUploadImg(file) {
  const formData = new FormData();
  formData.append('file', file)
  return request(`${HOST}/upload/file`, {
    method: 'POST',
    body: formData,
    requestType: 'form',
  })
}

// 发布文章
export async function fetchCreateArticle(params) {
  return request(`${HOST}/articles`,{
    method: 'POST',
    body: params,
  })
}

// 保存文章到草稿箱
export async function fetchSaveArticle(id, params) {
  return request(`${HOST}/articles/${id}/draft`,{
    method: 'POST',
    body: params,
  })
}

// 获取标签列表
export async function fetchTagList() {
  return request(`${HOST}/tags`)
}

// 获取分类列表
export async function fetchCategoryList() {
  return request(`${HOST}/categorys`)
}

// 获取文章列表
export async function fetchArticles(params) {
  return request(`${HOST}/articles?${stringify(params,{ indices: false })}`)
}

// 获取文章信息
export async function fetchArticleDetail(id, params) {
  return request(`${HOST}/articles/${id}?${stringify(params)}`)
}

// 获取文章用户点赞情况
export async function fetchArticleLikes(params) {
  return request(`${HOST}/articles-likes?${stringify(params)}`)
}

// 点赞
export async function fetchUpdateArticleLikes(params) {
  return request(`${HOST}/articles-likes`,{
    method: 'POST',
    body: params,
  })
}

// 评论
export async function fetchCreateComment(params) {
  return request(`${HOST}/articles-comments`,{
    method: 'POST',
    body: params,
  })
}

// 获取评论信息
export async function fetchArticleComments(params) {
  return request(`${HOST}/articles-comments?${stringify(params)}`)
}

// 删除评论
export async function fetchDeleteComments(id, params) {
  return request(`${HOST}/article-comments/${id}`,{
    method: 'DELETE',
    body: params,
  })
}