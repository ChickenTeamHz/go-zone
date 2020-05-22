import React from 'react';
import styles from './index.less';

export default function({spinning = true}) {
  if(spinning === false) {
    return null;
  }
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
