import React from 'react';
import styles from './index.less';

export default function() {
  return (
    <div className={styles.loader}>
      <div className={styles.liner}>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  )
}
