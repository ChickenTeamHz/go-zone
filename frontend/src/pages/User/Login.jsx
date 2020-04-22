import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { router } from 'umi';
import { UserOutlined, LockOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useDva } from 'utils/utils';
import styles from './style.less';
import useVCode from '../../components/VCode';

export default function() {
  const VCode = useVCode();
  const { dispatch, loadings: { loading } } = useDva({loading: 'user/fetchLogin'});
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
    if(code !== VCode.data) {
      message.error('图形校验码错误！');
      VCode.freshCode();
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

  return (
    <div className={styles.login}>
      <Form
        name="login"
        className={styles.form}
        onFinish={onFinish}
      >
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
          <VCode.Content />
        </div>
        <Form.Item>
          <div style={{ textAlign: 'right' }} className="a">
            忘记密码？
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
    </div>
  );
}
