import React, { Component } from 'react';
import { Card, Row, Table, label } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import axios from 'axios';
import axios from '../../../axios';
import styles from './SensorLib.css';

export default class SensorLib extends Component {
  state = {
    cardLoading: true,
    dataSource: [],
    pagination: {
      total: 0,
      defaultCurrent: 1,
      defaultPageSize: 10,
    },
  };

  componentWillMount() {
    this.queryDataSource(
      this.state.pagination.defaultCurrent,
      this.state.pagination.defaultPageSize
    );
  }

  queryDataSource = (page, pageSize) => {
    axios
      .get(`/sensor/SensorInfo`, {
        params: {
          pageNum: page,
          pageSize: pageSize,
        },
      })
      .then(result => {
        console.log(result);
        this.setState({
          cardLoading: false,
          dataSource: result.data.data.list,
          pagination: {
            total: result.data.data.total,
          },
        });
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  mySizeChange = (page, pageSize) => {
    this.queryDataSource(page, pageSize);
  };

  render() {
    console.log(this.state.pagination.total);

    const columns = [
      {
        title: '编号',
        dataIndex: 'sensorNumber',
        width: 200,
        fixed: 'left',
        align: 'center',
      },
      {
        title: '地址(十进制)',
        dataIndex: 'sensorAddress',
        width: 150,
        fixed: 'left',
        align: 'center',
      },
      {
        title: '位置',
        dataIndex: 'position',
        width: 300,
        fixed: 'left',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        fixed: 'left',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'sensorName',
        width: 200,
        align: 'center',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        width: 200,
        align: 'center',
      },
      {
        title: '型号',
        dataIndex: 'sensorModel',
        width: 150,
        align: 'center',
      },
      {
        title: '量程',
        dataIndex: 'sensorRange',
        width: 150,
        align: 'center',
      },
      {
        title: '精度',
        dataIndex: 'sensorAccuracy',
        width: 150,
        align: 'center',
      },
      {
        title: '标定系数K',
        dataIndex: 'timingFactor',
        width: 150,
        align: 'center',
      },
      {
        title: '解析方式',
        dataIndex: 'parserMethods',
        width: 200,
        align: 'center',
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        width: 200,
        align: 'center',
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        width: 200,
        align: 'center',
      },
    ];

    return (
      <PageHeaderLayout title="用户模块">
        <Card loading={this.state.cardLoading}>
          <Row style={{ marginTop: '2vh' }}>
            <Table
              columns={columns}
              dataSource={this.state.dataSource}
              scroll={{ x: 2400 }}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '20', '40', '50'],
                defaultCurrent: this.state.pagination.defaultCurrent,
                defaultPageSize: this.state.pagination.defaultPageSize,
                total: this.state.pagination.total,
                onShowSizeChange: this.mySizeChange.bind(),
                onChange: this.mySizeChange.bind(),
              }}
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
