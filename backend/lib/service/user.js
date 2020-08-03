
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
    async findOne(ctx, {
        query = {},
        populate = [],
        filters = null,
    } = {}) {
        return _item(ctx, UserModel, {
            query,
            populate,
            filters: filters ? filters : '-password',
        })
    }

    // 创建用户
    async create(payload) {
        return _create(UserModel, payload);
    }

    // 修改用户
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, UserModel, _id, payload, { options: { select: filters, new: true }});
    }

}

module.exports = new UserService();