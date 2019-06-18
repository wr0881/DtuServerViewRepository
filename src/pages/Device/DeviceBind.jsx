/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-param-reassign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable lines-between-class-members */
/* eslint-disable no-unused-vars */
import React, { Component, Fragment } from 'react';
import { insertSensors, sensorNumberCount } from '@/services/in-out-library';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  message,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import { getTerminalNumber, getSensorNumber, getParserMethods, getMonitorTypes, getTerminalTypes } from '@/services/device';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class DeviceBind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terminalNumber: [],
      sensorNumber: [],
      parserMethods: [],
      monitorTypes: [],
      terminalTypes: [],
      addSensorNum: [0]
    };
  }
  getTerminalNumber = () => {
    const { terminalNumber } = this.state;
    if (terminalNumber.length === 0) {
      getTerminalNumber().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ terminalNumber: data });
        } else {
          this.setState({ terminalNumber: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
  getSensorNumber = () => {
    const { sensorNumber } = this.state;
    if (sensorNumber.length === 0) {
      getSensorNumber().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ sensorNumber: data });
        } else {
          this.setState({ sensorNumber: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
  getParserMethods = () => {
    const { parserMethods } = this.state;
    if (parserMethods.length === 0) {
      getParserMethods().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ parserMethods: data });
        } else {
          this.setState({ parserMethods: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  getMonitorTypes = () => {
    const { monitorTypes } = this.state;
    if (monitorTypes.length === 0) {
      getMonitorTypes().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ monitorTypes: data });
        } else {
          this.setState({ monitorTypes: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  getTerminalType = () => {
    const { terminalTypes } = this.state;
    if (terminalTypes.length === 0) {
      getTerminalTypes().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ terminalTypes: data });
        } else {
          this.setState({ terminalTypes: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let sensorNumber = [];
      let monitorPointNumber = [];
      let sensorAddress = [];
      let timingFactor = [];
      for (const item in fieldsValue) {
        if (item.indexOf('sensorNumber') > -1) {
          const itemAry = item.split('_');
          const itemVal = fieldsValue[item];
          sensorNumber[itemAry[1]] = itemVal;
          sensorAddress[itemAry[1]] = this.state.sensorNumber.filter(v => v.sensorNumber === itemVal)[0].sensorAddress;
          timingFactor[itemAry[1]] = this.state.sensorNumber.filter(v => v.sensorNumber === itemVal)[0].timingFactor;
          delete fieldsValue[item];
        }
      }
      for (const item in fieldsValue) {
        if (item.indexOf('monitorPointNumber') > -1) {
          const itemAry = item.split('_');
          const itemVal = fieldsValue[item];
          monitorPointNumber[itemAry[1]] = itemVal;
          delete fieldsValue[item];
        }
      }

      sensorNumber = sensorNumber.filter(v => v !== undefined).toString();
      monitorPointNumber = monitorPointNumber.filter(v => v !== undefined).toString();
      sensorAddress = sensorAddress.filter(v => v !== undefined).toString();
      timingFactor = timingFactor.filter(v => v !== undefined).toString();

      const values = { ...fieldsValue, sensorNumber, monitorPointNumber, sensorAddress, timingFactor };

      console.log(values);

      // insertSensors(values).then(res => {
      //   const { data, msg } = res.data;
      //   if (data) {
      //     message.success('添加传感器成功');
      //     this.props.handleDrawerAddSensorVisible(false);
      //     this.props.queryDataSource(false);
      //   } else {
      //     message.info(msg);
      //   }
      // }).catch(err => {
      //   message.error('服务器错误');
      // })

    });
  };

  drawerDeviceBind = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div key={Math.random()}>
        <Drawer
          title="设备绑定"
          width={720}
          // onClose={_ => { this.props.handleDrawerAddSensorVisible(false) }}
          visible={false}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            {this.state.addSensorNum.map(i => {
              if (i !== undefined) {
                return (
                  <Fragment>
                    <Row gutter={16}>
                      <Col span={10}>
                        <Form.Item label={i > 0 ? '' : '传感器编号'}>
                          {getFieldDecorator(`sensorNumber_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                              {
                                pattern: /^[-.%a-zA-z0-9]{1,20}$/,
                                message: '请使用英文,数字，"."，"%"，"-"，长度1-20',
                              },
                            ],
                          })(
                            <Select
                              placeholder="传感器编号"
                              onFocus={this.getSensorNumber}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                              suffixIcon={
                                <Tooltip title={
                                  <Fragment>
                                    <div>传感器地址(十进制): {this.state.sensorNumber.filter(v => v.sensorNumber === this.props.form.getFieldValue(`sensorNumber_${i}`))[0] && this.state.sensorNumber.filter(v => v.sensorNumber === this.props.form.getFieldValue(`sensorNumber_${i}`))[0].sensorAddress}</div>
                                    <div>标定系数K: {this.state.sensorNumber.filter(v => v.sensorNumber === this.props.form.getFieldValue(`sensorNumber_${i}`))[0] && this.state.sensorNumber.filter(v => v.sensorNumber === this.props.form.getFieldValue(`sensorNumber_${i}`))[0].timingFactor}</div>
                                  </Fragment>
                                }
                                >
                                  <Icon type="info-circle" theme="filled" />
                                </Tooltip>
                              }
                            >
                              {this.state.sensorNumber.map(device => <Select.Option key={device.sensorNumber}>{device.sensorNumber}</Select.Option>)}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item label={i > 0 ? '' : '测点编号'}>
                          {getFieldDecorator(`monitorPointNumber_${i}`, {
                            rules: [{
                              required: true, message: '请选择对应设备的测点编号',
                            }, {
                              validator: this.validMonitorPointRule,
                            }],
                          })(
                            <Input placeholder="示例：SL110" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item>
                          <Button
                            type='dashed'
                            style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                            onClick={_ => {
                              const addSensorNum = this.state.addSensorNum;
                              addSensorNum[i] = undefined;
                              this.setState({ addSensorNum });
                            }}
                          >删除
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Fragment>
                )
              } 
                return null;
              
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addSensorNum: [...this.state.addSensorNum, this.state.addSensorNum.length] }) }}>
                    <Icon type="plus" /> 批量增加传感器
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端编号">
                  {getFieldDecorator('terminalNumber', {
                    rules: [
                      { required: true, message: '不允许为空' }
                    ],
                  })(
                    <Select
                      placeholder="终端编号"
                      onFocus={this.getTerminalNumber}
                      dropdownMatchSelectWidth={false}
                      style={{ width: '100%' }}
                      suffixIcon={
                        <Tooltip title="Extra information">
                          <Icon type="info-circle" theme="filled" />
                        </Tooltip>
                      }
                      onChange={value => {
                        const collectionFrequency = this.state.terminalNumber.filter(v => v.terminalNumber === value)[0].collectionFrequency;
                        this.props.form.setFieldsValue({ collectionFrequency });
                      }}
                    >
                      {this.state.terminalNumber.map(terminal => <Select.Option key={terminal.terminalNumber}>{terminal.terminalNumber}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="终端类型">
                  {getFieldDecorator('terminalType', {
                    rules: [
                      { required: true, message: '不允许为空' }
                    ],
                  })(
                    <Select
                      placeholder="终端类型"
                      onFocus={this.getTerminalType}
                      dropdownMatchSelectWidth={false}
                      style={{ width: '100%' }}
                    >
                      {this.state.terminalTypes.map(type => <Select.Option key={type.index}>{type.value}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="采集频率（分钟/次）">
                  {getFieldDecorator('collectionFrequency', {
                    rules: [
                      { required: true, message: '不允许为空' }
                    ],
                  })(<Input placeholder="请选择终端编号" disabled />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="通道号">
                  {getFieldDecorator('terminalChannel', {
                    rules: [
                      { required: true, message: '不允许为空' }
                    ],
                  })(<Input placeholder="示例：10" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="解析方式">
                  {getFieldDecorator('parserMethod', {
                    rules: [{
                      required: true, message: '请对应传感器的解析方式',
                    }],
                  })(
                    <Select
                      placeholder="解析方式"
                      onFocus={this.getParserMethods}
                      dropdownMatchSelectWidth={false}
                      style={{ width: '100%' }}
                    >
                      {this.state.parserMethods.map(parser => <Select.Option key={parser.index}>{parser.value}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="监测类型">
                  {getFieldDecorator('monitorType', {
                    rules: [{
                      required: true, message: '请选择对应设备的监测类型',
                    }],
                  })(
                    <Select
                      placeholder="监测类型"
                      onFocus={this.getMonitorTypes}
                      dropdownMatchSelectWidth={false}
                      style={{ width: '100%' }}
                    >
                      {this.state.monitorTypes.map(type => <Select.Option key={type.index}>{type.value}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="是否强制绑定">
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
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button onClick={_ => { this.props.handleDrawerAddSensorVisible(false) }} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType='submit'>
                提交
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    )
  }
  render() {
    return (
      this.drawerDeviceBind()
    );
  }
}

export default DeviceBind;