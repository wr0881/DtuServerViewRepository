import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { observer } from 'mobx-react';
import {
  Row,
  Col,
  Table,
  Badge,
  Divider,
  Switch,
  Alert,
  Drawer,
  Modal,
  message,
  Spin,
  Empty,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Tabs,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import debounce from 'lodash/debounce';
import IndexInfo from './AddIndexInfo';
import ImgMark from '@/components/ImgMark/ImgMark';
import { getInstrMemberInfo, getMemberType, addSectorMember, getCountMemberInfo, addMember } from '@/services/project';
import projectState from './project';
import styles from './style.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;

@observer
@Form.create()
class AddMemberInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memberType: [],
      addJsUnit: [0],
      addSgUnit: [0],
      addJcUnit: [0],
      addJlUnit: [0],

      addMemberInfoModal: false,
      getInstrMemberInfoLoading: false
    };
  }

  setAddMemberInfoModalVisible = status => {
    this.setState({ addMemberInfoModal: status });
  }

  getInstrMemberInfo = (value, type, i) => {
    if (value) {
      this.setState({ getInstrMemberInfoLoading: true });
      getInstrMemberInfo({ memberName: value }).then(res => {
        const { code, data, msg } = res.data;
        if (code === 0) {
          this.setState({ [type + i + 'Data']: data });
        } else {
          console.log(msg);
        }
        this.setState({ getInstrMemberInfoLoading: false });
      }).catch(err => {
        console.log(err);
        this.setState({ getInstrMemberInfoLoading: false });
      })
    }
  }

  getMemberType = () => {
    const { memberType } = this.state;
    if (memberType.length === 0) {
      getMemberType().then(res => {
        const { code, data } = res.data;
        if (code === 0) {
          this.setState({ memberType: data });
        } else {
          this.setState({ memberType: [] });
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let result = [];

        let JsUnitConcatKeys = Object.keys(values).filter(item => item.indexOf('JsUnitConcat_') > -1);
        let SgUnitConcatKeys = Object.keys(values).filter(item => item.indexOf('SgUnitConcat_') > -1);
        let JcUnitConcatKeys = Object.keys(values).filter(item => item.indexOf('JcUnitConcat_') > -1);
        let JlUnitConcatKeys = Object.keys(values).filter(item => item.indexOf('JlUnitConcat_') > -1);

        for (let i = 0; i < JsUnitConcatKeys.length; i++) {
          result.push({
            sectorId: projectState.sectorId,
            memberId: values[JsUnitConcatKeys[i]],
            memberType: 0,
            sectorRole: values[`JsUnitJob_${JsUnitConcatKeys[i].split('_')[1]}`]
          })
        }

        for (let i = 0; i < SgUnitConcatKeys.length; i++) {
          result.push({
            sectorId: projectState.sectorId,
            memberId: values[SgUnitConcatKeys[i]],
            memberType: 1,
            sectorRole: values[`SgUnitJob_${SgUnitConcatKeys[i].split('_')[1]}`]
          })
        }

        for (let i = 0; i < JcUnitConcatKeys.length; i++) {
          result.push({
            sectorId: projectState.sectorId,
            memberId: values[JcUnitConcatKeys[i]],
            memberType: 2,
            sectorRole: values[`JcUnitJob_${JcUnitConcatKeys[i].split('_')[1]}`]
          })
        }

        for (let i = 0; i < JlUnitConcatKeys.length; i++) {
          result.push({
            sectorId: projectState.sectorId,
            memberId: values[JlUnitConcatKeys[i]],
            memberType: 3,
            sectorRole: values[`JlUnitJob_${JlUnitConcatKeys[i].split('_')[1]}`]
          })
        }

        addSectorMember(result).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            router.push('/project/add-project/add-sector-info');
          } else {
            message.info('添加人员信息失败');
          }
        }).catch(err => {
          message.info('添加人员信息失败 ' + err);
        })
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <div className={styles.disabled} style={{ marginTop: '30px' }}>
        <Form
          layout="vertical"
        >
          <div>
            <Alert
              style={{ marginBottom: '15px' }}
              message={
                <div>
                  如没有所选联系人, 请先<a onClick={_ => { this.setState({ addMemberInfoModal: true }) }}>添加人员信息</a>。添加完毕后再选择联系人
                  </div>
              }
              type="info"
              showIcon
            />
            {this.state.addJsUnit.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '建设单位联系人'}>
                        {getFieldDecorator(`JsUnitConcat_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            loading={this.state.getInstrMemberInfoLoading}
                            // labelInValue
                            placeholder="选择联系人"
                            notFoundContent={this.state.getInstrMemberInfoLoading ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={debounce(v => { this.getInstrMemberInfo(v, 'JsUnitConcat', i) }, 800)}
                            onChange={value => {
                              if (this.state[`JsUnitConcat${i}Data`]) {
                                let select = this.state[`JsUnitConcat${i}Data`].filter(v => v.memberId.toString() === value)[0];
                                this.props.form.setFieldsValue({
                                  [`JsUnitName_${i}`]: select.memberCompany,
                                  [`JsUnitPhone_${i}`]: select.memberPhone,
                                  [`JsUnitEmail_${i}`]: select.memberEmail,
                                });
                              }
                            }}
                          >
                            {this.state[`JsUnitConcat${i}Data`] && this.state[`JsUnitConcat${i}Data`].map(v => (
                              <Option key={v.memberId}>{v.memberName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label={i > 0 ? '' : '建设单位名称'}>
                        {getFieldDecorator(`JsUnitName_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：武魂殿" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '电话'}>
                        {getFieldDecorator(`JsUnitPhone_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：12345678912" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '邮箱'}>
                        {getFieldDecorator(`JsUnitEmail_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：123456@qq.com" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '职位'}>
                        {getFieldDecorator(`JsUnitJob_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            placeholder="示例：方案编制人"
                            onFocus={this.getMemberType}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '100%' }}
                          >
                            {this.state.memberType.map(job => <Select.Option key={job.scId}>{job.itemName}</Select.Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                          onClick={_ => {
                            const addJsUnit = this.state.addJsUnit;
                            addJsUnit[i] = undefined;
                            this.setState({ addJsUnit });
                          }}
                        >删除</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              } else {
                return null
              }
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addJsUnit: [...this.state.addJsUnit, this.state.addJsUnit.length] }) }}>
                    <Icon type="plus" /> 批量增加单位信息
                      </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Alert
              style={{ marginBottom: '15px' }}
              message={
                <div>
                  如没有所选联系人, 请先<a onClick={_ => { this.setState({ addMemberInfoModal: true }) }}>添加人员信息</a>。添加完毕后再选择联系人
                  </div>
              }
              type="info"
              showIcon
            />
            {this.state.addSgUnit.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '施工单位联系人'}>
                        {getFieldDecorator(`SgUnitConcat_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            loading={this.state.getInstrMemberInfoLoading}
                            // labelInValue
                            placeholder="选择联系人"
                            notFoundContent={this.state.getInstrMemberInfoLoading ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={debounce(v => { this.getInstrMemberInfo(v, 'SgUnitConcat', i) }, 800)}
                            onChange={value => {
                              if (this.state[`SgUnitConcat${i}Data`]) {
                                let select = this.state[`SgUnitConcat${i}Data`].filter(v => v.memberId.toString() === value)[0];
                                this.props.form.setFieldsValue({
                                  [`SgUnitName_${i}`]: select.memberCompany,
                                  [`SgUnitPhone_${i}`]: select.memberPhone,
                                  [`SgUnitEmail_${i}`]: select.memberEmail,
                                });
                              }
                            }}
                          >
                            {this.state[`SgUnitConcat${i}Data`] && this.state[`SgUnitConcat${i}Data`].map(v => (
                              <Option key={v.memberId}>{v.memberName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label={i > 0 ? '' : '施工单位名称'}>
                        {getFieldDecorator(`SgUnitName_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：武魂殿" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '电话'}>
                        {getFieldDecorator(`SgUnitPhone_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：12345678912" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '邮箱'}>
                        {getFieldDecorator(`SgUnitEmail_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：123456@qq.com" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '职位'}>
                        {getFieldDecorator(`SgUnitJob_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            placeholder="示例：方案编制人"
                            onFocus={this.getMemberType}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '100%' }}
                          >
                            {this.state.memberType.map(job => <Select.Option key={job.scId}>{job.itemName}</Select.Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                          onClick={_ => {
                            const addSgUnit = this.state.addSgUnit;
                            addSgUnit[i] = undefined;
                            this.setState({ addSgUnit });
                          }}
                        >删除</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              } else {
                return null
              }
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addSgUnit: [...this.state.addSgUnit, this.state.addSgUnit.length] }) }}>
                    <Icon type="plus" /> 批量增加单位信息
                      </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Alert
              style={{ marginBottom: '15px' }}
              message={
                <div>
                  如没有所选联系人, 请先<a onClick={_ => { this.setState({ addMemberInfoModal: true }) }}>添加人员信息</a>。添加完毕后再选择联系人
                  </div>
              }
              type="info"
              showIcon
            />
            {this.state.addJcUnit.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '监测单位联系人'}>
                        {getFieldDecorator(`JcUnitConcat_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            loading={this.state.getInstrMemberInfoLoading}
                            // labelInValue
                            placeholder="选择联系人"
                            notFoundContent={this.state.getInstrMemberInfoLoading ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={debounce(v => { this.getInstrMemberInfo(v, 'JcUnitConcat', i) }, 800)}
                            onChange={value => {
                              if (this.state[`JcUnitConcat${i}Data`]) {
                                let select = this.state[`JcUnitConcat${i}Data`].filter(v => v.memberId.toString() === value)[0];
                                this.props.form.setFieldsValue({
                                  [`JcUnitName_${i}`]: select.memberCompany,
                                  [`JcUnitPhone_${i}`]: select.memberPhone,
                                  [`JcUnitEmail_${i}`]: select.memberEmail,
                                });
                              }
                            }}
                          >
                            {this.state[`JcUnitConcat${i}Data`] && this.state[`JcUnitConcat${i}Data`].map(v => (
                              <Option key={v.memberId}>{v.memberName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label={i > 0 ? '' : '监测单位名称'}>
                        {getFieldDecorator(`JcUnitName_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：武魂殿" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '电话'}>
                        {getFieldDecorator(`JcUnitPhone_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：12345678912" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '邮箱'}>
                        {getFieldDecorator(`JcUnitEmail_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：123456@qq.com" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '职位'}>
                        {getFieldDecorator(`JcUnitJob_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            placeholder="示例：方案编制人"
                            onFocus={this.getMemberType}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '100%' }}
                          >
                            {this.state.memberType.map(job => <Select.Option key={job.scId}>{job.itemName}</Select.Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                          onClick={_ => {
                            const addJcUnit = this.state.addJcUnit;
                            addJcUnit[i] = undefined;
                            this.setState({ addJcUnit });
                          }}
                        >删除</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              } else {
                return null
              }
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addJcUnit: [...this.state.addJcUnit, this.state.addJcUnit.length] }) }}>
                    <Icon type="plus" /> 批量增加单位信息
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div>
            <Alert
              style={{ marginBottom: '15px' }}
              message={
                <div>
                  如没有所选联系人, 请先<a onClick={_ => { this.setState({ addMemberInfoModal: true }) }}>添加人员信息</a>。添加完毕后再选择联系人
                </div>
              }
              type="info"
              showIcon
            />
            {this.state.addJlUnit.map(i => {
              if (i !== undefined) {
                return (
                  <Row gutter={16} key={i}>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '监理单位联系人'}>
                        {getFieldDecorator(`JlUnitConcat_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            showSearch
                            loading={this.state.getInstrMemberInfoLoading}
                            // labelInValue
                            placeholder="选择联系人"
                            notFoundContent={this.state.getInstrMemberInfoLoading ? <Spin size="small" /> : null}
                            filterOption={false}
                            onSearch={debounce(v => { this.getInstrMemberInfo(v, 'JlUnitConcat', i) }, 800)}
                            onChange={value => {
                              if (this.state[`JlUnitConcat${i}Data`]) {
                                let select = this.state[`JlUnitConcat${i}Data`].filter(v => v.memberId.toString() === value)[0];
                                this.props.form.setFieldsValue({
                                  [`JlUnitName_${i}`]: select.memberCompany,
                                  [`JlUnitPhone_${i}`]: select.memberPhone,
                                  [`JlUnitEmail_${i}`]: select.memberEmail,
                                });
                              }
                            }}
                          >
                            {this.state[`JlUnitConcat${i}Data`] && this.state[`JlUnitConcat${i}Data`].map(v => (
                              <Option key={v.memberId}>{v.memberName}</Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item label={i > 0 ? '' : '监理单位名称'}>
                        {getFieldDecorator(`JlUnitName_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：武魂殿" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '电话'}>
                        {getFieldDecorator(`JlUnitPhone_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：12345678912" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '邮箱'}>
                        {getFieldDecorator(`JlUnitEmail_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(<Input placeholder="示例：123456@qq.com" disabled />)}
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Form.Item label={i > 0 ? '' : '职位'}>
                        {getFieldDecorator(`JlUnitJob_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                          <Select
                            placeholder="示例：方案编制人"
                            onFocus={this.getMemberType}
                            dropdownMatchSelectWidth={false}
                            style={{ width: '100%' }}
                          >
                            {this.state.memberType.map(job => <Select.Option key={job.scId}>{job.itemName}</Select.Option>)}
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Form.Item>
                        <Button
                          type='dashed'
                          style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' }}
                          onClick={_ => {
                            const addJlUnit = this.state.addJlUnit;
                            addJlUnit[i] = undefined;
                            this.setState({ addJlUnit });
                          }}
                        >删除</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              } else {
                return null
              }
            })}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addJlUnit: [...this.state.addJlUnit, this.state.addJlUnit.length] }) }}>
                    <Icon type="plus" /> 批量增加单位信息
                      </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Button type='primary' onClick={this.handleSubmit}>下一步</Button>

        </Form>

        <MemberForm visible={this.state.addMemberInfoModal} setVisible={this.setAddMemberInfoModalVisible} />
        {/* <Divider style={{ margin: '40px 0 24px' }} />
        <div>
          <h4>易大师</h4>
          <p>
            无极之道，在我内心延续。 In me, Wuju lives on.
          </p>
        </div> */}
      </div>
    );
  }
}

@Form.create()
class MemberForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  handleSubmit = () => {
    const { form, setVisible } = this.props;
    const { validateFields } = form;
    validateFields((err, values) => {
      if (!err) {
        let result = {
          memberName: values.memberName,
          memberCompany: values.memberCompany,
          memberPhone: values.memberPhone,
          memberEmail: values.memberEmail,
        };
        getCountMemberInfo(result).then(res => {
          const { code, msg, data } = res.data;
          if (code === 0) {
            addMember(result).then(res => {
              const { code, msg, data } = res.data;
              if (code === 0) {
                setVisible(false);
              } else {
                message.info(msg);
              }
            }).catch(err => {
              message.error(err);
            })
          } else {
            message.info(msg);
          }
        }).catch(err => {
          message.error(err);
        })
      }
    })
  }
  render() {
    const { setVisible, visible, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="添加人员信息"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={_ => { setVisible(false) }}
        okText="确认"
        cancelText="取消"
      >
        <Form >
          <Form.Item label="姓名">
            {getFieldDecorator('memberName', {
              rules: [{ required: true, message: '请输入人员姓名' }],
            })(<Input placeholder="示例: 李四" />)}
          </Form.Item>
          <Form.Item label="公司">
            {getFieldDecorator('memberCompany', {
              rules: [{ required: true, message: '请输入人员所在公司' }],
            })(<Input placeholder="示例: 中大检测" />)}
          </Form.Item>
          <Form.Item label="电话">
            {getFieldDecorator('memberPhone', {
              rules: [{ required: true, message: '请输入人员电话' }],
            })(<Input placeholder="示例: 12312345678" />)}
          </Form.Item>
          <Form.Item label="邮箱">
            {getFieldDecorator('memberEmail', {
              rules: [{ required: true, message: '请输入人员邮箱' }],
            })(<Input placeholder="示例: 123456@qq.com" />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default AddMemberInfo;