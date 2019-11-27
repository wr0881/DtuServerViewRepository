import React, { Component } from 'react';
import router from 'umi/router';
import { Input, Typography } from 'antd';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { getSectorName } from '@/services/project';

const { Title } = Typography;

@observer
class EditSelectorWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectorName: ''
    };
  }
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
      case 'thresholdList':
        router.push(`${match.url}/thresholdList`);
        break;
      case 'bindBenchmark':
        router.push(`${match.url}/bindBenchmark`);
        break;
      default:
        break;
    }
  };

  //根据子项目id获取子项目名称
  GetSectorName() {
    const sectorId = sectorModel.sectorId;
    getSectorName(sectorId).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        const sectorName = data;
        this.setState({ sectorName });
        //console.log('获取子项目名称',this.state.sectorName);
      }
    })
  }

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
        key: 'thresholdList',
        tab: '绑定阈值',
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
            <Title level={4}>{this.state.sectorName}</Title>
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
  componentDidMount() {
    this.GetSectorName();
  }
}

export default EditSelectorWrapper;