import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Space, List, Avatar } from 'antd';
import { router } from 'umi';
import { MessageOutlined, LikeOutlined, CalendarOutlined } from '@ant-design/icons';
import { useDva } from 'utils/hooks';

const BlogList = React.memo(
  forwardRef(
    (
      {
        pagination = {
          pageNum: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20', '50'],
        },
        loading = false,
        getList = () => {},
      },
      ref,
    ) => {
      const [pageNum, setPageNum] = useState(pagination.pageNum);
      const [pageSize, setPageSize] = useState(pagination.pageSize);
      const {
        data: {
          blog: { list = {} },
        },
      } = useDva({}, ['blog']);

      const { items: listData = [], total = 0 } = list;

      useImperativeHandle(ref, () => ({
        getPagination: () => {
          return {
            pageNum,
            pageSize,
          };
        },
      }));

      useEffect(() => {
        getList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [pageNum, pageSize]);

      const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );

      return (
        <List
          itemLayout="vertical"
          size="large"
          loading={loading}
          locale={{
            emptyText: '还没有文章发布哦~',
          }}
          pagination={{
            onChange: (p) => {
              setPageNum(p);
            },
            onShowSizeChange: (_, pSize) => {
              setPageSize(pSize);
            },
            showSizeChanger: true,
            showQuickJumper: true,
            current: pageNum,
            pageSize,
            total,
            pageSizeOptions: pagination.pageSizeOptions,
          }}
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <IconText icon={LikeOutlined} text={item?.likes} key="list-vertical-like-o" />,
                <IconText
                  icon={MessageOutlined}
                  text={item?.comments}
                  key="list-vertical-message"
                />,
              ]}
              extra={
                item.coverPathUrl && (
                  <img width={188} height={106} alt="logo" src={item.coverPathUrl} />
                )
              }
              onClick={() => router.push(`/blog/detail/${item.id}`)}
            >
              <List.Item.Meta
                avatar={<Avatar src={item?.user?.avatar} />}
                title={<a href={item.href}>{item?.title}</a>}
                description={
                  <div>
                    <span>{item?.user?.nickname}</span>
                    <span style={{ marginLeft: 12 }}>
                      <CalendarOutlined /> {item?.updatedAt}
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      );
    },
  ),
);

export default BlogList;
