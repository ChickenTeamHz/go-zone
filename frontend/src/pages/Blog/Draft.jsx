import React, { useRef } from 'react';
import { Card } from 'antd';
import { useUnmount } from '@umijs/hooks';
import { ContainerOutlined } from '@ant-design/icons';
import { useQueryParams, NumberParam, withDefault } from 'use-query-params';
import styles from './index.less';
import { useDva } from '../../utils/hooks';
import BlogList from '../../components/BlogList';

export default function () {
  const {
    dispatch,
    loadings: { loading },
  } = useDva({ loading: 'blog/fetchArticles' }, ['blog']);
  const paginationRef = useRef();
  const [query, setQuery] = useQueryParams({
    pageNum: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, 10),
  });

  const getList = () => {
    const paginationValues = paginationRef.current.getPagination();
    setQuery(paginationValues);
    dispatch({
      type: 'blog/fetchArticles',
      payload: {
        ...paginationValues,
        publish: false,
        personal: true,
      },
    });
  };

  useUnmount(() => {
    dispatch({
      type: 'blog/clearList',
    });
  });

  return (
    <div className="box" style={{ maxWidth: 1000, margin: 'auto' }}>
      <Card
        bordered={false}
        className={styles.column}
        title={
          <div>
            草稿箱 <ContainerOutlined style={{ color: '#bbb' }} />
          </div>
        }
      >
        <BlogList
          loading={loading}
          getList={getList}
          pagination={{
            pageNum: query.pageNum,
            pageSize: query.pageSize,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          ref={paginationRef}
          moreOperate
          emptyText="草稿箱空空如也，继续保持！"
        />
      </Card>
    </div>
  );
}
