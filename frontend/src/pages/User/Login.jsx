import React, { useState } from 'react';
import { Button, Form, Input, message, Alert, Modal } from 'antd';
import { router } from 'umi';
import { UserOutlined, LockOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useDva, useModal, useResetFormOnCloseModal } from 'utils/hooks';
import styles from './style.less';
import { useVCodeProps, VCode} from '../../components/VCode';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function() {
  const VCodeProps = useVCodeProps();
  const ResetPassModal = useModal();
  const [showPass, setShowPass] = useState(false);
  const [pass,setPass] = useState(null);
  const { dispatch, loadings: { loading, passLoading } } = useDva({loading: 'user/fetchLogin', passLoading: 'user/fetchForgetRegister'});
  const [ form ] = Form.useForm();

  useResetFormOnCloseModal({ form, visible: ResetPassModal.visible })

  const onFinish = values => {
    const { username, password, code } = values;
    message.config({
      top: 120,
      maxCount: 1,
    });
    if(!username || !password) {
      message.error('用户名或者密码不能为空！');
      return;
    }
    if(!code){
      message.error('图形校验码不能为空！');
      return;
    }
    if(code !== VCodeProps.data) {
      message.error('图形校验码错误！');
      VCodeProps.freshCode();
      return;
    }
    dispatch({
      type: 'user/fetchLogin',
      payload: {
        username,
        password,
      },
    });
  };

  const handleClose = () => {
    setShowPass(false);
  }

  const handleOk = () => {
    form.validateFields().then(values => {
      dispatch({
        type: 'user/fetchForgetRegister',
        payload: values,
      }).then(data => {
        const { password } = data;
        setPass(password);
        setShowPass(true);
        ResetPassModal.hideModal();
      })
    })
  }

  return (
    <div className={styles.login}>
      <Form
        name="login"
        className={styles.form}
        onFinish={onFinish}
      >
        {showPass ? (
          <Alert
            message={`重置密码成功！您的初始密码为: ${pass}`}
            type="success"
            showIcon
            closable
            afterClose={handleClose}
            style={{ top: '-20px',userSelect: 'text' }}
          />
        ):null}
        <Form.Item
          name="username"
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用户名"
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="password"
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="密码"
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Form.Item
            name="code"
          >
            <Input
              prefix={<SafetyCertificateOutlined />}
              placeholder="请输入右侧的验证码"
              size="large"
              autoComplete="off"
            />
          </Form.Item>
          <VCode state={VCodeProps.state} freshCode={VCodeProps.freshCode} data={VCodeProps.data} />
        </div>
        <Form.Item>
          <div style={{ textAlign: 'right' }}>
            <a onClick={()=> ResetPassModal.showModal()}>忘记密码？</a>
          </div>
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ width: 200 }} size="large" loading={loading}>
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
      <a className={styles.toRegister} onClick={()=> router.replace('/user/register')}>立即注册 <ArrowRightOutlined /></a>
      <Modal {...ResetPassModal.modalProps} title="忘记密码" onOk={handleOk} confirmLoading={passLoading} okText="提交">
        <>
          <div style={{ fontSize: 14, fontWeight: '600', marginBottom: 24 }}>如果您忘记密码了，您可以输入用户名和昵称，来获取一个可以登录的密码，但记得登录成功之后，去修改密码哦~</div>
          <Form form={form} name="reset-password" {...formItemLayout}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nickname"
              label="昵称"
              rules={[
                {
                  required: true,
                  message: '请输入昵称',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </>
      </Modal>
    </div>
  );
}
