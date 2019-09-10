import React, { Component } from 'react';
import router from 'umi/router';
import { Cascader, Card, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const options = [
  {
    value: 'zhejiang',
    label: '焦柳铁路怀化至塘豹段电气化改造工程质量第三方检测服务',
    children: [
      {
        value: 'hangzhou',
        label: '海南省万宁至洋浦、文昌至琼海高速公路工程涉铁工程',
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
      },
    ],
  },
];

function onChange(value) {
  console.log(value);
}

class SelectSector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <PageHeaderWrapper title='选择区间'>
        <Card bordered={false}>
          <div style={{
            height: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Cascader size="large" style={{ width: '500px' }} options={options} onChange={onChange} placeholder="选择区间" />
            <div style={{ paddingLeft: '25px' }}><Button size="large" type='primary' onClick={this.onOk.bind(this)}>确认</Button></div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
  onOk() {
    const { match } = this.props;

    router.push('/project/editSector');
  }
}

export default SelectSector;