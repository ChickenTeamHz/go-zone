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
