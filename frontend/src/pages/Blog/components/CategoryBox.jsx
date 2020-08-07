import React, { useState, useRef, useEffect } from 'react';
import { Input, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { CheckableTag } = Tag;

export default function({
  value,
  categoryList = [],
  placeholder = '请添加分类专栏',
  onChange,
}) {
  const [categorys,setCategorys] = useState(categoryList);
  const [createCategory, setCreateCategory] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if(createCategory && inputRef.current) {
      inputRef.current.focus();
    }
  },[createCategory]);

  const showInput = () => {
    setCreateCategory(true);
  };

  const handleChange = (checked, item) => {
    if(checked) {
      onChange(item)
    }
  }

  const handleInputConfirm = () => {
    if(inputValue) {
      if(!categorys?.includes(inputValue)) {
        setCategorys(l => {
          l.push(inputValue)
          return l;
        });
      }
      onChange(inputValue);
      setInputValue(null);
    }
    setCreateCategory(false);
  }

  return (
    <div className={styles.categoryBox}>
      <div className={styles.box}>
        {value || <span className={styles.placeholder}>{placeholder}</span>}
      </div>
      <div>
        {categorys.map(item => (
          <CheckableTag key={item} checked={item === value} onChange={c => handleChange(c,item)}>{item}</CheckableTag>
        ))}
        {createCategory && categorys.length < 10 && (
          <Input
            type="text"
            size="small"
            ref={inputRef}
            style={{ width: 103.4 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!createCategory && categorys.length < 10 && (
          <Tag onClick={showInput} className={styles.button}>
            <PlusOutlined /> 新建分类专栏
          </Tag>
        )}
      </div>
    </div>
  )
}
