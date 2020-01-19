
'use strict';
const {
    UserModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
} = require('../dao/baseDao');


class UserService {

    // 查找用户
    async find(ctx, {
        query = {},
        populate = [],
        files = null
    } = {}) {
        return _item(ctx, UserModel, {
            query,
            populate,
            files: files ? files : '-password',
        })
    }

    // 创建用户
    async create(payload) {
        return _create(UserModel, payload);
    }

    // 修改用户
    async update(ctx, _id, payload) {
        return _update(ctx, UserModel, _id, payload);
    }

}

module.exports = new UserService();