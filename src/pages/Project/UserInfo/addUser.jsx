/* eslint-disable */
import React, { Component } from 'react';
import { addUserInfo } from '@/services/project';
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
import styles from './userinfo.less';
import axios from '@/services/axios'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@Form.create()
class addUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addUserNum: [0],
      cancelUserNum: [],
    };
  }
  
  //验证用户唯一性
  userRules = (rule, value ,callback) => {
    //console.log(value);
    this.setState({
      userName:value
    },() => {
      this.nameChange(callback);
    })
    
  }
  nameChange = (callback) => {
    axios.get('/user/checkOnlyUser',{params:{userName: this.state.userName}}).then(res =>{
      const { code, msg, data } = res.data;
      //console.log(data,msg);
      if(data === false){
        callback(msg)
      }else{
        callback()
      }
    })
  }

  // 添加用户提交
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        "status": true,
      }
      console.log(values);
      addUserInfo(values).then(res => {
        const { code, msg } = res.data;
        if (code === 0) {
          message.success('添加用户成功');
          this.props.handleDrawerAddUserVisible(false);
          this.props.queryDataSource(false);
        } else {
          message.info(msg);
        }
      }).catch(err => {
        message.error(err);
      })

      // this.setState({
      //   formValues: values,
      // }, _ => { this.queryDataSource() });
    });
  };

  drawerAddUser = () => {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return (
      <div>
        <Drawer
          title="添加用户"
          width={360}
          onClose={_ => { this.props.handleDrawerAddUserVisible(false) }}
          visible={this.props.drawerAddUserVisible}
          destroyOnClose
        >
          <Form
            layout="vertical"
            //hideRequiredMark
            onSubmit={this.handleSubmit}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="账号">
                  {getFieldDecorator('userName', {
                    rules: [
                      { validator: this.userRules },
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z]+$|^[a-zA-Z]+_+[\w]*[a-zA-Z]+$/,
                        message: '只允许输入英文，只支持下划线‘_’一种特殊符号，且下划线不允许出现在第一个和最后一个。',
                      },
                    ],
                  })(<Input placeholder="示例：账号" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="密码">
                  {getFieldDecorator('password', {
                    rules: [
                      { required: true, message: '不允许为空' },
                    ],
                  })(<Input.Password placeholder='请设置您的密码' className="formInput" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="电话">
                  {getFieldDecorator('phone', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
                        message: '请输入正确的电话',
                      },
                    ],
                  })(<Input placeholder="示例：电话" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="邮箱">
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/,
                        message: '请输入正确的邮箱',
                      },
                    ],
                  })(<Input placeholder="示例：邮箱" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="公司">
                  {getFieldDecorator('company', {
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
                <Form.Item label="真实姓名">
                  {getFieldDecorator('realName', {
                    rules: [
                      { required: true, message: '不允许为空' },
                      {
                        pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                        message: '只允许输入中文和英文',
                      },
                    ],
                  })(<Input placeholder="示例：真实姓名" />)}
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
              <Button onClick={_ => { this.props.handleDrawerAddUserVisible(false) }} style={{ marginRight: 8 }}>
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
      this.drawerAddUser()
    );
  }
}

export default addUser;