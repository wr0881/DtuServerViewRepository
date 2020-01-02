import React, { Component, Fragment } from 'react';
import axios from 'axios';
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
import ImgViewer from '@/components/ImgViewer/ImgViewer';
import ImgMark from '@/components/ImgMark/ImgMark';
import sectorModel from './sectorModel';
import { getTerminlaNumber1, getSersorNumber1, addMonitorPoint, listMonitorType } from '@/services/project';
import styles from './style.less';

@Form.create()
class AddPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addSensorNum: [Date.now().toString(36)],
      isDeep: false,

      terminlaNumberAry: [],
      sersorNumberAry: [],
      listMonitorType: [],

      getTerminlaNumberLoading: false,
      getSersorNumberLoading: false,
      listMonitorTypeLoading: false,

      dot: [],

      imgViewerShow: false,
    };
  }

  getTerminlaNumber = value => {
    if (value) {
      this.setState({ getTerminlaNumberLoading: true });
      getTerminlaNumber1({ terminalNumber: value,sectorId: sectorModel.sectorId }).then(res => {
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
      getSersorNumber1({ sensorNumber: value }).then(res => {
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

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        const addSensorNum = this.state.addSensorNum;
        let result = [];
        addSensorNum.forEach(v => {
          result.push({
            "monitorType": values[`monitorType`],
            "picx": values[`picx`] + 'px',
            "picy": values[`picy`] + 'px',
            "sensorDeep": values[`sensorDeep_${v}`],
            "sensorNumber": values[`sensorNumber_${v}`],
            "terminalChannel": values[`terminalChannel_${v}`],
            "terminalNumber": values[`terminalNumber_${v}`]
          })
        })

        axios.post(
          `/monitorPoint/addMonitorPointBach?imageId=${sectorModel.selectImageId}&monitorPointNumber=${values.monitorPointNumber}&sectorId=${sectorModel.sectorId}`,
          result,
          { headers: { 'Content-Type': 'application/json' } }
        ).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            this.props.getPointInfoList();
            this.props.handleAddPointVisible(false);
            message.info('增添成功');
          } else {
            message.info('增添失败');
          }
        })
      }
    });
  }

  Reset(){
    const {form} = this.props;
    form.resetFields();
  }
  render() {
    const formItemLayout = {
      labelCol: { sm: { span: 8 }, xs: { span: 24 }, style: { lineHeight: 2, textAlign: 'center' } },
      wrapperCol: { sm: { span: 16 }, xs: { span: 24 } }
    }
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue } } = this.props;
    return (
      <Fragment>
        <Drawer
          title={(
            <div>
              新增测点
            </div>
          )}
          width={800}
          onClose={_ => { this.props.handleAddPointVisible(false) }}
          visible={this.props.visible}
        >
          <div>
            <Form
              layout="vertical"
              style={{ textAlign: 'right', paddingLeft: '30px', paddingRight: '60px' }}
            >
              <Row gutter={8}>
                <Col md={12} sm={24}>
                  <Form.Item label="测点名称" {...formItemLayout}>
                    {getFieldDecorator('monitorPointNumber', {
                      rules: [
                        { required: true, message: '不允许为空' }
                      ],
                      // initialValue: this.props.modifypass.sensorNumber
                    })(<Input style={{ width: '210px' }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="监测类型" {...formItemLayout}>
                    {getFieldDecorator('monitorType', {
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
                        onChange={v => {
                          axios.get('/sysCode/queryIsNeedDeep', { params: { scId: v } }).then(res => {
                            const { code, msg, data } = res.data;
                            if (code === 0 || code === 1) {
                              this.setState({ isDeep: data });
                            }
                          })
                        }}
                      >
                        {this.state.listMonitorType.map(type => <Select.Option key={type.scId} value={type.scId}>{type.itemName}</Select.Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col md={12} sm={24}>
                  <Form.Item label="x轴坐标" {...formItemLayout}>
                    {getFieldDecorator('picx', {
                      rules: [
                        { required: true, message: '不允许为空' },
                        {
                          pattern: /^[0-9]*$/,
                          message: '只允许数字',
                        },
                      ],
                      // initialValue: this.props.modifypass.manufacturer
                    })(<Input style={{ width: '210px' }} placeholder='例如:1920' onClick={_ => { this.setState({ imgViewerShow: true }) }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="y轴坐标" {...formItemLayout}>
                    {getFieldDecorator('picy', {
                      rules: [
                        { required: true, message: '不允许为空' },
                        {
                          pattern: /^[0-9]*$/,
                          message: '只允许数字',
                        },
                      ],
                    })(<Input style={{ width: '210px' }} placeholder='例如:1080' onClick={_ => { this.setState({ imgViewerShow: true }) }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginTop: '0' }} />

              {this.state.addSensorNum.map((v, i) => {
                return (
                  <div style={{ position: 'relative' }}>
                    <Icon
                      type="close-circle"
                      style={{ display: this.state.addSensorNum.length > 1 ? 'block' : 'none', position: 'absolute', top: '40px', right: '-50px', zIndex: '1000', fontSize: '20px', cursor: 'pointer' }}
                      onClick={_ => {
                        let { addSensorNum } = this.state;
                        addSensorNum.splice(i, 1);
                        this.setState({ addSensorNum });
                      }}
                    />
                    <Row gutter={8}>
                      <Col md={12} sm={24} >
                        <Form.Item label="传感器深度" {...formItemLayout}>
                          {getFieldDecorator(`sensorDeep_${v}`, {
                            rules: [
                              {
                                pattern: /^[0-9]*$/,
                                message: '只允许数字',
                              },
                            ],
                          })(<Input style={{ width: '210px' }} disabled={!this.state.isDeep} />)}
                        </Form.Item>
                      </Col>
                      <Col md={12} sm={24}>
                        <Form.Item label="传感器编号" {...formItemLayout}>
                          {getFieldDecorator(`sensorNumber_${v}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select
                              showSearch
                              placeholder="请选择传感器编号"
                              loading={this.state.getSersorNumberLoading}
                              notFoundContent={this.state.getSersorNumberLoading ? <Spin size="small" /> : null}
                              onSearch={this.getSersorNumber}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                            >
                              {this.state.sersorNumberAry.map(v => (
                                <Select.Option key={v} value={v}>{v}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={8}>
                      <Col md={12} sm={24}>
                        <Form.Item label="终端通道" {...formItemLayout}>
                          {getFieldDecorator(`terminalChannel_${v}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                              {
                                pattern: /^((0?[1-9])|((1|2)[0-9])|30|31|32|33|34)$/,
                                message: '只允许1-34数字',
                              },
                            ],
                          })(<Input style={{ width: '210px' }} placeholder='示例:1' />)}
                        </Form.Item>
                      </Col>
                      <Col md={12} sm={24}>
                        <Form.Item label="终端编号" {...formItemLayout}>
                          {getFieldDecorator(`terminalNumber_${v}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            <Select
                              showSearch
                              placeholder="请选择终端编号"
                              loading={this.state.getTerminlaNumberLoading}
                              notFoundContent={this.state.getTerminlaNumberLoading ? <Spin size="small" /> : null}
                              onSearch={this.getTerminlaNumber}
                              dropdownMatchSelectWidth={false}
                              style={{ width: '100%' }}
                            >
                              {this.state.terminlaNumberAry.map(v => (
                                <Select.Option key={v}>{v}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider style={{ marginTop: '0' }} />
                  </div>
                )
              })}

              <Row gutter={16} style={{ display: this.state.isDeep ? 'block' : 'none' }}>
                <Col span={24}>
                  <Form.Item>
                    <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addSensorNum: [...this.state.addSensorNum, Date.now().toString(36)] }) }}>
                      <Icon type="plus" /> 批量增加传感器
                  </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>

          <Modal
            title="图片描点"
            width='1200px'
            visible={this.state.imgViewerShow}
            destroyOnClose={true}
            onOk={_ => {
              setFieldsValue({
                picx: this.state.dot[0].realX,
                picy: this.state.dot[0].realY
              })
              this.setState({ imgViewerShow: false });
            }}
            onCancel={_ => { this.setState({ imgViewerShow: false }) }}
          >
            <div style={{ width: '100%', height: '500px' }}>
              <ImgViewer
                style={{ width: '100%', height: '100%' }}
                url={window.imgAddress + sectorModel.selectImageUrl}
                children={
                  <ImgMark
                    style={{ width: '100%' }}
                    src={window.imgAddress + sectorModel.selectImageUrl}
                    dot={this.state.dot ? this.state.dot : []}
                    onChange={dot => {
                      this.setState({ dot });
                    }}
                  />
                }
                onScale={() => { this.setState({ dot: [] }) }}
              />
            </div>
          </Modal>

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
            <Button onClick={_ => { this.props.handleAddPointVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Drawer >
      </Fragment>
    );
  }
}

export default AddPoint;