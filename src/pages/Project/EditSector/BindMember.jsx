import React, { Component, Fragment } from 'react';
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
  Tag
} from 'antd';

const FormItem = Form.Item;

const columns = [
  {
    title: '名字',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '类型',
    key: 'tags',
    dataIndex: 'tags',
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>编辑</a>
        <Divider type="vertical" />
        <a>删除</a>
        <Divider type="vertical" />
        <a>详情</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: '张三',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: '施工单位',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: '监理单位',
  },
  {
    key: '3',
    name: '王五',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: '建设单位',
  },
];

@Form.create()
class BindMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},

      drawerVisible: false
    };
  }

  handleDrawerVisible = flag => {
    this.setState({ drawerVisible: flag });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // this.setState({
      //   formValues: fieldsValue,
      // }, _ => { this.queryDataSource() });
      console.log(fieldsValue);

    });
  };

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
        <FormItem label="人员姓名">
          {getFieldDecorator('name')(<Input placeholder="请输入人员姓名" style={{ width: '200px' }} />)}
        </FormItem>
        <FormItem label="人员类型">
          {getFieldDecorator('type')(
            <Select placeholder="请选择人员类型" style={{ width: '200px' }}>
              <Select.Option value="全部">全部</Select.Option>
              <Select.Option value="建设单位">建设单位</Select.Option>
              <Select.Option value="施工单位">施工单位</Select.Option>
              <Select.Option value="监测单位">监测单位</Select.Option>
              <Select.Option value="监理单位">监理单位</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={e => {
            e.preventDefault();
            this.handleFormReset();
          }}>
            重置
          </Button>
        </FormItem>
        {/* <Divider /> */}
        <FormItem>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            this.handleDrawerVisible(true);
          }}>
            添加人员
          </Button>
        </FormItem>
      </Form>
    );
  }
  render() {
    return (
      <Fragment>
        <Card bordered={false}>
          {this.renderSimpleForm()}
          <Divider />
          <Table columns={columns} dataSource={data} />
        </Card>

        <AddMember
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
        // queryDataSource={this.queryDataSource}
        />
      </Fragment>
    );
  }
}

@Form.create()
class AddMember extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // addMember(fieldsValue).then(res => {
      //   const { code, msg } = res.data;
      //   if (code === 0) {
      //     message.success('添加人员成功');
      //     this.props.handleDrawerVisible(false);
      //     this.props.queryDataSource(false);
      //   } else {
      //     console.log(res.msg);
      //     message.info(msg);
      //   }
      // }).catch(err => {
      //   message.error('服务器错误');
      // })

      this.props.handleDrawerVisible(false);
    })
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="添加人员"
        width={720}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          onSubmit={this.handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="姓名">
                {getFieldDecorator('name')(
                  <Select placeholder="请选择人员姓名">
                    <Select.Option value="张三">张三</Select.Option>
                    <Select.Option value="李四">李四</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="人员类型">
                {getFieldDecorator('type')(
                  <Select placeholder="请选择人员类型">
                    <Select.Option value="建设单位">建设单位</Select.Option>
                    <Select.Option value="施工单位">施工单位</Select.Option>
                    <Select.Option value="监测单位">监测单位</Select.Option>
                    <Select.Option value="监理单位">监理单位</Select.Option>
                  </Select>
                )}
              </FormItem>
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
            <Button onClick={_ => { this.props.handleDrawerVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType='submit'>
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default BindMember;