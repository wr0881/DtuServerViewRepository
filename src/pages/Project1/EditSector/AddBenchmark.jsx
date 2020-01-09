import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { autorun, toJS } from 'mobx';
import {
    Row,
    Col,
    Table,
    Badge,
    Divider,
    Switch,
    Alert,
    Drawer,
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
    Modal,
    Popconfirm,
    message,
    Tag,
    Avatar,
    Upload,
    Spin
} from 'antd';
import PointList from './PointList';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';

import { addBenchmark, getBenchmark, deleteBenchmark, listMonitorType, editBenchmark } from '@/services/project';

const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class AddBenchmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addBenchmarkNum: [0],
            visible: false,

            // pagination: {
            //     current: 1,
            //     pageSize: 10,
            //     size: 'midden',
            //     total: 0,
            //     showSizeChanger: true,
            //     showQuickJumper: true
            // },
            listMonitorType: [],
            listMonitorTypeLoading: false,

            handleEditBenchmarkVisible: false,
            getBenchmarkListLoading: false,
            modifyRecordVisible: false,

            benchmarkList: []
        };
    }

    //获取指标
    listMonitorType = () => {
        this.setState({ listMonitorTypeLoading: true });
        listMonitorType().then(res => {
            const { code, data, msg } = res.data;
            if (code === 0) {
                this.setState({ listMonitorType: data });
            } else {
                console.log(msg);
            }
            this.setState({ listMonitorTypeLoading: false });
        }).catch(err => {
            console.log(err);
            this.setState({ listMonitorTypeLoading: false });
        })
    }

    handleSubmit = e => {
        e.preventDefault();    
        const { dispatch, form } = this.props;    
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const data = [];
            for(name in fieldsValue){
                const [k2,iStr] =  name.split("_");
                const index = parseInt(iStr);
                if(!data[index]){
                    data[index] = {}
                }
                data[index][k2] = fieldsValue[name];
                if(k2 === 'updateTime'){
                    data[index][k2] = fieldsValue[name].format('YYYY-MM-DD HH:mm:ss');
                }
            }
            
            const sectorId = sectorModel.sectorId;
            addBenchmark(sectorId,data).then(res => {
                const { code,msg,data } = res.data;
                if(code === 0) {
                    this.setState({visible:false});
                    this.getBenchmarkList();
                }
            })
        });
    };

    getBenchmarkList = () => {
        //this.setState({ getBenchmarkListLoading: true });
        //const { pagination } = this.state;
        const sectorId = sectorModel.sectorId;
        getBenchmark(sectorId).then(res => {
            const { code,msg,data } = res.data;
            if(code === 0) {
                this.setState({ benchmarkList:data });
            }else{
                this.setState({ benchmarkList:[] })
            }
        }).catch(err => {
            console.log(err);
        }) 
        console.table(this.state.benchmarkList);
    }

    deleteBenchmark = id => {
        const param = {
            id: id
        }
        deleteBenchmark(id).then(res => {
            const {code,msg,data} = res.data;
            if(code === 0){
                message.info('删除成功!');
                this.getBenchmarkList();
            }else{
                message.error('删除失败!');
            }
        })
    }

    handleEditBenchmarkVisible = flag => {
        this.setState({ handleEditBenchmarkVisible: flag });
    }
    modifyRecordVisible = flag => {
        this.setState({ modifyRecordVisible: flag });
    }

    render() {
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        const columns = [
            {
                title: '监测项目',
                dataIndex: 'monitorTypeName',
            },
            {
                title: '点号',
                dataIndex: 'benchmarkNumber',
            },
            {
                title: '测量值',
                dataIndex: 'measuredValue',
            },
            {
                title: '上传时间',
                dataIndex: 'updateTime',
            },
            {
                title: '操作',
                dataIndex: 'action',
                render: (text,record) => (
                    <span>
                        <a onClick={_ => {
                            this.setState({ editValue: record });
                            this.handleEditBenchmarkVisible(true);
                        }}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="确定删除?"
                            onConfirm={this.deleteBenchmark.bind(this,record.id)}
                            okText="是"
                            cancelText="否"
                        >
                            <a>删除</a>
                        </Popconfirm>
                        <Divider type="vertical" />
                        <a onClick={_ => {
                            this.setState({showModifyRecordValue:record});
                            this.modifyRecordVisible(true);
                        }}>修改记录</a>
                    </span>
                )
            }
        ]
        return (
            <Fragment>
                {this.state.visible === false ? (
                  <Card bordered={false}>
                  <Button type='primary' onClick={_ => { this.setState({visible:true}); }}>基准点添加</Button>
                  <Divider />
                  <Table
                      loading={this.state.getBenchmarkListLoading}
                      columns={columns}
                      dataSource={this.state.benchmarkList}
                      // pagination={this.state.pagination}
                      // onChange={(pagination) => {
                      //     this.setState({pagination});
                      // }}
                  />
              </Card>
                ) : (
                  <Card bordered={false}>
                    <div style={{
                        width: '100%',
                        //height: '500px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Form
                        layout="vertical"
                        hideRequiredMark
                        onSubmit={
                            this.handleSubmit
                            //_ => {this.setState({visible:true});this.getBenchmarkList();}
                        }
                        style={{width:'1200px'}}
                    >
                        {this.state.addBenchmarkNum.map(i => {
                            if(i !== undefined) {
                                return (
                                    <Row gutter={24} key={i}>
                                        <Col span={4}>
                                            <FormItem label={i > 0 ? '' : '监测项目'}>
                                                {getFieldDecorator(`monitorType_${i}`,{
                                                    rules:[
                                                        { required: true, message: '不允许为空' }
                                                    ]
                                                })(
                                                    <Select
                                                        style={{ width: '180px' }} 
                                                        showSearch
                                                        filterOption={false} 
                                                        placeholder="选择监测项目"
                                                        onFocus={this.listMonitorType}
                                                        loading={this.state.listMonitorTypeLoading}
                                                        
                                                        dropdownMatchSelectWidth={false}
                                                        onChange={v => {
                                                            axios.get('/sysCode/queryIsNeedDeep', { params: { scId: v } }).then(res => {
                                                                const { code, msg, data } = res.data;
                                                                if (code === 0 || code === 1) {
                                                                this.setState({ isDeep: data });
                                                                }
                                                            })
                                                            this.monitorType = v;
                                                        }}
                                                    >
                                                        {this.state.listMonitorType.map(type => <Select.Option key={type.scId} value={type.scId}>{type.itemName}</Select.Option>)}
                                                    </Select>
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={4}>
                                            <FormItem label={i > 0 ? '' : '点号'}>
                                                {getFieldDecorator(`benchmarkNumber_${i}`,{
                                                    rules:[
                                                        { required: true, message: '不允许为空' }
                                                    ]
                                                })(<Input placeholder='示例：test01' />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={4}>
                                            <FormItem label={i > 0 ? '' : '测量值'}>
                                                {getFieldDecorator(`measuredValue_${i}`,{
                                                    rules:[
                                                        { required: true, message: '不允许为空' }
                                                    ]
                                                })(<Input placeholder='示例：test01' />)}
                                            </FormItem>
                                        </Col>
                                        <Col span={4}>
                                            <FormItem label={i > 0 ? '' : '添加时间'}>
                                                {getFieldDecorator(`updateTime_${i}`,{
                                                    rules:[
                                                        { required: true, message: '不允许为空' }
                                                    ]
                                                })(
                                                    <DatePicker showTime style={{ width: '100%' }} placeholder="选择日期" />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={4}>
                                            <FormItem label={i > 0 ? '' : '备注'}>
                                                {getFieldDecorator(`remark_${i}`)(
                                                    <Input placeholder='示例：test01' />
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={4}>
                                            <FormItem>
                                                <Button
                                                    type='dashed'
                                                    style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                                                    onClick={_ => {
                                                        const addBenchmarkNum = this.state.addBenchmarkNum;
                                                        addBenchmarkNum[i] = undefined;
                                                        this.setState({ addBenchmarkNum });
                                                    }}
                                                >删除</Button>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                )
                            }else{
                                return null
                            }
                        })}
                        <Row gutter={16}>
                            <Col span={24}>
                                <FormItem>
                                <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addBenchmarkNum: [...this.state.addBenchmarkNum, this.state.addBenchmarkNum.length] }) }}>
                                    <Icon type="plus" /> 批量增加编号
                                </Button>
                                </FormItem>
                            </Col>
                        </Row>
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                width: '100%',
                                padding: '10px 16px',
                                background: '#fff',
                                textAlign: 'center',
                            }}
                            >
                            <Button onClick={_ => { this.setState({visible:false});this.getBenchmarkList(); }} style={{ marginRight: 8 }}>
                                取消
                            </Button>
                            <Button type="primary" htmlType='submit' 
                                //onClick={_ => {this.setState({visible:true});this.getBenchmarkList();this.handleSubmit}}
                            >
                                提交
                            </Button>
                        </div>
                    </Form>
                    </div>
                  </Card>                   
                )}

                <EditBenchmark 
                    visible={this.state.handleEditBenchmarkVisible}
                    handleEditBenchmarkVisible={this.handleEditBenchmarkVisible}
                    getBenchmarkList = {this.getBenchmarkList}
                    value={this.state.editValue}
                />

                <ShowModifyRecord 
                    visible={this.state.modifyRecordVisible}
                    modifyRecordVisible={this.modifyRecordVisible}
                    getBenchmarkList = {this.getBenchmarkList}
                    value={this.state.showModifyRecordValue}
                />
                
            </Fragment>
        );
    }
    componentDidMount() {
        this.getBenchmarkList();
    }
}

@Form.create()
class EditBenchmark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editValue: null
        }
    }

    handleEditSubmit = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        let fillZero = (n) => {
            let result = (n).toString().length === 1 ? ('0' + n): n;
            return result;
        }
        let formatTime = (t = new Date()) => {
            let d = new Date(t);
            let year = d.getFullYear();
            let month = d.getMonth() + 1;
            let date = d.getDate();
            let hours = d.getHours();
            let minutes = d.getMinutes();
            let seconds = d.getSeconds();
            let result = `${year}-${fillZero(month)}-${fillZero(date)} ${fillZero(hours)}:${fillZero(minutes)}:${fillZero(seconds)}`;
            return result;
        }
        let currentTime = formatTime(new Date());
        form.validateFields((err, values) => {
            if(!err){
                let params = {
                    benchmarkNumber: this.state.editValue.benchmarkNumber,
                    monitorType: this.state.editValue.monitorType,
                    measuredValue: values.measuredValue,
                    remark: values.remark,
                    updateTime: currentTime
                };
                const id = this.state.editValue.id;
                editBenchmark(id,params).then(res => {
                    const {code,msg,data} = res.data;
                    if(code === 0) {
                        message.success('编辑成功!')
                        this.props.getBenchmarkList();
                        this.props.handleEditBenchmarkVisible(false);
                    }else{
                        message.info('编辑失败!')
                    }
                })
            };
        })
    }

    render() {
        const { form: { getFieldDecorator } } = this.props;
        return (
            <Modal
                title="编辑"
                width={480}
                visible={this.props.visible}
                onOk={this.handleEditSubmit}
                onCancel={_ => {this.props.handleEditBenchmarkVisible(false)}}
            >
                <Form
                    layout="vertical"
                    hideRequiredMark
                    //onSubmit={this.handleEditSubmit}
                >
                    <Row gutter={24} >
                        <Col span={12}>
                            <FormItem label='监测项目'>
                                {getFieldDecorator(`monitorTypeName`,{
                                    initialValue: this.state.editValue && this.state.editValue.monitorTypeName,
                                    rules:[
                                        { required: true, message: '不允许为空' }
                                    ]
                                })(<Input disabled />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='点号'>
                                {getFieldDecorator(`benchmarkNumber`,{
                                    initialValue: this.state.editValue && this.state.editValue.benchmarkNumber,
                                    rules:[
                                        { required: true, message: '不允许为空' }
                                    ]
                                })(<Input placeholder='请输入点号' disabled />)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={24} >
                        <Col span={12}>
                            <FormItem label='测量值'>
                                {getFieldDecorator(`measuredValue`,{
                                    initialValue: this.state.editValue && this.state.editValue.measuredValue,
                                    rules:[
                                        { required: true, message: '不允许为空' }
                                    ]
                                })(<Input />)}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label='备注'>
                                {getFieldDecorator(`remark`,{
                                    initialValue: this.state.editValue && this.state.editValue.remark,
                                    // rules:[
                                    //     { required: true, message: '不允许为空' }
                                    // ]
                                })(<Input />)}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            editValue: nextProps.value
        }
    }
}

@Form.create()
class ShowModifyRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModifyRecordValue: null
        }
    }

    render() {
        return (
            <Modal
                title="修改记录"
                visible={this.props.visible}
                onOk={_ => {this.props.modifyRecordVisible(false)}}
                onCancel={_ => {this.props.modifyRecordVisible(false)}}
            >
                <div style={{width:'100%',height:'200px'}}>
                <p style={{float:'left',width:'100%'}}><span style={{float:'left',width:'200px'}}>监测项目:</span>{this.state.showModifyRecordValue && this.state.showModifyRecordValue.monitorTypeName}</p>
                <p style={{float:'left',width:'100%'}}><span style={{float:'left',width:'200px'}}>点号:</span>{this.state.showModifyRecordValue && this.state.showModifyRecordValue.benchmarkNumber}</p>
                <p style={{float:'left',width:'100%'}}><span style={{float:'left',width:'200px'}}>测量值:</span>{this.state.showModifyRecordValue && this.state.showModifyRecordValue.measuredValue}</p>
                <p style={{float:'left',width:'100%'}}><span style={{float:'left',width:'200px'}}>备注:</span>{this.state.showModifyRecordValue && this.state.showModifyRecordValue.remark}</p>
                <p style={{float:'left',width:'100%'}}><span style={{float:'left',width:'200px'}}>修改时间:</span>{this.state.showModifyRecordValue && this.state.showModifyRecordValue.updateTime}</p>
                </div>
            </Modal>
        )
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            showModifyRecordValue: nextProps.value
        }
    }
}

export default AddBenchmark;