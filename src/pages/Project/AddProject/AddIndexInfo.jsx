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
  Modal,
  message,
  Spin,
  Empty,
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
import { getTerminlaNumber, getSersorNumber } from '@/services/project';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

@Form.create()
class AddIndexInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indexInfo: [],
      terminlaNumberAry: [],
      sersorNumberAry: [],
      markAry: []
    };
  }

  dotChange = v => {
    this.setState({ indexInfo: v });
  }

  getTerminlaNumber = value => {
    if (value) {
      getTerminlaNumber({ terminalNumber: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          this.setState({ terminlaNumberAry: data });
        } else {
          console.log(msg);
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  getSersorNumber = value => {
    if (value) {
      getSersorNumber({ sensorNumber: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          this.setState({ sersorNumberAry: data });
        } else {
          console.log(msg);
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  getMark = () => {
    let markAry = [];
    for (let i = 0; i < this.state.indexInfo.length; i++) {
      if (this.props.form.getFieldValue(`isMark_${i}`) === true) {
        const indexName = this.props.form.getFieldValue(`indexName_${i}`);
        markAry.push(indexName);
      }
    }
    return markAry;
  }

  render() {
    const { form, src, addImg, deleteImgUrl } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Fragment>
        <Alert
          style={{ marginBottom: '15px' }}
          message={
            <div>
              鼠标左键单击图片某一区域确定测点位置
            </div>
          }
          type="info"
          showIcon
        />
        <ImgMark
          src={src}
          // style={{ height: '300px' }}
          dot={this.state.indexInfo}
          onChange={this.dotChange}
        />
        <div style={{ marginTop: '50px' }}>
          <Form
            className={styles.disabled}
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
                        {getFieldDecorator(`number_${i}`, {
                          initValue: `编号${v.number}`,
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder={`编号${v.number}`} disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '测点名'}>
                        {getFieldDecorator(`indexName_${i}`, {
                          initValue: `编号${v.number}`,
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：007" onChange={e => {
                          let dot = this.state.indexInfo;
                          dot[i].indexName = e.target.value;
                          this.setState({ dot });
                        }} />)}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '终端编号'}>
                        {getFieldDecorator(`terminlaNumber_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            dropdownMatchSelectWidth={false}
                            placeholder="请选择终端编号"
                            onSearch={debounce(v => { this.getTerminlaNumber(v) }, 800)}
                          >
                            {this.state.terminlaNumberAry.map(v => (
                              <Option key={v}>{v}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '终端通道'}>
                        {getFieldDecorator(`terminlaWay_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：0~34" />)}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '传感器编号'}>
                        {getFieldDecorator(`sersorNumber_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            dropdownMatchSelectWidth={false}
                            placeholder="请选择传感器编号"
                            onSearch={debounce(v => { this.getSersorNumber(v) }, 800)}
                          >
                            {this.state.sersorNumberAry.map(v => (
                              <Option key={v}>{v}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '监测指标'}>
                        {getFieldDecorator(`monitorType_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：钢支撑轴力" />)}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item label={i > 0 ? '' : '所属基准点'}>
                        {getFieldDecorator(`ownMark_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            dropdownMatchSelectWidth={false}
                            placeholder="请选择基准点"
                          >
                            {this.getMark().map(v => (
                              <Option key={v}>{v}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2} style={{ display: this.props.form.getFieldValue(`indexName_${i}`) ? 'block' : 'none' }}>
                      <Form.Item label={i > 0 ? '' : '是否基准点'}>
                        {getFieldDecorator(`isMark_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Switch checkedChildren="是" unCheckedChildren="否" style={{ marginTop: '5px' }}
                            onChange={v => {
                              let dot = this.state.indexInfo;
                              dot[i].isMark = v;
                              this.setState({ dot });
                            }}
                          />
                        )}
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
        <div style={{ marginBottom: '30px' }}>
          <Button style={{ marginRight: '20px' }} type='danger' onClick={_ => { deleteImgUrl(src) }}>删除此布点图</Button>
          <Button style={{ marginRight: '20px' }} onClick={addImg} type='primary'>继续添加布点图</Button>
          <Button type='primary'>上传此布点图</Button>
        </div>
      </Fragment>
    );
  }
}

export default AddIndexInfo;