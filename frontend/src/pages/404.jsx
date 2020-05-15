import { Button, Result } from 'antd';
import React from 'react';
import { router } from 'umi';

export default function(){
  return (
    <div style={{ top: 200, position: 'relative' }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => router.replace('/')}>
            Back Home
          </Button>
        }
      />
    </div>
  )
};
