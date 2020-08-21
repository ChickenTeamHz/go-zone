import React from 'react';
import { Button } from 'antd';
import { router } from 'umi';
import { CaretUpOutlined, FormOutlined } from '@ant-design/icons';
import { animateScroll as scroll } from 'react-scroll';
import { useToggle, useScroll } from '@umijs/hooks';
import { QueryParamProvider } from 'use-query-params';
import styles from './BasicLayout.less';
import SlideBar from '../components/SlideBar';
import { menuData } from '../common/menu';
import Logo from '../components/Logo';
import { useDva } from '../utils/hooks';
import avatarDefault from '../assets/avatar.jpg';

function LearnMore() {
  const { state: visible, toggle } = useToggle(false);
  const {
    data: {
      user: { currentUser },
    },
  } = useDva({}, ['user']);
  const avatar = currentUser.avatar || avatarDefault;
  return (
    <>
      <div className={styles.learnMore} onClick={() => toggle(true)}>
        <div className={styles.text}>MORE</div>
        <div className={styles.icon}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <SlideBar
        menuData={menuData}
        handleClose={() => toggle(false)}
        visible={visible}
        avatar={avatar}
        name={currentUser.nickname}
      />
    </>
  );
}

function ToTop() {
  function scrollToTop() {
    scroll.scrollToTop({
      smooth: true,
    });
  }
  return (
    <div className={styles.toTop}>
      <Button
        type="primary"
        shape="circle"
        icon={<CaretUpOutlined />}
        size="large"
        onClick={scrollToTop}
      />
    </div>
  );
}

function BasicLayout(props) {
  const {
    children,
    location: { pathname },
  } = props;
  const [scrollEle] = useScroll(document);

  const handleCreateBlog = () => {
    router.push('/blog/create');
  };

  const showBlogEdit = pathname !== '/blog/create' && pathname?.indexOf('/blog/edit') === -1;
  return (
    <div className={`${styles.content} animated fadeIn slow`}>
      <Logo />
      {showBlogEdit && (
        <div className={styles.edit} onClick={handleCreateBlog}>
          <FormOutlined /> 写博客
        </div>
      )}
      <LearnMore />
      <div className={styles.main}>
        <QueryParamProvider history={props.history}>{children}</QueryParamProvider>
      </div>
      {scrollEle.top > 0 ? <ToTop /> : null}
    </div>
  );
}

export default BasicLayout;
