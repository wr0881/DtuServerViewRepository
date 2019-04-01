import React, { Component } from 'react';
import {
  Card,
  Row,
  InputNumber,
  Form,
  Button,
  Col,
  Input,
  Icon,
  Badge,
  DatePicker,
  Tag,
  Empty,
  Drawer,
  Select,
  List,
} from 'antd';
import axios from '../../axios';
import moment from 'moment';
import style from '../Platform/SensorLib/SensorLib.css';
import { getNowFormatDate } from '../../utils/utils';

const { Option } = Select;

@Form.create()
export default class SensorDrawer extends Component {
  state = {
    sensorNumberLength: 0,
    illegalArrt: [],
    failedArry: [],
  };

  handleInsert = e => {
    this.props.form.validateFields(
      [
        'sensorAddress',
        'manufacturer',
        'sensorModel',
        'sensorName',
        'sensorRange',
        'sensorAccuracy',
        'timingFactor',
        // 'parserMethod',
        'productDate',
        'endDate',
        'sensorStatus',
        'sensorNumber',
      ],
      (err, values) => {
        console.log(values);
        if (!err) {
          axios
            .post(`/sensor/insertSensors`, {
              sensorNumber: values.sensorNumber,
              sensorName: values.sensorName,
              manufacturer: values.manufacturer,
              sensorModel: values.sensorModel,
              sensorAddress: values.sensorAddress,
              sensorRange: values.sensorRange,
              sensorAccuracy: values.sensorAccuracy,
              timingFactor: values.timingFactor,
              parserMethod: values.parserMethod,
              productDate: values.productDate.format('YYYY-MM-DD'),
              endDate: values.endDate.format('YYYY-MM-DD'),
              sensorStatus: values.sensorStatus,
            })
            .then(result => {
              console.log(result.data);
            })
            .catch(e => {
              console.log(e);
            });
        }
      }
    );
  };

  handelChangeNumber = (rule, value, callback) => {
    const { illegalArrt, failedArry } = this.state;
    const arr = illegalArrt;
    const failNumber = failedArry;
    const mythis = this;
    if (value !== undefined && value.length > 0) {
      const val = value[value.length - 1];
      const ref = /^[a-zA-z0-9]{0,20}$/;
      let pass = ref.test(val);
      if (value.length > 20) {
        callback('一次性最多添加20个传感器');
      }
      if (pass) {
        axios
          .get(`/sensor/sensorNumberCount`, {
            params: {
              sensorNumber: val,
            },
          })
          .then(result => {
            if (result.data.code === 1) {
              message.error('系统异常，请联系管理员！');
            } else {
              if (result.data.data > 0) {
                arr.push(val);
                this.setState({
                  illegalArrt: arr,
                });
                mythis.myValidata(failNumber, arr, value, callback);
              } else {
                const inter = mythis.myIntersectionMain(arr, value);
                const interA = mythis.myIntersectionMain(failNumber, value);
                if (inter.length > 0 || interA.length > 0) {
                  let msg = '';
                  if (interA.length > 0) {
                    msg = msg + `${interA.toString()}格式不正确。`;
                  }
                  if (inter.length > 0) {
                    msg = msg + `${inter.toString()}编号已存在。`;
                  }
                  callback(msg);
                } else {
                  callback();
                }
              }
            }
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        failNumber.push(val);
        this.myValidata(failNumber, arr, value, callback);
      }
    } else {
      callback('请输入传感器');
    }
  };

  myValidata = (failNumber, arr, value, callback) => {
    const interA = this.myIntersectionMain(failNumber, value);
    const interB = this.myIntersectionMain(arr, value);
    let msg = '';
    if (interA.length > 0) {
      msg = msg + `${interA.toString()}格式不正确。`;
    }
    if (interB.length > 0) {
      msg = msg + `${interB.toString()}编号已存在。`;
    }
    msg = msg + '请使用英文,数字,一次性最多添加20个传感器';
    callback(msg);
  };

  myIntersectionMain(ill, value) {
    let a = new Set(ill);
    let b = new Set(value);
    const intersectionSet = new Set([...a].filter(x => b.has(x)));
    const arr = Array.from(intersectionSet);
    return arr;
  }

  querymyAnalyticalDethod = param => {
    const aray = [];
    // aray.push(
    //   <Option key="xinzen" value="add">
    //     新增
    //   </Option>
    // );
    param.forEach(data => {
      aray.push(
        <Option key={data.id} value={data.scId}>
          {data.itemName}
        </Option>
      );
    });
    return aray;
  };

  myhandleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    return (
      <Drawer title="新建传感器" width={720} onClose={this.props.onClick} visible={this.props.show}>
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleInsert}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="传感器编号">
                {getFieldDecorator('sensorNumber', {
                  rules: [
                    // { required: true, message: '不允许为空' },
                    // { validator: this.handleChange },
                    // { pattern: '/ab{2,5}c/', message: '不匹配' },

                    { validator: this.handelChangeNumber },
                  ],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="多个传感器编号添加请按回车"
                    // onChange={this.handleChange}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="传感器地址(十进制表示)">
                {getFieldDecorator('sensorAddress', {
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      transform: value => {
                        if (value !== undefined) {
                          return value.toString();
                        }
                      },
                    },
                    {
                      pattern: /^[,a-zA-z0-9]{0,100}$/,
                      message: '请输入字母或数字,一次性最多添加20个传感器',
                    },
                  ],
                })(
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    placeholder="请跟传感器编号顺序保持一致"
                  />
                )}
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
                    step={'0.01'}
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
            {/* <Col span={12}>
              <Form.Item label="传感器的解析方式">
                {getFieldDecorator('parserMethod', {
                  rules: [{ required: true, message: '不允许为空' }],
                })(
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    placeholder="示例：上海朝辉静力水准仪协议"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.querymyAnalyticalDethod(this.props.myAnalyticalDethod)}
                  </Select>
                )}
              </Form.Item>
            </Col> */}
            <Col span={12}>
              <Form.Item label="生产日期">
                {getFieldDecorator('productDate', {
                  rules: [{ required: true, message: '不允许为空' }],
                  initialValue: moment(),
                })(<DatePicker style={{ width: '100%' }} placeholder="Select Date" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="结束日期">
                {getFieldDecorator('endDate', {
                  rules: [{ required: true, message: '不允许为空' }],
                  initialValue: moment(),
                })(<DatePicker style={{ width: '100%' }} placeholder="Select Date" />)}
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
            <Button onClick={this.myhandleReset} style={{ marginRight: 8 }}>
              清空
            </Button>
            <Button onClick={this.props.onClick} style={{ marginRight: 8 }}>
              关闭
            </Button>
            <Button htmlType="submit" type="primary">
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}
