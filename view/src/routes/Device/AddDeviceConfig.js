import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Select, Drawer, message, Tooltip } from 'antd';
import axios from '../../axios';

@Form.create()
export default class AddDeviceConfig extends Component {

  state = {
    bindDrawerVisible: false,
    terminalInfos: [],
    collectionFrequency: null,
    terminalTypes: [],
    sensorInfos: [],
    sensorAddress: null,
    timingFactor: null,
    parserMethods: [],
    monitorTypes: [],
  }

  componentWillReceiveProps(props) {
    this.setState({ bindDrawerVisible: props.drawerVisible });
  }

  //关闭设备绑定页面
  closeBindDrawer = () => {
    this.setState({ bindDrawerVisible: false, sensorAddress: null });
  }

  //表单提交触发事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const hide = message.loading('绑定中，请稍候', 0);
        var formDate = new URLSearchParams();
        console.log(values)
        Object.keys(values).map(key => { values[key] ? formDate.append(key, values[key]) : null; });
        axios.post(`/deviceConfig/addDeviceConfig`, formDate)
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              message.info(result.msg);
            } else {
              message.error(result.msg);
            }
            setTimeout(hide, 2500);
          })
          .catch(function (error) {
            message.error(error);
            console.log(error);
            setTimeout(hide, 2500);
          });
      }
    });
  }

  //选择框提供终端编号供选择
  getTerminalNumber = () => {
    if (this.state.terminalInfos.length != 0) {
      return
    }
    axios.get(`/terminal/listTerminalInUse`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            terminalInfos: result.data,
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
    if (this.state.sensorInfos.length != 0) {
      return
    }
    axios.get(`/sensor/listSensorInUseAndNotBind`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            sensorInfos: result.data,
          });
        } else {
          message.info("暂无传感器编号信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //选择框提供终端类型供选择
  getTerminalType = () => {
    if (this.state.sensorInfos.length != 0) {
      return
    }
    axios.get(`/terminal/getTerminalTypes`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            terminalTypes: result.data,
          });
        } else {
          message.info("暂无终端类型信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //选择框提供传感器解析方式供选择
  getParserMethod = () => {
    if (this.state.parserMethods.length != 0) {
      return
    }
    axios.get(`/sensor/getParserMethods`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            parserMethods: result.data,
          });
        } else {
          message.info("暂无传感器解析方式信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

   //选择框提供监测类型供选择
   getMonitorType = () => {
    if (this.state.monitorTypes.length != 0) {
      return
    }
    axios.get(`/sensor/getMonitorTypes`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            monitorTypes: result.data,
          });
        } else {
          message.info("暂无监测类型信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //选择框选中终端编号后填充相应的终端信息
  fillTerminalInfo = (value) => {
    let terminalInfos = this.state.terminalInfos
    for (let terminal of terminalInfos) {
      if (value == terminal.terminalNumber) {
        this.setState({ collectionFrequency: terminal.collectionFrequency })
        break;
      }
    }
  }

  //选择框选中传感器编号后填充相应的传感器信息
  fillSensorInfo = (value) => {
    let sensorInfos = this.state.sensorInfos
    for (let sensor of sensorInfos) {
      if (value == sensor.sensorNumber) {
        let sensorAddressVar = this.state.sensorAddress
        if(sensorAddressVar){
          console.log(typeof sensorAddressVar)
          if(sensorAddressVar.toString().includes("," + sensor.sensorAddress + ",")){
            message.error("所选择的传感器地址与之前选择的重复，请移除刚刚选择的传感器")
          }
          if(sensorAddressVar.toString().startsWith(sensor.sensorAddress + ",")){
            message.error("所选择的传感器地址与之前选择的重复，请移除刚刚选择的传感器")
          }
          if(sensorAddressVar.toString().endsWith("," + sensor.sensorAddress + ",")){
            message.error("所选择的传感器地址与之前选择的重复，请移除刚刚选择的传感器")
          }
          sensorAddressVar = sensorAddressVar + "," + sensor.sensorAddress
        }else{
          sensorAddressVar = sensor.sensorAddress
        }
        this.setState({ sensorAddress: sensorAddressVar, timingFactor: sensor.timingFactor })
        break;
      }
    }
  }

  //选择框取消选中传感器编号后移除掉已填充相应的传感器信息
  removeSensorInfo = (value) => {
    let sensorInfos = this.state.sensorInfos
    for (let sensor of sensorInfos) {
      if (value == sensor.sensorNumber) {
        let sensorAddressVar = this.state.sensorAddress
        if(sensorAddressVar == sensor.sensorAddress){
          sensorAddressVar = null
        } else if(sensorAddressVar.endsWith(sensor.sensorAddress)){
          sensorAddressVar = sensorAddressVar.replace("," + sensor.sensorAddress, "")
        }else{
          sensorAddressVar = sensorAddressVar.replace(sensor.sensorAddress + ",", "")
        }
        this.setState({ sensorAddress: sensorAddressVar, timingFactor: sensor.timingFactor })
        break;
      }
    }
  }

  validMonitorPointRule = (rule, value, callback) => {
    if (value) { 
      const form = this.props.form;
      let sensorNumberArr = form.getFieldValue('sensorNumber')
      if (!sensorNumberArr) {
        callback('请先选择传感器');
      } else {
        let arrayStr = value.split(",")
        if (arrayStr.length != sensorNumberArr.length) {
          callback('输入的测点编号格式不符合要求，请与传感器数量顺序保持一致');
        } else {
          callback();
        }
      }
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };

    return <div>
      <Drawer
        title="设备绑定"
        width={720}
        onClose={this.closeBindDrawer}
        visible={this.state.bindDrawerVisible}
        destroyOnClose={true}
      >
        <Form layout="horizontal" onSubmit={this.handleSubmit}>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="终端编号" {...formItemLayout}>
                {getFieldDecorator('terminalNumber', {
                  rules: [{
                    required: true, message: '请选择一个终端',
                  }],
                })(
                  <Select
                    placeholder="终端编号"
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onDropdownVisibleChange={this.getTerminalNumber}
                    onSelect={this.fillTerminalInfo}
                    onPopupScroll={(a) => { console.log(a) }}
                    style={{ width: '100%' }}
                  >
                    {this.state.terminalInfos.map(terminal => <Select.Option key={terminal.terminalNumber}>{terminal.terminalNumber}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="终端类型" {...formItemLayout}>
                {getFieldDecorator('terminalType', {
                  rules: [{
                    required: true, message: '请对应终端的类型',
                  }],
                })(
                  <Select
                    placeholder="终端类型"
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onDropdownVisibleChange={this.getTerminalType}
                    onPopupScroll={(a) => { console.log(a) }}
                    style={{ width: '100%' }}
                  >
                    {this.state.terminalTypes.map(type => <Select.Option key={type.index}>{type.value}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="采集频率（分钟/次）" {...formItemLayout}>
                {getFieldDecorator('collectionFrequency', { initialValue: this.state.collectionFrequency })(
                  <Input placeholder="采集频率（分钟/次）" disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="通道号" {...formItemLayout}>
                {getFieldDecorator('terminalChannel', {
                  rules: [{
                    required: true, message: '请选择传感器接入终端的通道号',
                  }],
                })(
                  <InputNumber min={1} max={16} precision={0} placeholder="通道号" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="传感器编号"  {...formItemLayout}>
                {getFieldDecorator('sensorNumber', {
                  rules: [{
                    required: true, message: '请至少选择一个传感器',
                  }],
                })(
                  <Select
                    placeholder="传感器编号(绑定多个传感器时，只能选择相同厂家同类型传感器)"
                    mode="multiple"
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onDropdownVisibleChange={this.getSensorNumber}
                    onSelect={this.fillSensorInfo}
                    onDeselect={this.removeSensorInfo}
                    style={{ width: '100%' }}
                  >
                    {this.state.sensorInfos.map(sensor => <Select.Option key={sensor.sensorNumber}>{sensor.sensorNumber}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="传感器地址（十进制）" {...formItemLayout}>
                {getFieldDecorator('sensorAddress', { initialValue: this.state.sensorAddress })(
                  <Input placeholder="传感器地址" disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="标定系数K" {...formItemLayout}>
                {getFieldDecorator('timingFactor', { initialValue: this.state.timingFactor })(
                  <Input placeholder="标定系数K" disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="解析方式"  {...formItemLayout}>
                {getFieldDecorator('parserMethod', {
                  rules: [{
                    required: true, message: '请对应传感器的解析方式',
                  }],
                })(
                    <Select
                      placeholder="解析方式"
                      showSearch={true}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      onDropdownVisibleChange={this.getParserMethod}
                      style={{ width: '100%' }}
                    >
                      {this.state.parserMethods.map(parser => <Select.Option key={parser.index}>{parser.value}</Select.Option>)}
                    </Select>
                  )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="测点编号" {...formItemLayout}>
                {getFieldDecorator('monitorPointNumber', {
                  rules: [{
                    required: true, message: '请选择对应设备的测点编号',
                  },{
                    validator: this.validMonitorPointRule,
                  }],
                })(
                  <Input placeholder="示例：SL1,SL3,SL9（3个测点，与传感器顺序保持一致）" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="监测类型" {...formItemLayout}>
                {getFieldDecorator('monitorType', {
                  rules: [{
                    required: true, message: '请选择对应设备的监测类型',
                  }],
                })(
                  <Select
                    placeholder="监测类型"
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onDropdownVisibleChange={this.getMonitorType}
                    style={{ width: '100%' }}
                  >
                    {this.state.monitorTypes.map(type => <Select.Option key={type.index}>{type.value}</Select.Option>)}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="是否强制绑定" {...formItemLayout}>
                {getFieldDecorator('forceBind', {
                  rules: [{
                    required: true, message: '请选择对应的绑定类型',
                  }],
                })(
                  <Select placeholder="选择强制绑定不能确保数据能正常收到，请谨慎操作">
                    <Option value="0">不强制绑定</Option>
                    <Option value="1">强制绑定</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12} push={9}>
              <Form.Item>
                <Button onClick={this.closeBindDrawer}> 取消 </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit"> 提交 </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>;
  }
}




