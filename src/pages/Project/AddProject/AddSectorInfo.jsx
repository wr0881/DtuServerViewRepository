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
import ImgMark from '@/components/ImgMark/ImgMark';

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
      addJsUnit: [0],
      addSgUnit: [0],
      addJcUnit: [0],
      addJlUnit: [0],
      indexInfo: [],
    };
  }

  dotChange = v => {
    this.setState({ indexInfo: v });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const _this = this;
    return (
      <div>
        <Tabs style={{ marginTop: '30px', minHeight: '500px' }} tabPosition='left' defaultActiveKey="4">
          <TabPane tab='建设单位' key={0}>
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
                        <Form.Item label={i > 0 ? '' : '联系人'}>
                          {getFieldDecorator(`JsUnitConcat_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：萧炎" />)}
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
          <TabPane tab='施工单位' key={1}>
            <Form
              layout="vertical"
              hideRequiredMark
              onSubmit={this.handleSubmit}
            >
              {this.state.addSgUnit.map(i => {
                if (i !== undefined) {
                  return (
                    <Row gutter={16} key={i}>
                      <Col span={6}>
                        <Form.Item label={i > 0 ? '' : '施工单位名称'}>
                          {getFieldDecorator(`SgUnitName_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：英灵殿" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '联系人'}>
                          {getFieldDecorator(`SgUnitConcat_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：奇衡三" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '电话'}>
                          {getFieldDecorator(`SgUnitPhone_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：12345678912" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '邮箱'}>
                          {getFieldDecorator(`SgUnitEmail_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：123456@qq.com" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '职位'}>
                          {getFieldDecorator(`SgUnitJob_${i}`, {
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
                              const addSgUnit = this.state.addSgUnit;
                              addSgUnit[i] = undefined;
                              this.setState({ addSgUnit });
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
                    <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addSgUnit: [...this.state.addSgUnit, this.state.addSgUnit.length] }) }}>
                      <Icon type="plus" /> 批量增加单位信息
                  </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab='监测单位' key={2}>
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
                        <Form.Item label={i > 0 ? '' : '施工单位名称'}>
                          {getFieldDecorator(`JcUnitName_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：凌霄殿" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '联系人'}>
                          {getFieldDecorator(`JcUnitConcat_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：弥罗宫三公子" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '电话'}>
                          {getFieldDecorator(`JcUnitPhone_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：12345678912" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '邮箱'}>
                          {getFieldDecorator(`JcUnitEmail_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：123456@qq.com" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '职位'}>
                          {getFieldDecorator(`JcUnitJob_${i}`, {
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
          <TabPane tab='监理单位' key={3}>
            <Form
              layout="vertical"
              hideRequiredMark
              onSubmit={this.handleSubmit}
            >
              {this.state.addJlUnit.map(i => {
                if (i !== undefined) {
                  return (
                    <Row gutter={16} key={i}>
                      <Col span={6}>
                        <Form.Item label={i > 0 ? '' : '施工单位名称'}>
                          {getFieldDecorator(`JlUnitName_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：混沌殿" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '联系人'}>
                          {getFieldDecorator(`JlUnitConcat_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：太易" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '电话'}>
                          {getFieldDecorator(`JlUnitPhone_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：12345678912" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '邮箱'}>
                          {getFieldDecorator(`JlUnitEmail_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：123456@qq.com" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={i > 0 ? '' : '职位'}>
                          {getFieldDecorator(`JlUnitJob_${i}`, {
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
                              const addJlUnit = this.state.addJlUnit;
                              addJlUnit[i] = undefined;
                              this.setState({ addJlUnit });
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
                    <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addJlUnit: [...this.state.addJlUnit, this.state.addJlUnit.length] }) }}>
                      <Icon type="plus" /> 批量增加单位信息
                  </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab='测点信息' key={4}>
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
                        <Col span={4}>
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
                              console.log(dot);
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
        <Divider style={{ margin: '40px 0 24px' }} />
        <div>
          <h4>易大师</h4>
          <p>
            无极之道，在我内心延续。 In me, Wuju lives on.
          </p>
        </div>
      </div>
    );
  }
}

export default AddSectorInfo;