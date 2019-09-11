import React, { Component, Fragment } from 'react';
import axios from 'axios';
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
import PointList from './PointList';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
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

@observer
@Form.create()
class BindPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlePointListVisible: false,
      previewVisible: false,

      PointImageList: [],

      getPointImageListLoading: false,
    };
  }

  handlePointListVisible = flag => {
    this.setState({ handlePointListVisible: flag });
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
            // this.handleDrawerVisible(true);
          }}>
            添加布点图
          </Button>
        </FormItem>
      </Form>
    );
  }

  delectPointImage = id => {
    // axios.delete('/monitorPoint/removeMonitorPointImage', {
    //   params: {
    //     sectorId: sectorModel.sectorId,
    //     imageId: id
    //   }
    // }).then(res => {
    //   const { code, msg, data } = res.data;
    //   if (code === 0) {
    //     message.info('删除成功');
    //   }
    // })
    message.info(`删除${id}布点图`);
  }

  render() {
    const columns = [
      {
        title: '图片',
        dataIndex: 'imageUrl',
        key: 'url',
        render: text => (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: window.imgAddress + text,
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
        dataIndex: 'imageName',
        key: 'name',
      },
      {
        title: '图片描述',
        dataIndex: 'imageDes',
        key: 'des',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              this.handlePointListVisible(true);
              sectorModel.selectImageId = text.imageId;
            }}>详情</a>
            <Divider type="vertical" />
            <a onClick={this.delectPointImage.bind(this, text.imageId)}>删除</a>
            <Divider type="vertical" />
            <a>替换</a>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          {this.renderSimpleForm()}
          <Divider />
          <Table loading={this.state.getPointImageListLoading} columns={columns} dataSource={this.state.PointImageList} />
        </Card>

        {/* 添加布点图 */}

        {/* 布点图测点信息 */}
        <PointList
          visible={this.state.handlePointListVisible}
          handlePointListVisible={this.handlePointListVisible}
        />

        <Modal visible={this.state.previewVisible} footer={null} onCancel={_ => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={window.imgAddress + this.state.previewUrl} />
        </Modal>
      </Fragment>
    );
  }
  componentDidMount() {
    this.getPointImageList();
  }
  getPointImageList() {
    this.setState({ getPointImageListLoading: true });
    axios.get('/image/listMonitorPointImage', {
      params: {
        sectorId: sectorModel.sectorId
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        console.log(data);
        this.setState({ PointImageList: data });
      } else {
        this.setState({ PointImageList: [] });
      }
      this.setState({ getPointImageListLoading: false });
    }).catch(err => {
      this.setState({ PointImageList: [] });
      this.setState({ getPointImageListLoading: false });
      console.log(err);
    });
  }
}

export default BindPoint;