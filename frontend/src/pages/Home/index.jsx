import React, { useRef }  from 'react';
import { Card, Input } from 'antd';
import { useUnmount } from '@umijs/hooks';
import styles from './style.less';
import { useDva } from '../../utils/hooks';
import BlogList from '../../components/BlogList';

const { Search } = Input;

export default function () {
  const {
    dispatch,
    loadings: { loading },
  } = useDva({ loading: 'blog/fetchArticles' }, ['blog']);

  const paginationRef = useRef()

  const getList = () => {
    const paginationValues = paginationRef.current.getPagination()
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
      type: 'blog/clearList'
    })
  })

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
          <BlogList loading={loading} getList={getList} ref={paginationRef} />
        </Card>
      </div>
      <div />
    </div>
  );
}
