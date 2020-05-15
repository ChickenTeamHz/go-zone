/*
 * @Author: Fairy
 * @Description: 操作mongodb封装方法
 * @Last Modified by: Fairy
 * @Last Modified time: 2020-05-11 16:52:04
*/

const shortid = require('shortid');
const _ = require('lodash')

/**
 * 通用列表
 * @method list
 * @param Model 模型
 * @param {} pageQuery { pageNum, pageSize, searchReg, isPaging, skip } 
 * @param {} { sort, filters, query, serachKeys, populate}
 */

exports._list = async (Model, pageQuery, {
    sort = {
        date: -1
    },
    filters = null,
    query = {},
    searchKeys = [],
    populate = []
} = {}) => {
    let {
        pageNum = 1,
        pageSize = 10,
        searchReg,
        isPaging = 0, // 是否分页
        skip
    } = pageQuery;

    let items = [];
    let count = 0;
    query = query || {};
    sort = !_.isEmpty(sort) ? sort : {
        date: -1
    };

    /** 分页数据处理 */
    pageNum = Number(pageNum) || 1;
    pageSize = Number(pageSize) || 10;
    let skipNum = skip ? skip : ((Number(pageNum)) - 1) * Number(pageSize); // 要跳过的文档数

    /** 条件筛选 */
    if (searchReg && searchKeys) {
        if (searchKeys instanceof Array && searchKeys.length > 0) {
            let searchStr = [];
            for (let i = 0; i < searchKeys.length; i++) {
                const keyItem = searchKeys[i];
                searchStr.push({
                    [keyItem]: {
                        $regex: searchReg //  $regex 用于模糊查询
                    }
                })
            }
            query.$or = searchStr;
        }
        if(typeof searchKeys === 'string'){
            query[searchKeys] = {
                $regex: searchReg
            }  
        }  
    }

    /** 查表获取数据 */
    if (isPaging || pageQuery.pageSize > 0) {
        items = await Model.find(query, filters).skip(skipNum).limit(pageSize).sort(sort).populate(populate).exec();
    } else {
        items = await Model.find(query, filters).skip(skipNum).sort(sort).populate(populate).exec();
    }

    count = await Model.count(query).exec(); // 文档条数

    if (isPaging) {
        let pageInfoParams = {
            totalItems: count,
            pageSize,
            pageNum,
            searchReg: searchReg || '',
            totalPage: Math.ceil(count / pageSize),
        };
        for (const querykey in query) {
            if (query.hasOwnProperty(querykey)) {
                const queryValue = query[querykey];
                _.assign(pageInfoParams, {
                    [querykey]: queryValue || ''
                });
            }
        }
        return {
            items,
            pageInfo: pageInfoParams
        }
    } else {
        return items;
    }
}


/**
 * 查询集合匹配条数
 * @method count
 * @param Model 模型
 * @param query 查询条件
 */
exports._count = async (Model, query = {}) => {
    return await Model.count(query);
}

/**
 * 集合上创建文档
 * @method add
 * @param  Model 模型
 * @param  payload 一条/多条数据
 */
exports._create = async (Model, payload) => {
    return await Model.create(payload);
}

/**
 * （通用）查找一条数据
 * @param  {[type]} ctx 
 * @param Model 模型
 * @return {{}} Promise object
 */
exports._item = async (ctx, Model, {
    filters = null, // 投影参数
    query = {},
    populate = []
} = {}) => {
    if (query._id && !shortid.isValid(query._id)) {
        ctx.throw(400,'参数异常');
    }
    return await Model.findOne(query, filters).populate(populate).exec();
}

/**
 * 删除匹配条件的所有文档
 * @method deletes
 * @param  {[type]} ctx 
 * @param  {[type]}   Model [数据集合]
 * @param  {[type]}   ids [主键ids]
 */
exports._removes = async (ctx, Model, ids, key) => {
    if (!checkCurrentId(ids)) {
        ctx.throw(400,'参数异常');
    }
    return await Model.remove({
        [key]: {
            $in: ids
        }
    })
}

/**
 * 从数据库中移除当前文档
 * @method deletes
 * @param  {[type]}   Model [数据集合]
 */
exports._removeAll = async (Model) => {
    return await Model.remove()
}

/**
 * 通用删除
 * @method deletes
 * @param  {[type]} ctx 
 * @param  {[type]}   Model [数据集合]
 * @param  {[type]}   ids [ids]
 */
exports._safeDelete = async (ctx, Model, ids = []) => {
    if (!checkCurrentId(ids)) {
        ctx.throw(400,'参数异常');
    }
    return await Model.updateMany({
        _id: {
            $in: ids
        }
    }, {
        $set: {
            deleted: true,
        }
    })
}

/**
 * 通用编辑一条
 * @method update
 * @param  {[type]} ctx 
 * @param  {[type]} Model [数据集合]
 * @param  {[type]} _id     [id]
 * @param  {[type]} data    [修改数据]
 */
exports._update = async (ctx, Model, _id, data, {
    query = {},
    options = {
      new: true,
    },
} = {}) => {
    if (_id) {
        query = _.assign({}, query, {
            _id: _id
        });
    } else {
        if (_.isEmpty(query)) {
            ctx.throw(400,'参数异常');
        }
    }
    const user = await this._item(ctx, Model, {
        query: query
    })
    if (_.isEmpty(user)) {
        ctx.throw(400,'参数异常');
    }
    return await Model.findOneAndUpdate(query, {
        $set: data
    },options);
}

/**
 * 通用编辑多条
 * @method update
 * @param  {[type]} ctx 
 * @param  {[type]} Model [数据集合]
 * @param  {[type]} ids     [更新id]
 * @param  {[type]} data    [更新数据]
 */
exports._updateMany = async (ctx, Model, ids = [], data, {
    query = {}
} = {}) => {
    if (_.isEmpty(ids) && _.isEmpty(query)) {
        ctx.throw(400,'参数异常');
    }
    if (!_.isEmpty(ids)) {
        query = _.assign({}, query, {
            _id: {
                $in: ids
            }
        });
    }
    return await Model.updateMany(query, {
        $set: data
    });
}

/**
 * 通用数组字段添加(更新多个符合匹配条件的文档)
 * @method update
 * @param  {[type]} ctx 
 * @param  {[type]} Model [数据集合]
 * @param  {[type]} id     [id]
 * @param  {{type}} data    [更新数据]
 */
exports._addToSet = async (ctx, Model, id, data, {
    query = {}
} = {}) => {
    if (_.isEmpty(id) && _.isEmpty(query)) {
        ctx.throw(400,'参数异常');
    }
    if (!_.isEmpty(id)) {
        query = _.assign({}, query, {
            _id: id
        });
    }
    return await Model.updateMany(query, {
        $addToSet: data
    });
}


/**
 * 通用数组字段删除(更新多个符合匹配条件的文档)
 * @method update
 * @param  {[type]} ctx 
 * @param  {[type]} Model [数据集合]
 * @param  {[type]} id     [id]
 * @param  {{type}} data    [更新数据]
 */
exports._pull = async (ctx, Model, id, data, {
    query = {}
} = {}) => {
    if (_.isEmpty(id) && _.isEmpty(query)) {
        ctx.throw(400,'参数异常');
    }
    if (!_.isEmpty(id)) {
        query = _.assign({}, query, {
            _id: id
        });
    }
    return await Model.updateMany(query, {
        $pull: data
    });
}

/**
 * 通用属性加值(更新多个符合匹配条件的文档)
 * @method update
 * @param  {[type]} ctx 
 * @param  {[type]} Model [数据集合]
 * @param  {[type]} id     [id]
 * @param  {{xx: number}} data    [更新数据]
 */
exports._inc = async (ctx, Model, id, data, {
    query = {}
} = {}) => {
    if (_.isEmpty(id) && _.isEmpty(query)) {
        ctx.throw(400,'参数异常');
    }
    if (!_.isEmpty(id)) {
        query = _.assign({}, query);
    }
    return await Model.updateMany(query, {
        $inc: data
    });
}
