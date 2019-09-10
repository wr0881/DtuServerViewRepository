/* eslint-disable */
import React, { Component } from 'react';
import { addMemberInfo } from '@/services/project';
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
import styles from './member.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class addMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMemberNum: [0],
      cancelMemberNum: [],
    };
  }

  // 添加人员提交
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue
      }
      addMemberInfo(values).then(res => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success('添加人员成功');
          this.props.handleDrawerAddMemberVisible(false);
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

  drawerAddMember = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div>
        <Drawer
          title="添加人员"
          width={360}
          onClose={_ => { this.props.handleDrawerAddMemberVisible(false) }}
          visible={this.props.drawerAddMemberVisible}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('memberName', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                        message: '只允许输入中文和英文',
                      },
                    ],
                  })(<Input placeholder="示例：人员名称" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="公司">
                  {getFieldDecorator('memberCompany', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                        message: '只允许输入中文和英文',
                      },
                    ],
                  })(<Input placeholder="示例：公司" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="邮箱">
                  {getFieldDecorator('memberEmail', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/,
                        message: '请输入正确的邮箱',
                      },
                    ],
                  })(<Input placeholder="示例：zdjc@qq.com" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="电话">
                  {getFieldDecorator('memberPhone', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
                        message: '请输入正确的电话',
                      },
                    ],
                  })(<Input placeholder="示例：电话" />)}
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
              <Button onClick={_ => { this.props.handleDrawerAddMemberVisible(false) }} style={{ marginRight: 8 }}>
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
      this.drawerAddMember()
    );
  }
}

export default addMember;