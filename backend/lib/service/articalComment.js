
'use strict';
const {
    ArticalCommentModel
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


class ArticalCommentService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null
    } = {}) {

        let listdata = _list(ArticalCommentModel, payload, {
            query: query,
            searchKeys: searchKeys,
            populate: populate,
            filters
        });
        return listdata;
    }

    // 查找一条数据
    async findOne(ctx, {
        query = {},
        populate = [],
        filters = null
    } = {}) {
        return _item(ctx, ArticalCommentModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(ArticalCommentModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, ArticalCommentModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, ArticalCommentModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, ArticalCommentModel, values);
    }

    // 统计个数
    async count(query = {}) {
      return _count(ArticalCommentModel, query)
    }
}

module.exports = new ArticalCommentService();