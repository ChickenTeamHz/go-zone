const {
  ArticalService,
  PhotoService,
  TagService,
  ArticalCategoryService,
  Artical2TagService,
} = require('~service');

const ApiError = require('~ApiError');
const { verify } = require('~utils/validate');
const { verifyToken } = require('~utils/util');
const _ = require('lodash');

async function getTagId(item) {
  const newTag = await TagService.create({
    title: item,
 });
 if(_.isEmpty(newTag)) {
   ctx.throw(400,'参数异常');
 }
 return newTag.id;
}

async function getCategoryId(ctx,item, userId) {
  console.log('item',item)
  const categoryRes = await ArticalCategoryService.findOne(ctx, {
    query: {
      title: item,
      user: userId,
    }
  });
  let categoryId = null;
  console.log(categoryRes,'res')
  if(_.isEmpty(categoryRes)) {
    console.log(categoryRes,'pp')
    const newCategory = await ArticalCategoryService.create({
      title: item,
      user: userId,
    });
    categoryId = newCategory.id;
  }else {
    categoryId = categoryRes.id;
  }
  console.log(categoryId,'p')
  return categoryId;
}

async function setArtical2tag(ctx,item, articalId) {
  await Artical2TagService.removes(ctx,articalId, 'artical');
  await Artical2TagService.create({
    artical: articalId,
    tag: item,
  });
}

module.exports = {
  /**
   * 发布文章
   * @param {*} ctx 
   */
  async create (ctx) {
    try {
      const {
        content,
        tags,
        category,
        title,
        coverPath,
        public,
      } = ctx.request.body; 
      let { articleId } = ctx.request.body;
      const { id: userId } = verifyToken(ctx);
      const errInfo = verify(ctx,'artical',{ 
        title,
        content,
        category,
        tags,
        public,
       }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }

      const tagsRes = await TagService.find({},{
        query: {
          title: {$in: tags}
        }
      });
      let tagIds = tagsRes.map(item => item.id);
      tags.forEach(item => {
        const i = tagsRes.findIndex(v => v.title === item)
        if(i === -1) {
           // 不存在则新建
           tagIds.push(getTagId(item));
        }
      });
      const categoryId = await getCategoryId(ctx,category, userId);
      const articalRes = ArticalService.findOne(ctx, {
        query: {
          id: articleId,
        }
      });
      console.log(categoryId,'id')
      if(_.isEmpty(articalRes)){
        const newArtical = await ArticalService.create({
          user: userId,
          articalCategory: categoryId,
          title,
          content,
          public,
          coverPath: coverPath || null,
          publish:true,
        });
        articalId = newArtical.id;
      }else{
        await ArticalService.update(ctx, articalId, {
          user: userId,
          articalCategory: categoryId,
          title,
          content,
          public,
          coverPath: coverPath || null,
          publish:true,
        });
      }
      tagIds.forEach(item => {
        setArtical2tag(ctx,item, articalId);
      })
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 保存到草稿箱
   * @param {*} ctx 
   */
  async save (ctx) {
    try {
      const {
        content,
        title,
        coverPath,
      } = ctx.request.body; 
      const { id } = ctx.params;
      const { id: userId } = verifyToken(ctx);
      const errInfo = verify(ctx,'artical',{ 
        title,
        content
       }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      if(id && id !== 'null') {
        const res = await ArticalService.update(ctx,id,{
          content,
          title,
          coverPath: coverPath || null,
          user: userId,
        });
        if(_.isEmpty(res)) {
          throw new ApiError(null,{
            code: 100000,
            message: '没有找到这条记录！'
          })
        }
        ctx.body = {};
      }else {
        const res = await ArticalService.create({
          content,
          title,
          coverPath: coverPath || null,
          user: userId,
        });
        console.log(res);
        ctx.body = {
          articleId: res.id
        }
      }
    }catch(err) {
      throw err;
    }
  },

  /**
   * 保存文章到草稿箱
   * @param {*}} ctx 
   */
  async getList(ctx) {
    try {
      const { id } = verifyToken(ctx);
      const res = await ArticalService.find({},{
        query: { user: id },
        filters: '-user'
      });
      ctx.body = res;
    }catch(err) {
      throw err;
    }
  },

  /**
   * 删除某个相册
   * @param {*} ctx 
   */
  async removeOne(ctx) {
    try {
      const { id } = ctx.params;
      await PhotoService.removes(ctx,id,'album');
      const res = await ArticalService.removes(ctx,id);
      if(res.n === 0) {
        throw new ApiError(null, {
          code: 100000,
          message: '没有找到需要删除的记录！',
        });
      }
      if(res.deletedCount === 0) {
        throw new ApiError(null, {
          code: 100000,
          message: '删除记录失败！',
        });
      };
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 更新相册
   * @param {*} ctx 
   */
  async update (ctx) {
    try {
      const { id } = ctx.params;
      const {
        name,
        coverPath,
      } = ctx.request.body; 
      const errInfo = verify(ctx,'album',{ name, coverPath }); 
      if (!_.isEmpty(errInfo)) {
        throw new ApiError(null,errInfo)
      }
      const res = await ArticalService.update(ctx,id,
        { 
          name,
          coverPath,
        });
      ctx.body = {};
    }catch(err) {
      throw err;
    }
  },

  /**
   * 获取日志信息
   * @param {*} ctx 
   */
  async getOne (ctx) {
    try {
      const { id } = ctx.params;
      const { id: userId } = verifyToken(ctx);
      const tagRes = await TagService.find();
      const tags = tagRes.map(item => item.title);
      console.log(tags);
      const categoryRes = await categoryService.find({},{
        query: {
          user: userId,
        }
      });
      const categorys = categoryRes.map(item => item.title);
      const res = await ArticalService.findOne(ctx,{
       query: {
        _id: id,
        },
      });
      ctx.body = {
        blog: res,
        tags,
        categorys,
      }
    }catch(err) {
      throw err;
    }
 },
}

