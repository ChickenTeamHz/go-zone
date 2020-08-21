import React, { useRef } from 'react';
import { Card, Input } from 'antd';
import { router } from 'umi';
import { useUnmount } from '@umijs/hooks';
import { NumberParam, useQueryParams, withDefault } from 'use-query-params';
import styles from './style.less';
import { useDva } from '../../utils/hooks';
import BlogList from '../../components/BlogList';

const { Search } = Input;

export default function () {
  const {
    dispatch,
    loadings: { loading },
  } = useDva({ loading: 'blog/fetchArticles' }, ['blog']);

  const paginationRef = useRef();
  const [query, setQuery] = useQueryParams({
    pageNum: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, 5),
  });

  const getList = () => {
    const paginationValues = paginationRef.current.getPagination();
    setQuery(paginationValues);
    dispatch({
      type: 'blog/fetchArticles',
      payload: {
        public: true,
        ...paginationValues,
      },
    });
  };

  useUnmount(() => {
    dispatch({
      type: 'blog/clearList',
    });
  });

  const handleSearch = (val) => {
    router.replace(`/blog/search?query=${val}`);
  };

  return (
    <div className={styles.home}>
      <div className={styles.bg} />
      <Search
        placeholder="欢迎来到Go Zone ~~~ 搜一搜文章"
        size="large"
        enterButton
        className={styles.search}
        onSearch={handleSearch}
        onPressEnter={(e) => handleSearch(e.target.value)}
      />
      <div className={styles.blog}>
        <Card bordered={false}>
          <BlogList
            loading={loading}
            getList={getList}
            ref={paginationRef}
            pagination={{
              pageNum: query.pageNum,
              pageSize: query.pageSize,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
          />
        </Card>
      </div>
      <div />
    </div>
  );
}
