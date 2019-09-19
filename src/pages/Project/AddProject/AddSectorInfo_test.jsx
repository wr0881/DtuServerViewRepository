import React, { Component } from 'react';
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
  Spin,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Tabs,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import debounce from 'lodash/debounce';
import ImgMark from '@/components/ImgMark/ImgMark';
import { getInstrMemberInfo } from '@/services/project';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

@Form.create()
class AddSectorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addConcatModal: false,
      addJsUnit: [0],
      addSgUnit: [0],
      addJcUnit: [0],
      addJlUnit: [0],
      indexInfo: [],

      getInstrMemberInfoLoading: false
    };
  }

  dotChange = v => {
    this.setState({ indexInfo: v });
  }

  getInstrMemberInfo = value => {
    if (value) {
      this.setState({ getInstrMemberInfoLoading: true });
      getInstrMemberInfo({ memberName: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          console.log(data);
        } else {
          console.log(msg);
        }
        this.setState({ getInstrMemberInfoLoading: false });
      }).catch(err => {
        console.log(err);
        this.setState({ getInstrMemberInfoLoading: false });
      })
    }
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div>
        <Tabs style={{ marginTop: '30px', minHeight: '500px' }} tabPosition='left' defaultActiveKey="0">
          <TabPane tab='单位信息' key={0}>
            <Form
              layout="vertical"
              hideRequiredMark
              onSubmit={this.handleSubmit}
            >
              {this.state.addJcUnit.map(i => {
                if (i !== undefined) {
                  return (
                    <Row gutter={16} key={i}>
                      <Col span={6}>
                        <Form.Item label={i > 0 ? '' : '建设单位名称'}>
                          {getFieldDecorator(`JsUnitName_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：武魂殿" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : <div>联系人 <a style={{ float: 'right' }}>添加联系人?</a></div>}>
                          {getFieldDecorator(`JsUnitConcat_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Input type="text" placeholder="示例：李四" />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '电话'}>
                          {getFieldDecorator(`JsUnitPhone_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：12345678912" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '邮箱'}>
                          {getFieldDecorator(`JsUnitEmail_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：123456@qq.com" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '职位'}>
                          {getFieldDecorator(`JsUnitJob_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：总工" />)}
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item>
                          <Button
                            type='dashed'
                            style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                            onClick={_ => {
                              const addJcUnit = this.state.addJcUnit;
                              addJcUnit[i] = undefined;
                              this.setState({ addJcUnit });
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
                    <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addJcUnit: [...this.state.addJcUnit, this.state.addJcUnit.length] }) }}>
                      <Icon type="plus" /> 批量增加单位信息
                  </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane tab='测点信息' key={2}>
            <ImgMark
              src={'http://123.207.88.210/monitor/images/three/pointMap/cfl.png'}
              dot={this.state.indexInfo}
              onChange={this.dotChange}
            />
            <div style={{ marginTop: '50px' }}>
              <Form
                layout="vertical"
                hideRequiredMark
                onSubmit={this.handleSubmit}
              >
                {this.state.indexInfo.map((v, i) => {
                  if (i !== undefined) {
                    return (
                      <Row gutter={16} key={i}>
                        <Col span={2}>
                          <Form.Item label={i > 0 ? '' : '编号'}>
                            {getFieldDecorator(`JsUnitName_${i}`, {
                              initValue: `编号${v.number}`,
                              rules: [
                                { required: true, message: '不允许为空' },
                              ],
                            })(<Input placeholder={`编号${v.number}`} />)}
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label={i > 0 ? '' : '测点名'}>
                            <Input placeholder="示例：007" onChange={e => {
                              let dot = this.state.indexInfo;
                              dot[i].indexName = e.target.value;
                              this.setState({ dot });
                            }} />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label={i > 0 ? '' : '终端编号'}>
                            {getFieldDecorator(`JsUnitPhone_${i}`, {
                              rules: [
                                { required: true, message: '不允许为空' },
                              ],
                            })(<Input placeholder="示例：12345678912" />)}
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label={i > 0 ? '' : '终端通道'}>
                            {getFieldDecorator(`JsUnitPhone_${i}`, {
                              rules: [
                                { required: true, message: '不允许为空' },
                              ],
                            })(<Input placeholder="示例：0~34" />)}
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label={i > 0 ? '' : '传感器编号'}>
                            {getFieldDecorator(`JsUnitEmail_${i}`, {
                              rules: [
                                { required: true, message: '不允许为空' },
                              ],
                            })(<Input placeholder="示例：123456" />)}
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item label={i > 0 ? '' : '监测指标'}>
                            {getFieldDecorator(`JsUnitJob_${i}`, {
                              rules: [
                                { required: true, message: '不允许为空' },
                              ],
                            })(<Input placeholder="示例：钢支撑轴力" />)}
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Form.Item label={i > 0 ? '' : '标点位置'}>
                            <Switch checkedChildren="查看" unCheckedChildren="隐藏" style={{ marginTop: '5px' }}
                              onChange={v => {
                                let dot = this.state.indexInfo;
                                dot[i].visible = v;
                                console.log(dot);
                                this.setState({ dot });
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )
                  } else {
                    return null
                  }
                })}
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default AddSectorInfo;