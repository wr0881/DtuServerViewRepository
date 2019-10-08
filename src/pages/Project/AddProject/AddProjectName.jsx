import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { observer } from 'mobx-react';
import { Form, Input, Button, Select, Divider, Cascader, Spin, message, Tooltip } from 'antd';
import { getAllProjectType, getAllProject, addProject } from '@/services/project';
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
class AddProjectName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: 'detail',
      allProjectType: [],
      allProject: [],

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
          router.push('/user/login');
        }
        this.setState({ getAllProjectLoading: false });
      }).catch(err => {
        this.setState({ getAllProjectLoading: false });
        console.log(err);
      })
    }
  }
  onValidateFormDetail = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let result = {
          projectName: values.name,
          projectAddress: values.adress.join('') + values.adress_detail,
          projectDescription: values.dec,
          projectType: values.type
        };
        addProject(result).then(res => {
          const { code, data, msg } = res.data;
          if (code === 0) {
            projectState.projectId = data;
            router.push('/project/add-project/add-sector-name');
          } else {
            message.info(msg);
          }
        }).catch(err => { console.log(err) });
      }
    });
  }
  onValidateFormSimple = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        projectState.projectId = values.projectId;
        router.push('/project/add-project/add-sector-name');
      }
    });
  }
  detailForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="项目名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入项目名称' }],
          })(<Input placeholder="示例: xxx项目" />)}

          <a href=""
            style={{ float: 'right', marginTop: '-5px', marginBottom: '-20px' }}
            onClick={e => {
              e.preventDefault();
              this.setState({ form: 'simple' });
            }}
          >选择已有项目?</a>
        </Form.Item>
        <Form.Item {...formItemLayout} label="所在省市">
          {getFieldDecorator('adress', {
            rules: [{ required: true, message: '请选择项目所在省市' }],
          })(
            <Cascader options={getLocation()} placeholder="示例: 湖南省长沙市岳麓区" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="街道地址">
          {getFieldDecorator('adress_detail', {
            rules: [{ required: true, message: '请输入项目街道地址' }],
          })(
            <Input placeholder="示例: 学士路学士街道755号" />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="项目描述">
          {getFieldDecorator('dec', {
            rules: [{ required: true, message: '请输入项目描述' }],
          })(
            <TextArea
              placeholder="示例: 这是一个什么什么项目"
              autosize={{ minRows: 3 }}
            />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="项目类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择项目类型' }],
          })(
            <Select
              placeholder="示例: 地铁"
              loading={this.state.getAllProjectTypeLoading}
              notFoundContent={this.state.getAllProjectTypeLoading ? <Spin size="small" /> : null}
              onFocus={this.getAllProjectType}
              dropdownMatchSelectWidth={false}
              style={{ width: '100%' }}
            >
              {this.state.allProjectType.map(type => <Select.Option key={type.scId}>{type.itemName}</Select.Option>)}
            </Select>
          )}
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
          <Button type="primary" style={{ marginRight: '30px' }} onClick={this.onValidateFormDetail}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    )
  }
  simpleForm = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="项目名称">
          {getFieldDecorator('projectId', {
            rules: [{ required: true, message: '请选择项目' }],
          })(
            <Select
              showSearch
              placeholder="示例: xxx项目"
              loading={this.state.getAllProjectLoading}
              notFoundContent={this.state.getAllProjectTypeLoading ? <Spin size="small" /> : null}
              onFocus={this.getAllProject}
              optionFilterProp='children'
              style={{ width: '100%' }}
            >
              {this.state.allProject.map(project => <Select.Option key={project.projectId}><Tooltip placement="topLeft" title={project.projectName}>{project.projectName}</Tooltip></Select.Option>)}
            </Select>
          )}
          <a
            style={{ float: 'right', marginTop: '-5px', marginBottom: '-20px' }}
            onClick={e => {
              e.preventDefault();
              this.setState({ form: 'detail' });
            }}
          >新建项目?</a>
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
          <Button type="primary" style={{ marginRight: '30px' }} onClick={this.onValidateFormSimple}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    )
  }
  render() {
    return (
      <Fragment>
        {this.state.form === 'detail' ? this.detailForm() : this.simpleForm()}
        {/* <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h4>亚索</h4>
          <p>
            树叶的一生,只是为了归根吗?
          </p>
        </div> */}
      </Fragment>
    );
  }
}

export default AddProjectName;