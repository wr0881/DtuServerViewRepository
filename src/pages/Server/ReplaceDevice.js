import React, { Component } from 'react';
import { Table, Form, Card, Button, Row, Col, Select, message } from 'antd';
import axios from '@/services/axios';

@Form.create()
export default class QueryData extends Component {

  state = {
    terminalNumbers: [],
    terminalType: 1,
    monitorTypes: [],
    sensorInfos: [],
    sensorNumber: null,
    sensorAddress: null,
    measuredData: [],
    pageTotal: 0,
    defaultPageNum: 1,
    defaultPageSize: 10,
    dataColumns: null,
  }

  componentWillMount() {
    this.setState({ terminalNumbers: this.props.terminalNumbers })
    this.setState({ terminalType: this.props.terminalType });
  }

  // 表单提交触发事件
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { setSpinLoading } = this.props;
        setSpinLoading(true);
        values.pageNum = this.state.defaultPageNum
        values.pageSize = this.state.defaultPageSize
        axios.get(`/data/getDataBySearchData`, { params: values })
          .then(response => {
            const result = response.data
            if (result.code === 0) {
              this.setState({
                measuredData: result.data.list,
                pageTotal: result.data.total,
              });
            } else {
              message.info(result.msg);
            }
            setSpinLoading(false);
          })
          .catch(function (error) {
            setSpinLoading(false);
            message.error("系统异常，请联系管理员");
            console.log(error);
          });
      }
    });
  }

  // 选择框提供监测类型供选择
  getMonitorTypes = () => {
    if (this.state.monitorTypes.length !== 0) {
      return
    }
    axios.get(`/data/getMonitorTypes`)
      .then(response => {
        let result = response.data
        if (result.code === 0) {
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

  // 选择框根据所选择的终端编号提供传感器编号供选择
  getSensorInfos = (key) => {
    const values = {};
    values.terminalNumber = key;
    axios.get(`/deviceConfig/getDeviceConfigByTerminal`, { params: values })
      .then(response => {
        const result = response.data
        if (result.code === 0) {
          this.setState({
            sensorInfos: result.data,
          });
          console.log(this.state.sensorInfos);
        } else {
          message.info("暂无已绑定的传感器信息");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // 选择框提供传感器地址供选择
  getSensorAddresses = () => {
    if (this.state.sensorInfos.length !== 0) {
      return
    }
    message.info("请先选择一个终端");
  }

  // 选择框提供传感器地址供选择
  getSensorAddress = (key) => {
    const sensorInfo = this.state.sensorInfos.filter(item => item.sensorNumber===key);
    this.setState({
      sensorAddress: sensorInfo[0].sensorAddress,
    });
  }

  // 选择框提供传感器地址供选择
  getSensorNumber = (key) => {
    const sensorInfo = this.state.sensorInfos.filter(item => item.sensorAddress===key);
    this.setState({
      sensorNumber: sensorInfo[0].sensorNumber,
    });
  }

  // 搜索框
  serachDataForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;

    const formItemLayout = {
      labelCol: { sm: { span: 6 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 18 }, xs: { span: 24 } },
    };

    return (
      <Form onSubmit={this.handleSubmit} style={{ marginTop: -5 }}>
        <Row gutter={8}>
          <Col span={5}>
            <Form.Item label="监测类型" {...formItemLayout}>
              {getFieldDecorator('monitorType', { rules: [{ required: true, message: '请选择监测类型' }] })(
                <Select
                  placeholder="监测类型"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onDropdownVisibleChange={this.getMonitorTypes}
                  onSelect={this.changeTableShow}
                  style={{ width: '100%' }}

                >
                  {this.state.monitorTypes.map(type => <Select.Option key={type.index}>{type.value}</Select.Option>)}
                </Select>
              )
              }
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="终端编号" {...formItemLayout}>
              {getFieldDecorator('terminalNumber')(
                <Select
                  placeholder="终端编号"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onDropdownVisibleChange={this.getTerminalNumbers}
                  onSelect={this.getSensorInfos}
                  style={{ width: '100%' }}
                >
                  {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label="终端通道" {...formItemLayout}>
              {getFieldDecorator('terminalChannel')
                (
                  <Select placeholder="终端通道">
                    <Select.Option value=""></Select.Option>
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                  </Select>
                )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="传感器编号" {...formItemLayout}>
              {getFieldDecorator('sensorNumber', { initialValue: this.state.sensorNumber })(
                <Select
                  placeholder="传感器编号"
                  showSearch
                  // filterOption={false}
                  // onSearch={this.fetchUser}
                  onSelect={this.getSensorAddress}
                  style={{ width: '100%' }}
                >
                  {this.state.sensorInfos.map(device => <Select.Option key={device.sensorNumber}>{device.sensorNumber}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="传感器地址" {...formItemLayout}>
              {getFieldDecorator('sensorAddress', { initialValue: this.state.sensorAddress })(
                <Select
                  placeholder="传感器地址"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  onDropdownVisibleChange={this.getSensorAddresses}
                  onSelect={this.getSensorNumber}
                  style={{ width: '100%' }}
                >
                  {this.state.sensorInfos.map(device => <Select.Option key={device.sensorAddress}>{device.sensorAddress}</Select.Option>)}
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
      </Form>
    )
  }

  pageSizeOrNumChange = (pageNum, pageSize) => {
    const { form } = this.props;
    const value = form.getFieldsValue();
    const param = {
      pageNum,
      pageSize,
      ...value,
    };
    const { setSpinLoading } = this.props;
    setSpinLoading(true);
    axios.get(`/data/getDataBySearchData`, { params: param })
      .then(response => {
        const result = response.data
        if (result.code === 0) {
          this.setState({
            measuredData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("暂无数据");
        }
        setSpinLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setSpinLoading(false);
      });
  }

  changeTableShow = (key) => {
    const commonDataColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端通道', dataIndex: 'terminalChannel', key: 'terminalChannel', align: 'center',
      }, {
        title: '传感器编号', dataIndex: 'sensorNumber', key: 'sensorNumber', align: 'center',
      }, {
        title: '传感器地址', dataIndex: 'sensorAddress', key: 'sensorAddress', align: 'center',
      }, {
        title: '测点编号', dataIndex: 'monitorPointNumber', key: 'monitorPointNumber', align: 'center',
      }, {
        title: '实时数据', dataIndex: 'measuredData', key: 'measuredData', align: 'center',
      }, {
        title: '采集时间', dataIndex: 'createDate', key: 'createDate', align: 'center',
      }];

    const twoDataColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端通道', dataIndex: 'terminalChannel', key: 'terminalChannel', align: 'center',
      }, {
        title: '传感器编号', dataIndex: 'sensorNumber', key: 'sensorNumber', align: 'center',
      }, {
        title: '传感器地址', dataIndex: 'sensorAddress', key: 'sensorAddress', align: 'center',
      }, {
        title: '测点编号', dataIndex: 'monitorPointNumber', key: 'monitorPointNumber', align: 'center',
      }, {
        title: 'X数据', dataIndex: 'measuredDataX', key: 'measuredDataX', align: 'center',
      }, {
        title: 'Y数据', dataIndex: 'measuredDataY', key: 'measuredDataY', align: 'center',
      }, {
        title: '采集时间', dataIndex: 'createDate', key: 'createDate', align: 'center',
      }];

    const threeDataColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端通道', dataIndex: 'terminalChannel', key: 'terminalChannel', align: 'center',
      }, {
        title: '传感器编号', dataIndex: 'sensorNumber', key: 'sensorNumber', align: 'center',
      }, {
        title: '传感器地址', dataIndex: 'sensorAddress', key: 'sensorAddress', align: 'center',
      }, {
        title: '测点编号', dataIndex: 'monitorPointNumber', key: 'monitorPointNumber', align: 'center',
      }, {
        title: 'X数据', dataIndex: 'measuredDataX', key: 'measuredDataX', align: 'center',
      }, {
        title: 'Y数据', dataIndex: 'measuredDataY', key: 'measuredDataY', align: 'center',
      }, {
        title: 'Z数据', dataIndex: 'measuredDataZ', key: 'measuredDataZ', align: 'center',
      }, {
        title: '采集时间', dataIndex: 'createDate', key: 'createDate', align: 'center',
      }];

    if (key == 26 || key == 66 || key == 80 || key == 83 || key == 104) {
      this.setState({
        dataColumns: twoDataColumns,
      })
    } else if (key == 52) {
      this.setState({
        dataColumns: threeDataColumns,
      })
    } else {
      this.setState({
        dataColumns: commonDataColumns,
      })
    }
  }

  render() {
    return (
      <div>
        {this.serachDataForm()}
        <div>
          <Table columns={this.state.dataColumns} dataSource={this.state.measuredData} pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '40', '50'],
            defaultCurrent: this.state.defaultPageNum,
            defaultPageSize: this.state.defaultPageSize,
            total: this.state.pageTotal,
            onShowSizeChange: this.pageSizeOrNumChange,
            onChange: this.pageSizeOrNumChange,
          }}
          />
        </div>
      </div>
    )
  }
}