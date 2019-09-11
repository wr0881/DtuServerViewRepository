import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
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
  Modal,
  Popconfirm,
  message,
  Tag,
  Avatar,
  Upload,
  Spin
} from 'antd';
import debounce from 'lodash/debounce';
import ImgMark from '@/components/ImgMark/ImgMark';
import { getTerminlaNumber, getSersorNumber, addMonitorPoint, listMonitorType } from '@/services/project';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
class AddPointInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dot: [],
      mark: { markAry: [], noMarkAry: [] },

      terminlaNumberAry: [],
      sersorNumberAry: [],
      listMonitorType: [],

      getTerminlaNumberLoading: false,
      getSersorNumberLoading: false,
      listMonitorTypeLoading: false
    };
  }

  dotChange = v => {
    // console.log(v);
    this.setState({ dot: v });
  }

  getTerminlaNumber = value => {
    if (value) {
      this.setState({ getTerminlaNumberLoading: true });
      getTerminlaNumber({ terminalNumber: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          this.setState({ terminlaNumberAry: data });
        } else {
          console.log(msg);
        }
        this.setState({ getTerminlaNumberLoading: false });
      }).catch(err => {
        console.log(err);
        this.setState({ getTerminlaNumberLoading: false });
      })
    }
  }

  getSersorNumber = value => {
    if (value) {
      this.setState({ getSersorNumberLoading: true });
      getSersorNumber({ sensorNumber: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          this.setState({ sersorNumberAry: data });
        } else {
          console.log(msg);
        }
        this.setState({ getSersorNumberLoading: false });
      }).catch(err => {
        console.log(err);
        this.setState({ getSersorNumberLoading: false });
      })
    }
  }

  listMonitorType = () => {
    this.setState({ listMonitorTypeLoading: true });
    listMonitorType().then(res => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        this.setState({ listMonitorType: data });
      } else {
        console.log(msg);
      }
      this.setState({ listMonitorTypeLoading: false });
    }).catch(err => {
      console.log(err);
      this.setState({ listMonitorTypeLoading: false });
    })
  }

  getMark = () => {
    let markAry = [], noMarkAry = [];
    let idAry = this.getId();
    idAry.forEach(v => {
      let indexName = this.props.form.getFieldValue(`indexName_${v}`);
      let isMark = this.props.form.getFieldValue(`isMark_${v}`);
      if (isMark === 'isMark_0') {
        markAry.push(indexName);
      } else {
        noMarkAry.push(indexName);
      }
    });
    console.log(markAry);
    this.setState({ mark: { markAry, noMarkAry } });
  }

  getId = () => {
    let dot = this.state.dot;
    let idAry = [];
    dot.forEach(v => {
      idAry.push(v.id);
    });
    return idAry;
  }

  onSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Fragment>
        <Alert
          style={{ marginBottom: '15px' }}
          message={
            <div>
              点击图片添加测点信息
            </div>
          }
          type="info"
          showIcon
        />

        <ImgMark
          style={{ border: '1px solid #91d5ff', width: '100%', height: '300px', overflow: 'hidden' }}
          // src={'http://123.207.88.210/monitor/images/three/pointMap/cfl.png'}
          src={'http://123.207.88.210/monitor/images/three/pointMap/hlgsbdt.jpg'}
          dot={this.state.dot}
          onChange={this.dotChange}
        />

        <div style={{ marginTop: '50px' }}>
          <Alert
            style={{ marginBottom: '15px' }}
            message={
              <div>
                填写测点信息
              </div>
            }
            type="info"
            showIcon
          />
          <Form
            className={styles.disabled}
            layout="vertical"
          >
            {this.state.dot.map((v, i) => {
              if (v !== undefined) {
                return (
                  <Fragment>
                    <Row gutter={16} key={i}>
                      <Col span={3}>
                        <Form.Item label={'测点名'}>
                          {getFieldDecorator(`indexName_${v.id}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：007" onChange={e => {
                            let dot = this.state.dot;
                            dot[i].indexName = e.target.value;
                            this.setState({ dot });
                          }} />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={'监测指标'}>
                          {getFieldDecorator(`monitorType_${v.id}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select
                              placeholder="示例：监测指标"
                              onFocus={this.listMonitorType}
                              loading={this.state.listMonitorTypeLoading}
                              notFoundContent={this.state.listMonitorTypeLoading ? <Spin size="small" /> : null}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                            >
                              {this.state.listMonitorType.map(type => <Select.Option key={type.scId}>{type.itemName}</Select.Option>)}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={'终端编号'}>
                          {getFieldDecorator(`terminlaNumber_${v.id}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select
                              showSearch
                              placeholder="请选择终端编号"
                              loading={this.state.getTerminlaNumberLoading}
                              notFoundContent={this.state.getTerminlaNumberLoading ? <Spin size="small" /> : null}
                              onSearch={debounce(v => { this.getTerminlaNumber(v) }, 800)}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                            >
                              {this.state.terminlaNumberAry.map(v => (
                                <Option key={v}>{v}</Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'终端通道'}>
                          {getFieldDecorator(`terminlaWay_${v.id}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：0~34" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={'传感器编号'}>
                          {getFieldDecorator(`sersorNumber_${v.id}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select
                              showSearch
                              placeholder="请选择传感器编号"
                              loading={this.state.getSersorNumberLoading}
                              notFoundContent={this.state.getSersorNumberLoading ? <Spin size="small" /> : null}
                              onSearch={debounce(v => { this.getSersorNumber(v) }, 800)}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                            >
                              {this.state.sersorNumberAry.map(v => (
                                <Option key={v}>{v}</Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'是否基准点'}>
                          {getFieldDecorator(`isMark_${v.id}`, {
                            initialValue: 'isMark_1',
                            rules: [
                              // { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select>
                              <Option value={'isMark_0'}>是</Option>
                              <Option value={'isMark_1'}>否</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'删除测点'}>
                          <Button type='danger' onClick={_ => {
                            let dot = this.state.dot;
                            dot.splice(i, 1);
                            this.setState({ dot });
                          }}>删除</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider style={{ marginTop: '0' }} />
                  </Fragment>
                )
              } else {
                return null
              }
            })}

            <div>
              <Alert
                style={{ marginBottom: '15px' }}
                message={
                  <div>
                    绑定基准点,不可逆 <a onClick={this.getMark}>绑定</a>
                  </div>
                }
                type="info"
                showIcon
              />
              {/* <Button onClick={this.onSubmit}>绑定基准点</Button> */}
              {this.state.mark.markAry.map((v, i) => {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={3}>
                      <Form.Item label={'基准点'}>
                        {getFieldDecorator(`markPoint_i`, {
                          initialValue: v,
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：007" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={21}>
                      <Form.Item label={'测点'}>
                        {getFieldDecorator(`index_i`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            mode="multiple"
                            placeholder="选择测点"
                          >
                            {this.state.mark.noMarkAry.map(v => {
                              return <Option value={v}>{v}</Option>
                            })}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                )
              })}
            </div>

            <Button type='primary' onClick={this.onSubmit}>确定</Button>
          </Form>
        </div>
      </Fragment>
    );
  }
}

export default AddPointInfo;