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
import PointList from './PointList';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class BindBenchmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],

      handleAddPointBindVisible: false,
      handleSureBenchmarkVisible: false,
      handleDeleteBenchmarkPointVisible: false,
    };
  }

  handleAddPointBindVisible = flag => {
    this.setState({ handleAddPointBindVisible: flag });
  }

  handleSureBenchmarkVisible = flag => {
    this.setState({ handleSureBenchmarkVisible: flag });
  }

  handleDeleteBenchmarkPointVisible = flag => {
    this.setState({ handleDeleteBenchmarkPointVisible: flag });
  }

  delectBenchmark = idAry => {
    axios.put('/monitorPoint/releaseBenchmark', idAry, {
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getBenchmarkList();
      }
    });
  }

  render() {
    const columns = [
      {
        title: '基准点名字',
        dataIndex: 'benchName',
        key: 'benchName',
      },
      {
        title: '测点名字',
        dataIndex: 'benchmarkMonitorPoints',
        key: 'benchmarkMonitorPoints',
        render: (text, record) => {
          console.log(text);
          return (
            <div style={{ width: '1000px', overflow: 'hidden' }}>
              {text.map(v => <span>{v.monitorPointNumber},</span>)}
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="确定删除?"
              onConfirm={_ => {
                let idAry = [text.benchId];
                const benchmarkMonitorPoints = text.benchmarkMonitorPoints;
                benchmarkMonitorPoints.forEach(v => {
                  idAry.push(v.mpId);
                });
                this.delectBenchmark(idAry);
              }}
              okText="是"
              cancelText="否"
            >
              <a>删除基准点</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={_ => {
              sectorModel.selectBenchmarkPointList = text.benchmarkMonitorPoints;
              this.handleDeleteBenchmarkPointVisible(true);
            }}>删除测点</a>
            <Divider type="vertical" />
            <a onClick={_ => {
              sectorModel.selectBenchmarkId = text.benchId;
              this.handleAddPointBindVisible(true);
            }}>添加</a>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            this.handleSureBenchmarkVisible(true);
          }}>
            声明基准点
          </Button>
          <Divider />
          <Table columns={columns} dataSource={this.state.dataSource} />
        </Card>

        <AddPointBind
          visible={this.state.handleAddPointBindVisible}
          handleAddPointBindVisible={this.handleAddPointBindVisible}
          getBenchmarkList={this.getBenchmarkList}
        />

        <SureBenchmark
          visible={this.state.handleSureBenchmarkVisible}
          handleSureBenchmarkVisible={this.handleSureBenchmarkVisible}
          getBenchmarkList={this.getBenchmarkList}
        />

        <DeleteBenchmarkPoint
          visible={this.state.handleDeleteBenchmarkPointVisible}
          handleDeleteBenchmarkPointVisible={this.handleDeleteBenchmarkPointVisible}
          getBenchmarkList={this.getBenchmarkList}
        />
      </Fragment>
    );
  }
  componentDidMount() {
    this.getBenchmarkList();
  }
  getBenchmarkList = () => {
    axios.get('/monitorPoint/listBenchmarkBinding', {
      params: { sectorId: sectorModel.sectorId }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data });
      } else {
        this.setState({ dataSource: [] });
      }
    })
  }
}

@Form.create()
class AddPointBind extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPoint: [],

      listPointLoading: false
    };
  }
  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let pointList = values.pointList;
        axios.put(`/monitorPoint/addBenchmarkBinding?benchId=${sectorModel.selectBenchmarkId}`, pointList, {
          headers: { 'Content-Type': 'application/json' }
        }).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('添加成功');
            this.props.getBenchmarkList();
            this.props.handleAddPointBindVisible(false);
          }
        })
      }
    });
  }

  getlistPoint = v => {
    this.setState({ listPointLoading: true });
    axios.get('/monitorPoint/listBenchmarkNotBinding', {
      params: {
        sectorId: sectorModel.sectorId,
        monitorPointNumber: v
      }
    }).then(res => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        this.setState({ listPoint: data });
        console.log(data);
      } else {
        console.log(msg);
      }
      this.setState({ listPointLoading: false });
    }).catch(err => {
      console.log(err);
      this.setState({ listPointLoading: false });
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Drawer
        title="绑定测点"
        width={720}
        onClose={_ => { this.props.handleAddPointBindVisible(false) }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={'测点名称'}>
                {getFieldDecorator(`pointList`, {
                  rules: [
                    { required: true, message: '不允许为空' },
                  ],
                })(
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="请选择测点名称"
                    loading={this.state.getlistPointLoading}
                    notFoundContent={this.state.getlistPointLoading ? <Spin size="small" /> : null}
                    onFocus={this.getlistPoint}
                    optionFilterProp='children'
                    style={{ width: '100%' }}
                  >
                    {this.state.listPoint.map(v => (
                      <Option key={v.mpId}>{v.monitorPointNumber}</Option>
                    ))}
                  </Select>
                )}
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
            <Button onClick={_ => { this.props.handleAddPointBindVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

@Form.create()
class SureBenchmark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listPointSure: [],

      listPointSureLoading: false
    };
  }
  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let pointList = values.pointList;
        axios.put(`/monitorPoint/declarationBenchmark?mpId=${pointList}`).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('添加成功');
            this.props.getBenchmarkList();
            this.props.handleSureBenchmarkVisible(false);
          }
        })
      }
    });
  }

  getlistPointSure = v => {
    this.setState({ listPointSureLoading: true });
    axios.get('/monitorPoint/listBenchmarkNotBinding', {
      params: {
        sectorId: sectorModel.sectorId,
        monitorPointNumber: v
      }
    }).then(res => {
      const { code, data, msg } = res.data;
      if (code === 0) {
        this.setState({ listPointSure: data });
        console.log(data);
      } else {
        console.log(msg);
      }
      this.setState({ listPointSureLoading: false });
    }).catch(err => {
      console.log(err);
      this.setState({ listPointSureLoading: false });
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Drawer
        title="声明基准点"
        width={720}
        onClose={_ => { this.props.handleSureBenchmarkVisible(false) }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={'测点名称'}>
                {getFieldDecorator(`pointList`, {
                  rules: [
                    { required: true, message: '不允许为空' },
                  ],
                })(
                  <Select
                    showSearch
                    placeholder="请选择测点名称"
                    loading={this.state.getlistPointSureLoading}
                    notFoundContent={this.state.getlistPointSureLoading ? <Spin size="small" /> : null}
                    onFocus={this.getlistPointSure}
                    optionFilterProp='children'
                    style={{ width: '100%' }}
                  >
                    {this.state.listPointSure.map(v => {
                      return <Option value={v.mpId}>{v.monitorPointNumber}</Option>
                    })}
                  </Select>
                )}
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
            <Button onClick={_ => { this.props.handleSureBenchmarkVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

@Form.create()
class DeleteBenchmarkPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let pointList = values.pointList;
        axios.put(`/monitorPoint/releaseBenchmark`, pointList, {
          headers: { 'Content-Type': 'application/json' },
        }).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('删除成功');
            this.props.getBenchmarkList();
            this.props.handleDeleteBenchmarkPointVisible(false);
          }
        })
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Drawer
        title="删除基准点下的测点"
        width={720}
        onClose={_ => { this.props.handleDeleteBenchmarkPointVisible(false) }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={'测点名称'}>
                {getFieldDecorator(`pointList`, {
                  rules: [
                    { required: true, message: '不允许为空' },
                  ],
                })(
                  <Select
                    mode="multiple"
                    placeholder="请选择需要删除的测点名称"
                    dropdownMatchSelectWidth={false}
                    style={{ width: '100%' }}
                  >
                    {sectorModel.selectBenchmarkPointList.map(v => (
                      <Option key={v.mpId}>{v.monitorPointNumber}</Option>
                    ))}
                  </Select>
                )}
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
            <Button onClick={_ => { this.props.handleDeleteBenchmarkPointVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default BindBenchmark;