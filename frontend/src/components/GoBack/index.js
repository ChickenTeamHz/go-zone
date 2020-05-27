import React from 'react';
import { BackwardOutlined } from '@ant-design/icons';
import { router } from 'umi';
import styles from './index.less';

export default function() {
  return (
    <div className={styles.back} onClick={()=> router.goBack()}><BackwardOutlined /> Back</div>
  )
}
