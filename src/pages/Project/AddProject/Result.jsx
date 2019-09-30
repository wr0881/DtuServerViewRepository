import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Button, Row, Col, Icon, Steps, Card } from 'antd';
import Result from '@/components/Result';

const actions = (
  <Fragment>
    {/* <Button type="primary">
      
    </Button> */}
    <Button onClick={_=>{
      router.push('/project/add-project/add-project-name');
    }}>
      新建项目
    </Button>
    <Button onClick={_=>{
      router.push('/project/add-project/add-sector-name');
    }}>
      新建子项目
    </Button>
    {/* <Button onClick={_=>{
      router.push('/project/add-project/add-sector-info');
    }}>
      新建布点图
    </Button> */}
  </Fragment>
);

class result extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Result
        type="success"
        title='新建成功'
        description={null}
        extra={null}
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    );
  }
}

export default result;