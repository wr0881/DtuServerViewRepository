import React, { Component } from 'react';
import router from 'umi/router';
import { Input, Typography } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Title } = Typography;

class EditSelectorWrapper extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'bindMember':
        router.push(`${match.url}/bindMember`);
        break;
      case 'bindImg':
        router.push(`${match.url}/bindImg`);
        break;
      case 'bindMonitorBasis':
        router.push(`${match.url}/bindMonitorBasis`);
        break;
      case 'bindPoint':
        router.push(`${match.url}/bindPoint`);
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'bindMember',
        tab: '绑定人员信息',
      },
      {
        key: 'bindImg',
        tab: '绑定图片信息',
      },
      {
        key: 'bindMonitorBasis',
        tab: '绑定监测依据',
      },
      {
        key: 'bindPoint',
        tab: '绑定测点',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        title={
          <div>
            {/* <Title level={3}>焦柳铁路怀化至塘豹段电气化改造工程质量第三方检测服务</Title> */}
            <Title level={4}>海南省万宁至洋浦、文昌至琼海高速公路工程涉铁工程</Title>
          </div>
        }
        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default EditSelectorWrapper;