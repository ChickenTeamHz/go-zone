import React, { useState, useRef } from 'react';
import { Upload, Button, message, Modal } from 'antd';
import { useDva } from 'utils/hooks'
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import lrz from 'lrz';
import HOST from '../../../services/host';
import { getToken } from '../../../utils/authToken';

export default function() {
  const tokenOptions = getToken() ? { Authorization: `Bearer ${getToken()}` } : {};
  const [cropVisible, setCropVisible] = useState(false);
  const [cropFile, setCropFile] = useState({
    name: '', // 文件名称
    suffix: '', // 文件类型
    url: null,
  });

  const ref = useRef(null);
  const { dispatch, loadings: { loading } } = useDva({loading: 'user/fetchUpdateAvatar'});

  /**
   * 图片校验
   */
  const beforeUploadImgLimit = (file, limit = 2) => {
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
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      setCropFile({
        url: e.target.result,
        name: file.name,
        suffix: file.type.split('/')[1],
      });
      setCropVisible(true);
    };
    return false;
  };

  const handleCancel = () => {
    setCropVisible(false);
  }

 /**
  * 上传裁剪头像
  */
  const saveImg = () => {
    if (loading) {
      return;
    }
    const { name, suffix } = cropFile;
    const dom = ref.current;
    lrz(dom.getCroppedCanvas().toDataURL(), { quality: 0.6 })
      .then(async result => {
        dispatch({
          type: 'user/fetchUpdateAvatar',
          payload: {
            imgBase: result.base64,
            imgSize: result.fileLen,
            suffix,
            filename: name,
          },
        }).then(() => {
          handleCancel();
        })
      })
      .catch(() => {
        message.error('上传失败，请重新上传');
      });
  };

  return (
    <>
      <Upload
        withCredentials
        name="file"
        accept="image/jpeg,image/jpg,image/png"
        showUploadList={false}
        action={`${HOST}/user/avatar`}
        headers={tokenOptions}
        beforeUpload={file => beforeUploadImgLimit(file, 2)}
      >
        <Button>更换头像</Button>
      </Upload>
      <Modal
        key="crop"
        visible={cropVisible}
        closable={false}
        maskClosable={false}
        footer={[
          <Button onClick={handleCancel}  key="cancel">
            取消
          </Button>,
          <Button type="primary" onClick={saveImg} loading={loading} key="save">
            保存
          </Button>,
        ]}
        destroyOnClose
      >
        <Cropper
          src={cropFile.url} // 图片路径，即是base64的值，在Upload上传的时候获取到的
          ref={ref}
          style={{ height: 400, width: '100%' }}
          viewMode={1} // 定义cropper的视图模式
          aspectRatio={1/1} // image的纵横比
          guides={false} // 显示在裁剪框上方的虚线
          background={false} // 是否显示背景的马赛克
          rotatable={false} // 是否旋转
        />
      </Modal>
    </>
  )
}
