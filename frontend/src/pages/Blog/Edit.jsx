import React, { useState, useRef, forwardRef, useCallback } from 'react';
import { MdEditor } from 'md-pre-editor';
import { useMount, useUnmount } from '@umijs/hooks';
import { Input, Button, Popover, Card, Form, Modal, Switch, Select, message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { router } from 'umi';
import { useDva, useModal, useResetFormOnCloseModal } from '../../utils/hooks';
import Loading from '../../components/Loading';
import Upload from '../../components/Upload';
import styles from './index.less';
import GoBack from '../../components/GoBack';
import CategoryBox from './components/CategoryBox';

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1858338_mkebiyt6nho.js'],
});

const MdEditorComp = React.memo(
  forwardRef((props, ref) => {
    return <MdEditor {...props} ref={ref} toolbar={{ save: false }} />;
  }),
);

export default function ({
  match: {
    params: { articleId },
  },
}) {
  const [value, setValue] = useState();
  const {
    dispatch,
    loadings: { uploading = false, loading = false },
    data: {
      blog: { tags = [], categorys = [], detail = {} },
    },
  } = useDva(
    {
      uploading: 'blog/fetchUploadImg',
      loading: 'blog/fetchArticleDetail',
    },
    ['blog'],
  );
  const editRef = useRef();
  const [title, setTitle] = useState();
  const [coverPath, setCoverPath] = useState();
  const modalParams = useModal();
  const [form] = Form.useForm();
  useResetFormOnCloseModal({ form, visible: modalParams.visible });

  useMount(() => {
    dispatch({
      type: 'blog/fetchTagList',
    });
    dispatch({
      type: 'blog/fetchCategoryList',
    });
    dispatch({
      type: 'blog/fetchArticleDetail',
      payload: [
        articleId,
        {
          isEdit: true,
        },
      ],
    }).then((res) => {
      setTitle(res?.title);
      setCoverPath({
        url: res?.coverPathUrl,
        key: res?.coverPath,
      });
      setValue(res?.content);
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'blog/clearDetail',
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
      }).then(({ id }) => {
        message.success('发布成功');
        if(id) {
          router.replace(`/blog/detail/${id}`);
        }else {
          router.goBack();
        }
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
          <Button type="primary" onClick={handleShowPublicModal}>
            发布
          </Button>
        </div>
        <MdEditorComp
          value={value}
          onChange={useCallback((val) => setValue(val), [])}
          addImg={useCallback(handleUploadImg, [])}
          ref={editRef}
        />
      </Card>
      <Modal
        {...modalParams.modalProps}
        centered={false}
        okText="提交"
        title="发布文章"
        onOk={handleSubmit}
      >
        <Form
          form={form}
          initialValues={{
            category: detail?.articleCategory?.title,
            tags: detail?.tags?.map((i) => i.title),
            public: detail?.public,
          }}
        >
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
          <Form.Item label="是否公开" name="public" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
      <Loading spinning={uploading || loading} />
    </div>
  );
}
