import React from 'react';
import { MailOutlined } from '@ant-design/icons';
import Beian from 'assets/beian.png';
import styles from './index.less';

export default function ({ style }) {
  return (
    <div className={styles.footer} style={style}>
      <div className={styles.copyright}>
        Copyright © 2020-2022 葉大树のHome. All rights reserved. 浙ICP备2020033168号
      </div>
      <div className={styles.head}>
        <div className={styles.beian}>
          <a
            target="_blank"
            rel="noreferrer"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802011153"
          >
            <img src={Beian} alt="beian" />
            <p>浙公网安备 33010802011153号</p>
          </a>
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=RSMkKyIaPSwkKmhya3R2BTQ0ayYqKA"
        >
          <MailOutlined />
          &nbsp; 意见反馈，请联系
        </a>
      </div>
    </div>
  );
}
