import React, { Component } from 'react';
import { Table, Form, Card, Button, Row, Col, Select, message, Tooltip } from 'antd';
import axios from '@/services/axios';

export default class ReplaceDevice extends Component {

  state = {
    // 所有已使用的终端
    terminalNumbers: [],
    terminalType: 1,
    oldTerminalNumber: null,
    newTerminalNumber: null,
    // 所有已使用的传感器
    sensorNumbers: [],
    oldSensorNumber: null,
    newSensorNumber: null,
    terminalVisible: false,
    sensorVisible: false,
  }

  componentWillMount() {
    this.setState({ terminalNumbers: this.props.terminalNumbers })
    this.setState({ terminalType: this.props.terminalType });
    // 初始化传感器
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
    console.log(selectValue);
    this.setState({ oldSensorNumber: selectValue })
    let newSensorNumber = this.state.newSensorNumber;
    if (newSensorNumber != null && selectValue === newSensorNumber) {
      this.setState({ sensorVisible: true })
    } else {
      this.setState({ sensorVisible: false })
    }
  }

  newSensorNumberFun = (selectValue) => {
    console.log(selectValue);
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
            } else {

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
            {this.state.sensorNumbers.map(sensorNumber => <Select.Option key={sensorNumber}>{sensorNumber}</Select.Option>)}
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
            {this.state.sensorNumbers.map(sensorNumber => <Select.Option key={sensorNumber}>{sensorNumber}</Select.Option>)}
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
              } else {

              }
          }}>替换传感器</Button>
        </Tooltip>
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