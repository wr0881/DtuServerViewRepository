import React, { Component, Fragment } from 'react';
import router from 'umi/router';
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
  Upload,
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
      confirmLoading: false,
      imgId: [],
      imgUrl: null,
      imgFile: null
    };
  }

  addImg = () => {
    this.setState({ uploadVisible: true });
  }

  deleteImgUrl = v => {
    // const { imgUrl } = this.state;
    // const index = imgUrl.findIndex(item => item === v);
    // imgUrl.splice(index, 1);
    // this.setState({ imgUrl });
    message.info('开发中');
  }

  onSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        const imgFile = this.state.imgFile;
        let result = {
          sectorId: projectState.sectorId,
          type: values.type,
          imageName: values.name,
          description: values.dec,
        }
        this.setState({ confirmLoading: true });
        uploadImage(imgFile, result).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            this.setState({ imgId: [...this.state.imgId, { url: this.state.imgUrl, id: data }], uploadVisible: false });
          } else {
            message.info(msg);
          }
          this.setState({ confirmLoading: false });
        }).catch(err => {
          message.info(err);
          this.setState({ confirmLoading: false });
        });
      }
    });
    /* 测试 */
    // this.setState({ imgId: [{ url: this.state.imgUrl, id: 241 }], uploadVisible: false });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div className={styles.disabled}>
        <div style={{ position: 'relative', paddingTop: '30px', minHeight: '500px' }}>
          {this.state.imgId.length ? null :
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
              <Button type="primary" onClick={this.addImg}>
                选择图片
              </Button>
            </Empty>
          }
          {this.state.imgId.map(v => {
            return <IndexInfo key={v.id} src={v.url} imgId={v.id} addImg={this.addImg} deleteImgUrl={this.deleteImgUrl} />
          })}

          {this.state.imgId.length > 0 ?
            <Button
              type="primary"
              style={{ position: 'absolute', right: '0px', bottom: '0px' }}
              onClick={_ => {
                router.push('/project/add-project/result');
              }}
            >
              下一步
            </Button>
            : null
          }
        </div>

        <Modal
          title="上传布点图"
          visible={this.state.uploadVisible}
          onOk={this.onSubmit}
          onCancel={_ => { this.setState({ uploadVisible: false }) }}
          confirmLoading={this.state.confirmLoading}
          okText="确认"
          cancelText="取消"
        >
          <Form>
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
                }} />
              <div className={styles.addFile} onClick={_ => { this.imgSelect.click() }}>
                {this.state.imgUrl ? <img src={this.state.imgUrl} style={{ width: '100%', height: 'auto' }} alt="" /> :
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
              })(<TextArea placeholder="示例: 这是1号布点图" />)}
            </Form.Item>
          </Form>
        </Modal>

        {/* <Divider style={{ margin: '40px 0 24px' }} />
        <div>
          <h4>易大师</h4>
          <p>
            无极之道，在我内心延续。 In me, Wuju lives on.
          </p>
        </div> */}
      </div>
    );
  }
}

export default AddSectorInfo;