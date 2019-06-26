import React, { Component, Fragment } from 'react';
import { Form, Input, Button, Select, Divider, Cascader, DatePicker, Slider } from 'antd';
import moment from 'moment';
import Map from '@/components/Map/Map';
import { getAllProjectType, getAllProject } from '@/services/project';
import { getLocation } from '@/utils/getLocation';
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

@Form.create()
class AddSectorName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProjectType: [],
      allProject: [],
      JW:{lng:'',lat:''},

      getAllProjectTypeLoading: false,
      getAllProjectLoading: false
    };
  }
  getAllProjectType = () => {
    const { allProjectType } = this.state;
    if (allProjectType.length === 0) {
      this.setState({ getAllProjectTypeLoading: true });
      getAllProjectType().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ allProjectType: data });
        } else {
          this.setState({ allProjectType: [] });
        }
        this.setState({ getAllProjectTypeLoading: false });
      }).catch(err => {
        this.setState({ getAllProjectTypeLoading: false });
        console.log(err);
      })
    }
  }
  getAllProject = () => {
    const { allProject } = this.state;
    if (allProject.length === 0) {
      this.setState({ getAllProjectLoading: true });
      getAllProject().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ allProject: data });
        } else {
          this.setState({ allProject: [] });
        }
        this.setState({ getAllProjectLoading: false });
      }).catch(err => {
        this.setState({ getAllProjectLoading: false });
        console.log(err);
      })
    }
  }
  setJW=v=>{
    this.setState({JW:v});
  }
  onValidateForm = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        // router.push('/project/add-project/add-sector');
        // let res = {
        //   name: values.name,
        //   adress: values.adress.join('') + values.adress_detail,
        //   dec: values.dec,
        //   type: values.type
        // };
        console.log(values);
      }
    });
  }
  detailForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Form.Item {...formItemLayout} label="区段名称">
          {getFieldDecorator('sectorName', {
            rules: [{ required: true, message: '请输入区段名称' }],
          })(<Input placeholder="示例: xxx区段" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区段类型">
          {getFieldDecorator('sectorType', {
            rules: [{ required: true, message: '请输入区段类型' }],
          })(<Input placeholder="示例: 长丰路站" />)}
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
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h4>锐雯</h4>
          <p>
            我已经流浪了如此之久……
          </p>
        </div>
      </Fragment>
    );
  }
}

export default AddSectorName;