import React, { useState } from 'react';
import { Select, Upload, message, Button, Divider } from 'antd';
import { useDva } from 'utils/hooks';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import HOST from '../../../services/host';
import { getToken } from '../../../utils/authToken';

export default function({
  handleOk = () => {},
  albumValue = undefined,
}) {
  const {
    dispatch,
    loadings: { loading },
    data: { album: { list } },
  } = useDva({
    loading: 'album/fetchUploadPhotos',
  },['album']);

  const [fileList, setFileList] = useState([]);
  const [fileKeysList, setFileKeysList] = useState([]);
  const [albumId, setAlbumId] = useState(albumValue);

  /**
   * 图片校验
   */
  const beforeUpload = (file, limit = 2) => {
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg');
    if (!isJPG) {
      message.error('请按照正确格式上传');
      return false;
    }
    const isLimited = file.size / 1024 / 1024 < limit;
    if (!isLimited) {
      message.error(`${file.name}上传的图片过大,须在${limit}M以内!`);
      return false;
    }
    return isJPG && isLimited;
  };

  /**
   * 图片上传
   * @param {*} info
   */
  const handleChange = info => {
    const  { file } = info;
    const fList = [...info.fileList];
    if(!file.status) {
      return;
    }
    const fKeys = [];
    fList.forEach(f => {
      if (f.response && f.response.code === 0) {
        const { data } = f.response;
       fKeys.push({
         key: data.key,
         name: f.uid,
       })
      };
    });
    setFileKeysList(fKeys);
    setFileList(fList);
  };

  /**
   * 删除图片
   * @param {*} file
   */
  const handleRemove = file => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    const newFileKeysList = fileKeysList.filter(item => item.name !== file.uid);
    newFileList.splice(index, 1);
    setFileList(newFileList);
    setFileKeysList(newFileKeysList);
  }

  const uploadProps = {
    name: 'file',
    multiple: true,
    withCredentials: true,
    fileList,
    action: `${HOST}/upload/file`,
    beforeUpload: file => beforeUpload(file, 2),
    listType: 'picture-card',
    onChange: handleChange,
    headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
    showUploadList: {
      showRemoveIcon: true,
      showPreviewIcon: false,
    },
    onRemove: handleRemove,
  };

  const handleUploadPhotos = () => {
    if(!albumId) {
      message.error('请选择上传相册！');
      return;
    }
    const imgKeys = fileKeysList.map(item => item.key);
    dispatch({
      type: 'album/fetchUploadPhotos',
      payload:[albumId, { imgKeys }],
    }).then(()=>{
      handleOk();
    });
  }

  return (
    <>
      <div className={styles.selectName}>
        <span>上传到</span>
        <Select
          placeholder="请选择相册"
          style={{ marginLeft: 12, width: 240 }}
          value={albumId}
          onChange={v => setAlbumId(v)}
        >
          {list.map(item => (
            <Select.Option key={item.id} value={item.id}>
              <img src={item.coverPathUrl} alt="album" style={{ height: 24, width: 42.67, marginRight: 12 }} />{item.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className={styles.uploadArea}>
        <Divider />
        <Upload {...uploadProps} className={fileList.length > 0 ? '' : styles.content}>
          {fileList.length > 0 ? (
            <>
              <p className="ant-upload-drag-icon">
                <PlusOutlined />
              </p>
              <p className="ant-upload-text">点击上传</p>
            </>
          ):(
            <Button type="primary" size="large" icon={<UploadOutlined />}>选择照片(可多选)</Button>
          )}
        </Upload>
      </div>
      {fileKeysList.length > 0 ? (
        <div className={styles.uploadButton}>
          <Divider />
          <div style={{ display: 'flex', alignItems: 'baseline'}}>
            <Button type="primary" size="large" onClick={handleUploadPhotos} loading={loading}>确认上传</Button>
            <p style={{ marginLeft: 12 }}>共{fileKeysList.length}张照片（上传过程中请不要删除原始照片）</p>
          </div>
        </div>
      ): null}
    </>
  )
}
