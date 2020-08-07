const {
	ArticleService,
	PhotoService,
	TagService,
	ArticleCategoryService,
  Article2TagService,
  ArticleLikesService,
  ArticleCommentService,
} = require("~service");

const ApiError = require("~ApiError");
const { verify } = require("~utils/validate");
const { verifyToken, formatBoolean } = require("~utils/util");
const _ = require("lodash");
const { format } = require("path");

async function getTagId(item) {
	const newTag = await TagService.create({
		title: item,
	});
	if (_.isEmpty(newTag)) {
		ctx.throw(400, "参数异常");
	}
	return newTag.id;
}

module.exports = {
	/**
	 * 发布文章
	 * @param {*} ctx
	 */
	async create(ctx) {
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
			const errInfo = verify(ctx, "article", {
				title,
				content,
				category,
				tags,
				public,
			});
			if (!_.isEmpty(errInfo)) {
				throw new ApiError(null, errInfo);
			}

			const categoryRes = await ArticleCategoryService.findOne(ctx, {
				query: {
					title: category,
					user: userId,
				},
			});
			let categoryId = null;
			if (_.isEmpty(categoryRes)) {
				const categoryCount = await ArticleCategoryService.count({
					query: {
						user: userId,
					},
				});
				if(categoryCount >= 10) {
					throw new ApiError(null, {
						code: 100000,
						message: '自定义专栏数量上限！'
					})
				}
				const newCategory = await ArticleCategoryService.create({
					title: category,
					user: userId,
				});
				categoryId = newCategory.id;
			} else {
				categoryId = categoryRes.id;
			}

			const tagsRes = await TagService.find(
				{},
				{
					query: {
						title: { $in: tags },
					},
				}
			);
			let tagIds = tagsRes.map(item => item.id);
			tags.forEach(item => {
				const i = tagsRes.findIndex(v => v.title === item);
				if (i === -1) {
					// 不存在则新建
					tagIds.push(getTagId(item));
				}
			});
			const articleRes = await ArticleService.findOne(ctx, {
				query: {
					_id: articleId,
				},
			});
			if (_.isEmpty(articleRes)) {
				const newArticle = await ArticleService.create({
					user: userId,
					articleCategory: categoryId,
					title,
					content,
					public,
					coverPath: coverPath || null,
					publish: true,
				});
				articleId = newArticle.id;
			} else {
				await ArticleService.update(ctx, articleId, {
					user: userId,
					articleCategory: categoryId,
					title,
					content,
					public,
					coverPath: coverPath || null,
					publish: true,
					updatedAt: Date.now(),
				});
			}
			await Article2TagService.removes(ctx, articleId, "article");
      for(const item of tagIds) {
        await Article2TagService.create({
          article: articleId,
          tag: item,
        });
      }
			ctx.body = {};
		} catch (err) {
			throw err;
		}
	},

	/**
	 * 保存到草稿箱
	 * @param {*} ctx
	 */
	async save(ctx) {
		try {
			const { content, title, coverPath } = ctx.request.body;
			const { articleId } = ctx.params;
			const { id: userId } = verifyToken(ctx);
			const errInfo = verify(ctx, "article", {
				title,
				content,
			});
			if (!_.isEmpty(errInfo)) {
				throw new ApiError(null, errInfo);
			}
			if (articleId && articleId !== "null") {
				const res = await ArticleService.update(ctx, articleId, {
					content,
					title,
					coverPath: coverPath || null,
					user: userId,
				});
				if (_.isEmpty(res)) {
					throw new ApiError(null, {
						code: 100000,
						message: "没有找到这条记录！",
					});
				}
				ctx.body = {};
			} else {
				const res = await ArticleService.create({
					content,
					title,
					coverPath: coverPath || null,
					user: userId,
				});
				ctx.body = {
					articleId: res.id,
				};
			}
		} catch (err) {
			throw err;
		}
	},

	/**
	 * 获取文章列表
	 * @param {*}} ctx
	 */
	async getList(ctx) {
		try {
			const { 
				public = false, 
				pageNum = 1, 
				pageSize = 10,
				personal = false,
				tags = [],
				category,
				publish = true,
			} = ctx.query;
			const { id: userId } = verifyToken(ctx);
			const query = {
				deleted: false,
				public,
				publish,
			}
			if(personal) {
        query.user = userId
			}
			if((typeof tags === 'string' && tags) || (tags instanceof Array && tags.length > 0)) {
				const tagRes = await Article2TagService.find({},{
					query: {
						tag: {
								$in: tags
						}
					},
					filters: 'article'
				})
				const articals = [...new Set(tagRes.map(item => item.article))]
        query['_id'] = {
					$in: articals
				}
			}
			if(category) {
				query['articleCategory'] = category;
			}
			if(formatBoolean(public)) {
				query.public = true;
			}

			const res = await ArticleService.find(
				{
					pageNum,
					pageSize,
					isPaging: true,
				},
				{
					query,
					populate: [
						{
							path: "user",
							select: "nickname avatar -_id",
						},
					],
					filters: "-deleted -publish",
					sort: {
						updatedAt: -1,
					}
				}
      );
      let items = [];
      for(let item of res.items) {
        const likes = await ArticleLikesService.count({
					article: item.id,
					liked: true,
        })
        const comments = await ArticleCommentService.count({
          article: item.id,
        }) 
        items.push({
          ...item.toJSON(),
          likes,
          comments,
        })
      }
			ctx.body = {
        total: res.pageInfo.totalItems,
        items,
      };
		} catch (err) {
			throw err;
		}
	},

	/**
	 * 删除某个文章
	 * @param {*} ctx
	 */
	async removeOne(ctx) {
		try {
			const { id } = ctx.params;
			await PhotoService.removes(ctx, id, "album");
			const res = await ArticleService.removes(ctx, id);
			if (res.n === 0) {
				throw new ApiError(null, {
					code: 100000,
					message: "没有找到需要删除的记录！",
				});
			}
			if (res.deletedCount === 0) {
				throw new ApiError(null, {
					code: 100000,
					message: "删除记录失败！",
				});
			}
			ctx.body = {};
		} catch (err) {
			throw err;
		}
	},

	/**
	 * 更新文章
	 * @param {*} ctx
	 */
	async update(ctx) {
		try {
			const { id } = ctx.params;
			const { name, coverPath } = ctx.request.body;
			const errInfo = verify(ctx, "album", { name, coverPath });
			if (!_.isEmpty(errInfo)) {
				throw new ApiError(null, errInfo);
			}
			const res = await ArticleService.update(ctx, id, {
				name,
				coverPath,
			});
			ctx.body = {};
		} catch (err) {
			throw err;
		}
	},

	/**
	 * 获取文章
	 * @param {*} ctx
	 */
	async getOne(ctx) {
		try {
      const { articleId } = ctx.params;
			let { isEdit = false, hasReading = false } = ctx.query
			isEdit = formatBoolean(isEdit)
			hasReading = formatBoolean(hasReading)
			const res = await ArticleService.findOne(ctx, {
				query: {
					_id: articleId,
        },
        populate: [
          {
            path: "user",
            select: "nickname avatar",
					},
					{
						path: "articleCategory",
						select: "title"
					}
        ],
        filters: "-deleted -publish",
			});
			if(_.isEmpty(res)) {
				throw new ApiError(null, {
					code: '100000',
					message: '没有这条记录！'
				})
			}
			const tagRes = await Article2TagService.find({},{
				query: {
					article: articleId,
				},
				populate: 'tag',
			})
			const tags = tagRes.map(item => {
				const { tag = {} } = item;
				return {
					title: tag.title,
					id: tag.id,
				};
			})
      if(!isEdit) {
        const likes = await ArticleLikesService.count({
					article: articleId,
					liked: true,
        })
        const comments = await ArticleCommentService.count({
          article: articleId,
        }) 
        const item = {
          ...res.toJSON(),
          likes,
					comments,
					tags,
				}
				if(!hasReading) {
					ArticleService.update(ctx,articleId, {
						reading: item.reading + 1
					})
				}
        ctx.body = item
      }else {
        ctx.body = {
					tags,
					...res.toJSON(),
				}
      }
		} catch (err) {
			throw err;
		}
	},
};
