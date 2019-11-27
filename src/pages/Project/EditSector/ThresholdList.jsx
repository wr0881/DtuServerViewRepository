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
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@observer
@Form.create()
class ThresholdList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handleAddThresholdVisible: false,
      handleEditThresholdVisible: false,
      thresholdList: [],
      editValue: {},
      getThresholdListLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
    };
  }

  handleAddThresholdVisible = flag => {
    this.setState({ handleAddThresholdVisible: flag });
  }

  handleEditThresholdVisible = flag => {
    this.setState({ handleEditThresholdVisible: flag });
  }

  delectThreshold = id => {
    axios.delete('/threshold/removeMonitorInThreshold', {
      params: {
        mpId: id
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        // message.info('删除成功');
        this.getThresholdList();
      } else {
        message.error('删除失败');
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const columns = [
      {
        title: '测点名称',
        dataIndex: 'monitorPointNumber',
        key: 'name',
      },
      {
        title: '阈值类型',
        dataIndex: 'thresholdType',
        key: 'type',
        render: (text, record) => {
          const map = ['当前值', '单次变化量', '累计变化量', '变化速率'];
          return map[text - 1];
        }
      },
      {
        title: '一级阈值',
        dataIndex: 'oneThresholdValue',
        key: 'threshold1',
      },
      {
        title: '二级阈值',
        dataIndex: 'twoThresholdValue',
        key: 'threshold2',
      },
      {
        title: '三级阈值',
        dataIndex: 'threeThresholdValue',
        key: 'threshold3',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              this.setState({ editValue: record });
              this.handleEditThresholdVisible(true);
            }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={this.delectThreshold.bind(this, record.mpId)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <Button type='primary' onClick={_ => { this.handleAddThresholdVisible(true) }}>添加阈值</Button>
          <Divider />
          <Table
            loading={this.state.getThresholdListLoading}
            columns={columns}
            dataSource={this.state.thresholdList}
            pagination={this.state.pagination}
            onChange={(pagination) => {
              this.setState({ pagination }, this.getThresholdList.bind(this));
            }} />
        </Card>

        <AddThreshold
          visible={this.state.handleAddThresholdVisible}
          handleAddThresholdVisible={this.handleAddThresholdVisible}
          getThresholdList={this.getThresholdList}
        />

        <EditThreshold
          visible={this.state.handleEditThresholdVisible}
          handleEditThresholdVisible={this.handleEditThresholdVisible}
          getThresholdList={this.getThresholdList}
          value={this.state.editValue}
        />
      </Fragment>
    );
  }
  componentDidMount() {
    this.getThresholdList();
  }
  getThresholdList = () => {
    this.setState({ getThresholdListLoading: true });
    const { pagination } = this.state;
    let params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sectorId: sectorModel.sectorId,
    };
    axios.get('/threshold/getMonitorInThreshold', { params }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ thresholdList: data.list });
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      } else {
        this.setState({ thresholdList: [] });
      }
      this.setState({ getThresholdListLoading: false });
    }).catch(err => {
      this.setState({ thresholdList: [] });
      this.setState({ getThresholdListLoading: false });
    });
  }
}

@Form.create()
class AddThreshold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getMonitorPointLoading: false,
      monitorPoints: []
    };
  }

  randerExForm = () => {
    const columns = [
      {
        title: '阈值等级',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '测量值(v)',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '阈值配置',
        dataIndex: 'ex',
        key: 'ex',
      },
    ];
    const dataSource = [
      {
        key: '1',
        index: '一级阈值',
        value: 'v <= -100 或 v > 100',
        ex: '(-,-100);(100,+)',
      },
      {
        key: '2',
        index: '二级阈值',
        value: '-100 < v <= -55.5',
        ex: '(-100,-55.5)',
      },
      {
        key: '3',
        index: '三级阈值',
        value: '-55.5 < v <= -20',
        ex: '(-55.5,-20)',
      },
    ];
    return <Table bordered size="small" dataSource={dataSource} columns={columns} pagination={false} />
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          sectorId: sectorModel.sectorId,
          mpId: values.mpId,
          thresholdType: values.type,
          oneThresholdValue: values.threshold1,
          twoThresholdValue: values.threshold2,
          threeThresholdValue: values.threshold3,
        };
        axios.post('/threshold/addMonitorInThreshold', params, { headers: { 'Content-Type': 'application/json' } }).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            this.props.getThresholdList();
            this.props.handleAddThresholdVisible(false);
          } else {
            message.info('增添失败');
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
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue } } = this.props;
    return (
      <Drawer
        title="添加阈值"
        width={800}
        onClose={_ => { this.props.handleAddThresholdVisible(false) }}
        visible={this.props.visible}
      >
        <div style={{ marginBottom: '30px' }}>
          <div>请在英文输入状态下填写阈值，阈值填写格式：开区间，多个区间以 “;” 分隔，且区间不能重叠。 其中，正无穷用 “+” 表示，负无穷用 “-” 表示。例如：</div>
          {this.randerExForm()}
        </div>
        <Form
          layout="vertical"
        // style={{ textAlign: 'right', paddingLeft: '30px', paddingRight: '60px' }}
        >
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <Form.Item label="测点名称" {...formItemLayout}>
                {getFieldDecorator('mpId', {
                  rules: [
                    { required: true, message: '不允许为空' }
                  ],
                })(<Select
                  showSearch
                  placeholder="示例：ZC45"
                  onFocus={this.getMonitorPoint}
                  loading={this.state.getMonitorPointLoading}
                  notFoundContent={this.state.getMonitorPointLoading ? <Spin size="small" /> : null}
                  dropdownMatchSelectWidth={false}
                  style={{ width: '210px' }}
                >
                  {this.state.monitorPoints.map(item => <Select.Option key={item.mpId} value={item.mpId}>{item.monitorPointNumber}</Select.Option>)}
                </Select>)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="数据类型" {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: '1',
                  rules: [
                    { required: true, message: '不允许为空' }
                  ],
                })(
                  <Select style={{ width: '210px' }}>
                    <Select.Option value='1'>当前值</Select.Option>
                    <Select.Option value='2'>累计变化量</Select.Option>
                    <Select.Option value='3'>单次变化量</Select.Option>
                    <Select.Option value='4'>变化速率</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <Form.Item label="一级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold1', {
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-,-100);(100,+)' />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="二级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold2', {
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-100,-55.5)' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="三级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold3', {
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-55.5,-20)' />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>

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
          <Button onClick={_ => { this.props.handleAddThresholdVisible(false) }} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
        </div>
      </Drawer >
    );
  }

  getMonitorPoint = () => {
    this.setState({ getMonitorPointLoading: true });
    let params = {
      sectorId: sectorModel.sectorId,
    };
    axios.get('/threshold/getMonitorNotInThreshold', { params }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ monitorPoints: data });
      } else {
        this.setState({ monitorPoints: [] });
      }
      this.setState({ getMonitorPointLoading: false });
    }).catch(err => {
      this.setState({ monitorPoints: [] });
      this.setState({ getMonitorPointLoading: false });
    });
  }
}

@Form.create()
class EditThreshold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editValue: null
    };
  }

  randerExForm = () => {
    const columns = [
      {
        title: '阈值等级',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: '测量值(v)',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '阈值配置',
        dataIndex: 'ex',
        key: 'ex',
      },
    ];
    const dataSource = [
      {
        key: '1',
        index: '一级阈值',
        value: 'v <= -100 或 v > 100',
        ex: '(-,-100);(100,+)',
      },
      {
        key: '2',
        index: '二级阈值',
        value: '-100 < v <= -55.5',
        ex: '(-100,-55.5)',
      },
      {
        key: '3',
        index: '三级阈值',
        value: '-55.5 < v <= -20',
        ex: '(-55.5,-20)',
      },
    ];
    return <Table bordered size="small" dataSource={dataSource} columns={columns} pagination={false} />
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          sectorId: sectorModel.sectorId,
          monitorPointNumber: this.state.editValue.monitorPointNumber,
          mpId: this.state.editValue.mpId,
          thresholdType: values.type,
          oneThresholdValue: values.threshold1,
          twoThresholdValue: values.threshold2,
          threeThresholdValue: values.threshold3,
        };
        axios.put('/threshold/modifyThreshold', params).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            this.props.getThresholdList();
            this.props.handleEditThresholdVisible(false);
          } else {
            message.info('编辑失败');
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
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue } } = this.props;
    return (
      <Drawer
        title="编辑阈值"
        width={800}
        onClose={_ => { this.props.handleEditThresholdVisible(false) }}
        visible={this.props.visible}
      >
        <div style={{ marginBottom: '30px' }}>
          <div>请在英文输入状态下填写阈值，阈值填写格式：开区间，多个区间以 “;” 分隔，且区间不能重叠。 其中，正无穷用 “+” 表示，负无穷用 “-” 表示。例如：</div>
          {this.randerExForm()}
        </div>
        <Form
          layout="vertical"
        // style={{ textAlign: 'right', paddingLeft: '30px', paddingRight: '60px' }}
        >
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <Form.Item label="测点名称" {...formItemLayout}>
                {getFieldDecorator('monitorPointNumber', {
                  initialValue: this.state.editValue && this.state.editValue.monitorPointNumber,
                  rules: [
                    { required: true, message: '不允许为空' }
                  ],
                })(<Input style={{ width: '210px' }} disabled />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="数据类型" {...formItemLayout}>
                {getFieldDecorator('type', {
                  initialValue: this.state.editValue && this.state.editValue.thresholdType,
                  rules: [
                    { required: true, message: '不允许为空' }
                  ],
                })(
                  <Select style={{ width: '210px' }}>
                    <Select.Option value={1}>当前值</Select.Option>
                    <Select.Option value={2}>累计变化量</Select.Option>
                    <Select.Option value={3}>单次变化量</Select.Option>
                    <Select.Option value={4}>变化速率</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col md={12} sm={24}>
              <Form.Item label="一级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold1', {
                  initialValue: this.state.editValue && this.state.editValue.oneThresholdValue,
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-,-100);(100,+)' />)}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="二级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold2', {
                  initialValue: this.state.editValue && this.state.editValue.twoThresholdValue,
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-100,-55.5)' />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="三级阈值" {...formItemLayout}>
                {getFieldDecorator('threshold3', {
                  initialValue: this.state.editValue && this.state.editValue.threeThresholdValue,
                  rules: [
                    { required: true, message: '不允许为空' },
                    {
                      pattern: /^\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\)(\;\([-\+]?[0-9]+\.?[0-9]+\,[-\+]?[0-9]+\.?[0-9]+\))?$/,
                      message: '阈值格式错误',
                    },
                  ],
                })(<Input style={{ width: '210px' }} placeholder='例如:(-55.5,-20)' />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>

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
          <Button onClick={_ => { this.props.handleEditThresholdVisible(false) }} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={this.handleSubmit}>
            提交
          </Button>
        </div>
      </Drawer >
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      editValue: nextProps.value
    }
  }
}

export default ThresholdList;