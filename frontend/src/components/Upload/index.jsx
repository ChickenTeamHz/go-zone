import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Upload, message, Spin } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './index.less';
import useCropModal from './useCropModal';
import { getToken } from '../../utils/authToken';
import { fetchBase64Request } from '../../services/api';
import HOST from '../../services/host';

/**
 * 自定义上传图片（支持裁剪）
 * @param {*} param0
 */
export default function({
  needCrop = true,  // 需要裁剪
  className,
  cropRatio = 16 / 9,
  width = 188,
  height = 106,
  onChange = () => {}, // 图片上传文件改变表单值
  action = `${HOST}/upload/file`,
  value,
  tokenOptions = getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
}){
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImgUrl] = useState((value && value.url) || null);

  function triggerImgChange({key, url}) {
    setImgUrl(url);
    return onChange && onChange({key,url});
  }

  const cropModal = useCropModal({
    cropRatio,
    triggerImgChange,
    fetchBase64Request,
  })

  useEffect(()=>{
    if(!imageUrl && value)  {
      setImgUrl(value.url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[value]);


  /**
   * 图片校验
   */
  function beforeUploadImgLimit(file, limit = 2){
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg');
    if (!isJPG) {
      message.error('请按照正确格式上传');
      return false;
    }
    const isLimited = file.size / 1024 / 1024 < limit;
    if (!isLimited) {
      message.error(`上传的图片过大,须在${limit}M以内!`);
      return false;
    }
    if (needCrop) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        cropModal.changeFile({
          url: e.target.result,
          name: file.name,
          suffix: file.type.split('/')[1],
        });
        cropModal.handleModal(true);
      };
      return false;
    }
    return isJPG && isLimited;
  };


  /**
   * 上传图片
   */
  const handleChange = ({ file }) => {
    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (file.status === 'done') {
      if (file.response && file.response.code === 0) {
        const { data } = file.response;
        let url = '';
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = e => {
          url = e.target.result;
          triggerImgChange({
            key: data.key,
            url: url || data.url,
          })
          setLoading(false);
          message.success('上传成功');
        };
      } else {
        message.error('上传失败，请重新上传');
        setLoading(false);
      }
    }
  };

  const strClass = classNames(styles.CustomUpload, className);
  const spinIcon = <LoadingOutlined style={{ fontSize: 24, color: '#666' }} />;
  const uploadImg = val => {
    return (
      <div className={styles.icon} style={{ width, height }}>
        <div>
          <PlusOutlined className={styles.imgcss}/>
          <div className={styles.title}>{val}</div>
        </div>
      </div>
    );
  };
  return (
    <div className={strClass}>
      <Upload
        withCredentials
        name="file"
        listType="picture-card"
        accept="image/jpeg,image/jpg,image/png"
        className="avatar-uploader"
        showUploadList={false}
        action={action}
        headers={tokenOptions}
        beforeUpload={file => beforeUploadImgLimit(file, 2)}
        onChange={handleChange}
      >
        <Spin spinning={loading} indicator={spinIcon}>
          {imageUrl ? (
            <img alt="" src={imageUrl} style={{ minWidth: width, minHeight: height, width, height }} />
          ) : (
            uploadImg('上传图片')
          )}
        </Spin>
      </Upload>
      {cropModal.content}
    </div>
  )
}
