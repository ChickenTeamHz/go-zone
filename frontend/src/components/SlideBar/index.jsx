import { useToggle } from '@umijs/hooks';
import React, { useState } from 'react';
import { CaretRightOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import styles from './style.less';
import { useBodyScroll } from '../../utils/hooks';

export default function ({ menuData = [], handleClose = ()=> {}, visible = false, avatar, name }) {
  const { state: fold, toggle } = useToggle(false);
  const [selectKey, setSelectKey] = useState(0);
  const handleSelect = (key) => {
    if(selectKey === key) {
      toggle();
      return;
    };
    setSelectKey(key);
    toggle(true);
  }

  const { showScroll, hideScroll} = useBodyScroll();
  if(visible) {
    hideScroll();
  }else {
    showScroll();
  }

  const renderIcon = (hasChildren, index) => {
    if(hasChildren) {
      return selectKey === index && fold ? <UpOutlined /> : <DownOutlined />;
    }
    return null;
  }
  const getHref = (hasChildren,link) => hasChildren ? {} : { href: link };
  return (
    <div className={`${styles.slideBar} ${visible ? styles.show : ''}`}>
      <div className={styles.close} onClick={()=>handleClose()}>CLOSE <CaretRightOutlined /></div>
      <div className={styles.account}>
        <Avatar src={avatar} size={128} className={styles.avatar} />
        <div className={styles.name}>{name}</div>
      </div>
      <ul className={styles.bar}>
        {menuData.map((val,index) => (
          <li className={styles.parent} key={val.link}>
            <a
              onClick={()=> handleSelect(index)}
              {...getHref(val.children, val.link)}
            >
              {val.desc} {renderIcon(val.children, index)}
            </a>
            {val.children && selectKey === index && fold ? (
              <ul className={styles.childBar}>
                {val.children.map(child => (
                  <li className={styles.child} key={child.link}>
                    <a href={child.link}>{child.desc}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
