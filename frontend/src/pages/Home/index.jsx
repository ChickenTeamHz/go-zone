import React, { useState, useEffect } from 'react';
import { Card, Space, List, Avatar, Input } from 'antd';
import { MessageOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';

import styles from './style.less';
import { useDva } from '../../utils/hooks';
import { router } from 'umi';

const { Search } = Input;

export default function() {
  const { 
    dispatch, 
    loadings: { loading },
    data: { blog: { list = {} }},
  } = useDva({loading: 'blog/fetchArticals'}, ['blog']);

  const { items: listData = [], total = 0 } = list;

  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const getList = () => {
    dispatch({
      type: 'blog/fetchArticals',
      payload: {
        public: true,
        pageNum,
        pageSize,
      },
    });
  };

  useEffect(() => {
    getList()
  },[pageNum, pageSize])

  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <div className={styles.home}>
      <div className={styles.bg} />
      <Search
        placeholder="欢迎来到Go Zone ~~~ 搜一搜文章"
        size="large"
        enterButton
        className={styles.search}
      />
      <div className={styles.blog}>
        <Card bordered={false}>
          <List
            itemLayout="vertical"
            size="large"
            loading={loading}
            locale={{
              emptyText: '还没有文章发布哦~',
            }}
            pagination={{
              onChange: (p, pSize) => {
                setPageNum(p)
                setPageSize(pSize)
              },
              showSizeChanger: true,
              showQuickJumper: true,
              current: pageNum,
              pageSize,
              total,
            }}
            dataSource={listData}
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText icon={LikeOutlined} text={item?.likes} key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text={item?.comments} key="list-vertical-message" />,
                ]}
                extra={
                  item.coverPathUrl && (
                    <img
                      width={188}
                      height={106}
                      alt="logo"
                      src={item.coverPathUrl}
                    />
                  )
                }
                onClick={() => router.push(`/blog/${item.id}`)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item?.user?.avatar} />}
                  title={<a href={item.href}>{item?.title}</a>}
                  description={(
                    <div>
                      <span>{item?.user?.nickname}</span>
                      <span style={{ marginLeft: 12 }}><CalendarOutlined /> {item?.updatedAt}</span>
                    </div>
                  )}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
      <div />
    </div>
  );
}
