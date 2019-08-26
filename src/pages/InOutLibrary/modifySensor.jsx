/* eslint-disable */
import React, { Component } from 'react';
import { handleModifySensor } from '@/services/in-out-library';
import { Modal, Col, Form, Input, InputNumber, Row, Select, DatePicker, message, } from 'antd';
import moment from 'moment';

const { Option } = Select;

@Form.create()
class modifySensor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            sensorStatusValue: ''
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
        //console.log(this.props.modifypass.sensorStatus);
        if(this.props.modifypass.sensorStatus === 1){
            this.setState({sensorStatusValue:'未使用'})
        }
        if(this.props.modifypass.sensorStatus === 2){
            this.setState({sensorStatusValue:'使用中'})
        }
        if(this.props.modifypass.sensorStatus === 3){
            this.setState({sensorStatusValue:'已损坏'})
        }
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
            if(err) return;
            
            const params = { 
                ...fieldsValue,
                productDate: fieldsValue.productDate.format('YYYY-MM-DD'),
                endDate: fieldsValue.endDate.format('YYYY-MM-DD'),
                sensorId:this.props.modifypass.key
            };
            //console.log('参数：',params);
            handleModifySensor(params).then(res => {
                const { code, data, msg } = res.data;               
                if(code === 0){
                    message.success('传感器编辑成功!');
                    this.props.handleUpdate();
                }else{
                    message.info(msg);
                }
            }).catch(err => {
                message.error('服务器错误',err);
            })
        });
        this.setState({
            visible: false
        });
    }

    render(){
        const formItemLayout = {
            labelCol: { sm: { span:8 }, xs: { span:24 }, style:{ lineHeight:2,textAlign:'center' }},
            wrapperCol: { sm: { span:16 }, xs: { span:24 } }
        }
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        return(
            <div style={{display:'inline-block'}}>
                <a onClick={this.handlePopup}>编辑</a>
                <Modal
                    title="修改传感器"
                    width='800px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                >
                    <Form 
                        layout="vertical" 
                        style={{textAlign:'right',paddingLeft:'30px',paddingRight:'60px'}}
                        hideRequiredMark
                        //onSubmit={this.handleSubmit}
                    >
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器编号" {...formItemLayout}>
                                    {getFieldDecorator('sensorNumber',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorNumber
                                    })(<Input style={{width:'210px'}} />)}                
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器地址" {...formItemLayout}>
                                    {getFieldDecorator('sensorAddress',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorAddress
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
                                <Form.Item label="传感器型号" {...formItemLayout}>
                                    {getFieldDecorator('sensorModel',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorModel
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器名称" {...formItemLayout}>
                                    {getFieldDecorator('sensorName',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorName
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器量程" {...formItemLayout}>
                                    {getFieldDecorator('sensorRange',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorRange
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器精度" {...formItemLayout}>
                                    {getFieldDecorator('sensorAccuracy',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.sensorAccuracy
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器标定系数K" {...formItemLayout}>
                                    {getFieldDecorator('timingFactor',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.timingFactor
                                    })(<InputNumber min={0} max={50} step={'0.01'} style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>
                        <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器状态" {...formItemLayout}>
                                    {getFieldDecorator('sensorStatus',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.state.sensorStatusValue
                                    })(
                                        <Select style={{width:'210px'}}>
                                            <Option value="1">未使用</Option>
                                            <Option value="2">使用中</Option>
                                            <Option value="3">已损坏</Option>
                                        </Select>
                                    )}
                                    
                                </Form.Item>                                
                            </Col>
                            <Col md={12} sm={24}>
                                <Form.Item label="出入库状态" {...formItemLayout}>
                                    {getFieldDecorator('inAndOutStatus',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        initialValue:this.props.modifypass.inAndOutStatus.replace(/\"/g, "")
                                    })(
                                        <Select style={{width:'210px'}}>
                                            <Option value="出库">出库</Option>
                                            <Option value="入库">入库</Option>
                                        </Select>
                                    )}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row> 
                        {/* <Row gutter={8}>
                            <Col md={12} sm={24}>
                                <Form.Item label="传感器ID" {...formItemLayout}>
                                    {getFieldDecorator('sensorId',{
                                        rules: [
                                            { required:true, message:'不允许为空' }
                                        ],
                                        //initialValue:this.props.modifypass.sensorAccuracy
                                    })(<Input style={{width:'210px'}} />)}
                                    
                                </Form.Item>                                
                            </Col>
                        </Row>  */}
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

    componentDidMount(){

    }
}

export default modifySensor;