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
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const data = [
  {
    key: '1',
    url: 'http://123.207.88.210/monitor/images/three/siteMap/dtx1.jpg',
    name: '图片一',
    des: '尾矿库项目现场图',
    type: '现场图'
  },
  {
    key: '2',
    url: 'http://123.207.88.210/monitor/images/three/siteMap/dtx.jpg',
    name: 'xxxxxxx图片',
    des: 'xxxxxx现场图',
    type: '现场图'
  },
  {
    key: '3',
    url: 'http://123.207.88.210/monitor/images/three/siteMap/dtx2.jpg',
    name: 'xxxxxxx布点图',
    des: '布点图',
    type: '布点图'
  },
];

@Form.create()
class BindImg extends Component {
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
        <FormItem label="图片类型">
          {getFieldDecorator('type')(
            <Select placeholder="请选择图片类型" style={{ width: '200px' }}>
              <Select.Option value="全部">全部</Select.Option>
              <Select.Option value="布点图">剖面图</Select.Option>
              <Select.Option value="现场图">现场图</Select.Option>
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
            添加图片
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
        title: '类型',
        key: 'type',
        dataIndex: 'type',
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

        <AddImg
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

@Form.create()
class AddImg extends Component {
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
        title="添加图片"
        width={720}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
      >
        <Form
          layout="vertical"
          hideRequiredMark
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="选择图片">
            <input
              ref={ref => { this.imgSelect = ref }}
              type="file"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files.item(0);
                if (file) {
                  const url = window.URL.createObjectURL(file);
                  this.setState({ imgUrl: url, imgFile: file });
                }
              }}
            />
            <div className={styles.addFile} onClick={_ => { this.imgSelect.click() }}>
              {this.state.imgUrl ?
                <img src={this.state.imgUrl} style={{ width: '100%', height: 'auto' }} alt="" />
                :
                <div style={{
                  width: '100%',
                  height: '62px',
                  textAlign: 'center',
                  color: '#999',
                }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div>Upload</div>
                </div>
              }
            </div>
          </Form.Item>
          <Form.Item label="图片名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入图片名称' }],
            })(<Input placeholder="示例: 1号布点图" />)}
          </Form.Item>
          <Form.Item label="图片类型">
            {getFieldDecorator('type', {
              initValue: 1,
              rules: [{ required: true, message: '请输入图片类型' }],
            })(
              <Select
                placeholder="请选择图片类型"
              >
                <Option key={2}>现场图</Option>
                <Option key={3}>剖面图</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="图片描述">
            {getFieldDecorator('dec', {
              rules: [{ required: true, message: '请输入图片描述' }],
            })(<TextArea placeholder="示例: 这是1号布点图" />)}
          </Form.Item>
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
      </Drawer >
    );
  }
}

export default BindImg;