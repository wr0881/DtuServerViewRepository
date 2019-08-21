/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { handleModifyTerminal,getTerminalType } from '@/services/in-out-library';

const { Option } = Select;

@Form.create()
class modifyTerminal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            terminalType: [],
            terminalStatusValue: ''
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
        this.terminalType();
        //console.log(this.props.modifypass.terminalStatus);
        if(this.props.modifypass.terminalStatus === 1){
            this.setState({terminalStatusValue:'未使用'})
        }
        if(this.props.modifypass.terminalStatus === 2){
            this.setState({terminalStatusValue:'使用中'})
        }
        if(this.props.modifypass.terminalStatus === 3){
            this.setState({terminalStatusValue:'已损坏'})
        }
    }
    handleOkOrCancel() {
        this.setState({
            visible: false
        })
    }

    terminalType() {
        getTerminalType().then(res => {
          const { code, data } = res.data;
          if(code === 0){
            this.setState({terminalType:res.data.data});
          }
        })
    }
    //确定
    handleSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if(err) return;
            
            const params = { 
                ...fieldsValue,
                key:this.props.modifypass.key,
                //connectStatus: true,
            };
            handleModifyTerminal(params).then(res => {
                const { code, data, msg } = res.data;               
                if(code === 0){
                    message.success('终端编辑成功!');
                    this.props.handleUpdate();
                }else{
                    message.info(msg);
                }
            }).catch(err => {
                message.error('服务器错误',err);
            })

            this.setState({
                formValues:params
            })
        })
        this.handleOkOrCancel();
    }

    render(){
        const formItemLayout = {
            labelCol: { sm: { span:8 }, xs: { span:24 }, style:{ lineHeight:2,textAlign:'center' } },
            wrapperCol: { sm: { span:16 }, xs: { span:24 } }
        }
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        return(
            <div style={{display:'inline-block'}}>
                <a onClick={this.handlePopup}>编辑</a>
                <Modal
                    title="修改终端"
                    width='800px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                >
                    <Form layout="vertical"
                        style={{textAlign:'right',paddingLeft:'30px',paddingRight:'60px'}}
                        hideRequiredMark
                    >
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端编号" {...formItemLayout}>
                                    {getFieldDecorator('terminalNumber',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.terminalNumber
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端名称" {...formItemLayout}>
                                    {getFieldDecorator('terminalName',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.terminalName
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row> 
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="厂家" {...formItemLayout}>
                                    {getFieldDecorator('manufacturer',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.manufacturer
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端类型" {...formItemLayout}>
                                    {getFieldDecorator('terminalType', {
                                        rules: [
                                            { required: true, message: '不允许为空' },
                                        ],
                                        initialValue:this.props.modifypass.terminalType
                                        //initialValue:
                                    })(
                                        <Select
                                            showSearch
                                            style={{width:'210px'}}
                                        >
                                            {this.state.terminalType.map(v => {
                                                return <Option key={v.index} value={v.value}>{v.value}</Option>
                                            })}
                                        </Select>
                                    )}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端型号" {...formItemLayout}>
                                    {getFieldDecorator('terminalModel',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.terminalModel
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="电压" {...formItemLayout}>
                                    {getFieldDecorator('voltage',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.voltage
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="通道数" {...formItemLayout}>
                                    {getFieldDecorator('channelNumber',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.channelNumber
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="采集频率" {...formItemLayout}>
                                    {getFieldDecorator('collectionFrequency',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.collectionFrequency
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="终端状态" {...formItemLayout}>
                                    {getFieldDecorator('terminalStatus',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.state.terminalStatusValue
                                    })(
                                        <Select style={{width:'210px'}}>
                                            <Option value="1">未使用</Option>
                                            <Option value="2">使用中</Option>
                                            <Option value="3">已损坏</Option>
                                        </Select>
                                    )}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>  
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="生产日期" {...formItemLayout}>
                                    {getFieldDecorator('productDate',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:moment(this.props.modifypass.productDate)
                                    })(<DatePicker style={{ width:'210px' }} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="结束日期" {...formItemLayout}>
                                    {getFieldDecorator('endDate',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:moment(this.props.modifypass.endDate)
                                    })(<DatePicker style={{ width:'210px' }} />)}
                                     
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

export default modifyTerminal;