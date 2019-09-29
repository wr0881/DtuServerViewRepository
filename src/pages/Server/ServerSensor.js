import React, { Component, useState } from 'react';
import { Table, Form, Input, Button, Row, Col, Select, Drawer, message, Switch, Popconfirm, Modal } from 'antd';
import axios from '@/services/axios';

@Form.create()
export default class ServerSensor extends Component {

  state = {
    terminalNumbers: [],
    terminalType: 1,
    sensorData: [],
    pageTotal: 0,
    defaultPageNum: 1,
    defaultPageSize: 10,
    currentPageNum: null,
    currentPageSize: null,
  }

  componentWillMount() {
    this.setState({ terminalNumbers: this.props.terminalNumbers })
    this.setState({ terminalType: this.props.terminalType }, () => { this.initSensorTableData() });
  }

  //初始化传感器Table的数据
  initSensorTableData() {
    axios.get(`/deviceConfig/listDeviceConfigFiled`, { params: { 'terminalType': this.state.terminalType, 'pageNum': this.state.defaultPageNum, 'pageSize': this.state.defaultPageSize } })
      .then(response => {
        let result = response.data
        if (result.code == 0) { //有绑定的传感器
          this.setState({ sensorData: result.data.list, pageTotal: result.data.total });
        } else { //无绑定的传感器
          console.log("该服务下暂无绑定的传感器信息");
        }
      })
      .catch(function (error) {
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pageNum = this.state.defaultPageNum
        values.pageSize = this.state.defaultPageSize
        values.terminalType = this.state.terminalType
        let sensorNumber = values.sensorNumber === undefined ? '' : values.sensorNumber.trim()
        if (sensorNumber.length == 0) {
          values.sensorNumber = undefined
        }
        let sensorAddress = values.sensorAddress === undefined ? '' : values.sensorAddress.trim()
        if (sensorAddress.length == 0) {
          values.sensorAddress = undefined
        }
        axios.get(`/deviceConfig/listDeviceConfigFiled`, { params: values })
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              this.setState({
                sensorData: result.data.list,
                pageTotal: result.data.total,
                currentPageNum: 1,
              });
            } else {
              message.info("该服务下暂无绑定的传感器信息");
            }
          })
          .catch(function (error) {
            message.error("系统异常，请联系管理员");
            console.log(error);
          });
      }
    });
  }

  flush = () => {
    let pageNum = this.state.currentPageNum;
    let pageSize = this.state.currentPageSize;
    if (this.state.currentPageNum === null) {
      pageNum = this.state.defaultPageNum;
    }
    if (this.state.currentPageSize === null) {
      pageSize = this.state.defaultPageSize;
    }
    const { form } = this.props;
    const values = form.getFieldsValue();
    let sensorNumber = values.sensorNumber === undefined ? '' : values.sensorNumber.trim()
    if (sensorNumber.length == 0) {
      values.sensorNumber = undefined
    }
    let sensorAddress = values.sensorAddress === undefined ? '' : values.sensorAddress.trim()
    if (sensorAddress.length == 0) {
      values.sensorAddress = undefined
    }
    let param = {
      pageNum: pageNum,
      pageSize: pageSize,
      terminalType: this.state.terminalType,
      ...values,
    };
    axios.get(`/deviceConfig/listDeviceConfigFiled`, { params: param })
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            sensorData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("该服务下暂无绑定的传感器信息");
        }
      })
      .catch(function (error) {
        message.info("系统异常，请联系管理员");
        console.log(error);
      });
  }

  //传感器搜索框
  serachSensorForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;

    const formItemLayout = {
      labelCol: { sm: { span: 6 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 18 }, xs: { span: 24 } },
    };

    const formItemLayout1 = {
      labelCol: { sm: { span: 7 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 17 }, xs: { span: 24 } },
    };

    return (<Form onSubmit={this.handleSubmit} style={{ marginTop: -5 }}>
      <Row gutter={8}>
        <Col span={4}>
          <Form.Item label="终端编号" {...formItemLayout}>
            {getFieldDecorator('terminalNumber')(
              <Select
                placeholder="终端编号"
                showSearch={true}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: '100%' }}
                allowClear
              >
                {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
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
        <Col span={5}>
          <Form.Item label="传感器地址" {...formItemLayout}>
            {getFieldDecorator('sensorAddress')
              (
                <Input placeholder="传感器地址" />
              )}
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item label="未传数据次数"  {...formItemLayout1}>
            {getFieldDecorator('noDataCount')
              (
                <Select placeholder="未传数据次数" allowClear>
                  <Select.Option value="0">等于0</Select.Option>
                  <Select.Option value="1">不等于0</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="使用状态"  {...formItemLayout}>
            {getFieldDecorator('useStatus')
              (
                <Select placeholder="使用状态" allowClear>
                  <Select.Option value="0">未使用</Select.Option>
                  <Select.Option value="1">已使用</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item >
            <Button
              type="primary"
              style={{width:'100%',paddingLeft:'8px',paddingRight:'8px'}}
              htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>)
  }

  pageSizeOrNumChange = (pageNum, pageSize) => {
    this.setState({
      currentPageNum: pageNum,
      currentPageSize: pageSize,
    });
    const { form } = this.props;
    const values = form.getFieldsValue();
    let sensorNumber = values.sensorNumber === undefined ? '' : values.sensorNumber.trim()
    if (sensorNumber.length == 0) {
      values.sensorNumber = undefined
    }
    let sensorAddress = values.sensorAddress === undefined ? '' : values.sensorAddress.trim()
    if (sensorAddress.length == 0) {
      values.sensorAddress = undefined
    }
    let param = {
      pageNum: pageNum,
      pageSize: pageSize,
      terminalType: this.state.terminalType,
      ...values,
    };
    axios.get(`/deviceConfig/listDeviceConfigFiled`, { params: param })
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            sensorData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("该服务下暂无绑定的传感器信息");
        }
      })
      .catch(function (error) {
        message.info("系统异常，请联系管理员");
        console.log(error);
      });
  }

  deleteDC = (terminalNumber, sensorNumber) => {
    axios.delete(`/deviceConfig/removeDeviceConfigBySensor`, {
      params: { 'terminalNumber': terminalNumber, 'sensorNumber': sensorNumber }
    })
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.flush();
          message.info(result.msg);
        } else {
          message.error(result.msg);
        }
      })
      .catch(function (error) {
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

  changeUseStatus = (record, e, obj) => {
    //const { confirm } = Modal;
    Modal.confirm({
      title: '是否修改使用状态',
      content: '成功修改使用状态后，将同步修改定时任务相关信息',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let params = {
        'terminalNumber': record.terminalNumber,
        'sensorNumber': record.sensorNumber,
        'useStatus': e,
      };
        axios.put(`/deviceConfig/updateDeviceConfig`, params)
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              message.info(result.msg)
            } else {
              message.error(result.msg)
            }
            obj.flush();
          })
          .catch(function (error) {
            message.info("系统异常，请联系管理员");
            console.log(error);
          });
      },
      onCancel() {
        message.warn("修改未生效");
      },
    });
  }

  render() {
    const sensorColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端通道', dataIndex: 'terminalChannel', key: 'terminalChannel', align: 'center',
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
        title: '未传数据次数', dataIndex: 'noDataCount', key: 'noDataCount', align: 'center',
      }, {
        title: '使用状态', dataIndex: 'useStatus', key: 'useStatus', align: 'center',
        render: (text, record, index) => {
          const checked = text === "已使用" ? true : false;
          return (
            <Switch
              checkedChildren="已使用"
              unCheckedChildren="未使用"
              checked={checked}
              onChange={e => {
                this.changeUseStatus(record, e, this);
              }}
            />
          )
        },
      }, {
        title: '操作', dataIndex: 'operation', key: 'manalSend', align: 'center',
        render: (text, item) => {
          return <div><Button onClick={() => {
            if (this.state.terminalType != 1) {
              message.info("除了DTU外，其他类型终端暂未实现手动触发指令的功能")
              return
            }
            const hide = message.loading('正在发送指令，请稍候');
            // axios.get(`/deviceConfig/manualSend`, { params: {...item,queryInstruct:'EE'} })
            axios.get(`/deviceConfig/manualSend`, { params: item })
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
          }}>触发指令</Button>
            <Popconfirm placement="top" title={"是否解除绑定"} onConfirm={() => this.deleteDC(item.terminalNumber, item.sensorNumber)} okText="是" cancelText="否">
              <Button>解除绑定</Button>
            </Popconfirm>
          </div>;
        }
      }];

    return (
      <div>
          {this.serachSensorForm()}
        <div>
          <Table columns={sensorColumns} dataSource={this.state.sensorData} pagination={{
            current: this.state.currentPageNum,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '40', '50'],
            defaultCurrent: this.state.defaultPageNum,
            defaultPageSize: this.state.defaultPageSize,
            total: this.state.pageTotal,
            // onShowSizeChange: this.pageSizeOrNumChange,
            onChange: this.pageSizeOrNumChange,
          }} >
          </Table>
        </div>
      </div>
    )
  }
}