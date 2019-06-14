import React, { Component, Fragment } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Card,
  Steps
} from 'antd';

const { Step } = Steps;

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'add-project-name':
        return 0;
      case 'add-sector-name':
        return 1;
      case 'add-sector-info':
        return 2;
      default:
        return 0;
    }
  }
  render() {
    const { children } = this.props;
    return (
      <PageHeaderWrapper title='新建项目'>
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} style={{ margin: '0 auto', width: '700px' }}>
              <Step title="新建项目名" />
              <Step title="新建区间名" />
              <Step title="新建区间信息" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Project;