/* eslint-disable */
import React, { Component } from 'react';
import { getTerminalInfo, getTerminalType, updateInAndOut, getSensorInfo, handleDelTerminal } from '@/services/in-out-library';
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
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AddTerminal from './addTerminal';
import ModifyTerminal from './modifyTerminal';
import TerminalDetail from './terminalDetail'
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class Terminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      modalVisible: false,
      formValues: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      drawerAddTerminalVisible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
      tableLoading: false,
      terminalType: [],
      terminalDetailsVisible: false,
    };
  }

  terminalType() {
    getTerminalType().then(res => {
      const { code, data } = res.data;
      if(code === 0){
        this.setState({terminalType:res.data.data});
      }
    })
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="终端编号">
              {getFieldDecorator('terminalNumber')(<Input placeholder="请输入终端编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="终端类型">
              {getFieldDecorator('terminalType')(
                <Select
                  showSearch
                  placeholder="请选择终端类型"
                >
                  {this.state.terminalType.map(v => {
                    return <Option key={v.index} value={v.index}>{v.value}</Option>
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="终端状态">
              {getFieldDecorator('terminalStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="1">未使用</Select.Option>
                  <Select.Option value="2">使用中</Select.Option>
                  <Select.Option value="3">已损坏</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
            </span>
          </Col>
        </Row>
      </Form>
    );
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
  };

  handleDrawerAddTerminalVisible = (boolen) => {
    this.setState({ drawerAddTerminalVisible: boolen });
  }

  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    let param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getTerminalInfo(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data.list });
        //console.log(this.state.dataSource);
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      }else{
        this.setState({ dataSource: [] });
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`TerminalInfo code is catch`);
    })
  };

  //批量操作
  //清空所选
  handleSelectedEmpty(){
    if(this.state.selectedRowKeys.length>0){
      this.queryDataSource();
      this.state.selectedRowKeys=[];
    }else{
      message.error('请先选择！');
    }
  }

  //删除
  handleDelTerminal = (record) => {
    //传入终端编号
    let params = { "terminalNumber": record.terminalNumber };
    handleDelTerminal(params).then(res => {
      let result = res.data;
      if(result.code === 0) {
        message.success(result.msg);
        this.queryDataSource();
      }else{
        message.info(result.msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }

  //详情
  handleDetails = () => {
    this.setState({
      terminalDetailsVisible: true
    })
  }

  table = () => {
    const columns = [
      {
        title: '终端编号',
        dataIndex: 'terminalNumber',
        align: 'center',
      },
      {
        title: '终端名称',
        dataIndex: 'terminalName',
        align: 'center',
      },
      {
        title: '厂家',
        dataIndex: 'manufacturer',
        align: 'center',
      },
      {
        title: '终端类型',
        dataIndex: 'terminalType',
        align: 'center',
      },
      {
        title: '终端型号',
        dataIndex: 'terminalModel',
        align: 'center',
      },
      {
        title: '电压',
        dataIndex: 'voltage',
        align: 'center',
      },
      {
        title: '通道数',
        dataIndex: 'channelNumber',
        align: 'center',
      },
      {
        title: '采集频率',
        dataIndex: 'collectionFrequency',
        align: 'center',
      },
      {
        title: '生产日期',
        dataIndex: 'productDate',
        align: 'center',
        render: (v) => {
          return v = v.substring(0,10);
        }
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        align: 'center',
        render: (v) => {
          return v = v.substring(0,10);
        }
      },
      {
        title: '终端状态',
        dataIndex: 'terminalStatus',
        align: 'center',
        render: (text, value, index) => {          
          switch(text){
            case 1:text="未使用";status="default";break;
            case 2:text="使用中";status="success";break;
            case 3:text="已损坏";status="error";break;
          }
          return <Badge status={status} text={text} />
        }
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <ModifyTerminal className="terminal_modify" modifypass={record} handleUpdate={this.queryDataSource}/>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除此终端?"
              onConfirm={()=>this.handleDelTerminal(record)}
            >
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <TerminalDetail className="terminal_detail" pass={record} />
          </div>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
      },
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
  
  handleEditSensor(record){
    //console.log(record);
    this.setState({modalVisible:true,record});
  }

  render() {
    return (
      <PageHeaderWrapper title='终端仓库'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                this.handleDrawerAddTerminalVisible(true);
              }}>
                添加终端
              </Button>
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    全选为选择当前页的所有终端
                    {/* <a style={{ marginLeft: 24 }} onClick={_=>{this.handleSelectedInStatus()}}>
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
                    <Divider type="vertical" /> */}
                    <a style={{ marginLeft: 24 }} onClick={_=>{this.handleSelectedEmpty()}}>
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
        <AddTerminal
          drawerAddTerminalVisible={this.state.drawerAddTerminalVisible}
          handleDrawerAddTerminalVisible={this.handleDrawerAddTerminalVisible}
          queryDataSource={this.queryDataSource}
        />
      </PageHeaderWrapper>
    );
  }

  componentDidMount() {
    this.queryDataSource();
    this.terminalType();
  }
}

export default Terminal;