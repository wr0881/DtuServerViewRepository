/* eslint-disable */
import React, { Component } from 'react';
import { addTerminals, terminalNumberCount, getTerminalType } from '@/services/in-out-library';
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
class addTerminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addTerminalNum: [0],
      cancelTerminalNum: [],
      terminalType: []
    };
  }
  // terminalNumberRules = (rule, value, callback) => {
  //   if (value) {
  //     terminalNumberCount({ TerminalNumber: value }).then(res => {
  //       const { code, data } = res.data;
  //       if (data === 1) {
  //         callback('终端编号已存在,请重新输入');
  //       } else {
  //         callback();
  //       }
  //     }).catch(e => {
  //       console.log(e);
  //     });
  //   } else {
  //     callback('请输入传感器');
  //   }
  // }

  // 新建终端提交
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let terminalNumbers = [];
      for (let item in fieldsValue) {
        if (item.indexOf('terminalNumbers') > -1) {
          const itemAry = item.split('_');
          // if (this.state.cancelTerminalNum.includes(Number(itemAry[1]))) {

          // } else {
          const itemVal = fieldsValue[item];
          terminalNumbers[itemAry[1]] = itemVal;
          // }
          delete fieldsValue[item];
        }
      }

      if (terminalNumbers.findIndex(item => item === undefined) > -1) {
        terminalNumbers.splice(terminalNumbers.findIndex(item => item === undefined), 1);
      }
      const values = {
        ...fieldsValue,
        productDate: fieldsValue.productDate.format('YYYY-MM-DD'),
        endDate: fieldsValue.endDate.format('YYYY-MM-DD'),
        terminalNumbers
      }
      addTerminals(values).then(res => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success('添加终端成功');
          this.props.handleDrawerAddTerminalVisible(false);
          this.props.queryDataSource(false);
        } else {
          console.log(res.msg);
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

  terminalType() {
    getTerminalType().then(res => {
      const { code, data } = res.data;
      if(code === 0){
        this.setState({terminalType:res.data.data});
      }
    })
  }

  drawerAddTerminal = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div>
        <Drawer
          title="新建终端"
          width={720}
          onClose={_ => { this.props.handleDrawerAddTerminalVisible(false) }}
          visible={this.props.drawerAddTerminalVisible}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            {this.state.addTerminalNum.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={10}>
                      <Form.Item label={i > 0 ? '' : '终端编号'}>
                        {getFieldDecorator(`terminalNumbers_${i}`, {
                          rules: [
                            { validator: this.sensorNumberRules },
                          ],
                        })(<Input placeholder="示例：test01" />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                          onClick={_ => {
                            const addTerminalNum = this.state.addTerminalNum;
                            addTerminalNum[i] = undefined;
                            this.setState({ addTerminalNum });
                          }}
                        >删除</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              } else {
                return null
              }
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addTerminalNum: [...this.state.addTerminalNum, this.state.addTerminalNum.length] }) }}>
                    <Icon type="plus" /> 批量增加编号
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端名称">
                  {getFieldDecorator('terminalName', {
                    rules: [
                      { required: true, message: '不允许为空' },
                    ],
                  })(<Input placeholder="示例：终端名称" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="厂家">
                  {getFieldDecorator('manufacturer', {
                    rules: [
                      { required: true, message: '不允许为空' },
                    ],
                  })(<Input placeholder="示例：终端厂家" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="终端类型">
                  {getFieldDecorator('terminalType', {
                    rules: [
                      { required: true, message: '不允许为空' },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="请选择终端类型"
                    >
                      {this.state.terminalType.map(v => {
                        return <Option key={v.index} value={v.index}>{v.value}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="终端型号">
                  {getFieldDecorator('terminalModel', {
                    rules: [
                      { required: true, message: '不允许为空' },
                    ],
                  })(<Input placeholder="示例：终端型号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="电压">
                  {getFieldDecorator('voltage', {
                    rules: [
                      {
                        pattern: /^[1-9]\d*$/,
                        message: '请填入整数',
                      },
                    ],
                  })(<Input placeholder="示例：电压" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="通道数">
                  {getFieldDecorator('channelNumber', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[1-9]\d*$/,
                        message: '请输入整数',
                      },
                    ],
                  })(
                    <Input
                      placeholder="示例：通道数"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="采集频率">
                  {getFieldDecorator('collectionFrequency', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[1-9]\d*$/,
                        message: '请输入整数',
                      },
                    ],
                  })(
                    <Input
                      placeholder="示例：采集频率"
                    />
                  )}
                </Form.Item>
              </Col> 
              <Col span={12}>
                <Form.Item label="终端状态">
                  {getFieldDecorator('terminalStatus', {
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
            </Row>
            <Row gutter={16}>
             <Col span={12}>
                <Form.Item label="生产日期">
                  {getFieldDecorator('productDate', {
                    rules: [{ required: true, message: '不允许为空' }],
                    // initialValue: moment(),
                  })(<DatePicker style={{ width: '100%' }} placeholder="选择日期" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="结束日期">
                  {getFieldDecorator('endDate', {
                    rules: [{ required: true, message: '不允许为空' }],
                    // initialValue: moment(),
                  })(<DatePicker style={{ width: '100%' }} placeholder="选择日期" />)}
                </Form.Item>
              </Col>
            </Row>
            < div
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
              <Button onClick={_ => { this.props.handleDrawerAddTerminalVisible(false) }} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType='submit'>
                提交
              </Button>
            </div>
          </Form>
        </Drawer>
      </div >
    );
  }

  render() {
    return (
      this.drawerAddTerminal()
    );
  }

  componentDidMount() {
    this.terminalType();
  }
}

export default addTerminal;