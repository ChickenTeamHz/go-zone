
'use strict';
const {
    ArticalModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
} = require('../dao/baseDao');


class ArticalService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null,
        sort = {},
    } = {}) {

        let listdata = _list(ArticalModel, payload, {
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
        return _item(ctx, ArticalModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(ArticalModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, ArticalModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, ArticalModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, ArticalModel, values);
    }
}

module.exports = new ArticalService();