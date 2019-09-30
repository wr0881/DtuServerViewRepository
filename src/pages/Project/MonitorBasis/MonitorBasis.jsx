/* eslint-disable */
import React, { Component } from 'react';
import { getListBasis, removeBasis } from  '@/services/project'
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
import AddBasis from './addBasis';
import ModifyBasis from './modifyBasis';
import styles from './monitorbasis.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class MonitorBasis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      modalVisible: false,
      formValues: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      drawerAddBasisVisible: false,
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
      tableLoading: false,
    };
  }

  handleDrawerAddBasisVisible = (boolen) => {
    this.setState({ drawerAddBasisVisible: boolen });
  }
  
  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    let param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getListBasis(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data.list });
        console.log(this.state.dataSource);
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      }else{
        this.setState({ dataSource: [] });
        router.push('/user/login');
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`TerminalInfo code is catch`);
    })
  };

  //查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      }, _ => { this.queryDataSource() });
    });
  };

  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };
  
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="文件编号">
              {getFieldDecorator('number')(<Input placeholder="请输入文件编号" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(<Input placeholder="请输入文件名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="文件状态">
              {getFieldDecorator('fileStatus')(
                <Select placeholder="请选择">
                  <Option value='增加'>增加</Option>
                  <Option value='作废'>作废</Option>
                  <Option value='运行'>运行</Option>
                  <Option value='试运行'>试运行</Option>
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

  // 单个删除
  handleDelBasis = (record) => {
    //传入人员ID(key)
    let body = [record.key];
    console.log(body);
    removeBasis(body).then(res => {
      let result = res.data;
      if(result.code === 0){
        message.success(result.msg);
        this.queryDataSource();
      }else{
        message.info(result.msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }
  // 批量删除
  handleSelectedDel = (record) => {
    //传入人员ID(key)
    let body = this.state.selectedRowKeys;
    removeBasis(body).then(res => {
      let result = res.data;
      if(result.code === 0){
        message.success(result.msg);
        this.queryDataSource();
        this.state.selectedRowKeys=[];
      }else{
        message.info(result.msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }

  table = () => {
    const columns = [
      {
        title: '文件编号',
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
        align: 'center',
      },
      {
        title: '文件状态',
        dataIndex: 'fileStatus',
        align: 'center',
        render: (text) => {
          //let status = 'default';
          let color = 'green'; 
          //let text = '运行';
          if(text === '运行'){
            color = 'green'
          }else if(text === '作废'){
            color = 'red'
          }else if(text === '无'){
            color = '#000'
          }else if(text === '试运行'){
            color='#d9d9d9'
          } 
          return <Badge color={color} text={text} />
        }
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <ModifyBasis className="basis_modify" modifypass={record} handleUpdate={this.queryDataSource}/>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={()=>this.handleDelBasis(record)}
            >
              <a>删除</a>
            </Popconfirm>
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
  
  //清空所选
  handleSelectedEmpty(){
    if(this.state.selectedRowKeys.length>0){
      this.queryDataSource();
      this.state.selectedRowKeys=[];
    }else{
      message.error('请先选择！');
    }
  }

  render() {
    return (
      <PageHeaderWrapper title='监测依据'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator} style={{marginBottom:'16px'}}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                this.handleDrawerAddBasisVisible(true);
              }}>
                添加监测依据
              </Button>
            </div>
            <div className={styles.tableAlert} style={{marginBottom:'16px'}}>
              <Alert
                message={
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    全选为选择当前页的所有用户
                    <a style={{ marginLeft: 24 }} onClick={_=>{this.handleSelectedDel()}}>
                      批量删除
                    </a>
                    <Divider type="vertical" />
                    <a onClick={_=>{this.handleSelectedEmpty()}}>
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
        <AddBasis
          drawerAddBasisVisible={this.state.drawerAddBasisVisible}
          handleDrawerAddBasisVisible={this.handleDrawerAddBasisVisible}
          queryDataSource={this.queryDataSource}
        />
      </PageHeaderWrapper>
    );
  }

  componentDidMount() {
    this.queryDataSource();
  }
}

export default MonitorBasis;