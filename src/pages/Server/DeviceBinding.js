import React, { Component } from 'react';
import { Form, Input, InputNumber, Button, Row, Col, Select, Drawer, message } from 'antd';
import axios from '@/services/axios';

@Form.create()
export default class DeviceBinding extends Component {

  state = {
    terminalNumbers: [],
    terminalType: 1,
    drawerVisible: false,
    sensorInfos: [],
    sensorAddress: null,
    timingFactor: null,
    parserMethods: [],
    monitorTypes: [],
  }

  componentWillReceiveProps(props) {
    this.setState({ terminalNumbers: props.terminalNumbers })
    this.setState({ terminalType: props.terminalType });
    this.setState({ drawerVisible: props.drawerVisible });
  }

  //关闭设备绑定页面
  closeBindDrawer = () => {
    this.setState({ drawerVisible: false, sensorAddress: null, timingFactor: null });
  }

  //表单提交触发事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { setSpinLoading } = this.props;
        setSpinLoading(true);
        values.sensorAddresses =  values.sensorAddresses.split(",")
        values.timingFactors =  values.timingFactors.split(",")
        values.monitorPointNumbers =  values.monitorPointNumbers.split(",")
        values.terminalType = this.state.terminalType
        axios.post(`/deviceConfig/addDeviceConfig`, values)
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              message.info(result.msg)
            } else {
              message.error(result.msg)
            }
            setSpinLoading(false);
          })
          .catch(function (error) {
            setSpinLoading(false);
            message.error(error);
            console.log(error);
          });
      }
    });
  }

  //选择框提供传感器编号供选择
  getSensorNumbers = () => {
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
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

  //选择框提供传感器解析方式供选择
  getParserMethod = () => {
    if (this.state.parserMethods.length != 0) {
      return
    }
    axios.get(`/data/getParserMethods`)
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
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

   //选择框提供监测类型供选择
   getMonitorType = () => {
    if (this.state.monitorTypes.length != 0) {
      return
    }
    axios.get(`/data/getMonitorTypes`)
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
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

  //选择框选中传感器编号后填充相应的传感器信息
  fillSensorInfo = (value) => {
    let sensorInfos = this.state.sensorInfos
    for (let sensor of sensorInfos) {
      if (value == sensor.sensorNumber) {
        let newSensorAddress
        let oldSensorAddress = this.state.sensorAddress
        let newTimingFactor
        let oldTimingFactor = this.state.timingFactor
        if(oldSensorAddress || oldSensorAddress == 0){
          if(oldSensorAddress.toString().includes("," + sensor.sensorAddress + ",")){
            message.error("所选择的传感器地址与中间选择的重复，请移除刚刚选择的传感器")
          }
          if(oldSensorAddress.toString().startsWith(sensor.sensorAddress + ",")){
            message.error("所选择的传感器地址与第一次选择的重复，请移除刚刚选择的传感器")
          }
          if(oldSensorAddress.toString().endsWith("," + sensor.sensorAddress)){
            message.error("所选择的传感器地址与上一次选择的重复，请移除刚刚选择的传感器")
          }
          newSensorAddress = oldSensorAddress + "," + sensor.sensorAddress
          newTimingFactor = oldTimingFactor + "," + sensor.timingFactor
        }else{
          newSensorAddress = sensor.sensorAddress
          newTimingFactor = sensor.timingFactor
        }
        this.setState({ sensorAddress: newSensorAddress, timingFactor: newTimingFactor })
        break;
      }
    }
  }

  //选择框取消选中传感器编号后移除掉已填充相应的传感器信息
  removeSensorInfo = (value) => {
    let sensorInfos = this.state.sensorInfos
    for (let sensor of sensorInfos) {
      if (value == sensor.sensorNumber) {
        let newSensorAddress
        let oldSensorAddress = this.state.sensorAddress
        let newTimingFactor
        let oldTimingFactor = this.state.timingFactor
        if(oldSensorAddress == sensor.sensorAddress){
          newSensorAddress = null
          newTimingFactor = null
        } else if(oldSensorAddress.endsWith(sensor.sensorAddress)){
          newSensorAddress = oldSensorAddress.substr(0, oldSensorAddress.lastIndexOf(","))
          newTimingFactor = oldTimingFactor.substr(0, oldTimingFactor.lastIndexOf(","))
        }else{
          newSensorAddress = oldSensorAddress.replace(sensor.sensorAddress + ",", "")
          newTimingFactor = oldTimingFactor.replace(sensor.timingFactor + ",", "")
        }
        this.setState({ sensorAddress: newSensorAddress, timingFactor: newTimingFactor })
        break;
      }
    }
  }

  validMonitorPointRule = (rule, value, callback) => {
    if (value) { 
      const form = this.props.form;
      let sensorNumberArr = form.getFieldValue('sensorNumbers')
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
        visible={this.state.drawerVisible}
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
                    style={{ width: '100%' }}
                  >
                    {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
                  </Select>
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
                {getFieldDecorator('sensorNumbers', {
                  rules: [{
                    required: true, message: '请至少选择一个传感器',
                  }],
                })(
                  <Select
                    placeholder="传感器编号(绑定多个传感器时，只能选择相同厂家同类型传感器)"
                    mode="multiple"
                    showSearch={true}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onDropdownVisibleChange={this.getSensorNumbers}
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
                {getFieldDecorator('sensorAddresses', { initialValue: this.state.sensorAddress })(
                  <Input placeholder="传感器地址" disabled />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item label="标定系数K" {...formItemLayout}>
                {getFieldDecorator('timingFactors', { initialValue: this.state.timingFactor })(
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
                {getFieldDecorator('monitorPointNumbers', {
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
                    <Select.Option value="0">不强制绑定</Select.Option>
                    <Select.Option value="1">强制绑定</Select.Option>
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