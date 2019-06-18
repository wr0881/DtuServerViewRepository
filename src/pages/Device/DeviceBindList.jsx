/* eslint-disable lines-between-class-members */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  message,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DeviceBind from './DeviceBind';
import { getTerminalNumber, getSensorNumber, getDeviceBindList } from '@/services/device';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class DeviceBindList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      terminalNumber: [],
      sensorNumber: [],
      tableLoading: false,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
    };
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      }, _ => { this.queryDataSource() });

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  };

  getTerminalNumber = () => {
    const { terminalNumber } = this.state;
    if (terminalNumber.length === 0) {
      getTerminalNumber().then(res => {
        const { code, data } = res.data;
        console.log(data);
        if (code === 0) {
          this.setState({ terminalNumber: data });
        } else {
          this.setState({ terminalNumber: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  getSensorNumber = () => {
    const { sensorNumber } = this.state;
    if (sensorNumber.length === 0) {
      getSensorNumber().then(res => {
        const { code, data } = res.data;
        console.log(data);
        if (code === 0) {
          this.setState({ sensorNumber: data });
        } else {
          this.setState({ sensorNumber: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    const param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getDeviceBindList(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data.list });
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      } else {
        this.setState({ dataSource: [] });
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`err`);
    })
  };

  renderForm() {
    const { form: { getFieldDecorator }, } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col span={5}>
            <Form.Item label="终端编号">
              {getFieldDecorator('terminalNumber')(
                <Select
                  placeholder="终端编号"
                  onFocus={this.getTerminalNumber}
                  dropdownMatchSelectWidth={false}
                  style={{ width: '100%' }}
                >
                  {this.state.terminalNumber.map(device => <Select.Option key={device.terminalNumber}>{device.terminalNumber}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="连接状态">
              {getFieldDecorator('connectStatus')
                (
                  <Select placeholder="连接状态">
                    <Select.Option value="上线">上线</Select.Option>
                    <Select.Option value="离线">离线</Select.Option>
                  </Select>
                )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="传感器编号">
              {getFieldDecorator('sensorNumber')(
                <Select
                  placeholder="传感器编号"
                  showSearch
                  onFocus={this.getSensorNumber}
                  dropdownMatchSelectWidth={false}
                  style={{ width: '100%' }}
                >
                  {this.state.sensorNumber.map(device => <Select.Option key={device.sensorNumber}>{device.sensorNumber}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="使用状态">
              {getFieldDecorator('useStatus')
                (
                  <Select placeholder="使用状态">
                    <Select.Option value="未使用">未使用</Select.Option>
                    <Select.Option value="已使用">已使用</Select.Option>
                  </Select>
                )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={e => {
                e.preventDefault();
                this.handleFormReset();
              }}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  table = () => {
    const columns = [
      {
        title: '终端编号',
        dataIndex: 'terminalNumber',
        key: 'terminalNumber',
        align: 'center',
      },
      {
        title: '终端类型',
        dataIndex: 'terminalType',
        key: 'terminalType',
        align: 'center',
      },
      {
        title: '采集频率(分钟/次)',
        dataIndex: 'collectionFrequency',
        key: 'collectionFrequency',
        align: 'center',
      },
      {
        title: '连接状态',
        dataIndex: 'connectStatus',
        key: 'connectStatus',
        align: 'center',
        render: (text, record, index) => {
          let status = 'success';
          if (text === '上线') {
            status = 'success';
          } else if (text === '离线') {
            status = 'error';
          }
          return <Badge status={status} text={text} />;
        },
      },
      {
        title: '传感器编号',
        dataIndex: 'sensorNumber',
        key: 'sensorNumber',
        align: 'center',
      },
      {
        title: '传感器地址',
        dataIndex: 'sensorAddress',
        key: 'sensorAddress',
        align: 'center',
      },
      {
        title: '标定系数K',
        dataIndex: 'timingFactor',
        key: 'timingFactor',
        align: 'center',
      },
      {
        title: '解析方式',
        dataIndex: 'parserMethod',
        key: 'parserMethod',
        align: 'center',
      },
      {
        title: '查询指令',
        dataIndex: 'queryInstruct',
        key: 'queryInstruct',
        align: 'center',
      },
      {
        title: '测点编号',
        dataIndex: 'monitorPointNumber',
        key: 'monitorPointNumber',
        align: 'center',
      },
      {
        title: '监测类型',
        dataIndex: 'monitorType',
        key: 'monitorType',
        align: 'center',
      },
      {
        title: '使用状态',
        dataIndex: 'useStatus',
        key: 'useStatus',
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
        title: '操作',
        dataIndex: 'removeBinding',
        key: 'removeBinding',
        align: 'center',
        render: (text, item, index) => {
          return (
            <div>
              <a>解除绑定</a>
              {/* <Divider type="vertical" />
              <a>删除</a>
              <Divider type="vertical" />
              <a>详情</a> */}
            </div>
          )
        }
      }];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
      },
      getCheckboxProps: record => ({
        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        // name: record.name,
      }),
    };
    return (
      <Table
        loading={this.state.tableLoading}
        columns={columns}
        dataSource={this.state.dataSource}
        pagination={this.state.pagination}
        onChange={(pagination) => {
          this.setState({ pagination }, this.queryDataSource.bind(this));
        }}
        rowSelection={rowSelection}
      />
    )
  }
  render() {
    return (
      <PageHeaderWrapper title='设备绑定'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                // this.handleDrawerAddSensorVisible(true);
              }}>
                绑定设备
              </Button>
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    全选为选择当前页的所有传感器
                    <a style={{ marginLeft: 24 }}>
                      批量解除绑定
                    </a>
                    {/* <Divider type="vertical" />
                    <a style={{ marginLeft: 0 }}>
                      批量出库
                    </a> */}
                    <Divider type="vertical" />
                    <a style={{ marginLeft: 0 }} onClick={_ => { this.setState({ selectedRowKeys: [] }) }}>
                      清空所选
                    </a>
                  </div>
                }
                type="info"
                showIcon
              />
            </div>
            {this.table()}
          </div>
        </Card>
        <DeviceBind />
      </PageHeaderWrapper>
    );
  }
  componentDidMount() {
    this.queryDataSource();
  }
}

export default DeviceBindList;