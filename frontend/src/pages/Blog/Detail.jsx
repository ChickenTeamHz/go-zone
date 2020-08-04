import React, { useState, useCallback } from 'react';
import { MdPriview } from 'md-pre-editor';
import { router } from 'umi';
import { useMount, useUnmount } from '@umijs/hooks';
import { EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons'
import { Input, Button, Card, Tag, message, Avatar, Divider } from 'antd';
import { scroller, Element as ScrollEle  } from 'react-scroll';
import { useDva } from '../../utils/hooks';
import styles from './index.less';
import GoBack from '../../components/GoBack';
import CommentsBox from './components/CommentsBox';
import Loading from '../../components/Loading';

const tagColor = ['magenta','red','volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

export default function ({
  match: { params: { articleId }},
}) {
  const { 
    dispatch, 
    loadings: { loading = false, commentLoading = false, cLoading = false },
    data: { blog: { detail = {}, comments: commentsData = [] }},
  } = useDva({
    loading: 'blog/fetchArticleDetail',
    commentLoading: 'blog/fetchCreateComment',
    cLoading: 'blog/fetchArticleComments',
  }, ['blog', 'user']);

  const [isLike, setIsLike] = useState(false);

  function updateLikes() {
    dispatch({
      type: 'blog/fetchArticleLikes',
      payload: {
        articleId,
      },
    }).then(res => {
      const { liked = false } = res;
      setIsLike(liked)
    })
  }

  function fetchDetail(hasReading = false) {
    dispatch({
      type: 'blog/fetchArticleDetail',
      payload: [articleId, {
        hasReading,
      }],
    });
  }

  function fetchComments() {
    dispatch({
      type: 'blog/fetchArticleComments',
      payload: {
        articleId,
      },
    })
  }

  useMount(()=> {
    fetchDetail()
    updateLikes()
    fetchComments()
  })

  useUnmount(() => {
    dispatch({
      type: 'blog/clearDetail',
    })
  })

  const [ comments, setComments ] = useState()
  const [commentsVisible, setCommentsVisible] = useState(false)

  const handleComments = ({
    content = null,
    parentId = null,
    replyId = null,
    root = 0,
  }) => {
    return dispatch({
      type: 'blog/fetchCreateComment',
      payload: {
        articleId,
        content,
        parentId,
        replyId,
        root,
      },
    }).then(res => {
      message.success(res);
      fetchComments()
      return Promise.resolve()
    })
  }

  const handleBlur = () => {
    if(!comments){
      setCommentsVisible(false)
    }
  }

  const handleLikes = () => {
    dispatch({
      type: 'blog/fetchUpdateArticleLikes',
      payload: {
        articleId,
        liked: !isLike,
      },
    }).then(() => {
      if(isLike){
        message.success('不考虑再支持一下了吗~~~')
      }else {
        message.success('感谢您对小主的支持(*╹▽╹*)')
      }
      setIsLike(!isLike)
      fetchDetail(true)
    })
  }

  const scrollToComments = () => {
    scroller.scrollTo('comments', {
      smooth: true,
    })
  }

  const handleEdit = () => {
    router.push(`/blog/edit/${articleId}`)
  }

  return (
    <div className="box">
      <div className={styles.detail}>
        <GoBack />
        <Card bordered={false}>
          <div className={`flex ${styles.user}`}>
            <div className='flex'>
              <Avatar src={detail?.user?.avatar} size="large" />
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontWeight: 'bold' }}>{detail?.user?.nickname}</div>
                <div style={{ color: '#999'}}>
                  <span><CalendarOutlined /> {detail.updatedAt}</span>
                  <span style={{ marginLeft: 8 }}><EyeOutlined /> {detail?.reading}</span>
                  <span style={{ marginLeft: 8 }}><LikeOutlined /> {detail?.likes}</span>
                  <span style={{ marginLeft: 8 }}><MessageOutlined /> {detail?.comments}</span>
                </div>
              </div>
            </div>
            <div className={styles.editButton} onClick={handleEdit}>编辑</div>
          </div>
          <h1 style={{ textAlign: 'center' }}>{detail?.title}</h1>
          {detail?.coverPathUrl && (
            <div
              style={{ background: `url(${detail.coverPathUrl}) no-repeat center`, backgroundSize: 'cover' }}
              className={styles.img}
            />
          )}
          <MdPriview value={detail?.content}/>
          <div className={styles.user}>
            <div className='flex'>
              <span style={{ fontWeight: 'bold' }}>分类专栏：</span>
              <span>{detail?.articleCategory?.title}</span>
            </div>
            <div className='flex'>
              <span style={{ fontWeight: 'bold' }}>文章标签：</span>
              <span>
                {detail?.tags?.map((tag,index) => (
                <Tag color={tagColor[index]} style={{ marginRight: 4 }} key={tag.id}>{tag.title}</Tag>
                ))}
              </span> 
            </div>
          </div>
          <Divider />
          <ScrollEle name='comments'>
            <div className={styles.comments}>
              <h2>评论区</h2>
              <div className={styles.inputBox}>
                <div>              
                  <Avatar src={detail?.user?.avatar}/>
                  <Input.TextArea 
                    placeholder="输入评论..." 
                    style={{ marginLeft: 12, resize: 'none' }} 
                    autoSize
                    onChange={e => setComments(e.target.value)}
                    onPressEnter={e => {
                      if((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
                        handleComments({ content: comments }).then(() => {
                          setCommentsVisible(false)
                          setComments()
                        })
                      }
                    }}
                    onBlur={handleBlur}
                    onFocus={() => setCommentsVisible(true)}
                    value={comments}
                  />
                </div>
                {commentsVisible && (
                  <div style={{ display: 'flex', marginTop: 12, justifyContent: 'flex-end' }}>
                    <div>
                      <span style={{ marginRight: 8, color: '#c2c2c2' }}>Ctrl or ⌘ + Enter</span>
                      <Button 
                        type='primary' 
                        onClick={() => handleComments({ 
                          content: comments,
                        }).then(() => {
                          setCommentsVisible(false)
                          setComments()
                        })
                      } 
                        disabled={!comments}
                        loading={commentLoading}
                      >
                        评论
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <Card bordered={false}>
                <CommentsBox handleComments={useCallback(handleComments,[])} commentsData={commentsData} />
              </Card>
            </div>
          </ScrollEle>
        </Card>
        <div className={styles.extra}>
          <div onClick={handleLikes} className={isLike ? styles.likes : ''}><LikeOutlined /> 点赞</div>
          <div onClick={scrollToComments}><MessageOutlined /> 评论</div>
        </div>
      </div>
      <Loading spinning={loading || cLoading} />
    </div>
  )
}
