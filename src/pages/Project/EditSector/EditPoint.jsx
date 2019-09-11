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
import sectorModel from './sectorModel';
import { getTerminlaNumber, getSersorNumber, addMonitorPoint, listMonitorType } from '@/services/project';
import styles from './style.less';

@Form.create()
class EditPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addSensorNum: [Date.now().toString(36)],

      terminlaNumberAry: [],
      sersorNumberAry: [],
      listMonitorType: [],

      getTerminlaNumberLoading: false,
      getSersorNumberLoading: false,
      listMonitorTypeLoading: false
    };
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

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios.put('/monitorPoint/updateMonitorPoint', { ...values, mpId: sectorModel.selectPointInfo.mpId }).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('修改成功');
            this.props.handleEditPointVisible(false);
          }
        })
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: { sm: { span: 8 }, xs: { span: 24 }, style: { lineHeight: 2, textAlign: 'center' } },
      wrapperCol: { sm: { span: 16 }, xs: { span: 24 } }
    }
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <Fragment>
        <Drawer
          title={(
            <div>
              编辑测点信息
            </div>
          )}
          width={800}
          onClose={_ => { this.props.handleEditPointVisible(false) }}
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
                      initialValue: sectorModel.selectPointInfo.monitorPointNumber
                    })(<Input style={{ width: '210px' }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="监测类型" {...formItemLayout}>
                    {getFieldDecorator('monitorType', {
                      rules: [
                        { required: true, message: '不允许为空' },
                      ],
                      initialValue: sectorModel.selectPointInfo.monitorTypeName
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
              </Row>
              <Row gutter={8}>
                <Col md={12} sm={24}>
                  <Form.Item label="x轴坐标" {...formItemLayout}>
                    {getFieldDecorator('picx', {
                      rules: [
                        { required: true, message: '不允许为空' }
                      ],
                      initialValue: sectorModel.selectPointInfo.picx
                    })(<Input style={{ width: '210px' }} />)}
                  </Form.Item>
                </Col>
                <Col md={12} sm={24}>
                  <Form.Item label="y轴坐标" {...formItemLayout}>
                    {getFieldDecorator('picy', {
                      rules: [
                        { required: true, message: '不允许为空' }
                      ],
                      initialValue: sectorModel.selectPointInfo.picy
                    })(<Input style={{ width: '210px' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider style={{ marginTop: '0' }} />

              <Fragment>
                <Row gutter={8}>
                  <Col md={12} sm={24}>
                    <Form.Item label="传感器深度" {...formItemLayout}>
                      {getFieldDecorator(`sensorDeep`, {
                        initialValue: sectorModel.selectPointInfo.sensorDeep
                      })(<Input style={{ width: '210px' }} />)}
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item label="传感器编号" {...formItemLayout}>
                      {getFieldDecorator(`sensorNumber`, {
                        rules: [
                          { required: true, message: '不允许为空' },
                        ],
                        initialValue: sectorModel.selectPointInfo.sensorNumber
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
                            <Option key={v}>{v}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col md={12} sm={24}>
                    <Form.Item label="终端通道" {...formItemLayout}>
                      {getFieldDecorator(`terminalChannel`, {
                        rules: [
                          { required: true, message: '不允许为空' }
                        ],
                        initialValue: sectorModel.selectPointInfo.terminalChannel
                      })(<Input style={{ width: '210px' }} />)}
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24}>
                    <Form.Item label="终端编号" {...formItemLayout}>
                      {getFieldDecorator(`terminalNumber`, {
                        rules: [
                          { required: true, message: '不允许为空' },
                        ],
                        initialValue: sectorModel.selectPointInfo.terminalNumber
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
                            <Option key={v}>{v}</Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider style={{ marginTop: '0' }} />
              </Fragment>
            </Form>
          </div>

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
            <Button onClick={_ => { this.props.handleEditPointVisible(false) }} style={{ marginRight: 8 }}>
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

export default EditPoint;