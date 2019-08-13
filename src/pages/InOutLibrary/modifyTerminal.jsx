/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, } from 'antd';

const { Option } = Select;

class modifyTerminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
    }
    handleOkOrCancel() {
        this.setState({
            visible: false
        })
    }
    render(){
        const formItemLayout = {
            labelCol: { sm: { span:8 }, xs: { span:24 } },
            wrapperCol: { sm: { span:16 }, xs: { span:24 } }
        }
        const formItemLayout1 = {
            labelCol: { sm: { span:5 }, xs: { span:24 } },
            wrapperCol: { sm: { span:19 }, xs: { span:24 } }
        }
        const formItemLayout2 = {
            labelCol: { sm: { span:11 }, xs: { span:24 } },
            wrapperCol: { sm: { span:13 }, xs: { span:24 } }
        }
        return(
            <div style={{display:'inline-block'}}>
                <a onClick={this.handlePopup}>编辑</a>
                <Modal
                    title="修改终端"
                    width='800px'
                    visible={this.state.visible}
                    onOk={this.handleOkOrCancel}
                    onCancel={this.handleOkOrCancel}
                >
                    <Form layout="inline" style={{textAlign:'right',paddingLeft:'30px',paddingRight:'60px'}}>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端编号" {...formItemLayout}>
                                    <Input defaultValue={this.props.modifypass.terminalNumber} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端名称" {...formItemLayout}>
                                    <Input defaultValue={this.props.modifypass.terminalName} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                        </Row> 
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="厂家" {...formItemLayout1}>
                                    <Input defaultValue={this.props.modifypass.manufacturer} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端类型" {...formItemLayout}>
                                    <Input defaultValue={this.props.modifypass.terminalType} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端型号" {...formItemLayout}>
                                    <Input defaultValue={this.props.modifypass.terminalModel} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="电压" {...formItemLayout1}>
                                    <Input defaultValue={this.props.modifypass.voltage} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="通道数" {...formItemLayout1}>
                                    <Input defaultValue={this.props.modifypass.channelNumber} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="采集频率" {...formItemLayout}>
                                    <Input defaultValue={this.props.modifypass.collectionFrequency} style={{width:'140px'}} />
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端状态" {...formItemLayout}>
                                    <Select defaultValue={this.props.modifypass.terminalStatus} style={{width:'140px'}}>
                                        <Option value="1">未使用</Option>
                                        <Option value="2">使用中</Option>
                                        <Option value="3">已损坏</Option>
                                    </Select>
                                </Form.Item>                                
                            </Col>
                        </Row>  
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="生产日期" {...formItemLayout}>
                                    <DatePicker style={{ width:'180px' }} placeholder={this.props.modifypass.productDate} />
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="结束日期" {...formItemLayout}>
                                    <DatePicker style={{ width:'180px' }} placeholder={this.props.modifypass.endDate} /> 
                                </Form.Item>                                
                            </Col>
                        </Row>                    
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default modifyTerminal;