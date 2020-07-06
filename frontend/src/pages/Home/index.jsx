import React from 'react';
import { Card, Space, List, Avatar, Input } from 'antd';
import { MessageOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import styles from './style.less';

const listData = [];
for (let i = 0; i < 23; i+=1) {
  listData.push({
    href: 'https://ant.design',
    title: `ant design part ${i}`,
    name: '张三',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    createAt: '2020-22-22',
  });
}


const { Search } = Input;

export default function() {
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
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={listData}
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    width={188}
                    height={106}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={(
                    <div>
                      <span>{item.name}</span>
                      <span style={{ marginLeft: 12 }}><CalendarOutlined /> {item.createAt}</span>
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
