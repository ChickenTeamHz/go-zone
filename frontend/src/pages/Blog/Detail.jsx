import React, { useState, useRef, useEffect } from 'react';
import { MdPriview } from 'md-pre-editor';
import { useMount } from '@umijs/hooks';
import { EyeOutlined, LikeOutlined, MessageOutlined, CalendarOutlined } from '@ant-design/icons'
import { Input, Button, Popover, Card, Form, Modal, Switch, Select, Tag, message, Avatar, Divider } from 'antd';
import { useDva, useModal, useResetFormOnCloseModal } from '../../utils/hooks';
import styles from './index.less';
import GoBack from '../../components/GoBack';

const { CheckableTag } = Tag;

export default function ({
  match: { params: { articalId }},
}) {
  const { 
    dispatch, 
    loadings: { loading },
    data: { blog: { detail = {} }},
  } = useDva({uploading: 'blog/fetchArticalDetail'}, ['blog']);

  useMount(()=> {
    dispatch({
      type: 'blog/fetchArticalDetail',
      payload: [articalId],
    });
  })


  return (
    <div className="box">
      <div className={styles.detail}>
        <GoBack />
        <Card bordered={false}>
          <div className={`flex ${styles.user}`}>
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
          <h1 style={{ textAlign: 'center' }}>{detail?.title}</h1>
          {detail?.coverPathUrl && (
            <div
              style={{ background: `url(${detail.coverPathUrl}) no-repeat center`, backgroundSize: 'cover' }}
              className={styles.img}
            />
          )}
          <MdPriview value={detail?.content}/>
          <Divider />
          <div>
            <h2>评论区</h2>
          </div>
        </Card>
        <div className={styles.extra}>
          <div><LikeOutlined /> 点赞</div>
          <div><MessageOutlined /> 评论</div>
        </div>
      </div>
    </div>
  )
}
