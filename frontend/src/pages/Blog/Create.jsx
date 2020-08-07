import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import { MdEditor } from 'md-pre-editor';
import { useMount } from '@umijs/hooks';
import { Input, Button, Popover, Card, Form, Modal, Switch, Select, message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { router } from 'umi';
import { stringify } from 'qs';
import { useDva, useModal, useResetFormOnCloseModal } from '../../utils/hooks';
import Loading from '../../components/Loading';
import Upload from '../../components/Upload';
import styles from './index.less';
import GoBack from '../../components/GoBack';
import { getPageQuery } from '../../utils/utils';
import CategoryBox from './components/CategoryBox';

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1858338_mkebiyt6nho.js'],
});

const MdEditorComp = React.memo(
  forwardRef((props, ref) => {
    return <MdEditor {...props} ref={ref} />;
  }),
);

export default function () {
  const [value, setValue] = useState();
  const {
    dispatch,
    loadings: { uploading },
    data: {
      blog: { tags, categorys },
    },
  } = useDva({ uploading: 'blog/fetchUploadImg' }, ['blog']);
  const editRef = useRef();
  const [title, setTitle] = useState();
  const [coverPath, setCoverPath] = useState();
  const modalParams = useModal();
  const [form] = Form.useForm();
  const titleRef = useRef();
  useResetFormOnCloseModal({ form, visible: modalParams.visible });

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useMount(() => {
    dispatch({
      type: 'blog/fetchTagList',
    });
    dispatch({
      type: 'blog/fetchCategoryList',
    });
  });

  const handleUploadImg = (file) => {
    dispatch({
      type: 'blog/fetchUploadImg',
      payload: file,
    }).then((res) => {
      editRef.current.$img2Url(file.name, res.url);
    });
  };

  const handleSave = () => {
    const values = {
      content: value,
      title: titleRef.current,
      coverPath: (coverPath && coverPath.key) || null,
    };
    if (!values.title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if (values.title?.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    const params = getPageQuery();
    const { articleId: id = null } = params;
    dispatch({
      type: 'blog/fetchSaveArticle',
      payload: [id, values],
    }).then((articleId) => {
      if (!id) {
        router.replace(`/blog/create?${stringify(articleId)}`);
      }
      message.success('保存成功');
    });
  };

  const handleShowPublicModal = () => {
    if (!title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if (title.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    modalParams.showModal();
  };
  const handleSubmit = () => {
    if (!title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if (title.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    const params = getPageQuery();
    const { articleId = null } = params;
    form.validateFields().then((values) => {
      const payload = {
        content: value,
        title,
        coverPath: (coverPath && coverPath.key) || null,
        articleId,
        ...values,
      };
      dispatch({
        type: 'blog/fetchCreateArticle',
        payload,
      }).then((msg) => {
        message.success(msg);
        router.goBack();
      });
    });
  };

  return (
    <div className="box">
      <GoBack />
      <Card bordered={false}>
        <div className={styles.head}>
          <Input
            placeholder="请输入文章标题 ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Popover
            title="添加文章封面"
            content={
              <Upload needCrop={false} value={coverPath} onChange={(v) => setCoverPath(v)} />
            }
            trigger="click"
          >
            <IconFont type="icon-image" style={{ fontSize: 24 }} />
          </Popover>
          <Button type="dashed" onClick={handleSave}>
            保存到草稿箱
          </Button>
          <Button type="primary" onClick={handleShowPublicModal}>
            发布
          </Button>
        </div>
        <MdEditorComp
          value={value}
          onChange={useCallback((val) => setValue(val), [])}
          addImg={useCallback(handleUploadImg, [])}
          ref={editRef}
          onSave={useCallback(handleSave, [titleRef, coverPath, value])}
        />
      </Card>
      <Modal
        {...modalParams.modalProps}
        centered={false}
        okText="提交"
        title="发布文章"
        onOk={handleSubmit}
      >
        <Form form={form}>
          <Form.Item
            label="分类专栏"
            name="category"
            rules={[
              {
                required: true,
                message: '请添加分类专栏',
              },
            ]}
          >
            <CategoryBox categoryList={categorys.map((item) => item.title)} />
          </Form.Item>
          <Form.Item
            label="文章标签"
            name="tags"
            rules={[
              {
                required: true,
                message: '请添加文章标签',
              },
              () => ({
                validator(rule, val) {
                  if (val && val.length <= 5) {
                    return Promise.resolve();
                  }
                  return Promise.reject('最多添加5个标签！');
                },
              }),
            ]}
            validateFirst
          >
            <Select
              mode="tags"
              placeholder="最多添加5个标签"
              maxTagCount={5}
              bordered={false}
              style={{ borderBottom: '1px solid #d9d9d9' }}
            >
              {tags.map((item) => (
                <Select.Option key={item.title} value={item.title}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="是否公开" name="public" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
      <Loading spinning={uploading} />
    </div>
  );
}
