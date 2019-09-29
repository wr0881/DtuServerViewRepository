import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { observer } from 'mobx-react';
import { Form, Input, Button, Select, Divider, Cascader, DatePicker, Slider } from 'antd';
import moment from 'moment';
import Map from '@/components/Map/Map';
import { getsectorType, addSector, getAddress } from '@/services/project';
import { getLocation } from '@/utils/getLocation';
import projectState from './project';
import styles from './style.less';

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
    span: 14,
  },
  wrapperCol: {
    span: 10,
  },
};

@observer
@Form.create()
class AddSectorName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sectorType: [],
      JW: { lng: '', lat: '' },
    };
  }

  setJW = v => {
    this.setState({ JW: v },_=>{
      this.props.form.setFieldsValue({longitude:this.state.JW.lng});
      this.props.form.setFieldsValue({latitude:this.state.JW.lat});
    });    
  }
  //地图缩放
  setScale = v => {
    this.setState({
      scale:v
    },_=>{
      //console.log('获取的地图缩放比例为:',this.state.scale);
      this.props.form.setFieldsValue({mapScale:this.state.scale});
    })
  }
  onValidateForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let result = {
          projectId: projectState.projectId,
          sectorAddress: values.adress.join('') + values.adress_detail,
          sectorBeginTime: values.sectorBegin_time.format('YYYY-MM-DD HH:mm:ss'),
          sectorDescription: values.sectorDescription,
          sectorEndTime: values.sectorEnd_time.format('YYYY-MM-DD HH:mm:ss'),
          mapScale: values.mapScale,
          //mapScale: this.state.zoom,
          sectorLatitude: this.state.JW.lat,
          sectorLongitude: this.state.JW.lng,
          sectorName: values.sectorName,
          sectorStatus: values.sectorStatus,
          sectorType: values.sectorType
        };
        
        //console.log(result);
        addSector(result).then(res => {
          const { code, data, msg } = res.data;
          if (code === 0) {
            projectState.sectorId = data;
            router.push('/project/add-project/result');
          }
        })
      }
    });
  }

  getsectorType = () => {
    const { sectorType } = this.state;
    if (sectorType.length === 0) {
      getsectorType().then(res => {
        const { code, data } = res.data;
        console.log(data);
        if (code === 0) {
          this.setState({ sectorType: data });
        } else {
          this.setState({ sectorType: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
 
  detailForm = (record) => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={`${styles.stepForm} ${styles.disabled}`}>
        <Form.Item {...formItemLayout} label="区段名称">
          {getFieldDecorator('sectorName', {
            rules: [{ required: true, message: '请输入区段名称' }],
          })(<Input placeholder="示例: xxx区段" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段类型">
          {getFieldDecorator('sectorType', {
            rules: [{ required: true, message: '请输入区段类型' }],
          })(
            <Select
              placeholder="示例：区段类型"
              onFocus={this.getsectorType}
              dropdownMatchSelectWidth={false}
              style={{ width: '100%' }}
            >
              {this.state.sectorType.map((type, i) => <Select.Option key={type.id} value={type.id}>{type.itemName}</Select.Option>)}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段创建时间">
          {getFieldDecorator('sectorBegin_time', {
            initialValue: moment(),
            rules: [{ required: true, message: '请选择区段创建时间' }],
          })(
            <DatePicker />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段结束时间">
          {getFieldDecorator('sectorEnd_time', {
            rules: [{ required: true, message: '请选择区段结束时间' }],
          })(
            <DatePicker />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段描述">
          {getFieldDecorator('sectorDescription', {
            rules: [{ required: true, message: '请输入区段描述' }],
          })(
            <TextArea
              placeholder="示例: 这是一个什么什么区段"
              autosize={{ minRows: 3 }}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段状态">
          {getFieldDecorator('sectorStatus', {
            rules: [{ required: true, message: '请选择区段状态' }],
          })(
            <Select
              placeholder="示例: 未开始"
              dropdownMatchSelectWidth={false}
              style={{ width: '100%' }}
            >
              <Select.Option key={1}>未开始</Select.Option>
              <Select.Option key={2}>进行中</Select.Option>
              <Select.Option key={3}>已结束</Select.Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="所在省市">
          {getFieldDecorator('adress', {
            rules: [{ required: true, message: '请选择区段所在省市' }],
          })(
            <Cascader options={getLocation()} placeholder="示例: 湖南省长沙市岳麓区" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="街道地址">
          {getFieldDecorator('adress_detail', {
            rules: [{ required: true, message: '请输入区段街道地址' }],
          })(
            <Input placeholder="示例: 学士路学士街道755号" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="地图缩放比例">
          {getFieldDecorator('mapScale', {
            initialValue: 10,
            rules: [{ required: true, message: '请选择地图缩放比例' }],
          })(
            <Slider min={4} max={19} tipFormatter={v => `缩放比例: ${v}`} 
            tooltipPlacement='right'
            tooltipVisible={true}
            //value={10}
            />
          )}
          {/* <Slider min={3} max={19} tipFormatter={v => `缩放比例: ${v}`}
            //value={this.state.zoom}
            value={this.state.zoom}
            tooltipPlacement='right'
            tooltipVisible={true}
            //onChange={v => {v===this.state.zoom}} 
            //defaultValue={10}
          /> */}
        </Form.Item>
        <Input.Group compact>
        <Form.Item {...formItemLayout1} label="经纬度">
          
          
            {/* <Input style={{ width: 170, textAlign: 'center' }} placeholder="经度" value={this.state.JW.lng} disabled />  */}
            {getFieldDecorator('longitude')(
              <Input style={{ width: 120, borderTopRightRadius: 0, borderBottomRightRadius: 0, textAlign: 'center' }} placeholder="经度" />
            )}
            
        </Form.Item>
        <Form.Item>
          <Input
            style={{
              width: 30,
              borderLeft: 0,
              marginLeft: 47,
              pointerEvents: 'none',
              backgroundColor: '#fff',
              borderRadius: 0
            }}
            placeholder="~"
            disabled
          />

        </Form.Item>
        <Form.Item {...formItemLayout1}>
            {getFieldDecorator('latitude')(
              <Input style={{ width: 120, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, textAlign: 'center' }} placeholder="纬度" />
            )}
        </Form.Item>
        </Input.Group>
        <Form.Item {...formItemLayout} label="标点">
          {/* {getFieldDecorator('map',{
            rules: [{ required: true, message:''}]
          })(
            <Map
              setJW={this.setJW}
              address={this.props.form.getFieldValue('adress') + this.props.form.getFieldValue('adress_detail')}
              scale={this.props.form.getFieldValue('mapScale')}

              getZoom={(mapzoom) => {this.zoomChange(mapzoom)}}
            />
          )} */}
          <Map
            setJW={this.setJW}
            address={this.props.form.getFieldValue('adress') + this.props.form.getFieldValue('adress_detail')}
            scale={this.props.form.getFieldValue('mapScale')}
            //输入框的经纬度
            lng={this.props.form.getFieldValue('longitude')}
            lat={this.props.form.getFieldValue('latitude')}
            //getZoom={(mapzoom) => {this.zoomChange(mapzoom);console.log('Map的mapzoom:',mapzoom)}}
            setScale={this.setScale}
            
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" style={{ marginRight: '30px' }} onClick={this.onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    )
  }
  render() {
    return (
      <Fragment>
        {this.detailForm()}
        {/* <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h4>锐雯</h4>
          <p>
            我已经流浪了如此之久……
          </p>
        </div> */}
      </Fragment>
    );
  }
}

export default AddSectorName;