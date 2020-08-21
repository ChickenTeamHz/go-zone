import React, { useState } from 'react';
import { Card, Modal, Divider, Form, Input, message, Popover } from 'antd';
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useModal, useDva } from '../../utils/hooks';
import styles from './index.less';
import avatarDefault from '../../assets/avatar.jpg';
import { PATTERN } from '../../common/pattern';
import AvatarUpload from './component/AvatarUpload';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const passFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

function Avatar({imgUrl}) {
  const ModalParams = useModal();
  const [preview,setPreview] = useState(false);
  function handlePreview() {
    ModalParams.showModal();
  }
  return (
    <>
      <Divider style={{ height: 4, background: '#F9F9FB' }} />
      <div className={styles.avatarOut}>
        <div className={styles.avatar} onClick={handlePreview} onMouseEnter={()=> setPreview(true)} onMouseLeave={()=> setPreview(false)}>
          <div className={styles.preview} style={{ display: preview ? 'flex': 'none'}}>
            <EyeOutlined /> 预览
          </div>
          <img src={imgUrl} alt="avatar" className={styles.avatarImg} />
        </div>
      </div>
      <Modal {...ModalParams.modalProps} footer={null}>
        <img src={imgUrl} alt="avatar" className={styles.modalImg}/>
      </Modal>
    </>
  )
}

export default function() {
  const { dispatch, loadings: { passLoading }, data: { user: { currentUser }} } = useDva({passLoading: 'user/fetchUpdatePassword'},['user']);
  const ModalParams = useModal();
  const [form] = Form.useForm();
  const [passForm] = Form.useForm();
  const [popVisible, setPopVisible] = useState(false);

  const [visibles,setVisibles] = useState({
    username: true,
    nickname: true,
  });

  /**
   * 控制表单是否可填
   * @param {*} key
   * @param {*} bool
   */
  const handleVisibles = (key, bool = false ) => {
    if(!bool && !visibles[key]) {
      return;
    }
    if(!bool && (form.getFieldError('username').length > 0 || form.getFieldError('nickname').length > 0)){
      message.warn('请先正确提交已经修改部分！')
      return;
    }
    setVisibles(v => {
      return {
        ...v,
        [key]: bool,
      }
    });
  }

  /**
   * 失焦修改表单事件
   * @param {*} key
   */
  const handleEdit = key => {
    const value = form.getFieldValue(key);
    if(form.getFieldError(key).length > 0){
      return;
    }
    dispatch({
      type: 'user/fetchUpdateUser',
      payload: {
        [key]: value,
      },
    }).then(() => {
      message.success('修改成功');
      handleVisibles(key, true);
    }).catch(() => {
      form.resetFields([key]);
      handleVisibles(key, true);
    })
  }

  /**
   * 修改密码
   */
  const handleOk = () => {
    passForm.validateFields().then(values => {
      dispatch({
        type: 'user/fetchUpdatePassword',
        payload: values,
      }).then(() => {
        message.success('修改成功')
        ModalParams.hideModal();
      })
    })
  }

  const getPasswordStatus = value => {
    const passwordStatus = {
      whitespace: false,
      len: false,
      symbol: false,
    };
    if (value) {
      const whitespaceReg = /\s/;
      const stringReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)/;
      const wordReg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
      if (!value.match(whitespaceReg) && !wordReg.test(value)) {
        passwordStatus.whitespace = true;
      }
      if (value.length >= 6 && value.length <= 20) {
        passwordStatus.len = true;
      }
      if (value.match(stringReg)) {
        passwordStatus.symbol = true;
      }
      return passwordStatus;
    }
    return passwordStatus;
  };

  function renderPasswordProgress(value){
    const passwordStatus = getPasswordStatus(value);
    const TextArray = {
      whitespace: '不能包含空格和中文',
      len: '长度为6-20个字符',
      symbol: '至少包含数字、字母、符号中至少两种',
    };
    return value && value.length ? (
      <div>
        {Object.keys(TextArray).map(key => (
          <div className={styles.tip} key={key}>
            <div>
              <CheckCircleOutlined
                style={{ color: passwordStatus[key] === true ? '#2E994E' : 'rgba(21,21,61,0.2)' }}
                className={styles.icon}
              />
            </div>
            <div>{TextArray[key]}</div>
          </div>
        ))}
      </div>
    ) : null;
  };

  /**
   * 密码校验
   */
  const checkPassword = (rule, value) => {
    if (value) {
      if (!popVisible) {
        setPopVisible(true);
      }
      const passwordStatus = getPasswordStatus(value);
      for (const key in passwordStatus) {
        if (passwordStatus[key] === false) {
          return Promise.reject('');
        }
      }
      setPopVisible(false);
      return Promise.resolve();
    }
    if(popVisible){
      setPopVisible(false);
    }
    return Promise.resolve();
  };

  /**
   * 密码输入框失焦事件
   */
  function handlePassBlur() {
    if (form.getFieldError('newPassword').length === 0) {
      setPopVisible(false);
    }
  };

  return (
    <div className="box">
      <Card bordered={false}>
        <h2>个人中心</h2>
        <div style={{ paddingTop: 24 }}>
          <Avatar imgUrl={currentUser.avatar || avatarDefault}/>
          <div className={styles.content}>
            <AvatarUpload />
            <div className={styles.id}>ID: {currentUser.id}</div>
            <Form
              {...formItemLayout}
              style={{ textAlign: 'left' }}
              initialValues={{
                username: currentUser.username,
                nickname: currentUser.nickname,
              }}
              form={form}
            >
              <Form.Item label="用户名">
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Form.Item
                    name="username"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                      {
                        pattern: PATTERN.EN_NUM,
                        message: '只支持字母或者数字',
                      },
                      {
                        min: 4,
                        max: 15,
                        message: '请输入4-15个字的用户名',
                      },
                    ]}
                  >
                    <Input
                      style={{ width: 220 }}
                      autoComplete="off"
                      disabled={visibles.username}
                      onBlur={()=> handleEdit('username')}
                    />
                  </Form.Item>
                  <span className={styles.edit} onClick={()=>handleVisibles('username')}>修改</span>
                </div>
              </Form.Item>
              <Form.Item label="昵称">
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Form.Item
                    name="nickname"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请输入昵称',
                      },
                      {
                        min: 4,
                        max: 15,
                        message: '请输入4-15个字的昵称',
                      },
                    ]}
                  >
                    <Input
                      style={{ width: 220 }}
                      autoComplete="off"
                      disabled={visibles.nickname}
                      onBlur={()=> handleEdit('nickname')}
                    />
                  </Form.Item>
                  <span className={styles.edit} onClick={()=>handleVisibles('nickname')}>修改</span>
                </div>
              </Form.Item>
              <Form.Item label="密码">
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Form.Item noStyle>
                    <Input value="*******" style={{ width: 220 }} autoComplete="off" disabled/>
                  </Form.Item>
                  <span className={styles.edit} onClick={()=> ModalParams.showModal()}>修改</span>
                </div>
              </Form.Item>
              <Form.Item label="创建时间">
                <span>{currentUser.createdAt}</span>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
      <Modal {...ModalParams.modalProps} title="修改密码" onOk={handleOk} confirmLoading={passLoading} centered={false}>
        <>
          <Form form={passForm} name="reset-password" {...passFormItemLayout}>
            <Form.Item
              name="password"
              label="当前密码"
              rules={[
                {
                  required: true,
                  message: '请输入当前密码',
                },
              ]}
            >
              <Input.Password
                placeholder="请输入当前密码"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              label="新密码"
              required
              shouldUpdate={(prevValues, currentValues) => prevValues.newPassword !== currentValues.newPassword}
            >
              {({ getFieldValue }) => (
                <Popover
                  content={<div style={{ padding: '4px 0' }}>{renderPasswordProgress(getFieldValue('newPassword'))}</div>}
                  overlayStyle={{ width: 282 }}
                  placement="right"
                  visible={popVisible}
                >
                  <Form.Item
                    name="newPassword"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请设置新密码',
                      },
                      {
                        validator: checkPassword,
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="请设置新密码"
                      autoComplete="off"
                      onBlur={handlePassBlur}
                    />
                  </Form.Item>
                </Popover>
              )}
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: '请确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次输入的密码不一致');
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="请确认密码"
                autoComplete="off"
              />
            </Form.Item>

          </Form>
        </>
      </Modal>
    </div>
  )
}
