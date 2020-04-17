import { Button, Form, Checkbox, Input } from 'antd';
import { Link } from 'umi';
import { UserOutlined, LockOutlined, ArrowRightOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import styles from './style.less';
import useVCode from '../../components/VCode';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function() {
  const VCode = useVCode();
  const onFinish = values => {
    console.log('Success:', values);
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  console.log(VCode.data)

  return (
    <div className={styles.login}>
      <Form
        name="normal_login"
        className={`login-form ${styles.form}`}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="用户名"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
            size="large"
          />
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Form.Item
            name="code"
          >
            <Input
              prefix={<SafetyCertificateOutlined className="site-form-item-icon" />}
              placeholder="请输入右侧的验证码"
              size="large"
            />
          </Form.Item>
          <VCode.Content />
        </div>
        <Form.Item>
          <a className="login-form-forgot" style={{ textAlign: 'right', display: 'block' }}>
            忘记密码？
          </a>
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: 200 }} size="large">
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Link className={styles.register} to="/">立即注册 <ArrowRightOutlined /></Link>
    </div>
  );
}
