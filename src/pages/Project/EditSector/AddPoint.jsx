import React, { Component ,Fragment} from 'react';
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
  Upload
} from 'antd';
import ImgMark from '@/components/ImgMark/ImgMark';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class AddPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dot:[]
    };
  }

  dotChange = v => {
    console.log(v);
    this.setState({dot:v});
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="添加测点"
        width={1000}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
      >
        <ImgMark
          style={{border:'1px dashed #000',width:'100%',height:'300px',overflow:'hidden'}}
          // src={'http://123.207.88.210/monitor/images/three/pointMap/cfl.png'}
          src={'http://123.207.88.210/monitor/images/three/pointMap/hlgsbdt.jpg'}
          // style={{ height: '300px' }}
          dot={this.state.dot}
          onChange={this.dotChange}
        />

        <div style={{ marginTop: '50px' }}>
          <Form
            className={styles.disabled}
            layout="vertical"
            hideRequiredMark
            // onSubmit={this.handleSubmit}
          >
            {this.state.dot.map((v, i) => {
              if (v !== undefined) {
                return (
                  <Fragment>
                    <Row gutter={16} key={i}>
                      <Col span={3}>
                        <Form.Item label={'测点名'}>
                          {getFieldDecorator(`indexName_${i}`, {
                            initialValue: `编号${v.number}`,
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
                        <Form.Item label={'终端编号'}>
                          {getFieldDecorator(`terminlaNumber_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            // <Select
                            //   showSearch
                            //   placeholder="请选择终端编号"
                            //   loading={this.state.getTerminlaNumberLoading}
                            //   notFoundContent={this.state.getTerminlaNumberLoading ? <Spin size="small" /> : null}
                            //   onSearch={debounce(v => { this.getTerminlaNumber(v) }, 800)}
                            //   dropdownMatchSelectWidth={false}
                            //   style={{ width: '100%' }}
                            // >
                            //   {this.state.terminlaNumberAry.map(v => (
                            //     <Option key={v}>{v}</Option>
                            //   ))}
                            // </Select>
                            <Select>
                              <Option key={'terminlaNumber_1'}>terminlaNumber_1</Option>
                              <Option key={'terminlaNumber_2'}>terminlaNumber_2</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'终端通道'}>
                          {getFieldDecorator(`terminlaWay_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(<Input placeholder="示例：0~34" />)}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={'传感器编号'}>
                          {getFieldDecorator(`sersorNumber_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            // <Select
                            //   showSearch
                            //   placeholder="请选择传感器编号"
                            //   loading={this.state.getSersorNumberLoading}
                            //   notFoundContent={this.state.getSersorNumberLoading ? <Spin size="small" /> : null}
                            //   onSearch={debounce(v => { this.getSersorNumber(v) }, 800)}
                            //   dropdownMatchSelectWidth={false}
                            //   style={{ width: '100%' }}
                            // >
                            //   {this.state.sersorNumberAry.map(v => (
                            //     <Option key={v}>{v}</Option>
                            //   ))}
                            // </Select>
                            <Select>
                              <Option key={'sersorNumber_1'}>sersorNumber_1</Option>
                              <Option key={'sersorNumber_2'}>sersorNumber_2</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item label={'监测指标'}>
                          {getFieldDecorator(`monitorType_${i}`, {
                            rules: [
                              { required: true, message: '不允许为空' },
                            ],
                          })(
                            // <Select
                            //   placeholder="示例：监测指标"
                            //   onFocus={this.listMonitorType}
                            //   loading={this.state.listMonitorTypeLoading}
                            //   notFoundContent={this.state.listMonitorTypeLoading ? <Spin size="small" /> : null}
                            //   dropdownMatchSelectWidth={false}
                            //   style={{ width: '100%' }}
                            // >
                            //   {this.state.listMonitorType.map(type => <Select.Option key={type.scId}>{type.itemName}</Select.Option>)}
                            // </Select>
                            <Select>
                              <Option key={'monitorType_1'}>monitorType_1</Option>
                              <Option key={'monitorType_2'}>monitorType_2</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'是否基准点'}>
                          {getFieldDecorator(`isMark_${i}`, {
                            rules: [
                              // { required: true, message: '不允许为空' },
                            ],
                          })(
                            // <Switch checkedChildren="是" unCheckedChildren="否" style={{ marginTop: '5px' }}
                            //   onChange={v => {
                            //     let dot = this.state.dot;
                            //     dot[i].isMark = v;
                            //     this.setState({ dot });
                            //   }}
                            // />
                            <Select>
                              <Option key={'isMark_1'}>是</Option>
                              <Option key={'isMark_2'}>否</Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={3}>
                        <Form.Item label={'删除测点'}>
                          <Button type='danger'>删除</Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider style={{marginTop:'0'}}/>
                  </Fragment>
                )
              } else {
                return null
              }
            })}
          </Form>
        </div>

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
          <Button onClick={_ => { this.props.handleDrawerVisible(false) }} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType='submit'>
            提交
          </Button>
        </div>
      </Drawer >
    );
  }
}

export default AddPoint;