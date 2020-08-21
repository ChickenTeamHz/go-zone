import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Space, List, Avatar, Menu, Dropdown, Modal, message, Empty } from 'antd';
import { router } from 'umi';
import {
  MessageOutlined,
  LikeOutlined,
  CalendarOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { useDva } from 'utils/hooks';
import avatarDefault from '../../assets/avatar.jpg';

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
        needQuery = false,
        moreOperate = false,
        emptyText = '还没有文章发布哦~',
      },
      ref,
    ) => {
      const [pageNum, setPageNum] = useState(pagination.pageNum);
      const [pageSize, setPageSize] = useState(pagination.pageSize);
      const {
        dispatch,
        data: {
          blog: { list = {} },
          user: { currentUser = {} },
        },
      } = useDva({}, ['blog', 'user']);

      const { items: listData = [], total = 0 } = list;

      const needloadRef = useRef(false);

      useImperativeHandle(ref, () => ({
        getPagination: () => {
          return {
            pageNum,
            pageSize,
          };
        },
        setPagination: ({ pageNum: pNum, pageSize: pSize }) => {
          if (pNum !== pageNum || pSize !== pageSize) {
            needloadRef.current = false;
          }
          setPageNum(pNum);
          setPageSize(pSize);
        },
        resetPagination: () => {
          if (pagination.pageNum !== pageNum || pagination.pageSize !== pageSize) {
            needloadRef.current = false;
          }
          setPageNum(pagination.pageNum);
          setPageSize(pagination.pageSize);
        },
      }));

      useEffect(() => {
        if (!needloadRef.current && needQuery) {
          needloadRef.current = true;
        } else {
          getList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [pageNum, pageSize]);

      const IconText = ({ icon, text, onClick = () => {} }) => (
        <Space style={{ cursor: 'pointer' }} onClick={onClick}>
          {React.createElement(icon)}
          {text}
        </Space>
      );
      const resetPagination = () => {
        if (pagination.pageNum !== pageNum || pagination.pageSize !== pageSize) {
          needloadRef.current = false;
        }
        setPageNum(pagination.pageNum);
        setPageSize(pagination.pageSize);
      };

      const handleDelete = (id) => {
        Modal.confirm({
          title: '确认删除这篇文章吗?',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            return dispatch({
              type: 'blog/fetchDeleteArticals',
              payload: id,
            }).then(() => {
              message.success('删除文章成功');
              resetPagination();
              getList(false, true);
            });
          },
        });
      };

      const getActions = (item) => {
        const actions = [
          <IconText
            icon={LikeOutlined}
            text={item?.likes}
            key="list-vertical-like-o"
            onClick={() => router.push(`/blog/detail/${item.id}`)}
          />,
          <IconText
            icon={MessageOutlined}
            text={item?.comments}
            key="list-vertical-message"
            onClick={() => router.push(`/blog/detail/${item.id}`)}
          />,
        ];
        if (moreOperate && currentUser.id === item.user?.id) {
          actions.push(
            <Dropdown
              overlay={
                <Menu style={{ width: 100, textAlign: 'center' }}>
                  <Menu.Item onClick={() => handleDelete(item.id)}>删除</Menu.Item>
                  <Menu.Item onClick={() => router.push(`/blog/edit/${item.id}`)}>编辑</Menu.Item>
                </Menu>
              }
              trigger="click"
              key="list-vertical-more"
            >
              <EllipsisOutlined />
            </Dropdown>,
          );
        }
        return actions;
      };

      if (!total && !loading) return <Empty description={emptyText} />;

      return (
        <List
          itemLayout="vertical"
          size="large"
          loading={loading}
          locale={{
            emptyText,
          }}
          pagination={
            total
              ? {
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
                }
              : null
          }
          dataSource={listData}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={getActions(item)}
              extra={
                item.coverPathUrl && (
                  <img
                    width={188}
                    height={106}
                    alt="logo"
                    src={item.coverPathUrl}
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/blog/detail/${item.id}`)}
                  />
                )
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={item?.user?.avatar || avatarDefault} />}
                title={<a onClick={() => router.push(`/blog/detail/${item.id}`)}>{item?.title}</a>}
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
