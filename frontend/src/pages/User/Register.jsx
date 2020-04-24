import React from 'react';
import { Button, Form, Input, message, Popover } from 'antd';
import { router } from 'umi';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useToggle } from '@umijs/hooks';
import { useDva } from 'utils/hooks';
import styles from './style.less';
import { PATTERN } from '../../common/pattern';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export default function() {
  const { dispatch, loadings: { loading }} = useDva({loading: 'user/fetchRegister'});
  const [form] = Form.useForm();
  const { state: visible, toggle: toggleVisible } = useToggle(false);
  const onFinish = values => {
    toggleVisible(false);
    dispatch({
      type: 'user/fetchRegister',
      payload: values,
    }).then( msg => {
      message.success(msg);
      router.replace('/user/login');
    })
  };

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
      if (!visible) {
        toggleVisible();
      }
      const passwordStatus = getPasswordStatus(value);
      for (const key in passwordStatus) {
        if (passwordStatus[key] === false) {
          return Promise.reject('');
        }
      }
      return Promise.resolve();
    }
    if(visible){
      toggleVisible();
    }
    return Promise.resolve();
  };

  /**
   * 输入框失焦事件
   */
  function handlePassBlur() {
    if (form.getFieldError('password').length === 0) {
      toggleVisible(false);
    }
  };

  return (
    <div className={styles.register}>
      <Form
        {...formItemLayout}
        name="register"
        form={form}
        className={styles.form}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="用户名"
          hasFeedback
          validateFirst
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
            placeholder="用户名"
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="nickname"
          label="昵称"
          hasFeedback
          validateFirst
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
            placeholder="昵称"
            size="large"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label="密码"
          required
          shouldUpdate={(prevValues, currentValues) => prevValues.password !== currentValues.password}
        >
          {({ getFieldValue }) => (
            <Popover
              content={<div style={{ padding: '4px 0' }}>{renderPasswordProgress(getFieldValue('password'))}</div>}
              overlayStyle={{ width: 282 }}
              placement="right"
              visible={visible}
            >
              <Form.Item
                name="password"
                noStyle
                rules={[
                  {
                    required: true,
                    message: '请设置密码',
                  },
                  {
                    validator: checkPassword,
                  },
                ]}
              >
                <Input.Password
                  placeholder="请设置密码"
                  size="large"
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
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不一致');
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请确认密码"
            size="large"
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <Button style={{ width: 120 }} size="large" onClick={() => router.replace('/user/login')}>
              返回
            </Button>
            <Button type="primary" htmlType="submit" style={{ width: 120, marginLeft: 24 }} size="large" loading={loading}>
              注册
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}
