/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable func-names */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { Table, Form, Input, Card, Button, Popover, Row, Col, Select, Drawer, message} from 'antd';
// eslint-disable-next-line import/no-unresolved
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import axios from '@/services/axios';

@Form.create()
class CzServer extends Component {

  state = {
    startLoading: false,
    stopLoading: false,
    startDisabled: false,
    stopDisabled: false,
    drawerVisible: false,
    serverDetail: "服务未启动",
    sensorData: [],
    terminalType: 2,
    terminalData: [],
  }

  componentWillMount() {
    // if (this.props.match.url.lastIndexOf("youren") >= 0) {
    //   this.setState({ terminalType: 1 });
    // } else if (this.props.match.url.lastIndexOf("cezhi") >= 0) {
    //   this.setState({ terminalType: 2 });
    // }

    this.initButtonStatus();
    this.initTableData();

  }

    // 初始化对应button的状态
    initButtonStatus() {
        axios.get(`/server/getServer`, {}).then(response => {
            if (response.data.code === 0) { // 服务已启动
                this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "域名：cz.zdjcyun.com 端口：8888" });
            } else { // 服务未启动
                this.setState({ startDisabled: false, stopDisabled: true, serverDetail: "服务未启动" });
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

  // 初始化Table的数据
  initTableData() {
    axios.get(`/deviceConfig/listDeviceConfigByType`, { params: { 'terminalType': this.state.terminalType } })
      .then(response => {
        if (response.data.code === 0) { // 服务已启动
          this.setState({ terminalData: response.data.data });
          console.log(this.state.terminalType);
        } else { // 服务未启动
          console.log("该服务下暂无终端");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // 启动服务
  // eslint-disable-next-line react/sort-comp
  startServer = () => {
    this.setState({ startLoading: true });
    axios.post(`/server/startServer`)
      .then(response => {
        if (response.data.code === 0) { // 服务启动成功
          this.setState({ startDisabled: true, stopDisabled: false, serverDetail: "域名：cz.zdjcyun.com 端口：8888" });
        } else { // 服务启动失败
          message.error(response.data.msg);
        }
        this.setState({ startLoading: false });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ startLoading: false });
      });
  }

  // 停止服务
  stopServer = () => {
    this.setState({ stopLoading: true });
    axios.delete(`/server/stopServer`)
      .then(response => {
        if (response.data.code === 0) { // 服务停止成功
          this.setState({ startDisabled: false, stopDisabled: true, serverDetail: "服务未启动" });
        } else { // 服务停止失败
          message.error(response.data.msg);
        }
        this.setState({ stopLoading: false });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ stopLoading: false });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        message.info('Received values of form: ', values);
        console.log(values);
        console.log(this.state.terminalData);
      }
      // this.setState({
      //   formValues: values,
      // },_=>{this})
    });
  }
  
  // 搜索框
  searchTerminalForm = () => {
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
                {this.state.terminalData.map(terminal => <Select.Option key={terminal.terminalNumber}>{terminal.terminalNumber}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={5}>
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
        <Col span={6}>
          <Form.Item label="传感器编号" {...formItemLayout}>
            {getFieldDecorator('sensorNumber')(
              <Input placeholder="传感器编号" />
            )}
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="使用状态" {...formItemLayout}>
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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              
            >
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
        if (response.data.code === 0) {
          this.setState({ sensorData: response.data.data });
          console.log(record.terminalNumber);
          console.log(this.state.sensorData);
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
      title="采集频率"
      placement="right"
      visible={this.state.drawerVisible}
      onClose={() => { this.setState({ drawerVisible: false }) }}
    >
      <p>采集频率1...</p>
      <p>采集频率2...</p>
      <p>采集频率3...</p>
    </Drawer>;
  }

  render() {

    const terminalColumns = [
      {
        title: '终端编号', 
        dataIndex: 'terminalNumber', 
        key: 'terminalNumber', 
        align: 'center',
      }, {
        title: '终端类型', 
        dataIndex: 'terminalType', 
        key: 'terminalType', 
        align: 'center',
      }, {
        title: '采集频率', 
        dataIndex: 'collectionFrequency', 
        key: 'collectionFrequency', 
        align: 'center',
      }, {
        title: '连接状态', 
        dataIndex: 'connectStatus', 
        key: 'connectStatus', 
        align: 'center',
      }, {
        title: '操作', 
        dataIndex: 'showSensor', 
        key: 'showSensor', 
        align: 'center',
        // eslint-disable-next-line no-unused-vars
        render: (text, item, index) => {
          return <Button onClick={() => {
            this.setState({ drawerVisible: true })

          }}
          >修改采集频率</Button>;
        }
      }];

    const sensorColumns = [
      {
        title: '传感器编号', 
        dataIndex: 'sensorNumber', 
        key: 'sensorNumber', 
        align: 'center',
      }, {
        title: '传感器地址', 
        dataIndex: 'sensorAddress', 
        key: 'sensorAddress', 
        align: 'center',
      }, {
        title: '标定系数K', 
        dataIndex: 'timingFactor', 
        key: 'timingFactor', 
        align: 'center',
      }, {
        title: '解析方式', 
        dataIndex: 'parserMethod', 
        key: 'parserMethod', 
        align: 'center',
      }, {
        title: '查询指令', 
        dataIndex: 'queryInstruct', 
        key: 'queryInstruct', 
        align: 'center',
      }, {
        title: '使用状态', 
        dataIndex: 'useStatus', 
        key: 'useStatus', 
        align: 'center',
      }, {
        title: '手动触发', 
        dataIndex: 'manalSend', 
        key: 'manalSend', 
        align: 'center',
        // eslint-disable-next-line no-unused-vars
        render: (text, item, index) => {
          return <Button onClick={() => {
            console.log(item)
            const hide = message.loading('正在发送指令，请稍候', 0);
            axios.get(`/deviceConfig/manualSend`, { params: item })
              .then(response => {
                const result = response.data
                if (result.code === 0) {
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

            message.info("还未实现");
          }}
          >触发指令</Button>;
        }
      }];


    return (
      <PageHeaderWrapper title='测智终端服务'>
        <div>
          <Card 
            title={<div>
              <Popover content={this.state.serverDetail} title="服务各参数详细信息">
                <Button icon="info-circle" />
              </Popover>
            </div>} 
            extra={<div>
              <Button type="primary" icon="play-circle" disabled={this.state.startDisabled} loading={this.state.startLoading} onClick={this.startServer}>启动服务</Button>
            &nbsp;&nbsp;&nbsp;
              <Button type="primary" icon="poweroff" disabled={this.state.stopDisabled} loading={this.state.stopLoading} onClick={this.stopServer}>停止服务</Button>
            </div>}
          >
            {this.searchTerminalForm()}
            {this.showSensorDrawer()}
            <div>
              <Table
                columns={terminalColumns}
                dataSource={this.state.terminalData}
              // eslint-disable-next-line no-unused-vars
                expandedRowRender={(record) => {  return <Table columns={sensorColumns} dataSource={this.state.sensorData} /> }}
              // eslint-disable-next-line no-unused-expressions
                onExpand={(expanded, record) => {expanded? this.getSensorData(record):null }}
              />
            </div>

          </Card>
        </div>
      </PageHeaderWrapper>
    )
  }  
}

export default CzServer;




