import React, { Component } from 'react';
import { Table, Form, Card, Button, Row, Col, Select, message, Tooltip } from 'antd';
import axios from '@/services/axios';

export default class ReplaceDevice extends Component {

  state = {
    terminalNumbers: [],
    terminalType: 1,
    oldTerminalNumber: null,
    newTerminalNumber: null,
    oldSensorNumbers: [],
    newSensorNumbers: [],
    oldSensorNumber: null,
    newSensorNumber: null,
    terminalVisible: false,
    sensorVisible: false,
  }

  componentWillMount() {
    this.setState({ terminalNumbers: this.props.terminalNumbers })
    this.setState({ terminalType: this.props.terminalType });
    // 初始化传感器
    this.inintOldSensorNumbers();
    this.inintNewSensorNumbers();
  }

  inintOldSensorNumbers = () => {}

  inintNewSensorNumbers = () => {
    axios.get(`/sensor/listSensorInUseAndNotBind`)
            .then(response => {
              let result = response.data;
              if (result.code == 0) {
                this.setState({
                  newSensorNumbers: result.data
                })
              } else {
                message.error("已使用且未绑定的传感器（新的）获取失败，请联系管理员");
              }
            })
            .catch(function (error) {
              message.error("已使用且未绑定的传感器（新的）获取失败，请联系管理员");
              console.log(error);
            });
  }

  oldTerminalNumberFun = (selectValue) => {
    console.log(selectValue);
    this.setState({ oldTerminalNumber: selectValue })
    let newTerminalNumber = this.state.newTerminalNumber;
    if (newTerminalNumber != null && selectValue === newTerminalNumber) {
      this.setState({ terminalVisible: true })
    } else {
      this.setState({ terminalVisible: false })
    }
  }

  newTerminalNumberFun = (selectValue) => {
    console.log(selectValue);
    this.setState({ newTerminalNumber: selectValue })
    let oldTerminalNumber = this.state.oldTerminalNumber;
    if (oldTerminalNumber != null && selectValue === oldTerminalNumber) {
      this.setState({ terminalVisible: true })
    } else {
      this.setState({ terminalVisible: false })
    }
  }

  oldSensorNumberFun = (selectValue) => {
    this.setState({ oldSensorNumber: selectValue })
    let newSensorNumber = this.state.newSensorNumber;
    if (newSensorNumber != null && selectValue === newSensorNumber) {
      this.setState({ sensorVisible: true })
    } else {
      this.setState({ sensorVisible: false })
    }
  }

  newSensorNumberFun = (selectValue) => {
    this.setState({ newSensorNumber: selectValue })
    let oldSensorNumber = this.state.oldSensorNumber;
    if (oldSensorNumber != null && selectValue === oldSensorNumber) {
      this.setState({ sensorVisible: true })
    } else {
      this.setState({ sensorVisible: false })
    }
  }

  showSelect = () => {
    return <div>
      <Row>
        <Col span={4}>
          <Select
            placeholder="旧的终端编号"
            showSearch={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '100%' }}
            allowClear={true}
            onSelect={this.oldTerminalNumberFun}
          >
            {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
          </Select>
        </Col>
        <Col span={4} offset={3}>
          <Select
            placeholder="新的终端编号"
            showSearch={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '100%' }}
            allowClear={true}
            onSelect={this.newTerminalNumberFun}
          >
            {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
          </Select>
        </Col>
        <Col span={4} offset={3}>
          <Tooltip title="终端编号未改变，请重选终端编号" trigger={'click'} visible={this.state.terminalVisible} placement={'right'}>
            <Button type="primary" onClick={() => {
              let oldTerminalNumber = this.state.oldTerminalNumber;
              let newTerminalNumber = this.state.newTerminalNumber;
              if (oldTerminalNumber === newTerminalNumber) {
                message.warn("终端编号未改变，请重选终端编号");
                return;
              } else if (oldTerminalNumber === null || newTerminalNumber === null) {
                message.warn("终端编号不允许为空值，请重选终端编号");
                return;
              } else {
                // 发送请求与后端交互
                const params = new URLSearchParams();
                params.append('oldTerminalNumber', oldTerminalNumber);
                params.append('newTerminalNumber', newTerminalNumber);
                const hide = message.loading('正在发送指令，请稍候，最多等待 90 秒');
                axios.put(`/deviceConfig/replaceTerminal`, params)
                  .then(response => {
                    let result = response.data
                    if (result.code == 0) {
                      hide.then(() => message.info(result.msg));
                    } else {
                      hide.then(() => message.error(result.msg));
                    }
                  })
                  .catch(function (error) {
                    hide.then(() => message.error(error));
                    console.log(error);
                  });
              }
            }}>替换终端</Button>
          </Tooltip>
        </Col>
      </Row>
      <Row style={{ marginTop: '15px' }}>
        <Col span={4}>
          <Select
            placeholder="旧的传感器编号"
            showSearch={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '100%' }}
            allowClear={true}
            onSelect={this.oldSensorNumberFun}
          >
            {this.state.oldSensorNumbers.map(sensor => <Select.Option key={sensor.sensorNumber}>{sensor.sensorNumber}</Select.Option>)}
          </Select>
        </Col>
        <Col span={4} offset={3}>
          <Select
            placeholder="新的传感器编号"
            showSearch={true}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            style={{ width: '100%' }}
            allowClear={true}
            onSelect={this.newSensorNumberFun}
          >
            {this.state.newSensorNumbers.map(sensor => <Select.Option key={sensor.sensorNumber}>{sensor.sensorNumber}</Select.Option>)}
          </Select>
        </Col>
        <Col span={4} offset={3}>
          <Tooltip title="传感器编号未改变，请重选传感器编号" trigger={'click'} visible={this.state.sensorVisible} placement={'right'}>
            <Button type="primary" onClick={() => {
              let oldSensorNumber = this.state.oldSensorNumber;
              let newSensorNumber = this.state.newSensorNumber;
              if (oldSensorNumber === newSensorNumber) {
                message.warn("传感器编号未改变，请重选传感器编号");
                return;
              } else if (oldSensorNumber === null || newSensorNumber === null) {
                message.warn("传感器编号不允许为空值，请重选终端编号");
                return;
              } else {
                // 发送请求与后端交互
                const params = new URLSearchParams();
                params.append('oldSensorNumber', oldSensorNumber);
                params.append('newSensorNumber', newSensorNumber);
                const hide = message.loading('正在发送指令，请稍候，最多等待 90 秒');
                axios.put(`/deviceConfig/replaceSensor`, params)
                  .then(response => {
                    let result = response.data
                    if (result.code == 0) {
                      hide.then(() => message.info(result.msg));
                    } else {
                      hide.then(() => message.error(result.msg));
                    }
                  })
                  .catch(function (error) {
                    hide.then(() => message.error(error));
                    console.log(error);
                  });
              }
            }}>替换传感器</Button>
          </Tooltip>
        </Col>
      </Row>
      <Row style={{ marginTop: '15px' }}>
        <Col>
          <Button onClick={() => {
            axios.get(`/sensor/listSensorInUseAndNotBind`)
            .then(response => {
              let result = response.data;
              if (result.code == 0) {
                this.setState({
                  newSensorNumbers: result.data
                })
              } else {
                message.error("已使用且未绑定的传感器（新的）获取失败，请联系管理员");
              }
            })
            .catch(function (error) {
              message.error("已使用且未绑定的传感器（新的）获取失败，请联系管理员");
              console.log(error);
            });
          }}
          >测试</Button>
        </Col>
      </Row>
    </div>
  }

  render() {
    return (
      <div>
        {this.showSelect()}
      </div>
    )
  }
}