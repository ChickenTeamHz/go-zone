import React, { useRef, useState } from 'react';
import { Card, Input } from 'antd';
import { useUnmount, useMount } from '@umijs/hooks';
import { useQueryParams, NumberParam, withDefault, StringParam } from 'use-query-params';
import styles from './index.less';
import { useDva } from '../../utils/hooks';
import BlogList from '../../components/BlogList';

const { Search } = Input;
export default function () {
  const {
    dispatch,
    loadings: { loading },
    data: {
      blog: { list = {} },
    },
  } = useDva({ loading: 'blog/fetchSearchArticles' }, ['blog']);
  const paginationRef = useRef();
  const [search, setSearch] = useState();
  const [searchQuery, setQuery] = useQueryParams({
    pageNum: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, 10),
    query: StringParam,
  });

  const getList = (firstLoad = false, resetP = false) => {
    let searchValue = search;
    let paginationValues = paginationRef.current.getPagination();
    if (firstLoad) {
      searchValue = searchQuery.query;
      setSearch(searchQuery.query);
      paginationValues = {
        pageNum: searchQuery.pageNum,
        pageSize: searchQuery.pageSize,
      }
      paginationRef.current.setPagination(paginationValues);
    }
    if (resetP) {
      paginationValues = {
        pageNum: 1,
        pageSize: 10,
      };
    }
    const payload = {
      ...paginationValues,
      query: searchValue,
    };
    setQuery(payload);
    dispatch({
      type: 'blog/fetchSearchArticles',
      payload: {
        ...paginationValues,
        search: searchValue,
      },
    });
  };

  useMount(() => {
    getList(true);
  });

  useUnmount(() => {
    dispatch({
      type: 'blog/clearList',
    });
  });

  const handleSearch = () => {
    paginationRef.current.resetPagination();
    getList(false, true);
  };

  return (
    <div className="box" style={{ maxWidth: 1000, margin: 'auto' }}>
      <div style={{ margin: '0 24px 32px' }}>
        <Search
          placeholder="搜索文字/标签"
          enterButton
          className={styles.search}
          value={search}
          size="large"
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          onSearch={handleSearch}
        />
      </div>
      <h3 style={{ color: '#aaa' }}>
        搜到 <span style={{ fontSize: 18, color: '#666' }}>{list.total || 0}</span> 篇文章
      </h3>
      <Card bordered={false} className={styles.column}>
        <BlogList
          loading={loading}
          getList={getList}
          pagination={{
            pageNum: searchQuery.pageNum,
            pageSize: searchQuery.pageSize,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          ref={paginationRef}
          emptyText="没有找到相关文章~"
          needQuery
        />
      </Card>
    </div>
  );
}
