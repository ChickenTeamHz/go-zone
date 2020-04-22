// import { Link } from 'umi';
// import { connect } from 'dva';
import React from 'react';
import styles from './UserLayout.less';
import Logo from '../components/Logo';

export default function UserLayout(props){
  // const {
  //   route = {
  //     routes: [],
  //   },
  // } = props;
  // const { routes = [] } = route;
  const {
    children,
    // location = {
    //   pathname: '',
    // },
  } = props;
  return (
    <div className={`${styles.content} animated fadeIn slow`}>
      <Logo style={{ color: '#fff' }} />
      <div className={styles.main}>
        <div>{children}</div>
      </div>
    </div>
  );
};

