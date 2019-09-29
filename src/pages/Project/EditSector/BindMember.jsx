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
  Spin
} from 'antd';
import sectormodel from './sectorModel';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;

@observer
@Form.create()
class BindMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
        showQuickJumper: true
      },
      drawerVisible: false,
      tableLoading: false,
      
    };
  }

  handleDrawerVisible = flag => {
    this.setState({ drawerVisible: flag });
  }

  // 获取绑定人员表格
  queryDataSource = (loading = true) => {
    this.setState({tableLoading:true && loading});
    sectormodel.NotSectorMember();
    const { formValues, pagination } = this.state;
    let params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sectorId: sectormodel.sectorId,
      ...formValues,
    };
    getBindingMember(params).then(res => {
      this.setState({ tableLoading: false });
      const { code, data } = res.data;
      if(code === 0 ){
        this.setState({ dataSource: data.list });
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
      }else{
        this.setState({ dataSource: [] });
      }
    }).catch(err => {
      this.setState({ tableLoading: false });
      console.log(`BindingMember code is catch`);
    })
  }; 
  //查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      //console.log(values);
      this.setState({
        formValues: values,
      }, _ => { this.queryDataSource() });
    });
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };
  // 删除绑定关系
  handleDelMember = (record) => {
    // key值
    let body = [record.key];
    //console.log(body);
    removeSectorMember(body).then(res => {
      let result = res.data;
      if(result.code === 0){
        message.success('解绑人员成功!');
        this.queryDataSource();
      }else{
        message.info(result.msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <FormItem label="人员姓名">
          {getFieldDecorator('memberName')(<Input placeholder="请输入人员姓名" style={{ width: '200px' }} />)}
        </FormItem>
        <FormItem label="人员类型">
          {getFieldDecorator('memberType')(
            <Select placeholder="请选择人员类型" style={{ width: '200px' }}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="建设单位">建设单位</Select.Option>
              <Select.Option value="施工单位">施工单位</Select.Option>
              <Select.Option value="监测单位">监测单位</Select.Option>
              <Select.Option value="监理单位">监理单位</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={e => {
            e.preventDefault();
            this.handleFormReset();
          }}>
            重置
          </Button>
        </FormItem>
        {/* <Divider /> */}
        <FormItem>
          <Button icon="plus" type="dashd" onClick={e => {
            e.preventDefault();
            this.handleDrawerVisible(true);
          }}>
            绑定人员
          </Button>
        </FormItem>
      </Form>
    );
  }
  
  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'memeberName',
        align: 'center',
      },
      {
        title: '公司',
        dataIndex: 'memberCompany',
        align: 'center',
      },
      {
        title: '邮箱',
        dataIndex: 'memberEmail',
        align: 'center',
      },
      {
        title: '电话',
        dataIndex: 'memberPhone',
        align: 'center',
      },
      {
        title: '人员类型',
        dataIndex: 'memberType',
        align: 'center',
      },
      {
        title: '职位',
        dataIndex: 'sectorRole',
        align: 'center',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => (
          <span>
            {/* <a>编辑</a>
            <Divider type="vertical" /> */}
            <Popconfirm
              title="确定解除绑定关系?"
              onConfirm={()=>this.handleDelMember(record)}
            >
              <a>解绑</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <Fragment>
        <Card bordered={false}>
          {this.renderSimpleForm()}
          <Divider />
          <Table 
            loading={this.state.tableLoading}
            columns={columns}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            onChange={(pagination) => {
              this.setState({ pagination }, this.queryDataSource.bind(this));
            }}
          />
        </Card>

        <AddMember
          drawerVisible={this.state.drawerVisible}
          handleDrawerVisible={this.handleDrawerVisible}
          queryDataSource={this.queryDataSource}
        />
      </Fragment>
    );
  }
  componentDidMount(){
    this.queryDataSource();
  }
}

@Form.create()
class AddMember extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMemberNum: [0],
      memberNameList: [],
      //notBindMemberData:[],
      memberType: [],
      //formValues: []

      getInstrMemberInfoLoading: false
    };
  }

  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      
      //console.log(fieldsValue);
      if(!err){
        let result = [];
        
        let memberIdKeys = Object.keys(fieldsValue).filter(item => item.indexOf('memberId_') > -1);
        let memberTypeKeys = Object.keys(fieldsValue).filter(item => item.indexOf('memberType_') > -1);
        let sectorRoleKeys = Object.keys(fieldsValue).filter(item => item.indexOf('sectorRole_') > -1);

        for(let i = 0; i < memberIdKeys.length; i++){
          result.push({
            memberId: fieldsValue[memberIdKeys[i]],
            memberType: fieldsValue[memberTypeKeys[i]],
            sectorRole: fieldsValue[sectorRoleKeys[i]]
          })
        }
        const sectorId = sectormodel.sectorId;
        addUnbindMember(sectorId,result).then(res => {
          const { code, data, msg } = res.data;
          if (code === 0) {
            message.success('绑定成功');
            this.props.handleDrawerVisible(false);
            this.props.queryDataSource(false);
          } else {
            message.info(msg);
          }
        }).catch(err => {
          
        })
        this.setState({
          formValues: result,
        }, _ => { this.queryDataSource });
        this.props.handleDrawerVisible(false);
      }
    });
  };

  // 区间下没有绑定的人员
  // NotSectorMember = () => {
  //   let params = { sectorId:sectormodel.sectorId }
  //   notSectorMember(params).then(res => {
  //     const { code, msg, data } = res.data;
  //     if(code === 0) {
  //       this.setState({ notBindMemberData:data });
  //       console.log(this.state.notBindMemberData);
  //     }else{
  //       this.setState({ notBindMemberData:[] });
  //     }
  //   }).catch(err => {
  //     //console.log(err);
  //   });
  // };

  //获取人员信息
  getInstrMemberInfo = (value, type, i) => {
    if (value) {
      this.setState({ getInstrMemberInfoLoading: true });
      getInstrMemberInfo({ memberName: value }).then(res => {
        const { code, data, msg } = res.data;
        console.log('人员信息:',code,data);
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
  // 获取职位信息
  getSectorRole = () => {
    getMemberType().then(res => {
      const { code, msg, data } = res.data;
      //console.log(code);
      if(code === 0) {
        this.setState({memberType:data});
        //console.log(this.state.memberType);
      }else{
        this.setState({memberType:[]})
      }
    }).catch(err => {

    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    return (
      <Drawer
        title="绑定人员"
        width={1000}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
        destroyOnClose
      >
        <Form
          layout="vertical"
          //hideRequiredMark
          onSubmit={this.handleSubmit}
        > 
          {this.state.addMemberNum.map(i => {
            if(i !== undefined){
              return(
                <Row gutter={16} key={i}>
                  <Col span={4}>
                    <Form.Item label={i > 0 ? '' : '人员'}>
                      {getFieldDecorator(`memberId_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                        <Select 
                          placeholder="请选择人员"
                          showSearch
                          loading={this.state.getInstrMemberInfoLoading}
                          notFoundContent={this.state.getInstrMemberInfoLoading ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={debounce(v => { this.getInstrMemberInfo(v, 'memberId', i) }, 800)}
                          onChange={value => {
                            if (this.state[`memberId${i}Data`]) {
                              let select = this.state[`memberId${i}Data`].filter(v => v.memberId.toString() === value)[0];
                              this.props.form.setFieldsValue({
                                [`memberCompany_${i}`]: select.memberCompany,
                                [`memberPhone_${i}`]: select.memberPhone,
                              });
                            }
                          }}
                        >
                          {this.state[`memberId${i}Data`] && this.state[`memberId${i}Data`].map(v =>(
                            <Select.Option  
                              key={v.memberId}
                              //style={{lineHeight:'13px'}}
                            >
                              {v.memberName}
                            </Select.Option>          
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item label={i > 0 ? '' : '单位'}>
                      {getFieldDecorator(`memberCompany_${i}`, {
                        rules: [
                          { required: false, message: '不允许为空' },
                        ]
                      })(
                        <Input placeholder='人员单位' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label={i > 0 ? '' : '电话'}>
                      {getFieldDecorator(`memberPhone_${i}`, {
                        rules: [
                          { required: false, message: '不允许为空' },
                        ]
                      })(
                        <Input placeholder='人员电话' />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label={i > 0 ? '' : '人员类型'}>
                      {getFieldDecorator(`memberType_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                        <Select placeholder="请选择人员类型">
                          <Select.Option value={0}>建设单位</Select.Option>
                          <Select.Option value={1}>施工单位</Select.Option>
                          <Select.Option value={2}>监测单位</Select.Option>
                          <Select.Option value={3}>监理单位</Select.Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label={i > 0 ? '' : '职位'}>
                      {getFieldDecorator(`sectorRole_${i}`, {
                          rules: [
                            { required: true, message: '不允许为空' },
                          ],
                        })(
                        <Select placeholder="请选择职位">
                          {this.state.memberType.map(v => <Select.Option key={v.id} value={v.scId}>{v.itemName}</Select.Option>)}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button
                        type='dashed'
                        style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' } && i === 0 ? {display:'none'}:{display:'block'}}
                        onClick={_ => {
                          const addMemberNum = this.state.addMemberNum;
                          addMemberNum[i] = undefined;
                          this.setState({ addMemberNum });
                        }}
                      >删除</Button>
                    </Form.Item>
                  </Col>
                </Row>
              )
            }else{
              return null
            }
          })}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addMemberNum: [...this.state.addMemberNum, this.state.addMemberNum.length] }) }}>
                  <Icon type="plus" /> 批量绑定人员
                </Button>
              </Form.Item>
            </Col>
          </Row>
          
          < div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={_ => { this.props.handleDrawerVisible(false) }} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button type="primary" htmlType='submit'>
              绑定
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
  componentDidMount(){
    sectormodel.NotSectorMember();
    this.getSectorRole();
  }
}

export default BindMember;