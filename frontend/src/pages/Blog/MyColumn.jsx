import React, { useRef } from 'react';
import { Card, Form, Divider, Tag, Switch, Select, Collapse, Button } from 'antd';
import { useMount, useUnmount } from '@umijs/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import {
  useQueryParams,
  NumberParam,
  ArrayParam,
  StringParam,
  withDefault,
  BooleanParam,
} from 'use-query-params';
import styles from './index.less';
import { tagColor } from '../../common/enum';
import { useDva } from '../../utils/hooks';
import BlogList from '../../components/BlogList';

const { CheckableTag } = Tag;
const { Panel } = Collapse;

function TagRender({ label, closable, onClose, value }, data) {
  const index = data?.findIndex((item) => item.id === value);
  return (
    <Tag
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 8 }}
      color={tagColor[index % tagColor.length]}
    >
      {label}
    </Tag>
  );
}

function CategoryTags({ data = [], value, onChange = () => {} }) {
  const handleChange = (checked, item) => {
    if (checked) {
      onChange(item.id);
    }
  };

  return (
    <div className={styles.flex}>
      {data.map((item) => (
        <CheckableTag
          key={item.id}
          checked={item.id === value}
          onChange={(c) => handleChange(c, item)}
        >
          {item.title}
        </CheckableTag>
      ))}
    </div>
  );
}

export default function () {
  const {
    dispatch,
    loadings: { loading },
    data: {
      blog: { tags = [], categorys = [] },
    },
  } = useDva({ loading: 'blog/fetchArticles' }, ['blog']);
  const paginationRef = useRef();
  const [form] = Form.useForm();
  const [query, setQuery] = useQueryParams({
    pageNum: withDefault(NumberParam, 1),
    pageSize: withDefault(NumberParam, 10),
    category: StringParam,
    tags: withDefault(ArrayParam, []),
    public: withDefault(BooleanParam, false),
  });

  const getList = (firstLoad = false, resetP = false) => {
    let values = form.getFieldsValue() || {};
    let paginationValues = paginationRef.current.getPagination();
    if (firstLoad) {
      values = {
        tags: query.tags,
        category: query.category,
        public: query.public,
      };
      form.setFieldsValue(values);
      paginationValues = {
        pageNum: query.pageNum,
        pageSize: query.pageSize,
      };
      paginationRef.current.setPagination(paginationValues);
    }
    if (resetP) {
      paginationValues = {
        pageNum: 1,
        pageSize: 10,
      };
    }
    const payload = {
      public: false,
      ...paginationValues,
      ...values,
    };
    setQuery(payload);
    dispatch({
      type: 'blog/fetchArticles',
      payload: {
        ...payload,
        personal: true,
      },
    });
  };

  useMount(() => {
    dispatch({
      type: 'blog/fetchTagList',
    });
    dispatch({
      type: 'blog/fetchCategoryList',
    });
    getList(true);
  });

  useUnmount(() => {
    dispatch({
      type: 'blog/clearList',
    });
  });

  const resetFilter = () => {
    form.resetFields();
    paginationRef.current.resetPagination();
    getList(false, true);
  };

  const showReset = () => {
    const values = {
      tags: query.tags,
      category: query.category,
      public: query.public,
    };
    let show = false;
    for (const key of Object.keys(values)) {
      const item = values[key];
      if (
        (item instanceof Array && item.length > 0) ||
        (typeof item === 'string' && item) ||
        item === true
      ) {
        show = true;
        break;
      }
    }
    return show;
  };

  return (
    <div className="box" style={{ maxWidth: 1000, margin: 'auto' }}>
      <Card bordered={false} className={styles.column} title="我的专栏">
        <Collapse defaultActiveKey={['1']} ghost>
          <Panel key="1" header="筛选区域" style={{ position: 'relative' }}>
            {showReset() && (
              <Button className={styles.reset} type="text" danger onClick={resetFilter}>
                <ReloadOutlined /> 重置筛选
              </Button>
            )}
            <Form
              name="form-filter"
              onValuesChange={() => {
                paginationRef.current.resetPagination();
                getList(false, true);
              }}
              form={form}
            >
              <Form.Item name="category" label="分类专栏">
                <CategoryTags data={categorys} />
              </Form.Item>
              <Form.Item label="文章标签" name="tags">
                <Select
                  mode="multiple"
                  placeholder="请选择标签"
                  bordered={false}
                  style={{ borderBottom: '1px solid #d9d9d9' }}
                  showArrow={false}
                  tagRender={(props) => TagRender(props, tags)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {tags.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="是否公开"
                name="public"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <Divider />
        <BlogList
          loading={loading}
          getList={getList}
          pagination={{
            pageNum: 1,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          ref={paginationRef}
          needQuery
          moreOperate
        />
      </Card>
    </div>
  );
}
