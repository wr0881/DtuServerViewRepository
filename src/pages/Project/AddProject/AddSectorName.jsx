import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { observer } from 'mobx-react';
import { Form, Input, Button, Select, Divider, Cascader, DatePicker, Slider } from 'antd';
import moment from 'moment';
import Map from '@/components/Map/Map';
import { getsectorType, addSector } from '@/services/project';
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
    this.setState({ JW: v });
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
          sectorLatitude: this.state.JW.lat,
          sectorLongitude: this.state.JW.lng,
          sectorName: values.sectorName,
          sectorStatus: values.sectorStatus,
          sectorType: values.sectorType
        };
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

  detailForm = () => {
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
              {this.state.sectorType.map((type, i) => <Select.Option key={i} value={type.typeCode}>{type.itemName}</Select.Option>)}
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
            <Slider min={3} max={19} tipFormatter={v => `缩放比例: ${v}`} />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="经纬度">
          <Input.Group compact>
            <Input style={{ width: 170, textAlign: 'center' }} placeholder="经度" value={this.state.JW.lng} disabled />
            <Input
              style={{
                width: 30,
                borderLeft: 0,
                pointerEvents: 'none',
                backgroundColor: '#fff',
              }}
              placeholder="~"
              disabled
            />
            <Input style={{ width: 170, textAlign: 'center', borderLeft: 0 }} placeholder="纬度" value={this.state.JW.lat} disabled />
          </Input.Group>
        </Form.Item>
        <Form.Item {...formItemLayout} label="标点">
          <Map
            setJW={this.setJW}
            address={this.props.form.getFieldValue('adress') + this.props.form.getFieldValue('adress_detail')}
            scale={this.props.form.getFieldValue('mapScale')}
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
      </Fragment>
    );
  }
}

export default AddSectorName;