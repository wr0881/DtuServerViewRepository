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
import { uploadImage } from '@/services/project';
import sectorModel from './sectorModel';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@observer
@Form.create()
class BindPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handlePointListVisible: false,
      handleAddImgVisible: false,
      previewVisible: false,

      PointImageList: [],

      getPointImageListLoading: false,
    };
  }

  handlePointListVisible = flag => {
    this.setState({ handlePointListVisible: flag });
  }

  handleAddImgVisible = flag => {
    this.setState({ handleAddImgVisible: flag });
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
        {/* <FormItem>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            // this.handleDrawerVisible(true);
          }}>
            添加布点图
          </Button>
        </FormItem> */}
      </Form>
    );
  }

  delectPointImage = id => {
    axios.delete('/monitorPoint/removeMonitorPointImage', {
      params: {
        sectorId: sectorModel.sectorId,
        imageId: id
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getPointImageList();
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

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
            <Popconfirm
              title="确定删除?"
              onConfirm={this.delectPointImage.bind(this, text.imageId)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          {/* {this.renderSimpleForm()}*/}
          <Button type='primary' onClick={_ => { this.handleAddImgVisible(true) }}>添加布点图</Button>
          <Divider />
          <Table loading={this.state.getPointImageListLoading} columns={columns} dataSource={this.state.PointImageList} />
        </Card>

        {/* 添加布点图 */}
        <AddImg
          visible={this.state.handleAddImgVisible}
          handleAddImgVisible={this.handleAddImgVisible}
          getPointImageList={this.getPointImageList}
        />

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
  getPointImageList = () => {
    this.setState({ getPointImageListLoading: true });
    axios.get('/image/listSectorPointImage', {
      params: {
        sectorId: sectorModel.sectorId
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        // console.log(data);
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

@Form.create()
class AddImg extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="布点图"
        width={420}
        onClose={_ => { this.props.handleAddImgVisible(false) }}
        visible={this.props.visible}
      >
        <form
          method="POST"
          target="form"
          enctype="multipart/form-data"
          action={`${window.uploadImgAddress}/upload/uploadImageList`}
        >
          <input
            type="file"
            name="image"
            multiple="multiple"
            accept=".jpg,.png"
          />
          <input style={{ display: 'none' }} type="input" name="sectorId" placeholder="子项目ID" value={sectorModel.sectorId}></input>
          <select style={{ display: 'none' }} name="type" value='1'>
            <option key={Math.random()} value="1">布点图</option>
            <option key={Math.random()} value="2">现场图</option>
            <option key={Math.random()} value="3">剖面图</option>
          </select>
          <div style={{ height: '30px' }}></div>
          <Button type='primary' htmlType='submit'>上传</Button>
        </form>
        <iframe name="form" id="form" style={{ display: 'none' }} onLoad={_ => {
          this.props.handleAddImgVisible(false);
          this.props.getPointImageList();
        }} ></iframe>
      </Drawer >
    );
  }
}

export default BindPoint;