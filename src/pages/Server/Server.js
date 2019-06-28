/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { Tabs, Spin, Button, Popover, message } from 'antd';
import axios from '@/services/axios';
import DeviceBinding from './DeviceBinding';
import ServerTerminal from './ServerTerminal';
import ServerSensor from './ServerSensor';
import QueryData from './QueryData';

export default class Server extends Component {

  state = {
    startLoading: false,
    stopLoading: false,
    startDisabled: false,
    stopDisabled: false,
    bindDrawerVisible: false,
    spinLoading: false,
    serverDetail: "服务未启动",
    terminalType: 1,
    terminalNumbers: [],

  }

  componentWillMount() {
    if (this.props.url.lastIndexOf("youren") >= 0) {
      this.setState({ terminalType: 1 },()=>{this.initButtonStatus(), this.initTerminalNumbers()});
    } else if (this.props.url.lastIndexOf("cezhi") >= 0) {
      this.setState({ terminalType: 2 },()=>{this.initButtonStatus(), this.initTerminalNumbers()});
    }
  }

  setSpinLoading=(flag)=> {
    this.setState({ spinLoading: flag });
  }

  // 初始化对应button的状态
  initButtonStatus() {
    axios.get(`/server/getServer`, {params: { 'terminalType': this.state.terminalType }})
      .then(response => {
        let result = response.data
        if (result.code == 0) { //服务已启动
          this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "域名：iot.zdjcyun.com 端口：" + result.data });
        } else { //服务未启动
          this.setState({ startDisabled: false, stopDisabled: true, serverDetail: result.msg });
        }
      })
      .catch(function (error) {
        message.error("服务启动信息查询失败，请联系管理员");
        console.log(error);
      });
  }

  //初始化终端编号信息
  initTerminalNumbers() {
    axios.get(`/terminal/getTerminalNumbersInUseByType`, { params: { 'terminalType': this.state.terminalType } })
      .then(response => {
        let result = response.data
        if (result.code == 0) { //获取终端编号成功
          this.setState({ terminalNumbers: result.data });
        } else { //获取终端编号失败
          message.error("终端编号信息查询失败，请联系管理员")
        }
      })
      .catch(function (error) {
        message.error("终端编号信息查询失败，请联系管理员")
        console.log(error);
      });
  }

  //启动服务
  startServer = () => {
    this.setState({ startLoading: true });
    axios.post(`/server/startServer`, { params: { 'terminalType': this.state.terminalType }})
      .then(response => {
        let result = response.data
        if (result.code == 0) { //服务启动成功
          this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "域名：iot.zdjcyun.com 端口：" + result.data  });
        } else { //服务启动失败
          message.error(result.msg);
        }
        this.setState({ startLoading: false });
      })
      .catch(function (error) {
        this.setState({ startLoading: false });
        message.error("服务启动失败，请联系管理员")
        console.log(error);
      });
  }

  //停止服务
  stopServer = () => {
    this.setState({ stopLoading: true });
    axios.delete(`/server/stopServer`, { params: { 'terminalType': this.state.terminalType }})
      .then(response => {
        let result = response.data
        if (result.code == 0) { //服务停止成功
          this.setState({ startDisabled: false, stopDisabled: true, serverDetail: "服务未启动" });
        } else { //服务停止失败
          message.error(result.msg);
        }
        this.setState({ stopLoading: false });
      })
      .catch(function (error) {
        this.setState({ stopLoading: false });
        message.error("服务停止失败，请联系管理员")
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <Spin spinning={this.state.spinLoading}>
          <Tabs defaultActiveKey={"1"} tabBarExtraContent={<div><span>有人DTU服务<Popover content={this.state.serverDetail} title="服务各参数详细信息"><Button icon="info-circle"></Button></Popover></span>
            &nbsp;&nbsp;&nbsp;<Button type="primary" icon="play-circle" disabled={this.state.startDisabled} loading={this.state.startLoading} onClick={this.startServer}>启动服务</Button>
            &nbsp;&nbsp;&nbsp;<Button type="primary" icon="poweroff" disabled={this.state.stopDisabled} loading={this.state.stopLoading} onClick={this.stopServer}>停止服务</Button>
            &nbsp;&nbsp;&nbsp;<Button type="primary" onClick={() => this.setState({ bindDrawerVisible: true })}>绑定设备</Button></div>}>
            <Tabs.TabPane tab="终端信息" key="1">
              <ServerTerminal terminalNumbers={this.state.terminalNumbers} terminalType={this.state.terminalType}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="传感器信息" key="2">
              <ServerSensor terminalNumbers={this.state.terminalNumbers} terminalType={this.state.terminalType} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="数据信息" key="3">
              <QueryData terminalNumbers={this.state.terminalNumbers} terminalType={this.state.terminalType} setSpinLoading={this.setSpinLoading}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="日志信息" key="4">
              <p>待开发</p>
            </Tabs.TabPane>
          </Tabs>
        </Spin>
        <DeviceBinding terminalNumbers={this.state.terminalNumbers} terminalType={this.state.terminalType} drawerVisible={this.state.bindDrawerVisible} />
      </div>
    )
  }
}