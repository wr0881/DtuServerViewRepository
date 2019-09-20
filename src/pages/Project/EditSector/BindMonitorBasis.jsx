/* eslint-disable */
import React, { Component, Fragment } from 'react';
import { getBindingMonitorBasis,removeBindingMoniBas,addSectorMoniBas,notSectorMoniBas } from '@/services/project';
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
  Tag
} from 'antd';
import sectormodel from './sectorModel';

const FormItem = Form.Item;

@Form.create()
class BindMonitorBasis extends Component {
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

  // 获取绑定监测依据表格
  queryDataSource = (loading = true) => {
    this.setState({tableLoading:true && loading});
    const { formValues, pagination } = this.state;
    let params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      sectorId: sectormodel.sectorId,
      ...formValues,
    };
    getBindingMonitorBasis(params).then(res => {
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
  handleDelBasis = (record) => {
    //key
    let body = [record.key];
    //console.log(body);
    removeBindingMoniBas(body).then(res => {
      let result = res.data;
      //console.log(result.code);
      if(result.code === 0){
        message.success('解绑监测依据成功!');
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
        <FormItem label="文件编号">
          {getFieldDecorator('number')(<Input placeholder="请输入文件编号" style={{ width: '200px' }} />)}
        </FormItem>
        <FormItem label="文件名称">
          {getFieldDecorator('fileName')(<Input placeholder="请输入文件名称" style={{ width: '200px' }} />)}
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
            绑定依据
          </Button>
        </FormItem>
      </Form>
    );
  }
  render() {
    const columns = [
      {
        title: '文件编号',
        dataIndex: 'number',
        align: 'center',
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
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
              onConfirm={()=>this.handleDelBasis(record)}
            >
              <a>解绑</a>
            </Popconfirm>
          </span>
        ),
      },
    ]
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

        <AddMonitorBasis
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
class AddMonitorBasis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notSectorMoniBasData:[],
      addMoniBasNum: [0],
    };
  }
  handleSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const sectorId = sectormodel.sectorId;
      const values = fieldsValue;
      const params = Object.values(values);
      addSectorMoniBas(sectorId,params).then(res => {
        const { code, data, msg } = res.data;
        if(code === 0){
          message.success('绑定成功');
          this.props.handleDrawerVisible(false);
          this.props.queryDataSource(false);
        } else {
          message.info(msg);
        }
      }).catch(err => {
        
      })
      this.setState({
        formValues: values,
      }, _ => { this.queryDataSource });
      this.props.handleDrawerVisible(false);
    })
  }

  // 区间下没有绑定的监测依据
  NotSectorMoniBas = () =>{
    let params = { sectorId:sectormodel.sectorId }
    notSectorMoniBas(params).then(res => {
      const { code, msg, data } = res.data;
      if(code === 0) {
        this.setState({ notSectorMoniBasData:data });
        console.log(this.state.notSectorMoniBasData);
      }else{
        this.setState({ notSectorMoniBasData:[] });
      }
    }).catch(err => {
      //console.log(err);
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Drawer
        title="绑定监测依据"
        width={600}
        onClose={_ => { this.props.handleDrawerVisible(false) }}
        visible={this.props.drawerVisible}
        destroyOnClose
      >
        <Form
          layout="vertical"
          hideRequiredMark
          onSubmit={this.handleSubmit}
        >
          {this.state.addMoniBasNum.map(i => {
            if(i !== undefined){
              return(
                <Row gutter={16} key={i}>
                  <Col span={18}>
                    <FormItem label={i > 0 ? '' : '文件编号和名称'}>
                      {getFieldDecorator(`fileName_${i}`)(
                        <Select 
                          placeholder="请选择文件"
                          onFocus={this.NotSectorMoniBas}
                        >
                          {this.state.notSectorMoniBasData.map(v => <Select.Option key={v.monitoringBasis} value={v.monitoringBasis}><span style={{width:'120px',display:'inline-block'}}>{v.number}</span>{v.fileName}</Select.Option>)}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <Form.Item>
                      <Button
                        type='dashed'
                        style={i > 0 ? { width: '100%' } : { top: '29px', width: '100%' } && i === 0 ? {display:'none'}:{display:'block'}}
                        onClick={_ => {
                          const addMoniBasNum = this.state.addMoniBasNum;
                          addMoniBasNum[i] = undefined;
                          this.setState({ addMoniBasNum });
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
                <Button type="dashed" style={{ width: '100%' }} onClick={_ => { this.setState({ addMoniBasNum: [...this.state.addMoniBasNum, this.state.addMoniBasNum.length] }) }}>
                  <Icon type="plus" /> 批量绑定监测依据
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={24}>
              <FormItem label="文件名称">
                {getFieldDecorator('fileName')(
                  <Select 
                    placeholder="请选择文件"
                    onFocus={this.NotSectorMoniBas}
                  >
                    {this.state.notSectorMoniBasData.map(v => <Select.Option key={v.monitoringBasis} value={v.monitoringBasis}>{v.number}/{v.fileName}</Select.Option>)}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row> */}
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
    //this.NotSectorMoniBas();
  }
}

export default BindMonitorBasis;