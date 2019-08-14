/* eslint-disable */
import React, { Component } from 'react';
import { getSensorInfo, updateInAndOut, handleDelSensor } from '@/services/in-out-library';
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
  Popconfirm,
  Modal,
  message
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddSensor from './addSensor';
import ModifySensor from './modifySensor';
import SensorDetail from './sensorDetail';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      formValues: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      drawerAddSensorVisible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
      tableLoading: false,
      sensorDetailsVisible: false,
      sensorDetail: {},
    };
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('sensorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地址">
              {getFieldDecorator('sensorAddress')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={e => {
                e.preventDefault();
                this.handleFormReset();
              }}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={e => {
                e.preventDefault();
                this.toggleForm();
              }}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="编号">
              {getFieldDecorator('sensorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地址">
              {getFieldDecorator('sensorAddress')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="位置">
              {getFieldDecorator('position')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('sensorStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">未使用</Select.Option>
                  <Select.Option value="2">使用中</Select.Option>
                  <Select.Option value="3">已损坏</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('sensorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="厂家">
              {getFieldDecorator('manufacturer')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="型号">
              {getFieldDecorator('sensorModel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="量程">
              {getFieldDecorator('sensorRange')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="精度">
              {getFieldDecorator('sensorAccuracy')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标定系数K">
              {getFieldDecorator('timingFactor')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="生产日期">
              {getFieldDecorator('productDate')(<DatePicker style={{ width: '100%' }} placeholder="请输入生产日期" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="结束日期">
              {getFieldDecorator('endDate')(<DatePicker style={{ width: '100%' }} placeholder="请输入结束日期" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        productDate: fieldsValue.productDate ? fieldsValue.productDate.format('YYYY-MM-DD') : undefined,
        endDate: fieldsValue.endDate ? fieldsValue.endDate.format('YYYY-MM-DD') : undefined,
      };

      this.setState({
        formValues: values,
      }, _ => { this.queryDataSource() });

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    // dispatch({
    //   type: 'rule/fetch',
    //   payload: {},
    // });
  };

  handleDrawerAddSensorVisible = (boolen) => {
    this.setState({ drawerAddSensorVisible: boolen });
  }

  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    let param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getSensorInfo(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data.list });
        console.log(this.state.dataSource);
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      }else{
        this.setState({ dataSource: [] });
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`/sensor/SensorInfo code is catch`);
    })
  };

  //批量操作
  //批量入库
  handleSelectedInStatus = (record) => {
    if(this.state.selectedRowKeys.length>0){
      message.success('批量入库！！！');
      console.log('批量入库数据:',[...this.state.selectedRows]);
      //let params = { "sensorNumber": record.sensorNumber }
    }else{

    }
  }
  //批量出库
  handleSelectedOutStatus(){
    if(this.state.selectedRowKeys.length>0){
      message.success('批量出库！！！');
      console.log('批量出库数据:',[...this.state.selectedRows]);
    }
  }
  //批量删除
  handleSelectedDel(){
    if(this.state.selectedRowKeys.length>0){
      message.success('批量删除！！！');
      console.log('批量删除数据:',[...this.state.selectedRows]);
    }
  }
  //清空所选
  handleSelectedEmpty(){
    if(this.state.selectedRowKeys.length>0){
      message.success('清空所选！！！');
      console.log('清空所选数据:',[...this.state.selectedRows]);
      this.queryDataSource();
      this.state.selectedRowKeys=[];
    }
  }

  //删除
  handleDel = (record) => {
    console.log(record);
    //转换为json格式
    let params = { "sensorNumber": record.sensorNumber };
    handleDelSensor(params).then(res => {
      console.log(res);
      let result = res.data;
      if(result.code === 0){
        console.log(result.msg);
        this.queryDataSource();
      }else{
        console.log(result.msg);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  table = () => {
    const columns = [
      {
        title: '编号',
        dataIndex: 'sensorNumber',
        align: 'center',
      },
      {
        title: '地址(十进制)',
        dataIndex: 'sensorAddress',
        align: 'center',
      },
      {
        title: '位置',
        dataIndex: 'position',
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        render: (text, record, index) => {
          let status = 'success';
          if (text === '未使用') {
            status = 'default';
          } else if (text === '已损坏') {
            status = 'error';
          }
          return <Badge status={status} text={text} />;
        },
      },
      {
        title: '名称',
        dataIndex: 'sensorName',
        align: 'center',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        align: 'center',
      },
      {
        title: '出入库操作',
        dataIndex: 'inAndOutStatus',
        align: 'center',
        render: (text, record, index) => {
          const checked = text === '入库' ? true : false;
          return (
            <Switch
              checkedChildren="已入库"
              unCheckedChildren="未入库"
              checked={checked}
              onChange={e => {
                const inAndOutStatus = e ? '入库' : '出库';
                updateInAndOut({ inAndOutStatus, sensorId: record.key }).then(res => {
                  if (res) {
                    this.queryDataSource(false);
                  }
                })
              }}
            />
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <ModifySensor className="sensor_modify" modifypass={record} />
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除此传感器？"
              onConfirm={()=>this.handleDel(record)}
            >
              <a>删除</a>
            </Popconfirm>
            {/* <Divider type="vertical" />
            <a 
              onClick={
                this.handleDetails
              }
            >
              详情
            </a> */}
            <Divider type="vertical" />
            <SensorDetail className="sensor_detail" pass={record}/>
          </div>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
      },
      // onSelect:(record, selected, selectedRowKeys, selectedRows) => {

      // },
      getCheckboxProps: record => ({
        // disabled: record.name === 'Disabled User', // Column configuration not to be checked
        // name: record.name,
      }),
    };
    return (
      <Table
        loading={this.state.tableLoading}
        columns={columns}
        dataSource={this.state.dataSource}
        pagination={this.state.pagination}
        onChange={(pagination) => {
          this.setState({ pagination }, this.queryDataSource.bind(this));
        }}
        rowSelection={rowSelection}
      />
    )
  }
  //批量入库
  inStatusBatch = () =>{
    const { selectedRows } = this.state;
  }
  render() {
    return (
      <PageHeaderWrapper title='传感器仓库'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                this.handleDrawerAddSensorVisible(true);
              }}>
                添加传感器
              </Button>
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    全选为选择当前页的所有传感器
                    <a style={{ marginLeft: 24 }} onClick={_=>{this.handleSelectedInStatus()}}>
                      批量入库
                    </a>
                    <Divider type="vertical" />
                    <a style={{ marginLeft: 0 }} onClick={_=>{this.handleSelectedOutStatus()}}>
                      批量出库
                    </a>
                    <Divider type="vertical" />
                    <a style={{ marginLeft: 0 }} onClick={_=>{this.handleSelectedDel()}}>
                      批量删除
                    </a>
                    <Divider type="vertical" />
                    <a style={{ marginLeft: 0 }} onClick={_=>{this.handleSelectedEmpty()}}>
                      清空所选
                    </a>
                  </div>
                }
                type="info"
                showIcon
              />
            </div>
            {this.table()}
          </div>
        </Card>
        <AddSensor
          drawerAddSensorVisible={this.state.drawerAddSensorVisible}
          handleDrawerAddSensorVisible={this.handleDrawerAddSensorVisible}
          queryDataSource={this.queryDataSource}
        />
      </PageHeaderWrapper>
    );
  }

  componentDidMount() {
    this.queryDataSource();
  }
}

export default index;