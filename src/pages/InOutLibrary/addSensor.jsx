/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
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
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class addSensor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addSensorNum: [0],
      cancelSensorNum: []
    };
  }

  sensorNumberRules = (rule, value, callback) => {
    if (value) {
      sensorNumberCount({ sensorNumber: value }).then(res => {
        const { code, data } = res.data;
        if (data === 1) {
          callback('传感器编号已存在,请重新输入');
        } else {
          callback();
        }
      }).catch(e => {
        console.log(e);
      });
    } else {
      callback('请输入传感器');
    }
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const sensorNumber = [];
      const sensorAddress = [];
      for (const item in fieldsValue) {
        if (item.indexOf('sensorNumber') > -1) {
          const itemAry = item.split('_');
          // if (this.state.cancelSensorNum.includes(Number(itemAry[1]))) {

          // } else {
          const itemVal = fieldsValue[item];
          sensorNumber[itemAry[1]] = itemVal;
          // }
          delete fieldsValue[item];
        }
      }
      for (const item in fieldsValue) {
        if (item.indexOf('sensorAddress') > -1) {
          const itemAry = item.split('_');
          // if (this.state.cancelSensorNum.includes(Number(itemAry[1]))) {

          // } else {
          const itemVal = fieldsValue[item];
          sensorAddress[itemAry[1]] = itemVal;
          // }
          delete fieldsValue[item];
        }
      }

      if (sensorNumber.findIndex(item => item === undefined) > -1) {
        sensorNumber.splice(sensorNumber.findIndex(item => item === undefined), 1);
        sensorAddress.splice(sensorAddress.findIndex(item => item === undefined), 1);
      }

      const values = { ...fieldsValue, sensorNumber, sensorAddress };

      insertSensors(values).then(res => {
        const { data, msg } = res.data;
        if (data) {
          message.success('添加传感器成功');
          this.props.handleDrawerAddSensorVisible(false);
          this.props.queryDataSource(false);
        } else {
          message.info(msg);
        }
      }).catch(err => {
        message.error('服务器错误');
      })

      // this.setState({
      //   formValues: values,
      // }, _ => { this.queryDataSource() });
    });
  };

  drawerAddSensor = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div>
        <Drawer
          title="新建传感器"
          width={720}
          onClose={_ => { this.props.handleDrawerAddSensorVisible(false) }}
          visible={this.props.drawerAddSensorVisible}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            {this.state.addSensorNum.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={10}>
                      <Form.Item label={i > 0 ? '' : '传感器编号'}>
                        {getFieldDecorator(`sensorNumber_${i}`, {
                          rules: [
                            { validator: this.sensorNumberRules },
                          ],
                        })(<Input placeholder="示例：test01" />)}
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item label={i > 0 ? '' : '传感器地址(十进制表示)'}>
                        {getFieldDecorator(`sensorAddress_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                            {
                              pattern: /^[,a-zA-z0-9]{0,100}$/,
                              message: '请输入字母或数字,长度0-100',
                            },
                          ],
                        })(<Input placeholder="示例：PT124B-226E" />)}
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
                )
              } 
                return null
              
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addSensorNum: [...this.state.addSensorNum, this.state.addSensorNum.length] }) }}>
                    <Icon type="plus" /> 批量增加编号
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="厂家">
                  {getFieldDecorator('manufacturer', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[-\u4e00-\u9fa5a-zA-z0-9]{1,30}$/,
                        message: '不允许输入特殊字符串,长度1-30',
                      },
                    ],
                  })(<Input placeholder="示例：上海朝晖" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器型号">
                  {getFieldDecorator('sensorModel', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[-a-zA-z0-9]{1,30}$/,
                        message: '请输入字母或数字,长度1-30',
                      },
                    ],
                  })(<Input placeholder="示例：PT124B-226E" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器名称">
                  {getFieldDecorator('sensorName', {
                    rules: [
                      { required: true, message: '请输入传感器名称' },
                      {
                        pattern: /^[\u4e00-\u9fa5a-zA-z]{1,30}$/,
                        message: '请输入中文，英文或者中英文，不允许特殊字符串和数字，长度1-30',
                      },
                    ],
                  })(<Input placeholder="示例：静力水准仪" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器量程">
                  {getFieldDecorator('sensorRange', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[-.a-zA-z0-9]{1,20}$/,
                        message: '不允许特殊字符串和中文(请使用英文的".")，长度1-20',
                      },
                    ],
                  })(<Input placeholder="示例：1.5mH2O" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器精度">
                  {getFieldDecorator('sensorAccuracy', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[-.%a-zA-z0-9]{1,20}$/,
                        message: '请使用英文,数字，"."，"%"，"-"，长度1-20',
                      },
                    ],
                  })(<Input placeholder="示例：0.05%F.S" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="传感器标定系数K">
                  {getFieldDecorator('timingFactor', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[.0-9]{1,9}$/,
                        message: '请输入数字，长度1-9',
                      },
                    ],
                    initialValue: 1.0,
                  })(
                    <InputNumber
                      min={0}
                      max={50}
                      step="0.01"
                      style={{ width: '100%' }}
                      placeholder="示例：1.0000000"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="传感器状态">
                  {getFieldDecorator('sensorStatus', {
                    rules: [{ required: true, message: '不允许为空' }],
                    initialValue: '1',
                  })(
                    <Select>
                      <Option value="1">未使用</Option>
                      <Option value="2">使用中</Option>
                      <Option value="3">已损坏</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生产日期">
                  {getFieldDecorator('productDate', {
                    rules: [{ required: true, message: '不允许为空' }],
                    // initialValue: moment(),
                  })(<DatePicker style={{ width: '100%' }} placeholder="选择日期" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="结束日期">
                  {getFieldDecorator('endDate', {
                    rules: [{ required: true, message: '不允许为空' }],
                    // initialValue: moment(),
                  })(<DatePicker style={{ width: '100%' }} placeholder="选择日期" />)}
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
    );
  }

  render() {
    return (
      this.drawerAddSensor()
    );
  }
}

export default addSensor;