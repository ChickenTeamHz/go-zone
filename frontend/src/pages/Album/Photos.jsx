import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, message, Divider, Alert, Modal, Select } from 'antd';
import { useDva, useModal, useBodyScroll } from 'utils/hooks';
import { CloudUploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Viewer from 'viewerjs';
import { useUnmount } from '@umijs/hooks';
import PhotoUpload from './component/PhotoUpload';
import styles from './index.less';

import 'viewerjs/dist/viewer.css';
import Loading from '../../components/Loading';

function SelectIcon({ status, handleClick = () => {}, value }) {
  if(status) {
    return (
      <CheckCircleOutlined className={`${styles.imgIcon} ${styles.select}`} onClick={() => handleClick(value, false)}/>
    )
  };
  return (
    <span className={`${styles.imgIcon} ${styles.notSelect}`} onClick={() => handleClick(value, true)}/>
  )
}

export default function({
  match: { params: { albumId }},
}) {
  const {
    dispatch,
    loadings: { loading },
    data: { album: { detail: { album = {}, photoList = []}, list: albumList = [] } },
  } = useDva({
    loading: 'album/fetchPhotos',
  },['album']);

  const uploadModalParams = useModal();
  const photoRef = useRef(null);

  const [operate, setOperate] = useState(false);
  const [operateList, setOperateList] = useState({});

  const bodyScroll = useBodyScroll();
  const gallery = useRef(null);

  const [toAlbumId, setToAlbumId] = useState();
  const moveModalParams = useModal();

  const getList = () => {
    dispatch({
      type: 'album/fetchPhotos',
      payload: albumId,
    }).then(() => {
      gallery.current.update();
    })
  };

  const getAlbumList = () => {
    dispatch({
      type: 'album/fetchAlbumList',
    });
  };

  useEffect(() => {
    gallery.current = new Viewer(photoRef.current,{
      title: false,
      show() {
        bodyScroll.hideScroll();
      },
      hide() {
        bodyScroll.showScroll();
      },
    });
    getList();
    getAlbumList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useUnmount(() => {
    dispatch({
      type: 'album/clearDetail',
    })
  })


  /**
   * 确认上传照片
   */
  const handleOk = () => {
    uploadModalParams.hideModal();
    getList();
    message.success('上传成功！');
  }

  /**
   * 点击批量操作
   */
  const handleOperate = () => {
    if(operate) {
      setOperate(false);
      return;
    }
    const newOperateList = {};
    photoList.forEach(item => {
      newOperateList[item.id] = false;
    });
    setOperateList(newOperateList);
    setOperate(true);
  }

  const handleOperateItem = (id, status) => {
    setOperateList(list => {
      return {
        ...list,
        [id]: status,
      }
    });
  }

  /**
   * 点击上传照片
   */
  const handleUpload = () => {
    if(operate) {
      message.error('请先完成批量操作！');
      return ;
    }
    uploadModalParams.showModal();
  }

  /**
   * 删除照片
   */
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除这些照片吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: ()=> new Promise((resolve, reject) => {
        const imgIds = [];
        Object.keys(operateList).forEach(item => {
          if(operateList[item]) {
            imgIds.push(item);
          }
        });
        if(imgIds.length === 0) {
          message.error('至少选择一张照片！');
          resolve();
          return;
        }
        dispatch({
          type: 'album/fetchDeletePhotos',
          payload: [albumId, { imgIds }],
        }).then(() => {
          message.success('删除成功');
          setOperate(false);
          getList();
          resolve('success');
        }).catch(() => {
          reject();
        });
      }),
    })
  }


  const handleMove = () => {
    if(!toAlbumId) {
      message.error('请选择相册！');
      return;
    }
    const imgIds = [];
    Object.keys(operateList).forEach(item => {
      if(operateList[item]) {
        imgIds.push(item);
      }
    });
    if(imgIds.length === 0) {
      message.error('至少选择一张照片！');
      return;
    }
    dispatch({
      type: 'album/fetchMovePhotos',
      payload: [albumId, {
        toAlbumId,
        imgIds,
      }],
    }).then(()=> {
      message.success('移动成功！');
      setOperate(false);
      getList();
      moveModalParams.hideModal();
    })
  }


  return (
    <div className="box">
      <Card bordered={false} style={{ minHeight: 650 }}>
        <div className={styles.photoTop}>
          <img src={album.coverPathUrl} alt="album" />
          <div>
            <h3>{album.name}</h3>
            <div>
              <Button type="primary" onClick={handleUpload}><CloudUploadOutlined /> 上传照片</Button>
              {photoList && photoList.length > 0 ? (
                <Button style={{ marginLeft: 12 }} onClick={handleOperate}>{operate ? '取消批量操作':'批量操作'}</Button>
              ):null}
            </div>
          </div>
        </div>
        <Divider />
        <div className={styles.photos}>
          {operate ? (
            <Alert
              style={{ marginBottom: 24 }}
              type="info"
              message={(
                <div>
                  <Button onClick={()=> moveModalParams.showModal()}>移动到相册</Button>
                  <Button type="danger" style={{ marginLeft: 12}} onClick={handleDelete}>删除</Button>
                </div>
              )}
            />
          ):null}
          {photoList && photoList.length === 0 ? (
            <div className={styles.empty}>现在还是空空如也~快去上传照片吧^_^</div>
          ):null}
          <div>
            <ul ref={photoRef}>
              {photoList.map(item => (
                <li key={item.id}>
                  {operate ? <SelectIcon status={operateList[item.id]} handleClick={handleOperateItem} value={item.id} /> : null}
                  <img src={item.imgPathUrl} alt="img" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      <Modal
        {...uploadModalParams.modalProps}
        title="上传照片"
        centered={false}
        footer={null}
        width="80%"
      >
        <PhotoUpload handleOk={handleOk} albumValue={album.id}/>
      </Modal>
      <Modal {...moveModalParams.modalProps} onOk={handleMove} title="移动到相册" okText="移动" centered={false}>
        <div className={styles.selectName}>
          <span>移动到</span>
          <Select
            placeholder="请选择相册"
            style={{ marginLeft: 12, width: 240 }}
            value={toAlbumId}
            onChange={v => setToAlbumId(v)}
          >
            {albumList.map(item => {
              return item.id !== albumId ? (
                <Select.Option key={item.id} value={item.id}>
                <img src={item.coverPathUrl} alt="album" style={{ height: 24, width: 42.67, marginRight: 12 }} />{item.name}
              </Select.Option>
              ):null
            })}
          </Select>
        </div>
      </Modal>
      <Loading spinning={loading} />
    </div>
  )
}
