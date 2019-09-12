/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message } from 'antd';
import { updateBasis } from '@/services/project'

const { Option } = Select;

@Form.create()
class modifyBasis extends Component {
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
                "monitoringBasis":this.props.modifypass.key
            };
            updateBasis(params).then(res => {
                const { code, data, msg } = res.data;
                if (code === 0) {
                    message.success('监测依据编辑成功!');
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
                    title="修改监测依据"
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
                        <Row gutter={8}>
                            <Col md={24} sm={24}>
                                <Form.Item label="文件编号" {...formItemLayout}>
                                    {getFieldDecorator('number', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^[a-zA-Z0-9/]+$|[a-zA-Z0-9/]+-+[\w]*[a-zA-Z0-9/]+$/,
                                                message: '只允许输入英文和数字,中间可以用‘-’符号',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.number
                                    })(<Input style={{ width: '210px' }} />)}

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={24} sm={24}>
                                <Form.Item label="文件名称" {...formItemLayout}>
                                    {getFieldDecorator('fileName', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                            {
                                                pattern: /^《+[a-zA-Z0-9\u4E00-\u9FA5]+》+$|《+[a-zA-Z0-9\u4E00-\u9FA5]+、+[\w]*[a-zA-Z0-9\u4E00-\u9FA5]+》+$/,
                                                message: '需要以书名号的方式录入。示例：《地下铁道工程施工及验收规范》',
                                            },
                                        ],
                                        initialValue: this.props.modifypass.fileName
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

export default modifyBasis;