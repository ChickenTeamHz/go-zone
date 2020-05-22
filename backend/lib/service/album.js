
'use strict';
const {
    AlbumModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
} = require('../dao/baseDao');


class AlbumService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null
    } = {}) {

        let listdata = _list(AlbumModel, payload, {
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
        return _item(ctx, AlbumModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(AlbumModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, AlbumModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, AlbumModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, AlbumModel, values);
    }
}

module.exports = new AlbumService();