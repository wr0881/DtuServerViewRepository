import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  Modal,
  message,
  Spin,
  Empty,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Tabs,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import debounce from 'lodash/debounce';
import IndexInfo from './AddIndexInfo';
import ImgMark from '@/components/ImgMark/ImgMark';
import projectState from './project';
import { uploadImage } from '@/services/project';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

@observer
@Form.create()
class AddSectorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadVisible: false,
      imgUrl: []
    };
  }

  addImgUrl = (file, url) => {
    console.log(url);
    // const body = {
    //   projectId: projectState.projectId,
    //   img: file
    // }
    // uploadImage(body).then(res => {
    //   const { code, msg, data } = res.data;
    //   if (code === 0) {

    //   } else {
    //     message.info('测点图上传失败: ' + msg);
    //   }
    // }).catch(err => {
    //   message.info('测点图上传失败: ' + err);
    // })
    this.setState({ imgUrl: [...this.state.imgUrl, url] });
  }

  deleteImgUrl = v => {
    const { imgUrl } = this.state;
    const index = imgUrl.findIndex(item => item === v);
    imgUrl.splice(index, 1);
    this.setState({ imgUrl });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div className={styles.disabled}>
        <div style={{ paddingTop: '30px', minHeight: '500px' }}>
          {this.state.imgUrl.length ? null :
            <Empty
              image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
              imageStyle={{
                height: 60,
              }}
              description={
                <span>
                  请先选择布点图
                </span>
              }
            >
              {/* <input
                ref={ref => { this.imgSelect = ref }}
                type="file"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files.item(0);
                  if (file) {
                    const url = window.URL.createObjectURL(file);
                    this.addImgUrl(file, url);
                  }
                }} />
              <Button type="primary" onClick={_ => { this.imgSelect.click() }}>
                选择图片
              </Button> */}
              <Button type="primary" onClick={_ => { this.setState({ uploadVisible: true }) }}>
                选择图片
              </Button>
            </Empty>
          }
          {this.state.imgUrl.map((v, i) => {
            return <IndexInfo key={i} src={v} addImgUrl={this.addImgUrl} deleteImgUrl={this.deleteImgUrl} />
          })}
        </div>

        <Modal
          title="上传布点图"
          visible={this.state.uploadVisible}
          // onOk={this.handleOk}
          onCancel={_ => { this.setState({ uploadVisible: false }) }}
          okText="确认"
          cancelText="取消"
        >
          <Form >
            <Form.Item label="选择图片">
              {/* {getFieldDecorator('dec', {
                rules: [{ required: true, message: '请输入图片描述' }],
              })(<Input placeholder="示例: 这是1号布点图" />)} */}
              <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
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
                  <Option key={1}>布点图</Option>
                  <Option key={2}>现场图</Option>
                  <Option key={3}>剖面图</Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="图片描述">
              {getFieldDecorator('dec', {
                rules: [{ required: true, message: '请输入图片描述' }],
              })(<Input placeholder="示例: 这是1号布点图" />)}
            </Form.Item>
          </Form>
        </Modal>

        <Divider style={{ margin: '40px 0 24px' }} />
        <div>
          <h4>易大师</h4>
          <p>
            无极之道，在我内心延续。 In me, Wuju lives on.
          </p>
        </div>
      </div>
    );
  }
}

export default AddSectorInfo;