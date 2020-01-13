import React, { Component, Fragment } from 'react';
import axios from 'axios';
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
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';
import { getMonitorType, updateThresholdStatus, listMonitorType } from '@/services/project';

const FormItem = Form.Item;
const { TextArea } = Input;

@observer
@Form.create()
class UploadTestValue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagination: {
                current: 1,
                pageSize: 10,
                size: 'midden',
                total: 0,
                showQuickJumper: true
            },

            dataSource: [],
            fileList: [],
            uploading: false,
            listMonitorType: [],
            listMonitorTypeLoading: false,
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
 
    handleUpload = () => {
        const { fileList } = this.state;
        const sectorId = sectorModel.sectorId;
        const formData = new FormData();
        const monitorType = this.monitorType;
        fileList.forEach(file => {
            formData.append('dataFile', file);
            
        });
        formData.append('monitorType',monitorType);
        formData.append('sectorId',sectorId);
        const config = {
            headers: {
                'Content-Type':'multipart/form-data'
            }
        }
    
        this.setState({
            uploading: true,
        });
    
        // You can use any AJAX library you like
        axios.post('/manual-collect-data/check',formData,config).then(res => {
            const { code,msg,data } = res.data;
            if(code===0){
                this.setState({
                    fileList: [],
                    uploading: false,
                    dataSource: data.dataItems,
                });
                message.success(msg);
            }else{
                this.setState({
                    uploading: false,
                    dataSource: []
                });
                message.info(msg);
            }
        }).catch(err => {
            this.setState({
                uploading: false,
            });
            message.error(err);
        })
    };

    saveTest = () => {
        let saveDataItems = [];
        if(this.state.dataSource){
            this.state.dataSource.forEach(v => {
                saveDataItems.push({
                    createDate:v.createDate,
                    monitorPointNumber:v.monitorPointNumber,
                    sensorDeep:v.sensorDeep,
                    values:v.measureValues,
                });
            })
        }
        const params = {
            dataItems:saveDataItems,
            monitorType:this.monitorType,
            sectorId:sectorModel.sectorId,
        }
        axios.post('/manual-collect-data/save',params).then(res => {
            const { code,msg,data } = res.data;
            if(code===0){
                message.success(msg);
            }else{
                message.info(msg);
            }
        }).catch(err => {
            message.error(err);
        })
    }

    renderForm() {
        const {
            form: { getFieldDecorator }
        } = this.props;
        const { uploading, fileList } = this.state;
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md:8,lg:24,xl:48}}>
                    <Col md={4} sm={24}>
                        <FormItem>
                            {getFieldDecorator('monitorType')(
                                <Select
                                    style={{ width: '120px' }} 
                                    filterOption={false} 
                                    placeholder="选择指标"
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
                    <Col md={4} sm={24}>
                        <FormItem>
                            {getFieldDecorator('excelFile')(
                                <div>
                                    <Upload 
                                        {...props}
                                    >
                                        <Button>
                                            <Icon type="upload" /> 选择excel文件
                                        </Button>
                                    </Upload>
                                </div>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md:8,lg:24,xl:48}}>
                    <Col md={4} sm={24}>
                        <FormItem>
                            <Button 
                                type="primary"
                                onClick={this.handleUpload}
                                disabled={fileList.length === 0}
                                loading={uploading}
                                style={{ marginTop: 16 }}
                            >
                                {uploading ? '上传中' : '开始上传'}
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;

        const columns = [
        {
            title: '测点',
            dataIndex: 'monitorPointNumber',
            key: 'pointNumber',
        },
        {
            title: '初始值',
            dataIndex: 'initialValues',
            key: 'ininValue',
        },
        {
            title: '上次测量值',
            dataIndex: 'prevMeasureValues',
            key: 'testValue1',
        },
        {
            title: '本次测量值',
            dataIndex: 'measureValues',
            key: 'testValue2',
        },
        {
            title: '单次变化量',
            dataIndex: 'singleChangeValues',
            key: 'testValue3',
        },
        {
            title: '变化速率',
            dataIndex: 'speedChangeValues',
            key: 'testValue4',
        },
        {
            title: '累计变化量',
            dataIndex: 'totalChangeValues',
            key: 'testValue5',
        },
        {
            title: '是否报警',
            dataIndex: 'isAlert',
            render:(value)=>{
                return (
                    <div>
                        {value === false ? 
                            (<div key={Math.random()} style={{color:'#34CCB3'}}>否</div>) : 
                            (<div key={Math.random()} style={{color:'#F5222D'}}>是</div>)
                            // (<Popconfirm
                            //     title="确定报警?"
                            //     onConfirm={()=>this.handleAlert()}
                            // >
                            //     <a><div key={Math.random()} style={{color:'#F5222D'}}>是</div></a>
                            // </Popconfirm>)
                        }
                    </div>
                )
            }
                
        },
        ];
        
        return (
        <Fragment>
            <Card bordered={false}>
                {this.renderForm()}       
                <Divider />
                <Table
                    columns={columns}
                    pagination={this.state.pagination}
                    dataSource={this.state.dataSource}
                /> 
                <div style={{float:'right',marginTop:'10px'}}><Button type='primary' onClick={this.saveTest}>保存</Button></div>          
            </Card>
        </Fragment>
        );
    }
    componentDidMount() {
        
    }
    
}
export default UploadTestValue;