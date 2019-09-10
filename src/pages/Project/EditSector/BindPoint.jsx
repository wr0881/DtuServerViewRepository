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
  Tag,
  Avatar,
  Upload
} from 'antd';
import AddPoint from './AddPoint';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const data = [
  {
    key: '1',
    url: 'http://123.207.88.210/monitor/images/three/pointMap/cfl.png',
    name: '图片一',
    des: '布点图一',
    point: ['ZCL07', 'ZCL08', 'ZCL08', 'ZCL08']
  },
  {
    key: '2',
    url: 'http://123.207.88.210/monitor/images/three/pointMap/wk.jpg',
    name: 'xxxxxxx图片',
    des: '布点图二',
    point: ['ZCL08', , 'ZCL08', 'ZCL08', 'ZCL08', 'ZCL08', 'ZCL08', 'ZCL08']
  },
  {
    key: '3',
    url: 'http://123.207.88.210/monitor/images/three/pointMap/hlgsbdt.jpg',
    name: 'xxxxxxx布点图',
    des: '布点图三',
    point: ['ZCL10', , 'ZCL10', 'ZCL10', 'ZCL10', 'ZCL10', 'ZCL10']
  },
];

@Form.create()
class BindPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      previewUrl: '',

      drawerVisible: false,
      previewVisible: false,
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
        <FormItem label="图片名称">
          {getFieldDecorator('type')(
            <Input placeholder="请输入布点图名称" style={{ width: '200px' }} />
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
            添加布点图
          </Button>
        </FormItem>
      </Form>
    );
  }
  render() {
    const columns = [
      {
        title: '图片',
        dataIndex: 'url',
        key: 'url',
        render: text => (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: text,
            },]}
            onPreview={_ => { this.setState({ previewVisible: 'true', previewUrl: text }) }}
          // onChange={this.handleChange}
          >
            {/* {fileList.length >= 8 ? null : uploadButton} */}
          </Upload>
        ),
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '描述',
        dataIndex: 'des',
        key: 'des',
      },
      {
        title: '测点',
        key: 'point',
        dataIndex: 'point',
        render: text => (
          <div>{text.join(', ')}</div>
        )
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

    return (
      <Fragment>
        <Card bordered={false}>
          {this.renderSimpleForm()}
          <Divider />
          <Table columns={columns} dataSource={data} />
        </Card>

        <AddPoint
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
        // queryDataSource={this.queryDataSource}
        />

        <Modal visible={this.state.previewVisible} footer={null} onCancel={_ => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewUrl} />
        </Modal>
      </Fragment>
    );
  }
}

export default BindPoint;