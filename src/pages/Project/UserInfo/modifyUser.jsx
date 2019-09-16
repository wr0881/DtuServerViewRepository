/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message } from 'antd';
import { updateUser} from '@/services/project';

const { Option } = Select;

@Form.create()
class modifyUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
        //this.terminalType();
    }
    handleOkOrCancel() {
        this.setState({
            visible: false
        })
    }

    //确定
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const params = {
                ...fieldsValue,
                "userId":this.props.modifypass.key
            };
            updateUser(params).then(res => {
                const { code, data, msg } = res.data;
                if (code === 0) {
                    message.success('用户编辑成功!');
                    this.props.handleUpdate();
                } else {
                    message.info(msg);
                }
            }).catch(err => {
                message.error(err);
            })

            this.setState({
                formValues: params
            })
        })
        this.handleOkOrCancel();
    }

    render() {
        const formItemLayout = {
            labelCol: { sm: { span: 8 }, xs: { span: 24 }, style: { lineHeight: 2, textAlign: 'center' } },
            wrapperCol: { sm: { span: 16 }, xs: { span: 24 } }
        }
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        return (
            <div style={{ display: 'inline-block' }}>
                <a onClick={this.handlePopup}>编辑</a>
                <Modal
                    title="修改用户信息"
                    width='480px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                >
                    <Form layout="vertical"
                        style={{ textAlign: 'right', paddingLeft: '30px', paddingRight: '60px' }}
                        hideRequiredMark
                        onSubmit={this.handleSubmit}
                    >
                        {/* <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="用户名" {...formItemLayout}>
                                    {getFieldDecorator('userName', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            
                                        ],
                                        initialValue: this.props.modifypass.userName
                                    })(<Input style={{ width: '210px' }} disabled />)}

                                </Form.Item>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md={24} sm={24}>
                                <Form.Item label="电话" {...formItemLayout}>
                                    {getFieldDecorator('phone', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/,
                                                message: '请输入正确的电话',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.phone
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="邮箱" {...formItemLayout}>
                                    {getFieldDecorator('email', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/,
                                                message: '请输入正确的邮箱',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.email
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24} sm={24}>
                                <Form.Item label="公司" {...formItemLayout}>
                                    {getFieldDecorator('company', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                                                message: '只允许输入中文和英文',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.company
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="真实姓名" {...formItemLayout}>
                                    {getFieldDecorator('realName', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                                                message: '只允许输入中文和英文',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.realName
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
    componentDidMount() {
    }
}

export default modifyUser;