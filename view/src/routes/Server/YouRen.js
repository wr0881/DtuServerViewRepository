import React, { Component } from 'react';
import { Table, Form, Input, Card, Button, Popover, Row, Col, Select } from 'antd';
import axios from 'axios';
import '../Config';

@Form.create()
export default class YouRen extends Component {

  state = {
    startLoading: false,
    stopLoading: false,
    startDisabled: false,
    stopDisabled: false,
    serverDetail: "服务未启动",
    dataSource: [],
  }

  componentWillMount() {
    this.initButtonStatus();
  }

  //初始化对应button的状态
  initButtonStatus() {
    axios.get(`${global.constants.onlineWeb}/server/getServer`, {})
      .then(response => {
        if (response.data.code == 0) { //服务已启动
          this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "服务详情" });
        } else { //服务未启动
          this.setState({ startDisabled: false, stopDisabled: true, serverDetail: "服务未启动" });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //获取服务的详情
  getServerDetail() {
    axios.get(`${global.constants.onlineWeb}/server/getServer`, {})
      .then(response => {

        if (response.data.code == 0) { //服务已启动
          this.setState({ startDisabled: true, stopDisabled: false });
        } else { //服务未启动
          this.setState({ startDisabled: false, stopDisabled: true });
        }

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  startServer = () => {
    this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "服务详情" });
  }

  stopServer = () => {
    this.setState({ startDisabled: false, stopDisabled: true, serverDetail: "服务未启动" });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  serachTerminalForm = () => {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const formItemLayout = {
			labelCol: { sm: { span: 6 }, xs: { span: 24 }, },
			wrapperCol: { sm: { span: 18 }, xs: { span: 24 } },
		};

    return (<Form onSubmit={this.handleSubmit} style={{ marginTop: -15 }}>
      <Row gutter={8}>
        <Col span={5}>
          <Form.Item label="终端编号" {...formItemLayout}>
            {getFieldDecorator('terminalNumber')(
              <Input placeholder="终端编号" />
            )}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item label="终端状态" {...formItemLayout}>
            {getFieldDecorator('terminalStatus')
              (
                <Select mode="multiple" placeholder="终端状态">
                  <Option value="1">未使用</Option>
                  <Option value="2">上线</Option>
                  <Option value="3">离线</Option>
                  <Option value="4">已损坏</Option>
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
          <Form.Item label="传感器状态"  {...formItemLayout}>
            {getFieldDecorator('sensorStatus')
              (
                <Select mode="multiple" placeholder="传感器状态">
                  <Option value="1">未使用</Option>
                  <Option value="2">使用中</Option>
                  <Option value="b3">已损坏</Option>
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

  render() {

    const dataSource = [{
      key: '1',
      terminalNumber: 'ZD2019010001',
      collectionFrequency: 5,
      status: '上线'
    }, {
      key: '2',
      terminalNumber: 'ZD2019020001',
      collectionFrequency: 5,
      status: '离线'
    }];

    const columns = [{
      title: '终端编号',
      dataIndex: 'terminalNumber',
      key: 'terminalNumber',
    }, {
      title: '采集频率',
      dataIndex: 'collectionFrequency',
      key: 'collectionFrequency',
    }, {
      title: '终端状态',
      dataIndex: 'status',
      key: 'status',
    }];


    return (
      <div>
        <Card title={<div>有人DTU服务<Popover content={this.state.serverDetail} title="服务各参数详细信息"><Button icon="info-circle"></Button></Popover></div>} extra={<div>
          <Button type="primary" icon="play-circle" disabled={this.state.startDisabled} loading={this.state.startLoading} onClick={this.startServer}>启动服务</Button>
          &nbsp;&nbsp;&nbsp;<Button type="primary" icon="poweroff" disabled={this.state.stopDisabled} loading={this.state.stopLoading} onClick={this.stopServer}>停止服务</Button>
        </div>}>
          {this.serachTerminalForm()}
          <div><Table dataSource={this.state.dataSource} columns={columns} /></div>

        </Card>
      </div>
    )
  }
}


