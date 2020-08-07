import React, { useRef } from 'react';
import { Card, Form, Divider, Tag, Switch, Select, Collapse, Button } from 'antd';
import { useMount, useUnmount } from '@umijs/hooks';
import { ReloadOutlined } from '@ant-design/icons';
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
  const formRef = useRef();
  const paginationRef = useRef();

  useMount(() => {
    dispatch({
      type: 'blog/fetchTagList',
    });
    dispatch({
      type: 'blog/fetchCategoryList',
    });
  });

  useUnmount(() => {
    dispatch({
      type: 'blog/clearList',
    });
  });

  const getList = () => {
    const values = formRef.current?.getFieldsValue() || {};
    const paginationValues = paginationRef.current.getPagination();
    dispatch({
      type: 'blog/fetchArticles',
      payload: {
        public: false,
        ...paginationValues,
        ...values,
      },
    });
  };

  const resetFilter = () => {
    const { resetFields = () => {} } = formRef.current || {};
    resetFields();
    getList();
  };

  const showReset = () => {
    const values = formRef.current?.getFieldsValue() || {};
    let show = false;
    for (const key of Object.keys(values)) {
      const item = values[key];
      if ((item instanceof Array && item.length > 0) || (typeof item === 'string' && item)) {
        show = true;
        break;
      }
    }
    return show;
  };

  return (
    <div className="box" style={{ maxWidth: 1000, margin: 'auto' }}>
      <Card bordered={false} className={styles.column} title="我的专栏">
        <Collapse defaultActiveKey={[]} ghost>
          <Panel key="1" header="筛选区域" style={{ position: 'relative' }}>
            {showReset() && (
              <Button className={styles.reset} type="text" danger onClick={resetFilter}>
                <ReloadOutlined /> 重置筛选
              </Button>
            )}
            <Form name="form-filter" onValuesChange={getList} ref={formRef}>
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
        />
      </Card>
    </div>
  );
}
