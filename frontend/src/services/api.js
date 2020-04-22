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

