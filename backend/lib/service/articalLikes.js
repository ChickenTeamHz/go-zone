
'use strict';
const {
    ArticalLikesModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
    _count,
} = require('../dao/baseDao');


class ArticalLikesService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null,
        sort = {},
    } = {}) {

        let listdata = _list(ArticalLikesModel, payload, {
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
        return _item(ctx, ArticalLikesModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(ArticalLikesModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '', ...options } = {}) {
        return _update(ctx, ArticalLikesModel, _id, payload, { options: { select: filters, new: true, ...options }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, ArticalLikesModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, ArticalLikesModel, values);
    }

    // 统计个数
    async count(query = {}) {
      return _count(ArticalLikesModel, query)
    }
}

module.exports = new ArticalLikesService();