/* eslint-disable */
import React, { Component } from 'react';
import { getListUser, removeUser } from '@/services/project';
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
import AddUser from './addUser';
import ModifyUser from './modifyUser';
import BindProject from './bindProject';
import BindSector from './bindSector';
import UnbindSector from './unbindSector';
//import TerminalDetail from './terminalDetail'
import styles from './userinfo.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      modalVisible: false,
      formValues: {},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      drawerAddUserVisible: false,
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

  handleDrawerAddUserVisible = (boolen) => {
    this.setState({ drawerAddUserVisible: boolen });
  }

  /* 表格数据 */
  queryDataSource = (loading = true) => {
    this.setState({ tableLoading: true && loading });
    const { formValues, pagination } = this.state;
    let param = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    getListUser(param).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if (code === 0) {
        this.setState({ dataSource: data.list });
        //console.log(this.state.dataSource);
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      } else {
        this.setState({ dataSource: [] });
        router.push('/user/login');
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`ListUser code is catch`);
    })
  };

  /* 查询 */
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
    const formItemLayout = {
      labelCol: { sm: { span: 6 }, xs: { span: 24 }, style: { lineHeight: 2, textAlign: 'right' } },
      wrapperCol: { sm: { span: 18 }, xs: { span: 24 } }
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={8}>
          <Col md={6} sm={24}>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator('phone')(<Input placeholder="请输入电话" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email')(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="公司" {...formItemLayout}>
              {getFieldDecorator('company')(<Input placeholder="请输入公司名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="真实姓名"  {...formItemLayout}>
              {getFieldDecorator('realName')(<Input placeholder="请输入真实姓名" />)}
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

  //删除
  handleDelUser = (record) => {
    //用户的key值(userId)
    let param = record.key;
    console.log(param);
    removeUser(param).then(res => {
      let result = res.data;
      console.log(result);
      if (result.code === 0) {
        message.success(result.msg);
        this.queryDataSource();
      } else {
        message.info(result.msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }

  table = () => {
    const children = [];
    for (let i = 1; i < 36; i++) {
      children.push(<Option key={'子项目' + i}>{'子项目' + i}</Option>);
    }
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        align: 'center',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        align: 'center',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
      },
      {
        title: '公司',
        dataIndex: 'company',
        align: 'center',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <div>
            <ModifyUser className="user_modify" modifypass={record} handleUpdate={this.queryDataSource} />
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={() => this.handleDelUser(record)}
            >
              <a>删除</a>
            </Popconfirm>
          </div>
        ),
      },
      {
        title: '子项目操作',
        align: 'center',
        //width: '300px',
        render: (text, record) => (
          <div style={{}}>
            <BindProject bindSector={record} handleBindSector={this.queryDataSource} />
            <Divider type="vertical" />
            <BindSector bindSector={record} handleBindSector={this.queryDataSource} />
            <Divider type="vertical" />
            <UnbindSector unbindSector={record} handleUnBindSector={this.queryDataSource} />
          </div>
        )
      }
    ];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
      //rowSelection={rowSelection}
      />
    )
  }

  handleEditSensor(record) {
    //console.log(record);
    this.setState({ modalVisible: true, record });
  }

  render() {
    return (
      <PageHeaderWrapper title='用户管理'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator} style={{ marginBottom: '16px' }}>
              <Button icon="plus" type="primary" onClick={e => {
                e.preventDefault();
                this.handleDrawerAddUserVisible(true);
              }}>
                添加用户
              </Button>
            </div>
            {this.table()}
          </div>
        </Card>
        <AddUser
          drawerAddUserVisible={this.state.drawerAddUserVisible}
          handleDrawerAddUserVisible={this.handleDrawerAddUserVisible}
          queryDataSource={this.queryDataSource}
        />
      </PageHeaderWrapper>
    );
  }

  componentDidMount() {
    this.queryDataSource();
  }
}

export default UserInfo;