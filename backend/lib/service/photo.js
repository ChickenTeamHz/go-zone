
'use strict';
const {
    PhotoModel
} = require('~models');
const _ = require('lodash')
const {
    _item,
    _create,
    _update,
    _list,
    _removes,
    _safeDelete,
    _updateMany,
} = require('../dao/baseDao');


class PhotoService {

    // 查找
    async find(payload, {
        query = {},
        searchKeys = [],
        populate = [],
        filters = null
    } = {}) {

        let listdata = _list(PhotoModel, payload, {
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
        return _item(ctx, PhotoModel, {
            query,
            populate,
            filters,
        })
    }

    // 创建
    async create(payload) {
        return _create(PhotoModel, payload);
    }

    // 修改
    async update(ctx, _id, payload, { filters = '' } = {}) {
        return _update(ctx, PhotoModel, _id, payload, { options: { select: filters, new: true }});
    }

    // 删除
    async removes(ctx, values, key = '_id') {
        return _removes(ctx, PhotoModel, values, key);
    }

    // 逻辑删除
    async safeDelete(ctx, values) {
        return _safeDelete(ctx, PhotoModel, values);
    }

    // 更新多条
    async updateMany(ctx, ids, payload) {
      return _updateMany(ctx, PhotoModel, ids, payload);
  }
}

module.exports = new PhotoService();