import React, { Component } from 'react';
import { Card, Row, Table, label } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import axios from 'axios';
import styles from './SensorLib.css';

export default class SensorLib extends Component {
  state = {
    cardLoading: false,
    dataSource: [],
  };

  componentWillMount() {
    this.queryDataSource();
  }

  queryDataSource = () => {
    axios
      .get(`${global.constants.onlineWeb}/sensor/SensorInfo`, {
        headers: {
          Authorization: global.constants.Authorization,
        },
        params: {
          pageNum: 1,
          pageSize: 5,
        },
      })
      .then(result => {
        console.log(result);
        this.setState({
          dataSource: result.data.data.list,
        });
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'sensorNumber',
        width: 200,
        fixed: 'left',
        render: text => <label className={styles.table_lmp_head}>{text}</label>,
      },
      {
        title: '地址(十进制)',
        dataIndex: 'sensorAddress',
        width: 150,
        fixed: 'left',
        render: text => <label className={styles.table_lmp_head}>{text}</label>,
      },
      {
        title: '位置',
        dataIndex: 'position',
        width: 200,
        fixed: 'left',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        fixed: 'left',
      },
      {
        title: '名称',
        dataIndex: 'sensorName',
        width: 200,
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        width: 150,
      },
      {
        title: '型号',
        dataIndex: 'sensorModel',
        width: 150,
      },
      {
        title: '量程',
        dataIndex: 'sensorRange',
        width: 150,
      },
      {
        title: '精度',
        dataIndex: 'sensorAccuracy',
        width: 150,
      },
      {
        title: '标定系数K',
        dataIndex: 'timingFactor',
        width: 150,
      },
      {
        title: '解析方式',
        dataIndex: 'parserMethods',
        width: 200,
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 200,
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        width: 200,
      },
    ];

    return (
      <PageHeaderLayout title="用户模块">
        <Card loading={this.state.cardLoading}>
          <Row style={{ marginTop: '2vh' }}>
            <Table
              columns={columns}
              dataSource={this.state.dataSource}
              scroll={{ x: 2250 }}
              // rowKey={record => record.login.uuid}
              // dataSource={this.state.data}
              // pagination={this.state.pagination}
              // loading={this.state.loading}
              // onChange={this.handleTableChange}
            />
          </Row>
        </Card>
      </PageHeaderLayout>
    );
  }
}
