import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Avatar, Input, Button, message, Modal } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { useDva } from 'utils/hooks'
import styles from './index.less'

function useCommentDelete (comment) {
  const { 
    dispatch,
    data: { blog: { detail = {} }, user: { currentUser = {}} },
  } = useDva({}, ['blog','user']);
  const [showDelete, setShowDelete] = useState(false) 
  const handleHover = useCallback(() => {
    if(currentUser.id === comment.userId || detail.id === currentUser.id) {
      setShowDelete(true)
    }
  },[])

  const handleBlur = useCallback(() => {
    setShowDelete(false)
  },[])

  const handleDelete = useCallback(()=> {
    Modal.confirm({
      title: '确认删除这条评论吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        return dispatch({
          type: 'blog/fetchDeleteComments',
          payload: [comment.id, {
            articalId: detail.id,
          }],
        }).then(()=> {
          message.success('删除成功')
          dispatch({
            type: 'blog/fetchArticalComments',
            payload: {
              articalId: detail.id,
            },
          })
        })
      },
    })
  },[])
  return {
    handleHover,
    handleBlur,
    showDelete,
    handleDelete,
  }
}

const CBox = React.memo(({ item, handleComments }) => {
  const commentDelete = useCommentDelete(item)

  const [rId, setRId] = useState(null);
  const handleReply = (id) => {
    setRId(id)
  }

  const hideReply = useCallback(() => {
    setRId(null)
  },[])

  return (
    <div className={styles.box} onMouseMove={commentDelete.handleHover} onMouseLeave={commentDelete.handleBlur}>
      <Avatar src={item.avatar} />
      <div style={{ marginLeft: 12, width: '100%' }}>
        <div className={styles.name}>{item.nickname}</div>
        <div className={styles.content}>{item.content}</div>
        <div className={styles.operation}>
          <div style={{ display: 'flex' }}>
            <div className={styles.time}>{item.createdAt}</div>
            {commentDelete.showDelete && <div className={styles.delete} onClick={commentDelete.handleDelete}>· 删除</div>}
          </div>
          <div className={styles.button} onClick={() => handleReply(item.userId)}>
            <MessageOutlined /> 回复
          </div>
        </div>
        {item.userId === rId && (
          <ReplyBox item={item} hideReply={hideReply} parentId={item.id} handleComments={handleComments} />
        )}
        <div style={{ marginBottom: 12 }}>
          {item?.children?.map(child => (
            <CBoxChild item={child} key={child.id} parentId={item.id} handleComments={handleComments} />
          ))}
        </div>
      </div>
    </div>
  )
})

const CBoxChild = React.memo(({ item, parentId, handleComments }) => {
  const commentDelete = useCommentDelete(item)
  const [rId, setRId] = useState(null);
  const handleReply = (id) => {
    setRId(id)
  }

  const hideReply = useCallback(() => {
    setRId(null)
  },[])

  return (
    <div 
      className={styles.box} 
      style={{ backgroundColor: 'rgba(226, 228, 226,0.2)' }} 
      onMouseMove={commentDelete.handleHover} 
      onMouseLeave={commentDelete.handleBlur}
    >
      <Avatar src={item.avatar} />
      <div style={{ marginLeft: 12, width: '100%' }}>
        <div className={styles.name}>{item.nickname}</div>
        <div className={styles.content}>
          {item.root === 2 ? `回复【${item.replyName}】: ${item.content}`: item.content}
        </div>
        <div className={styles.operation}>
          <div style={{ display: 'flex' }}>
            <div className={styles.time}>{item.createdAt}</div>
            {commentDelete.showDelete && <div className={styles.delete} onClick={commentDelete.handleDelete}>· 删除</div>}
          </div>
          <div className={styles.button} onClick={() => handleReply(item.userId)}>
            <MessageOutlined /> 回复
          </div>
        </div>
        {item.userId === rId && (
          <ReplyBox item={item} hideReply={hideReply} isChild parentId={parentId} handleComments={handleComments} />
        )}
      </div>
    </div>
  )
})

const ReplyBox = React.memo(({
  item,
  hideReply = () => {},
  isChild = false,
  parentId = null,
  handleComments = () => {},
}) => {
  const [comments, setComments] = useState()
  const ref = useRef()
  const {
    loadings: { loading = false },
  } = useDva({
    loading: 'blog/fetchCreateComment',
  })
  useEffect(() => {
    ref.current.focus()
  },[])

  const handleBlur = () => {
    if(!comments){
      hideReply()
    }
  }

  return (
    <div style={{ backgroundColor:  isChild ? '#fff' : 'rgba(226, 228, 226,0.2)', padding: 12, margin: '12px 0'}}>
      <div>              
        <Input.TextArea 
          placeholder={`回复${item.nickname}...`}
          style={{ resize: 'none' }} 
          autoSize
          onChange={e => setComments(e.target.value)}
          onPressEnter={e => {
            if((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
              handleComments({
                content: comments,
                replyId: item.userId,
                parentId,
                root: isChild ? 2: 1,
              }).then(() => {
                setComments();
                hideReply();
              })
            }
          }}
          onBlur={handleBlur}
          ref={ref}
          value={comments}
        />
      </div>
      <div style={{ display: 'flex', marginTop: 12, justifyContent: 'flex-end' }}>
        <div>
          <span style={{ marginRight: 8, color: '#c2c2c2' }}>Ctrl or ⌘ + Enter</span>
          <Button 
            type='primary' 
            onClick={() => handleComments({
              content: comments,
              replyId: item.userId,
              parentId,
              root: isChild ? 2: 1,
            }).then(() => {
              setComments();
              hideReply();
            })} 
            disabled={!comments}
            loading={loading}
          >
            评论
          </Button>
        </div>
      </div>
    </div>
  )
})

export default function({
  commentsData = [],
  handleComments = () => {},
}) {
  return (
    <>
     {commentsData.map(item => (
       <CBox item={item} key={item.id} handleComments={handleComments} />
     ))}
    </>
  )
}