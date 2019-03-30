import React, { Component } from 'react';
import { Table, Form, Input, Card, Button, Row, Col, Select, Drawer, message } from 'antd';
import axios from '../../axios';

@Form.create()
export default class DeviceConfig extends Component {

  state = {
    drawerVisible: false,
    sensorData: [],
    terminalData: [],
  }

  componentWillMount() {
    this.initTableData();
  }

  //初始化Table的数据
  initTableData() {
    axios.get(`/deviceConfig/listDeviceConfig`)
      .then(response => {
        if (response.data.code == 0) { 
          this.setState({ terminalData: response.data.data });
        } else {
          message.info("暂无设备绑定信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //打开设备绑定页面
  openBindDrawer = () => {
    this.setState({ drawerVisible: true });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        message.info('Received values of form: ', values);
        console.log(values);
      }
    });
  }

  //搜索框
  serachTerminalForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;

    const formItemLayout = {
      labelCol: { sm: { span: 6 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 18 }, xs: { span: 24 } },
    };

    return (<Form onSubmit={this.handleSubmit} style={{ marginTop: -5 }}>
      <Row gutter={8}>
        <Col span={5}>
          <Form.Item label="终端编号" {...formItemLayout}>
            {getFieldDecorator('terminalNumber')(
              <Select
                placeholder="终端编号"
                // notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                // onChange={this.handleChange}
                style={{ width: '100%' }}
              >
                {this.state.terminalData.map(terminal => <Option key={terminal.terminalNumber}>{terminal.terminalNumber}</Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item label="连接状态" {...formItemLayout}>
            {getFieldDecorator('connectStatus')
              (
                <Select placeholder="连接状态">
                  <Select.Option value="上线">上线</Select.Option>
                  <Select.Option value="离线">离线</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={5} >
          <Form.Item label="传感器编号"  {...formItemLayout}>
            {getFieldDecorator('sensorNumber')(
              <Input placeholder="传感器编号" />
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="使用状态"  {...formItemLayout}>
            {getFieldDecorator('useStatus')
              (
                <Select placeholder="使用状态">
                  <Select.Option value="未使用">未使用</Select.Option>
                  <Select.Option value="已使用">已使用</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item >
            <Button
              type="primary"
              htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>)
  }

  getSensorData(record) {
    axios.get(`/deviceConfig/getDeviceConfigByTerminal`, { params: { 'terminalNumber': record.terminalNumber } })
      .then(response => {
        if (response.data.code == 0) {
          this.setState({ sensorData: response.data.data });
        } else {
          message.info(response.data.msg);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  showSensorDrawer = () => {
    return <Drawer
      title="sensorDetail"
      placement="right"
      visible={this.state.drawerVisible}
      onClose={() => { this.setState({ drawerVisible: false }) }}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>;
  }

  render() {

    const deviceConfigColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber',
      }, {
        title: '终端类型', dataIndex: 'terminalType', key: 'terminalType',
      }, {
        title: '采集频率', dataIndex: 'collectionFrequency', key: 'collectionFrequency',
      }, {
        title: '连接状态', dataIndex: 'connectStatus', key: 'connectStatus',
      }, {
        title: '传感器编号', dataIndex: 'sensorNumber', key: 'sensorNumber',
      }, {
        title: '传感器地址', dataIndex: 'sensorAddress', key: 'sensorAddress',
      }, {
        title: '标定系数K', dataIndex: 'timingFactor', key: 'timingFactor',
      }, {
        title: '解析方式', dataIndex: 'parserMethod', key: 'parserMethod',
      }, {
        title: '查询指令', dataIndex: 'queryInstruct', key: 'queryInstruct',
      }, {
        title: '使用状态', dataIndex: 'useStatus', key: 'useStatus',
      }, {
        title: '操作', dataIndex: 'removeBinding', key: 'removeBinding',
        render: (text, item, index) => {
          return <Button onClick={() => {
            message.info("还未实现");
          }}>解除绑定</Button>;
        }
      }];

    return (
      <div>
        <Card title="设备绑定" extra={<div><Button type="primary" onClick={this.openBindDrawer}>绑定设备</Button></div>}>
          {this.serachTerminalForm()}
          {this.showSensorDrawer()}
          <div>
            <Table columns={deviceConfigColumns} dataSource={this.state.terminalData} />
          </div>

        </Card>
      </div>
    )
  }

  
}




