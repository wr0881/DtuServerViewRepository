/* eslint-disable */
import React, { Component } from 'react';
import { addBasisInfo } from '@/services/project'
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  message,
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
} from 'antd';
import styles from './monitorbasis.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class addBasis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addBasisNum: [0],
      cancelBasisNum: [],
    };
  }

  // 添加用户提交
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      }
      addBasisInfo(values).then(res => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success('添加监测依据成功');
          this.props.handleDrawerAddBasisVisible(false);
          this.props.queryDataSource(false);
        } else {
          console.log(res.msg);
          message.info(msg);
        }
      }).catch(err => {
        message.error(err);
      })
    });
  };

  drawerAddBasis = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div>
        <Drawer
          title="添加监测依据"
          width={360}
          onClose={_ => { this.props.handleDrawerAddBasisVisible(false) }}
          visible={this.props.drawerAddBasisVisible}
          destroyOnClose
        >
          <Form
            layout="vertical"
            //hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="文件编号">
                  {getFieldDecorator('number', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z0-9\u4E00-\u9FA5\[\]/]+$|[a-zA-Z0-9\u4E00-\u9FA5\[\]]+-+[\w]*[a-zA-Z0-9\u4E00-\u9FA5\[\]]+$/,
                        message: '只允许输入中文、英文和数字,中间可以用‘-’符号',
                      },
                    ],
                  })(<Input placeholder="文件编号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="文件名称">
                  {getFieldDecorator('fileName', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z0-9\u4E00-\u9FA5\《\》]+$|[a-zA-Z0-9\u4E00-\u9FA5\《]+、+[\w]*[a-zA-Z0-9\u4E00-\u9FA5\》]+$/,
                        message: '需要以书名号的方式录入。示例：《地下铁道工程施工及验收规范》',
                      },
                    ],
                  })(<Input placeholder="文件名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="文件状态">
                  {getFieldDecorator('fileStatus', {
                    rules: [{ required: true, message: '不允许为空' }],
                    initialValue: '无',
                  })(
                    <Select>
                      <Option value='无'>无</Option>
                      <Option value='作废'>作废</Option>
                      <Option value='运行'>运行</Option>
                      <Option value='试运行'>试运行</Option>
                    </Select>
                  )}
                </Form.Item>
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
              <Button onClick={_ => { this.props.handleDrawerAddBasisVisible(false) }} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType='submit'>
                提交
              </Button>
            </div>
          </Form>
        </Drawer>
      </div >
    );
  }

  render() {
    return (
      this.drawerAddBasis()
    );
  }
}

export default addBasis;