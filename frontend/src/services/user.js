import request from '../utils/request';
import api from '../api/api'
const { Users } = api

export default {
  login(params) {
    console.log(request)
    return Promise.resolve(request.post(Users.login, params))
  },
  register(params) {
    return Promise.resolve(request.post(Users.register, params))
  }
}

