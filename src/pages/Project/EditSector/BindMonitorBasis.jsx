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
    title: '监测依据ID',
    dataIndex: 'id',
    key: 'id',
    render: text => <a>{text}</a>,
  },
  {
    title: '监测依据名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
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
    name: '《建筑基坑支护技术规程》 JGJ120-2012',
    id: 32,
  },
  {
    key: '2',
    name: '《建筑基坑工程检测技术规范》 GB50497-2009',
    id: 32,
  },
  {
    key: '3',
    name: '《城市轨道交通工程检测技术规范》 GB50911-2013',
    id: 32,
  },
  {
    key: '4',
    name: '《建筑变形测量规范》 JGJ8-2016',
    id: 32,
  },
  {
    key: '5',
    name: '《建筑地基基础工程施工质量验收规范》 GB50202-2002',
    id: 32,
  },
  {
    key: '6',
    name: '《国家一、二等水准测量规范》 GB/T12897-2006',
    id: 32,
  },
];

@Form.create()
class BindMonitorBasis extends Component {
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
        <FormItem label="监测依据名称">
          {getFieldDecorator('name')(<Input placeholder="请输入监测依据名称" style={{ width: '200px' }} />)}
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
            添加依据
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

        <AddMonitorBasis
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
        // queryDataSource={this.queryDataSource}
        />
      </Fragment>
    );
  }
}

@Form.create()
class AddMonitorBasis extends Component {
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
        title="添加监测依据"
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
              <FormItem label="监测依据名称">
                {getFieldDecorator('name')(<Input placeholder="请输入监测依据名称" style={{ width: '200px' }} />)}
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

export default BindMonitorBasis;