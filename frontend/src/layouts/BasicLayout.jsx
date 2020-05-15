import React from 'react';
import { Button } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
import { animateScroll as scroll } from 'react-scroll';
import { useToggle } from '@umijs/hooks';
import styles from './BasicLayout.less';
import SlideBar from '../components/SlideBar';
import { menuData } from '../common/menu';
import Logo from '../components/Logo';
import { useDva } from '../utils/hooks';
import avatarDefault from '../assets/avatar.jpg';

function LearnMore() {
  const { state:visible, toggle } = useToggle(false);
  const { data: { user: { currentUser }}} = useDva({},['user']);
  const avatar = currentUser.avatar || avatarDefault;
  return (
    <>
      <div className={styles.learnMore} onClick={()=> toggle(true)}>
        <div className={styles.text}>MORE</div>
        <div className={styles.icon}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <SlideBar menuData={menuData} handleClose={()=> toggle(false)} visible={visible} avatar={avatar} name={currentUser.nickname} />
    </>
  )
}

function ToTop() {
  function scrollToTop() {
    scroll.scrollToTop({
      smooth: true,
    });
  }
  return (
    <div className={styles.toTop}>
      <Button type="primary" shape="circle" icon={<CaretUpOutlined />} size="large" onClick={scrollToTop} />
    </div>
  )
}

function BasicLayout(props) {
  const { children } = props;
  return (
    <div className={`${styles.content} animated fadeIn slow`}>
      <Logo />
      <LearnMore />
      <div className={styles.main}>{children}</div>
      <ToTop />
    </div>
  );
}

export default BasicLayout;
