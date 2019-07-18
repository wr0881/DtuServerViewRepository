import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs, Icon, Input, Button, Checkbox, Row, Col, message } from 'antd';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';
import LoginContext from './loginContext';
import axios from '@/services/axios';
import router from 'umi/router';

class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => { },
    onSubmit: () => { },
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const params = new URLSearchParams();
        params.append('userName', values.username);
        params.append('password', values.password);
        axios.post(`/token/login`, params)
          .then(response => {
            console.log(response)
            let result = response.data
            if (result.code == 0) {
              console.log(result.data)
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + result.data;
              router.push('/server/youren');
            } else {
              message.warn(result.msg);
            }
          })
          .catch(function (error) {
            message.error(error);
            console.log(error);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Row>
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入账号' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="账号"
                size="large"
              />,
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
                size="large"
              />,
            )}
          </Form.Item>
        </Row>
        <Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', height: '40px', fontSize: '18px' }}>
              登录
          </Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
