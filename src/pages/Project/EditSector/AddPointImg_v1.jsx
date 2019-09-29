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
import AddPointInfo from './AddPointInfo';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class AddPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgUrl: '',
      imgFile: '',
      imgId: '',
    };
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        const imgFile = this.state.imgFile;
        let result = {
          sectorId: 173,
          type: values.type,
          imageName: values.name,
          description: values.dec,
        }

        let param = new FormData();
        param.append('img', imgFile);

        this.setState({ onPointImgSubmitLoading: true });
        axios.post(`/upload/uploadImage?sectorId=${result.sectorId}&type=${result.type}&imageName=${result.imageName}&description=${result.description}`, param).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            this.setState({ imgId: data });
          } else {
            message.info(msg);
          }
          this.setState({ onPointImgSubmitLoading: false });
        }).catch(err => {
          message.info(err);
          this.setState({ onPointImgSubmitLoading: false });
        });
      }
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="添加测点"
        width={1000}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
      >
        {/* 添加布点图操作 */}
        <div style={{ display: 'none' }}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="选择布点图">
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
                }} />
              <div className={styles.addFile} onClick={_ => { this.imgSelect.click() }}>
                {this.state.imgUrl ? <img src={this.state.imgUrl} style={{ width: '100%', height: '100%' }} alt="" /> :
                  <div className={styles.plus}>
                    <Icon type="plus" style={{ fontSize: '32px' }} />
                    <div>Upload</div>
                  </div>
                }
              </div>
            </Form.Item>
            <Form.Item label="图片名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入图片名称' }],
              })(<Input placeholder="示例: 1号布点图" style={{ width: '400px' }} />)}
            </Form.Item>
            <Form.Item label="图片类型">
              {getFieldDecorator('type', {
                initialValue: 1,
                rules: [{ required: true, message: '请输入图片类型' }],
              })(
                <Select
                  disabled
                  placeholder="请选择图片类型"
                  style={{ width: '400px' }}
                >
                  <Option value={1}>布点图</Option>
                  <Option value={2}>现场图</Option>
                  <Option value={3}>剖面图</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="图片描述">
              {getFieldDecorator('dec', {
                rules: [{ required: true, message: '请输入图片描述' }],
              })(<TextArea placeholder="示例: 这是1号布点图" style={{ width: '400px' }} />)}
            </Form.Item>
            <Form.Item>
              <Button type='primary' onClick={this.handleSubmit}>确定</Button>
            </Form.Item>
          </Form>
        </div>

        {/* 添加测点信息 */}
        <AddPointInfo />

        <div
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
          <Button type="primary">
            提交
          </Button>
        </div>
      </Drawer >
    );
  }
}

export default AddPoint;