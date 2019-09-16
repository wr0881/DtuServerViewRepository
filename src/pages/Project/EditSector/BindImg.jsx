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
  Upload,
  Spin
} from 'antd';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class BindImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      previewUrl: '',

      drawerVisible: false,
      handleEditImageVisible: false,
      handleEditImageInfoVisible: false,
      handleDeleteImageVisible: false,
      previewVisible: false,

      ImageList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
      },

      getImageListLoading: false,
    };
  }

  handleDrawerVisible = flag => {
    this.setState({ drawerVisible: flag });
  }

  handleEditImageVisible = flag => {
    this.setState({ handleEditImageVisible: flag });
  }

  handleDeleteImageVisible = flag => {
    this.setState({ handleDeleteImageVisible: flag });
  }

  handleEditImageInfoVisible = flag => {
    this.setState({ handleEditImageInfoVisible: flag });
  }

  handleTableChange(pagination) {
    this.setState({ pagination }, this.getImageList.bind(this));
  }

  deleteImage = id => {
    axios.delete(`/image/removeImages?imageListId=${id}`).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getImageList();
      }
    })
  }

  handleSearch = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        this.getImageList(values.type);
      }
    });
  }

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
      <Form layout="inline">
        <FormItem label="图片类型">
          {getFieldDecorator('type')(
            <Select placeholder="请选择图片类型" style={{ width: '200px' }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="1">布点图</Select.Option>
              <Select.Option value="2">现场图</Select.Option>
              <Select.Option value="3">剖面图</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={this.handleSearch}>
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
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        render: text => (
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={[{
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: `${window.imgAddress}${text}?time=${new Date().toString(32)}`
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
        key: 'imageName',
      },
      {
        title: '描述',
        dataIndex: 'imageDes',
        key: 'imageDes',
      },
      {
        title: '类型',
        key: 'imageType',
        dataIndex: 'imageType',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              sectorModel.selectImageListId = text.imageListId
              this.setState({ handleEditImageVisible: true });
            }}>替换</a>
            <Divider type="vertical" />
            <a onClick={_ => {
              sectorModel.selectImageListId = text.imageListId
              this.setState({ handleEditImageInfoVisible: true });
            }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={_ => {
                this.deleteImage(text.imageListId);
              }}
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
          {this.renderSimpleForm()}
          <Divider />
          <Table loading={this.state.getImageListLoading} dataSource={this.state.ImageList} columns={columns} pagination={{ ...this.state.pagination }} onChange={this.handleTableChange.bind(this)} />
        </Card>

        <AddImg
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
          getImageList={this.getImageList}
        />

        <EditImage
          visible={this.state.handleEditImageVisible}
          handleEditImageVisible={this.handleEditImageVisible}
          getImageList={this.getImageList}
        />

        <EditImageInfo
          visible={this.state.handleEditImageInfoVisible}
          handleEditImageInfoVisible={this.handleEditImageInfoVisible}
          getImageList={this.getImageList}
        />

        <Modal visible={this.state.previewVisible} footer={null} onCancel={_ => { this.setState({ previewVisible: false }) }}>
          <img alt="example" style={{ width: '100%' }} src={window.imgAddress + this.state.previewUrl} />
        </Modal>
      </Fragment>
    );
  }
  componentDidMount() {
    this.getImageList();
  }
  getImageList = (type) => {
    const { pagination } = this.state;
    this.setState({ getImageListLoading: true });
    axios.get('/image/listImage', {
      params: {
        sectorId: sectorModel.sectorId,
        imageType: type,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
        this.setState({ ImageList: data.list });
      } else {
        this.setState({ ImageList: [] });
      }
      this.setState({ getImageListLoading: false });
    }).catch(err => {
      this.setState({ ImageList: [] });
      this.setState({ getImageListLoading: false });
      console.log(err);
    });
  }
}

@Form.create()
class AddImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgFile: ''
    };
  }

  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let type = values.type;
        let image = this.state.imgFile;
        axios.post(`${window.uploadImgAddress}/upload/uploadImageListLoca`, {
          params: {
            sectorId: sectorModel.sectorId,
            type,
            image
          }
        }).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('添加成功');
            // this.props.getBenchmarkList();
            this.props.handleSubmit();
            this.props.handleDrawerVisible(false);
          }
        })
        console.log(image);
      }
    });
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
        {/* <Form
          layout="vertical"
          hideRequiredMark
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
                <img src={this.state.imgUrl} style={{ width: '100%', height: '100%' }} alt="" />
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
          <Form.Item label="图片类型">
            {getFieldDecorator('type', {
              initValue: 1,
              rules: [{ required: true, message: '请输入图片类型' }],
            })(
              <Select
                placeholder="请选择图片类型"
              >
                <Option key={1}>布点图</Option>
                <Option key={2}>现场图</Option>
                <Option key={3}>剖面图</Option>
              </Select>
            )}
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
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form> */}
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
          <input style={{ display: 'none' }} type="input" name="sectorId" placeholder="区间ID" value={sectorModel.sectorId}></input>
          <select name="type">
            {/* <option value="1">布点图</option> */}
            <option value="2">现场图</option>
            <option value="3">剖面图</option>
          </select>
          <button type="submit">上传</button>
        </form>
        <iframe
          name="form"
          style={{ display: 'none' }}
          onLoad={_ => {
            this.props.handleDrawerVisible(false);
            this.props.getImageList();
          }} />
      </Drawer>
    );
  }
}

@Form.create()
class EditImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="替换图片"
        width={720}
        onClose={_ => { this.props.handleEditImageVisible(false) }}
        visible={this.props.visible}
      >
        <form
          method="POST"
          target="form"
          enctype="multipart/form-data"
          action={`${window.uploadImgAddress}/upload/updateImage`}
        >
          <input
            type="file"
            name="img"
            accept=".jpg,.png"
          />
          <input style={{ display: 'none' }} type="input" name="imageListId" placeholder="图片ListID" value={sectorModel.selectImageListId}></input>
          <button type="submit">上传</button>
        </form>
        <iframe
          name="form"
          style={{ display: 'none' }}
          onLoad={_ => {
            this.props.handleEditImageVisible(false);
            this.props.getImageList();
          }} />
      </Drawer >
    );
  }
}

@Form.create()
class EditImageInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgFile: ''
    };
  }

  handleSubmit = e => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        axios.put(`/image/updateImageInfo?imageListId=${sectorModel.selectImageListId}&imageName=${values.imageName}&imageDes=${values.imageDes}`).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            message.info('编辑成功');
            this.props.getImageList();
            this.props.handleEditImageInfoVisible(false);
          }
        })
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="编辑图片信息"
        width={720}
        onClose={_ => { this.props.handleEditImageInfoVisible(false) }}
        visible={this.props.visible}
      >
        <Form
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="图片名称">
                {getFieldDecorator('imageName')(
                  <Input placeholder="请输入图片名称" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="图片描述">
                {getFieldDecorator('imageDes')(
                  <Input placeholder="请输入图片描述" />
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
            <Button type="primary" onClick={this.handleSubmit}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer >
    );
  }
}

export default BindImg;