/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message } from 'antd';
import { updateMemberInfo } from '@/services/project';

const { Option } = Select;

@Form.create()
class modifyMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            terminalStatusValue: ''
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
                memberId: this.props.modifypass.key
            };
            console.log(params);
            updateMemberInfo(params).then(res => {
                const { code, data, msg } = res.data;
                if (code === 0) {
                    message.success('人员编辑成功!');
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
            labelCol: { sm: { span: 4 }, xs: { span: 24 }, style: { lineHeight: 2, textAlign: 'left' } },
            wrapperCol: { sm: { span: 20 }, xs: { span: 24 } }
        }
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        return (
            <div style={{ display: 'inline-block' }}>
                <a onClick={this.handlePopup}>编辑</a>
                <Modal
                    title="修改人员信息"
                    width='480px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                >
                    <Form layout="vertical"
                        style={{ textAlign: 'right', paddingLeft: '40px', paddingRight: '40px' }}
                        hideRequiredMark
                        onSubmit={this.handleSubmit}
                    >
                        {/* <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="姓名" {...formItemLayout}>
                                    {getFieldDecorator('memberName', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                                                message: '只允许输入中文和英文',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.memberName
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row> */}
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="公司" {...formItemLayout}>
                                    {getFieldDecorator('memberCompany', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z\u4E00-\u9FA5]+$/,
                                                message: '只允许输入中文和英文',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.memberCompany
                                    })(<Input />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="邮箱" {...formItemLayout}>
                                    {getFieldDecorator('memberEmail', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/,
                                                message: '请输入正确的邮箱',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.memberEmail
                                    })(<Input />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="电话" {...formItemLayout}>
                                    {getFieldDecorator('memberPhone', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
                                                message: '请输入正确的电话',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.memberPhone
                                    })(<Input />)}

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

export default modifyMember;