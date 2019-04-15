import React, { Component } from 'react';
import { Table, Form, Card, Button, Row, Col, Select, message } from 'antd';
import axios from '../../axios';
import DeviceBindDrawer from './AddDeviceConfig';

@Form.create()
export default class DeviceConfig extends Component {

  state = {
    bindDrawerVisible: false,
    terminalNumbers: [],
    sensorNumbers: [],
    deviceData: [],
    pageTotal: 0,
    defaultPageNum: 1,
    defaultPageSize: 10,
  }

  componentWillMount() {
    this.initTableData();
  }

  //初始化Table的数据
  initTableData() {
    axios.get(`/deviceConfig/listDeviceConfig`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            deviceData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("暂无设备绑定信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //表单提交触发事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pageNum = this.state.defaultPageNum
        values.pageSize = this.state.defaultPageSize
        axios.get(`/deviceConfig/getDeviceConfigByCombine`, { params: values })
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              this.setState({
                deviceData: result.data.list,
                pageTotal: result.data.total,
              });
            } else {
              message.info("暂无设备绑定信息");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }

  //选择框提供终端编号供选择
  getTerminalNumber = () => {
    if (this.state.terminalNumbers.length != 0) {
      return
    }
    axios.get(`/deviceConfig/listTerminalNumber`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            terminalNumbers: result.data,
          });
        } else {
          message.info("暂无终端编号信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //选择框提供传感器编号供选择
  getSensorNumber = () => {
    if (this.state.sensorNumbers.length != 0) {
      return
    }
    axios.get(`/deviceConfig/listSensorNumber`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            sensorNumbers: result.data,
          });
        } else {
          message.info("暂无传感器编号信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //搜索框
  serachDeviceForm = () => {
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
                showSearch={true}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onDropdownVisibleChange={this.getTerminalNumber}
                onPopupScroll={(a) => { console.log(a) }}
                style={{ width: '100%' }}
              >
                {this.state.terminalNumbers.map(device => <Select.Option key={device.terminalNumber}>{device.terminalNumber}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item label="连接状态" {...formItemLayout}>
            {getFieldDecorator('connectStatus')
              (
                <Select placeholder="连接状态">
                  <Select.Option value=""></Select.Option>
                  <Select.Option value="上线">上线</Select.Option>
                  <Select.Option value="离线">离线</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={5} >
          <Form.Item label="传感器编号"  {...formItemLayout}>
            {getFieldDecorator('sensorNumber')(
              <Select
                placeholder="传感器编号"
                showSearch={true}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onDropdownVisibleChange={this.getSensorNumber}
                style={{ width: '100%' }}
              >
                {this.state.sensorNumbers.map(device => <Select.Option key={device.sensorNumber}>{device.sensorNumber}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="使用状态"  {...formItemLayout}>
            {getFieldDecorator('useStatus')
              (
                <Select placeholder="使用状态">
                  <Select.Option value=""></Select.Option>
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

  pageSizeOrNumChange = (pageNum, pageSize) => {
    const { form } = this.props;
    const value = form.getFieldsValue();
    let param = {
      pageNum: pageNum,
      pageSize: pageSize,
      ...value,
    };
    axios.get(`/deviceConfig/getDeviceConfigByCombine`, { params: param })
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            deviceData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("暂无设备绑定信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }



  render() {

    const deviceColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端类型', dataIndex: 'terminalType', key: 'terminalType', align: 'center',
      }, {
        title: '采集频率(分钟/次)', dataIndex: 'collectionFrequency', key: 'collectionFrequency', align: 'center',
      }, {
        title: '连接状态', dataIndex: 'connectStatus', key: 'connectStatus', align: 'center',
      }, {
        title: '传感器编号', dataIndex: 'sensorNumber', key: 'sensorNumber', align: 'center',
      }, {
        title: '传感器地址', dataIndex: 'sensorAddress', key: 'sensorAddress', align: 'center',
      }, {
        title: '标定系数K', dataIndex: 'timingFactor', key: 'timingFactor', align: 'center',
      }, {
        title: '解析方式', dataIndex: 'parserMethod', key: 'parserMethod', align: 'center',
      }, {
        title: '查询指令', dataIndex: 'queryInstruct', key: 'queryInstruct', align: 'center',
      }, {
        title: '测点编号', dataIndex: 'monitorPointNumber', key: 'monitorPointNumber', align: 'center',
      }, {
        title: '监测类型', dataIndex: 'monitorType', key: 'monitorType', align: 'center',
      }, {
        title: '使用状态', dataIndex: 'useStatus', key: 'useStatus', align: 'center',
      }, {
        title: '操作', dataIndex: 'removeBinding', key: 'removeBinding', align: 'center',
        render: (text, item, index) => {
          return <Button onClick={() => {
            message.info("还未实现");
          }}>解除绑定</Button>;
        }
      }];

    return (
      <div>
        <Card title="设备绑定" extra={<div><Button type="primary" onClick={() => this.setState({bindDrawerVisible: true})}>绑定设备</Button></div>}>
          {this.serachDeviceForm()}
          <DeviceBindDrawer drawerVisible={this.state.bindDrawerVisible}/>
          <div>
            <Table columns={deviceColumns} dataSource={this.state.deviceData} pagination={{
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20', '40', '50'],
              defaultCurrent: this.state.defaultPageNum,
              defaultPageSize: this.state.defaultPageSize,
              total: this.state.pageTotal,
              onShowSizeChange: this.pageSizeOrNumChange,
              onChange: this.pageSizeOrNumChange,
            }} />
          </div>
        </Card>
      </div>
    )
  }


}




