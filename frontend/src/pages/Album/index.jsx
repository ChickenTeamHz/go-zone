import React, { useState, useEffect } from 'react';
import { Card, Button, Divider, Input, Modal, Form, message, Popconfirm } from 'antd';
import { HeartTwoTone, CloudUploadOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { router } from 'umi';
import Upload from '../../components/Upload';
import styles from './index.less';
import { useModal, useDva } from '../../utils/hooks';
import Loading from '../../components/Loading';
import PhotoUpload from './component/PhotoUpload';

const modalType = {
  create: 'create',
  edit: 'edit',
};

function AlbumCard({ item, handleDelete, handleEdit }) {
  return (
    <div className={styles.albumCard}>
      <img src={item.coverPathUrl} alt="album" onClick={()=> router.push(`/album/${item.id}/photos`)} />
      <div>
        <div className={styles.name} onClick={()=> router.push(`/album/${item.id}/photos`)}>{item.name}</div>
        <EditOutlined style={{ marginLeft: 8, cursor: 'pointer' }} onClick={handleEdit} />
        <Popconfirm
          title="确定删除该相册吗"
          okText="确定"
          cancelText="取消"
          icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
          onConfirm={handleDelete}
        >
          <DeleteOutlined style={{ marginLeft: 8, cursor: 'pointer' }} />
        </Popconfirm>
      </div>
    </div>
  )
}

export default function() {
  const [form] = Form.useForm();
  const modalParams = useModal();
  const uploadModalParams = useModal();
  const [type,setType] = useState(modalType.create);
  const [selectItem, setSelectItem] = useState({});
  const {
    dispatch,
    loadings: { createLoading, loading, editLoading },
    data: { album: { list } },
  } = useDva({
    createLoading: 'album/fetchCreateAlbum',
    loading: 'album/fetchAlbumList',
    editLoading: 'album/fetchUpdateAlbum',
  },['album']);

  const getList = () => {
    dispatch({
      type: 'album/fetchAlbumList',
    });
  };

  useEffect(()=>{
    getList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const handleModalVisible = (t, item = {}) => {
    setType(t);
    form.resetFields();
    if(t === modalType.edit) {
       setSelectItem(item);
       form.setFieldsValue({
          name: item.name,
          coverPath: {
            key: item.coverPath,
            url: item.coverPathUrl,
          },
       })
    }
    modalParams.showModal();
  }

  const handleForm = () => {
    form.validateFields().then(values => {
      const payload = {
        name: values.name,
        coverPath: values.coverPath && values.coverPath.key,
      };

      if(type === modalType.create){
        dispatch({
          type: 'album/fetchCreateAlbum',
          payload,
        }).then(data => {
          message.success(data);
          getList();
          modalParams.hideModal();
        });
        return;
      }
      dispatch({
        type: 'album/fetchUpdateAlbum',
        payload: [selectItem.id, payload],
      }).then(data => {
        message.success(data);
        getList();
        modalParams.hideModal();
      });
    })
  }

  const handleDelete = id => {
    dispatch({
      type: 'album/fetchDeleteAlbum',
      payload: id,
    }).then(data=>{
      message.success(data);
      getList();
    })
  }

  const handleOk = () => {
    uploadModalParams.hideModal();
    message.success('上传成功！');
  }

  return (
    <div className="box">
      <Card bordered={false} style={{ minHeight: 650 }}>
        <div style={{ display: 'flex' }}>
          <Button type="primary" onClick={()=> uploadModalParams.showModal()}><CloudUploadOutlined /> 上传照片</Button>
          <Button style={{ marginLeft: 24 }} onClick={() => handleModalVisible(modalType.create)}>创建相册</Button>
        </div>
        <p style={{ marginTop: 24, color: 'rgba(0,0,0,0.45)' }}><HeartTwoTone twoToneColor="#eb2f96" /> 欢迎来到你的T台啊~快上传点照片给自己多留点回忆吧！！！</p>
        <Divider />
        <div className={styles.boxList}>
          {list.map(item => (
            <AlbumCard item={item} key={item.id} handleDelete={() => handleDelete(item.id)} handleEdit={()=>handleModalVisible(modalType.edit, item)}/>
          ))}
        </div>
      </Card>
      <Modal
        {...modalParams.modalProps}
        title={type === modalType.edit ? '修改相册' : '新建相册' }
        centered={false}
        onOk={handleForm}
        confirmLoading={type === modalType.edit ? editLoading : createLoading}
      >
        <Form
          form={form}
        >
          <Form.Item
            name="name"
            label="相册名称"
            rules={[
              {
                required: true,
                message: '请输入相册名称',
              },
              {
                max: 10,
                message: '相册名称不能超过10个字',
              },
            ]}
          >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="coverPath"
            label="相册封面"
            rules={[
              {
                required: true,
                message: '请上传相册封面',
              },
            ]}
          >
            <Upload needCrop={false}/>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        {...uploadModalParams.modalProps}
        title="上传照片"
        centered={false}
        footer={null}
        width="80%"
      >
        <PhotoUpload handleOk={handleOk}/>
      </Modal>
      <Loading spinning={loading} />
    </div>
  )
}
