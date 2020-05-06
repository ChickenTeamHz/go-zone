// import { Link } from 'umi';
// import { connect } from 'dva';
import React,{ useEffect } from 'react';
import styles from './UserLayout.less';
import Logo from '../components/Logo';
import { clearToken } from '../utils/authToken';

export default function UserLayout(props){

  useEffect(()=> {
    clearToken();
  },[]);
  
  const {
    children,
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

