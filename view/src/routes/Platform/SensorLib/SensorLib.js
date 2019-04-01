import React, { Component } from 'react';
import {
  Card,
  Row,
  Table,
  Form,
  Button,
  Col,
  Input,
  Icon,
  Badge,
  DatePicker,
  List,
  Empty,
  Tag,
  Divider,
  Popconfirm,
  message,
  Select,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import axios from '../../../axios';
import styles from './SensorLib.css';
import SensorDrawer from '../../MyComponent/SensorDrawer';
import SensorInfoDrawer from '../../MyComponent/SensorInfoDrawer';
import { getNowFormatDate } from '../../../utils/utils';

@Form.create()
export default class SensorLib extends Component {
  state = {
    expand: false,
    showTable: true,
    cardLoading: true,
    sensorDrawer: false,
    sensorInfoDrawer: false,
    sensorInfoData: [],
    analyticalDethod: [],
    dataSource: [],
    sensorInfolog: [],

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

  queryDataSource = (page, pageSize, value) => {
    let param = {
      pageNum: page,
      pageSize: pageSize,
      ...value,
    };
    if (value === undefined) {
      param = {
        pageNum: page,
        pageSize: pageSize,
      };
    }
    axios
      .get(`/sensor/SensorInfo`, {
        params: param,
      })
      .then(result => {
        if (result.data.code === 1) {
          this.setState({
            showTable: false,
          });
        } else {
          this.setState({
            cardLoading: false,
            showTable: true,
            dataSource: result.data.data.list,
            pagination: {
              total: result.data.data.total,
            },
          });
        }
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  queryInventoryRecord = record => {
    axios
      .get(`/sensor/SensorLog`, {
        params: {
          deviceNumber: record.sensorNumber,
          deviceType: '传感器',
          beginDate: getNowFormatDate(3),
          endDate: getNowFormatDate(),
        },
      })
      .then(result => {
        if (result.data.code === 0) {
          this.setState({
            sensorInfolog: result.data.data,
          });
        } else {
          this.setState({
            sensorInfolog: [],
          });
        }
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  querySensorAnalyticalDethod = () => {
    axios
      .get(`/sysCode/listParserMethod`)
      .then(result => {
        if (result.data.code === 0) {
          this.setState({
            analyticalDethod: result.data.data,
            sensorDrawer: true,
          });
        } else {
          this.setState({
            analyticalDethod: [],
          });
        }
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  mySizeChange = (page, pageSize) => {
    const { form } = this.props;
    const value = form.getFieldsValue();
    value.mytabel = undefined;
    if (value.productDate !== undefined) {
      value.productDate = value.productDate.format('YYYY-MM-DD');
    }
    if (value.endDate !== undefined) {
      value.endDate = value.endDate.format('YYYY-MM-DD');
    }
    this.queryDataSource(page, pageSize, value);
  };

  getFieldsAll = () => {
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const fieldName = [
      '编号',
      '地址',
      '位置',
      '状态',
      '名称',
      '厂家',
      '型号',
      '量程',
      '精度',
      '标定系数K',
      '生产日期',
      '结束日期',
    ];
    const fieldTable = [
      'sensorNumber',
      'sensorAddress',
      'position',
      'sensorStatus',
      'sensorName',
      'manufacturer',
      'sensorModel',
      'sensorRange',
      'sensorAccuracy',
      'timingFactor',
      'productDate',
      'endDate',
    ];
    const muRules = [
      [],
      [
        {
          pattern: /^[a-zA-z0-9]{0,4}$/,
          message: '请输入十进制，长度小于4',
        },
      ],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ];
    for (let i = 0; i < fieldName.length; i++) {
      let put = <Input placeholder="搜索条件" />;
      if (fieldName[i].indexOf('日期') > -1) {
        put = <DatePicker style={{ width: '100%' }} placeholder="搜索条件" />;
      }
      if (fieldName[i].indexOf('位置') > -1) {
        put = <Input disabled placeholder="搜索条件" />;
      }
      if (fieldName[i].indexOf('状态') > -1) {
        put = (
          <Select>
            <Select.Option value="1">未使用</Select.Option>
            <Select.Option value="2">使用中</Select.Option>
            <Select.Option value="3">已损坏</Select.Option>
          </Select>
        );
      }
      children.push(
        <Col span={4} key={i}>
          <Form.Item label={fieldName[i]}>
            {getFieldDecorator(fieldTable[i], {
              rules: muRules[i],
            })(put)}
          </Form.Item>
        </Col>
      );
    }
    return children;
  };

  getFieldsLess = () => {
    const { getFieldDecorator } = this.props.form;
    const children = [];
    const fieldName = ['编号', '地址', '位置', '状态', '名称'];
    // const fieldName = ['编号', '地址(十进制)'];
    // const fieldTable = ['sensorNumber', 'sensorAddress'];
    const fieldTable = ['sensorNumber', 'sensorAddress', 'position', 'sensorStatus', 'sensorName'];
    const muRules = [
      [],
      [
        {
          pattern: /^[a-zA-z0-9]{0,4}$/,
          message: '请输入十进制，长度小于4',
        },
      ],
      [],
      [],
      [],
    ];
    for (let i = 0; i < fieldName.length; i++) {
      let put = <Input placeholder="搜索条件" />;
      if (fieldName[i].indexOf('位置') > -1) {
        put = <Input disabled placeholder="搜索条件" />;
      }
      if (fieldName[i].indexOf('状态') > -1) {
        put = (
          <Select>
            <Select.Option value="1">未使用</Select.Option>
            <Select.Option value="2">使用中</Select.Option>
            <Select.Option value="3">已损坏</Select.Option>
          </Select>
        );
      }
      children.push(
        <Col span={4} key={i}>
          <Form.Item label={fieldName[i]}>
            {getFieldDecorator(fieldTable[i], {
              rules: muRules[i],
            })(put)}
          </Form.Item>
        </Col>
      );
    }
    return children;
  };

  getFields = () => {
    const { expand } = this.state;
    if (expand) {
      return this.getFieldsAll();
    } else {
      return this.getFieldsLess();
    }
  };

  toggle = () => {
    this.setState({
      expand: !this.state.expand,
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleSearch = e => {
    const { form } = this.props;
    const value = form.getFieldsValue();
    let page = 1;
    let pageSize = 10;
    if (value.mytabel !== undefined) {
      page = value.mytabel.current;
      pageSize = value.mytabel.pageSize;
    }
    if (value.productDate !== undefined) {
      value.productDate = value.productDate.format('YYYY-MM-DD');
    }
    if (value.endDate !== undefined) {
      value.endDate = value.endDate.format('YYYY-MM-DD');
    }
    value.mytabel = undefined;
    this.queryDataSource(page, pageSize, value);
  };

  deleteSensorInfo = () => {
    this.setState({
      deleteSensor: true,
    });
  };

  confirm = () => {
    message.success('Next step.');
  };

  cancel = () => {
    message.error('Click on cancel.');
  };

  tableTag = (text, record, index) => {
    return (
      <div>
        <Button type="primary" icon="edit" />
        <Divider type="vertical" />
        <Popconfirm
          title="删除后数据不可恢复，您当前操作会被记录，是否继续！"
          placement="left"
          onConfirm={e => this.confirm(e, record)}
          onCancel={this.cancel}
          okText="是"
          cancelText="否"
        >
          <Button type="danger" icon="delete" />
        </Popconfirm>
      </div>
    );
  };

  updateInAndOut = (e, record) => {
    const inOut = e.target.text;
    const va = e.target;
    let yuansu = undefined;
    axios
      .put(`/sensor/updateSensorPro`, {
        inAndOutStatus: inOut,
        sensorId: record.key,
      })
      .then(result => {
        if (result.data) {
          if (inOut === '出库') {
            //往下找
            yuansu = va.nextSibling.nextSibling;
          } else {
            //往上找
            yuansu = va.previousSibling.previousSibling;
          }
          va.style.color = '#D9D9D9';
          yuansu.style.color = '#52C41A';
          va.setAttribute('disabled', 'disabled');
          yuansu.removeAttribute('disabled');
        } else {
          message.error('操作失败！');
        }
      })
      .catch(() => {
        console.log('获取数据失败');
      });
  };

  showTable = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'sensorNumber',
        width: 200,
        align: 'center',
      },
      {
        title: '地址(十进制)',
        dataIndex: 'sensorAddress',
        width: 130,
        align: 'center',
      },
      {
        title: '位置',
        dataIndex: 'position',
        width: 300,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        align: 'center',
        render: (text, record, index) => {
          let status = 'success';
          if (text === '未使用') {
            status = 'default';
          } else if (text === '已损坏') {
            status = 'error';
          }
          return <Badge status={status} text={text} />;
        },
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
        title: '出入库操作',
        dataIndex: 'inAndOutStatus',
        width: 200,
        align: 'center',
        render: (text, record, index) => {
          let chuku = { color: '#D9D9D9' };
          let ruku = { color: '#52C41A' };
          let chu = true;
          if (text === '入库') {
            chu = false;
            chuku = { color: '#52C41A' };
            ruku = { color: '#D9D9D9' };
          }
          return (
            <span>
              <a
                disabled={chu}
                value="出库"
                onClick={e => this.updateInAndOut(e, record)}
                style={chuku}
              >
                出库
              </a>
              <Divider type="vertical" />
              <a disabled={!chu} onClick={e => this.updateInAndOut(e, record)} style={ruku}>
                入库
              </a>
            </span>
          );
        },
      },
      {
        title: '操作',
        width: 200,
        align: 'center',
        render: (text, record, index) => {
          return this.tableTag(text, record, index);
        },
      },
      // {
      //   title: '型号',
      //   dataIndex: 'sensorModel',
      //   width: 150,
      //   align: 'center',
      // },
      // {
      //   title: '量程',
      //   dataIndex: 'sensorRange',
      //   width: 150,
      //   align: 'center',
      // },
      // {
      //   title: '精度',
      //   dataIndex: 'sensorAccuracy',
      //   width: 150,
      //   align: 'center',
      // },
      // {
      //   title: '标定系数K',
      //   dataIndex: 'timingFactor',
      //   width: 150,
      //   align: 'center',
      // },
      // {
      //   title: '解析方式',
      //   dataIndex: 'parserMethods',
      //   width: 200,
      //   align: 'center',
      // },
      // {
      //   title: '生产日期',
      //   dataIndex: 'productDate',
      //   width: 200,
      //   align: 'center',
      // },
      // {
      //   title: '结束日期',
      //   dataIndex: 'endDate',
      //   width: 200,
      //   align: 'center',
      // },
    ];
    const a = (
      <Table
        columns={columns}
        dataSource={this.state.dataSource}
        // scroll={{ x: 2400 }}
        pagination={{
          showSizeChanger: true,
          bordered: true,
          pageSizeOptions: ['5', '10', '20', '40', '50'],
          defaultCurrent: this.state.pagination.defaultCurrent,
          defaultPageSize: this.state.pagination.defaultPageSize,
          total: this.state.pagination.total,
          onShowSizeChange: this.mySizeChange.bind(),
          onChange: this.mySizeChange.bind(),
        }}
        onRow={record => {
          return {
            onDoubleClick: e => {
              const name = e.target.nodeName;
              if (name !== 'BUTTON' && name !== 'A') {
                this.queryInventoryRecord(record);
                this.setState({
                  sensorInfoDrawer: true,
                  sensorInfoData: record,
                });
              }
            },
          };
        }}
      />
    );
    const b = <List />;
    return this.state.showTable === true ? a : b;
  };

  showDrawer = () => {
    this.querySensorAnalyticalDethod();
  };

  onClose = () => {
    this.setState({
      sensorDrawer: false,
    });
  };

  showSensorInfoDrawer = () => {
    this.setState({
      sensorInfoDrawer: true,
    });
  };

  onSensorInfoClose = () => {
    this.setState({
      sensorInfoDrawer: false,
    });
  };

  tableEdit = () => {
    alert('别点，还在开发');
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout title="传感器仓库">
        <Card loading={this.state.cardLoading}>
          <Form onSubmit={this.handleSearch}>
            <Row gutter={24}>
              {this.getFields()}
              <Col span={4} style={{ float: 'right', marginTop: '43px' }}>
                <Button type="primary" htmlType="submit" icon="search" />
                <Button
                  type="danger"
                  style={{ marginLeft: 8 }}
                  icon="close-circle"
                  onClick={this.handleReset}
                />
                <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                  {this.state.expand ? '收缩' : '展开'}{' '}
                  <Icon type={this.state.expand ? 'up' : 'down'} />
                </a>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={24} style={{ marginTop: '2vh', marginBottom: '10px' }}>
              <Button type="primary" icon="plus" onClick={this.showDrawer}>
                添加传感器
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: '5px' }}
                icon="form"
                onClick={this.tableEdit}
              >
                编辑
              </Button>
              <Button type="primary" style={{ marginLeft: '5px' }}>
                批量入库
              </Button>
              <Button type="primary" style={{ marginLeft: '5px' }}>
                批量出库
              </Button>
            </Col>
          </Row>

          <Row>{getFieldDecorator('mytabel')(this.showTable())}</Row>
        </Card>
        <SensorDrawer
          myAnalyticalDethod={this.state.analyticalDethod}
          show={this.state.sensorDrawer}
          onClick={this.onClose}
        />
        <SensorInfoDrawer
          datasource={this.state.sensorInfoData}
          show={this.state.sensorInfoDrawer}
          click={this.onSensorInfoClose}
          timelineData={this.state.sensorInfolog}
        />
      </PageHeaderLayout>
    );
  }
}
