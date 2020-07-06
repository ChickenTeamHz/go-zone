import React, { useState, useRef, useEffect } from 'react';
import { MdEditor } from 'md-pre-editor';
import { useMount } from '@umijs/hooks';
import { Input, Button, Popover, Card, Form, Modal, Switch, Select, Tag, message } from 'antd';
import { createFromIconfontCN, PlusOutlined } from '@ant-design/icons';
import { router } from 'umi';
import { stringify } from 'qs';
import { useDva, useModal, useResetFormOnCloseModal } from '../../utils/hooks';
import Loading from '../../components/Loading';
import Upload from '../../components/Upload';
import styles from './index.less';
import GoBack from '../../components/GoBack';
import { getPageQuery } from '../../utils/utils';

const { CheckableTag } = Tag;

const IconFont = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/font_1858338_mkebiyt6nho.js'],
})

function CategoryBox({
  value,
  categoryList = [],
  placeholder = '请添加分类专栏',
  onChange,
}) {
  const [categorys,setCategorys] = useState(categoryList);
  const [createCategory, setCreateCategory] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if(createCategory && inputRef.current) {
      inputRef.current.focus();
    }
  },[createCategory]);

  const showInput = () => {
    setCreateCategory(true);
  };

  const handleChange = (checked, item) => {
    if(checked) {
      onChange(item)
    }
  }

  const handleInputConfirm = () => {
    if(inputValue) {
      setCategorys(l => {
        l.push(inputValue)
        return l;
      });
      onChange(inputValue);
      setInputValue(null);
    }
    setCreateCategory(false);
  }

  return (
    <div className={styles.categoryBox}>
      <div className={styles.box}>
        {value || <span className={styles.placeholder}>{placeholder}</span>}
      </div>
      <div>
        {categorys.map(item => (
          <CheckableTag key={item} checked={item === value} onChange={c => handleChange(c,item)}>{item}</CheckableTag>
        ))}
        {createCategory && categorys.length <= 10 && (
          <Input
            type="text"
            size="small"
            ref={inputRef}
            style={{ width: 103.4 }}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {!createCategory && categorys.length <= 10 && (
          <Tag onClick={showInput} className={styles.button}>
            <PlusOutlined /> 新建分类专栏
          </Tag>
        )}
      </div>
    </div>
  )
}

export default function () {
  const [value, setValue] = useState();
  const { dispatch, loadings: { uploading },data: { blog: { tags, categorys }} } = useDva({uploading: 'blog/fetchUploadImg'}, ['blog']);
  const editRef = useRef();
  const [title,setTitle] = useState();
  const [coverPath,setCoverPath] = useState();
  const modalParams = useModal();
  const [form] = Form.useForm();
  useResetFormOnCloseModal({ form, visible: modalParams.visible })


  useMount(()=> {
    dispatch({
      type: 'blog/fetchTagList',
    });
    dispatch({
      type: 'blog/fetchCategoryList',
    });
  })

  const handleUploadImg = file => {
    dispatch({
      type: 'blog/fetchUploadImg',
      payload: file,
    }).then(res => {
      editRef.current.$img2Url(file.name,res.url)
    });
  }

  const handleSave = () => {
    const values = {
      content: value,
      title,
      coverPath,
    }
    if(!title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if(title.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    const params = getPageQuery();
    const { articleId: id = null } = params;
    dispatch({
      type: 'blog/fetchSaveArtical',
      payload: [id,values],
    }).then(articleId => {
      if(!id) {
        router.replace(`/blog/create?${stringify(articleId)}`)
      }
      message.success('保存成功');
   })
  }

  const handleShowPublicModal = () => {
    if(!title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if(title.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    modalParams.showModal()

  }
  const handleSubmit = () => {
    if(!title || !value) {
      message.error('文章标题和内容不能为空！');
      return;
    }
    if(title.length > 100) {
      message.error('文章标题不得超过100位！');
      return;
    }
    const params = getPageQuery();
    const { articleId = null } = params;
    form.validateFields().then(values => {
      const payload = {
        content: value,
        title,
        coverPath,
        articleId,
        ...values,
      };
      dispatch({
        type: 'blog/fetchCreateArtical',
        payload,
      }).then(msg => {
         message.success(msg);
         router.goBack();
      })
    })
  }

  return (
    <div className="box">
      <GoBack />
      <Card bordered={false}>
        <div className={styles.head}>
          <Input placeholder="请输入文章标题 ..." value={title} onChange={e => setTitle(e.target.value)}/>
          <Popover title="添加文章封面" content={<Upload needCrop={false} value={coverPath} onChange={v => setCoverPath(v)} />} trigger="click">
            <IconFont type="icon-image" style={{ fontSize: 24 }}/>
          </Popover>
          <Button type="dashed" onClick={handleSave}>保存到草稿箱</Button>
          <Button type="primary" onClick={handleShowPublicModal}>发布</Button>
        </div>
        <MdEditor
          value={value}
          onChange={val => setValue(val)}
          addImg={handleUploadImg}
          ref={editRef}
          onSave={handleSave}
        />
      </Card>
      <Modal {...modalParams.modalProps} centered={false} okText="提交" title="发布文章" onOk={handleSubmit}>
        <Form form={form} >
          <Form.Item
            label="分类专栏"
            name="category"
            rules={[{
              required: true,
              message: '请添加分类专栏',
            }]}
          >
            <CategoryBox categoryList={categorys.map(item => item.title)} />
          </Form.Item>
          <Form.Item
            label="文章标签"
            name="tags"
            rules={[{
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
              style={{ borderBottom: '1px solid #d9d9d9'}}
            >
              {tags.map(item => (
                <Select.Option key={item} value={item}>{item}</Select.Option>
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
  )
}
