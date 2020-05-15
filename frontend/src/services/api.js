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
