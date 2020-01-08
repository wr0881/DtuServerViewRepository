/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { observer } from 'mobx-react';
import { getInstrMemberInfo,getBindingMember,removeSectorMember,notSectorMember,addUnbindMember,getMemberType } from '@/services/project';
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
    Spin,
    Cascader,
    Slider
} from 'antd';
import moment from 'moment';
import Map from '@/components/Map/Map';
import { getSectorBaseInfo, updateSectorBaseInfo } from '@/services/project';
import { getLocation } from '@/utils/getLocation';
import sectorModel from './sectorModel';
import { getSectorName } from '@/services/project';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19,
    },
};
const formItemLayout1 = {
    labelCol: {
        span: 18,
    },
    wrapperCol: {
        span: 6,
    },
};

@observer
@Form.create()
class ModifySectorBasicInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectorName: '',
            sectorBasicInfo: {}
        };
    }
    setJW = v => {
        this.setState({ JW: v }, _ => {
            this.props.form.setFieldsValue({ longitude: this.state.JW.lng });
            this.props.form.setFieldsValue({ latitude: this.state.JW.lat });
        });
    }
    //地图缩放
    setScale = v => {
        this.setState({
            scale: v
        }, _ => {
            this.props.form.setFieldsValue({ mapScale: this.state.scale });
        })
    }
    
    //获取当前子项目基本信息
    getSectorBasicInfo() {
        const sectorId = sectorModel.sectorId;
        getSectorBaseInfo(sectorId).then(res => {
            const { code, msg, data } = res.data;
            if(code === 0) {
                this.setState({sectorBasicInfo:data});
                if(this.state.sectorBasicInfo.sectorStatus === 1) {
                    this.setState({sectorStatusValue:'未开始'})
                }
                if(this.state.sectorBasicInfo.sectorStatus === 2) {
                    this.setState({sectorStatusValue:'进行中'})
                }
                if(this.state.sectorBasicInfo.sectorStatus === 3) {
                    this.setState({sectorStatusValue:'已结束'})
                }
            } else {
                this.setState({sectorBasicInfo:{}});
            }
        }).catch(err => {
            message.error(err);
        })
    }

    //修改提交
    onValidateForm = () => {
        const { form } = this.props;
        const { validateFields } = form;
        
        validateFields((err, values) => {
            if (!err) {
                let result = {
                    isManual: false,
                    projectId: sectorModel.projectId,
                    projectType: this.state.sectorBasicInfo.projectType,
                    sectorId: sectorModel.sectorId,
                    sectorAddress: values.sectorAddress,
                    sectorDescription: values.sectorDescription,
                    sectorBeginTime: values.sectorBeginTime.format('YYYY-MM-DD HH:mm:ss'),
                    
                    sectorEndTime: values.sectorEndTime.format('YYYY-MM-DD HH:mm:ss'),
                    mapScale: values.mapScale.toString(),
                    //mapScale: this.state.zoom,
                    sectorLatitude: values.longitude,
                    sectorLongitude: values.latitude,
                    sectorName: values.sectorName,
                    sectorStatus: parseInt(values.sectorStatus),
                    sectorType: 48
                };
                console.log('自动子项目修改的基本信息:',result);
                updateSectorBaseInfo(result).then(res => {
                    const { code, data, msg } = res.data;
                    if (code === 0) {
                        message.success('修改成功!');
                    }else{
                        message.info('修改失败!');
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return(
            <Fragment>
                <Card bordered={false}>
                    <div>
                    <Form layout="horizontal" className="modify-sector-basicinfo" style={{maxWidth:'640px',margin:'40px auto 0'}}>
                        <Form.Item {...formItemLayout} label="子项目名称">
                        {getFieldDecorator('sectorName', {
                            rules: [{ required: true, message: '请输入子项目名称' }],
                            initialValue: this.state.sectorBasicInfo.sectorName
                        })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="创建时间">
                        {getFieldDecorator('sectorBeginTime', {
                            initialValue: moment(this.state.sectorBasicInfo.sectorBeginTime),
                            rules: [{ required: true, message: '请选择子项目创建时间' }],
                        })(
                            <DatePicker disabled />
                        )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="结束时间">
                        {getFieldDecorator('sectorEndTime', {
                            initialValue: moment(this.state.sectorBasicInfo.sectorEndTime),
                            rules: [{ required: true, message: '请选择子项目结束时间' }],
                        })(
                            <DatePicker />
                        )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="子项目描述">
                        {getFieldDecorator('sectorDescription', {
                            rules: [{ required: true, message: '请输入子项目描述' }],
                            initialValue: this.state.sectorBasicInfo.sectorDescription
                        })(
                            <TextArea
                            autoSize={{ minRows: 3 }}
                            />
                        )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="子项目状态">
                        {getFieldDecorator('sectorStatus', {
                            rules: [{ required: true, message: '请选择子项目状态' }],
                            initialValue: this.state.sectorBasicInfo.sectorStatus+''
                        })(
                            <Select
                                dropdownMatchSelectWidth={false}
                                style={{ width: '100%' }}
                            >
                                <Select.Option value='1'>未开始</Select.Option>
                                <Select.Option value='2'>进行中</Select.Option>
                                <Select.Option value='3'>已结束</Select.Option>
                            </Select>
                        )}
                        </Form.Item>
                        {/* <Form.Item {...formItemLayout} label="所在省市">
                            {getFieldDecorator('adress', {
                                rules: [{ required: true, message: '请选择子项目所在省市' }],
                                //initialValue:['北京市','市辖区','东城区']
                            })(
                                <Cascader options={getLocation()} placeholder="示例: 湖南省/长沙市/岳麓区" />
                            )}
                        </Form.Item> */}
                        <Form.Item {...formItemLayout} label="子项目地址">
                            {getFieldDecorator('sectorAddress', {
                                rules: [{ required: true, message: '请输入子项目地址' }],
                                initialValue: this.state.sectorBasicInfo.sectorAddress
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="地图缩放比例">
                            {getFieldDecorator('mapScale', {
                                initialValue: this.state.sectorBasicInfo.mapScale,
                                rules: [{ required: true, message: '请选择地图缩放比例' }],
                            })(
                                <Slider min={4} max={19} tipFormatter={v => `缩放比例: ${v}`}
                                    tooltipPlacement='right'
                                    initialValue={this.state.sectorBasicInfo.mapScale}
                                />
                            )}
                        </Form.Item>
                        <Input.Group compact>
                            <Form.Item {...formItemLayout1} label="经纬度">
                                {getFieldDecorator('longitude',{
                                    initialValue: this.state.sectorBasicInfo.sectorLongitude
                                })(
                                <Input style={{ width: 120, borderTopRightRadius: 0, borderBottomRightRadius: 0, textAlign: 'center' }} placeholder="经度" />
                                )}

                            </Form.Item>
                            <Form.Item>
                                <Input
                                style={{
                                    width: 30,
                                    //borderLeft: 0,
                                    marginLeft: 70,
                                    pointerEvents: 'none',
                                    backgroundColor: '#fff',
                                    borderRadius: 0
                                }}
                                placeholder="~"
                                disabled
                                />

                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('latitude',{
                                    initialValue:this.state.sectorBasicInfo.sectorLatitude
                                })(
                                <Input style={{ width: 120, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textAlign: 'center' }} placeholder="纬度" />
                                )}
                            </Form.Item>
                        </Input.Group>
                        <Form.Item {...formItemLayout} label="标点">
                            <Map
                                setJW={this.setJW}
                                //address={this.props.form.getFieldValue('adress')}
                                scale={this.props.form.getFieldValue('mapScale')}
                                //输入框的经纬度
                                lng={this.props.form.getFieldValue('longitude')}
                                lat={this.props.form.getFieldValue('latitude')}
                                //getZoom={(mapzoom) => {this.zoomChange(mapzoom);console.log('Map的mapzoom:',mapzoom)}}
                                setScale={this.setScale}

                            />
                        </Form.Item>
                        <Button type="primary" style={{ float:'right' }} onClick={this.onValidateForm}>
                        确认
                        </Button>
                        
                    </Form>
                    </div>
                </Card>
            </Fragment>
        )
    }

    componentDidMount(){
        this.getSectorBasicInfo();
    }
}

export default ModifySectorBasicInfo;