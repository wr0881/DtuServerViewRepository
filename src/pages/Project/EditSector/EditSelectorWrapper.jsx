import React, { Component } from 'react';
import router from 'umi/router';
import { Input, Typography } from 'antd';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Title } = Typography;

@observer
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
      case 'bindBenchmark':
        router.push(`${match.url}/bindBenchmark`);
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
      {
        key: 'bindBenchmark',
        tab: '绑定基准点',
      },
    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper
        title={
          <div>
            <Title level={4}>{sectorModel.sectorName}</Title>
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