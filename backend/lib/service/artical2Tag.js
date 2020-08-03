
'use strict';
const {
    Artical2TagModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
} = require('../dao/baseDao');


class Artical2TagService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null,
        sort = {},
    } = {}) {

        let listdata = _list(Artical2TagModel, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            filters,
            sort,
        });
        return listdata;
    }

    // 查找一条数据
    async findOne(ctx, {
        query = {},
        populate = [],
        filters = null
    } = {}) {
        return _item(ctx, Artical2TagModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(Artical2TagModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, Artical2TagModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, Artical2TagModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, Artical2TagModel, values);
    }
}

module.exports = new Artical2TagService();