const {
	ArticalService,
	PhotoService,
	TagService,
	ArticalCategoryService,
  Artical2TagService,
  ArticalLikesService,
  ArticalCommentService,
} = require("~service");

const ApiError = require("~ApiError");
const { verify } = require("~utils/validate");
const { verifyToken } = require("~utils/util");
const _ = require("lodash");

async function getTagId(item) {
	const newTag = await TagService.create({
		title: item,
	});
	if (_.isEmpty(newTag)) {
		ctx.throw(400, "参数异常");
	}
	return newTag.id;
}

async function getCategoryId(ctx, item, userId) {
	const categoryRes = await ArticalCategoryService.findOne(ctx, {
		query: {
			title: item,
			user: userId,
		},
	});
	let categoryId = null;
	if (_.isEmpty(categoryRes)) {
		const newCategory = await ArticalCategoryService.create({
			title: item,
			user: userId,
		});
		categoryId = newCategory.id;
	} else {
		categoryId = categoryRes.id;
	}
	return categoryId;
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
			const errInfo = verify(ctx, "artical", {
				title,
				content,
				category,
				tags,
				public,
			});
			if (!_.isEmpty(errInfo)) {
				throw new ApiError(null, errInfo);
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
			const categoryId = await getCategoryId(ctx, category, userId);
			const articalRes = ArticalService.findOne(ctx, {
				query: {
					id: articleId,
				},
			});
			if (_.isEmpty(articalRes)) {
				const newArtical = await ArticalService.create({
					user: userId,
					articalCategory: categoryId,
					title,
					content,
					public,
					coverPath: coverPath || null,
					publish: true,
				});
				articalId = newArtical.id;
			} else {
				await ArticalService.update(ctx, articalId, {
					user: userId,
					articalCategory: categoryId,
					title,
					content,
					public,
					coverPath: coverPath || null,
					publish: true,
				});
      }
      for(const item of tagIds) {
        await Artical2TagService.removes(ctx, articalId, "artical");
        await Artical2TagService.create({
          artical: articalId,
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
			const { id } = ctx.params;
			const { id: userId } = verifyToken(ctx);
			const errInfo = verify(ctx, "artical", {
				title,
				content,
			});
			if (!_.isEmpty(errInfo)) {
				throw new ApiError(null, errInfo);
			}
			if (id && id !== "null") {
				const res = await ArticalService.update(ctx, id, {
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
				const res = await ArticalService.create({
					content,
					title,
					coverPath: coverPath || null,
					user: userId,
				});
				console.log(res);
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
			const { public = false, pageNum = 1, pageSize = 10 } = ctx.query;
			const { id } = verifyToken(ctx);
			const res = await ArticalService.find(
				{
					pageNum,
					pageSize,
					isPaging: true,
				},
				{
					query: {
						deleted: false,
						public,
						publish: true,
					},
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
        const likes = await ArticalLikesService.count({
					artical: item.id,
					liked: true,
        })
        const comments = await ArticalCommentService.count({
          artical: item.id,
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
			const res = await ArticalService.removes(ctx, id);
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
			const res = await ArticalService.update(ctx, id, {
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
      const { id } = ctx.params;
      const { isEdit = false, hasReading = false } = ctx.query
			const res = await ArticalService.findOne(ctx, {
				query: {
					_id: id,
        },
        populate: [
          {
            path: "user",
            select: "nickname avatar -_id",
          },
        ],
        filters: "-deleted -publish",
      });
      if(!isEdit) {
        const likes = await ArticalLikesService.count({
					artical: id,
					liked: true,
        })
        const comments = await ArticalCommentService.count({
          artical: id,
        }) 
        const item = {
          ...res.toJSON(),
          likes,
          comments,
				}
				if(!hasReading) {
					ArticalService.update(ctx,id, {
						reading: item.reading + 1
					})
				}
        ctx.body = item
      }else {
        ctx.body = res
      }
		} catch (err) {
			throw err;
		}
	},
};
