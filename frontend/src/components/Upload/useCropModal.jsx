import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import lrz from 'lrz';
import { message, Modal, Button } from 'antd';

export default function useCropModal({
  cropRatio,
  cropStyle = { height: 400, width: '100%' },
  fetchBase64Request = () => {},
  triggerImgChange = () => {},
}) {
  const [cropLoading, setCropLoading] = useState(false);
  const [cropVisible,setCropVisible] = useState(false);
  const [cropFile, setCropFile] = useState({
    name: '', // 文件名称
    suffix: '', // 文件类型
    url: null,
  })
  const ref = useRef(null);

  function changeFile(file = {}) {
    setCropFile((c = {}) => {
      return {
        ...c,
        ...file,
      }
    })
  }

  function handleCancel(){
    setCropVisible(false);
    changeFile({
      name: '',
      suffix: '',
      url: null,
    });
  };

  function saveImg(){
    if (cropLoading) {
      return;
    }
    const { name, suffix } = cropFile;
    setCropLoading(true);
    const dom = ref.current;
    lrz(dom.getCroppedCanvas().toDataURL(), { quality: 0.6 })
      .then(async result => {
        const response = await fetchBase64Request({
          imgBase: result.base64,
          imgSize: result.fileLen,
          suffix,
          filename: name,
        });

        if (response && response.code === 0) {
          const { data = {} } = response;
          setCropLoading(false);
          triggerImgChange({
            key: data.key,
            url: data.url,
          })
          message.success('上传成功');
          handleCancel();
        } else {
          message.error('上传失败，请重新上传');
          setCropLoading(false);
        }
      })
      .catch(() => {
        message.error('上传失败，请重新上传');
        setCropLoading(false);
      });
  };

  function handleModal(status) {
    setCropVisible(status);
  }

  const content = (
    <Modal
      key="crop"
      visible={cropVisible}
      closable={false}
      maskClosable={false}
      footer={[
        <Button onClick={handleCancel}  key="cancel">
          取消
        </Button>,
        <Button type="primary" onClick={saveImg} loading={cropLoading} key="save">
          保存
        </Button>,
      ]}
      destroyOnClose
    >
      <Cropper
        src={cropFile.url} // 图片路径，即是base64的值，在Upload上传的时候获取到的
        ref={ref}
        style={cropStyle}
        viewMode={1} // 定义cropper的视图模式
        aspectRatio={cropRatio} // image的纵横比
        guides={false} // 显示在裁剪框上方的虚线
        background={false} // 是否显示背景的马赛克
        rotatable={false} // 是否旋转
      />
    </Modal>
  );
  return {
    content,
    changeFile,
    handleModal,
  }
};
