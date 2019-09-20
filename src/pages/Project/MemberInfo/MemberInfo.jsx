/* eslint-disable */
import React, { Component } from 'react';
import { getMemberInfo, addMemberInfo, removeMember } from '@/services/project';
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
import AddMember from './addMember';
import ModifyMember from './modifyMember';
//import TerminalDetail from './terminalDetail'
import styles from './member.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class MemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      modalVisible: false,
      formValues: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      drawerAddMemberVisible: false,
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

  handleDrawerAddMemberVisible = (boolen) => {
    this.setState({ drawerAddMemberVisible: boolen });
  }
  // 获取表格数据
  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    let param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getMemberInfo(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      //console.log('人员信息数据:',data);
      if (code === 0) {
        this.setState({ dataSource: data.list });
        console.log('人员信息:',this.state.dataSource);
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      }else{
        this.setState({ dataSource: [] });
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`MemberInfo code is catch`);
    })
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      console.log(values);
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
            <FormItem label="姓名">
              {getFieldDecorator('memberName')(<Input placeholder="请输入人员姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="公司">
              {getFieldDecorator('memberCompany')(<Input placeholder="请输入公司名称" />)}
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
  handleDelMember = (record) => {
    //传入人员ID(key)
    let body = [record.key];
    console.log(body);
    removeMember(body).then(res => {
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
    removeMember(body).then(res => {
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
        title: '姓名',
        dataIndex: 'memberName',
        align: 'center',
      },
      {
        title: '公司',
        dataIndex: 'memberCompany',
        align: 'center',
      },
      {
        title: '邮箱',
        dataIndex: 'memberEmail',
        align: 'center',
      },
      {
        title: '电话',
        dataIndex: 'memberPhone',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <ModifyMember className="member_modify" modifypass={record} handleUpdate={this.queryDataSource}/>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={()=>this.handleDelMember(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        )
      },
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({ selectedRowKeys, selectedRows });
        //console.log(this.state.selectedRowKeys);
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
      <PageHeaderWrapper title='人员管理'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                this.handleDrawerAddMemberVisible(true);
              }}>
                添加人员
              </Button>
            </div>
            <div className={styles.tableAlert}>
              <Alert
                message={
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{this.state.selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    全选为选择当前页的所有人员
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
        <AddMember
          drawerAddMemberVisible={this.state.drawerAddMemberVisible}
          handleDrawerAddMemberVisible={this.handleDrawerAddMemberVisible}
          queryDataSource={this.queryDataSource}
        />
      </PageHeaderWrapper>
    );
  }

  componentDidMount() {
    this.queryDataSource();
  }
}

export default MemberInfo;