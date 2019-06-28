import React, { Component } from 'react';
import { Table, Form, Input, Modal, Button, Row, Col, Select, message, Badge } from 'antd';
import axios from '@/services/axios';

@Form.create()
export default class ServerTerminal extends Component {

  state = {
    terminalNumbers: [],
    terminalType: 1,
    modalVisible: false,
    projectNames: [],
    terminalData: [],
    pageTotal: 0,
    defaultPageNum: 1,
    defaultPageSize: 10,
  }

  componentWillReceiveProps(props) {
    this.setState({ terminalNumbers: props.terminalNumbers });
    this.setState({ terminalType: props.terminalType }, () => {this.initTerminalTableData()});
  }

  //初始化终端Table的数据
  initTerminalTableData() {
    axios.get(`/terminal/listTerminalInUseByTypeFiled`, { params: { 'terminalType': this.state.terminalType, 'pageNum': this.state.defaultPageNum, 'pageSize': this.state.defaultPageSize } })
      .then(response => {
        let result = response.data
        if (result.code == 0) { //有终端
          this.setState({ terminalData: result.data.list, pageTotal: result.data.total });
        } else { //无终端
          message.error("该服务下暂无终端");
        }
      })
      .catch(function (error) {
        message.error("系统异常，请联系管理员");
        console.log(error);
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.pageNum = this.state.defaultPageNum
        values.pageSize = this.state.defaultPageSize
        values.terminalType = this.state.terminalType
        axios.get(`/terminal/listTerminalInUseByTypeFiled`, { params: values })
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              this.setState({
                terminalData: result.data.list,
                pageTotal: result.data.total,
              });
            } else {
              message.info("该服务下暂无终端");
            }
          })
          .catch(function (error) {
            message.error("系统异常，请联系管理员");
            console.log(error);
          });
      }
    });
  }

  //选择框提供项目名称供选择
  getProjectNames = () => {
    if (this.state.projectNames.length != 0) {
      return
    }
    axios.get(`/project/getProjectNames`)
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            projectNames: result.data,
          });
        } else {
          message.info("暂无项目名称信息，请联系管理员");
        }
      })
      .catch(function (error) {
        message.error("项目名称信息查询失败，请联系管理员");
        console.log(error);
      });
  }

  //终端搜索框
  serachTerminalForm = () => {
    const {
      getFieldDecorator
    } = this.props.form;

    const formItemLayout = {
      labelCol: { sm: { span: 6 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 18 }, xs: { span: 24 } },
    };

    return (<Form onSubmit={this.handleSubmit} style={{ marginTop: -5 }}>
      <Row gutter={8}>
        <Col span={5}>
          <Form.Item label="终端编号" {...formItemLayout}>
            {getFieldDecorator('terminalNumber')(
              <Select
                placeholder="终端编号"
                showSearch={true}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: '100%' }}
                allowClear
              >
                {this.state.terminalNumbers.map(terminalNumber => <Select.Option key={terminalNumber}>{terminalNumber}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="连接状态" {...formItemLayout}>
            {getFieldDecorator('connectStatus')
              (
                <Select placeholder="连接状态" allowClear>
                  <Select.Option value="1">上线</Select.Option>
                  <Select.Option value="0">离线</Select.Option>
                </Select>
              )}
          </Form.Item>
        </Col>
        <Col span={12} >
          <Form.Item label="项目名称"  {...formItemLayout}>
            {getFieldDecorator('projectId')(
              <Select
                placeholder="项目名称"
                showSearch={true}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onDropdownVisibleChange={this.getProjectNames}
                style={{ width: '100%' }}
                allowClear
              >
                {this.state.projectNames.map(project => <Select.Option key={project.projectId}>{project.projectName}</Select.Option>)}
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col span={1}>
          <Form.Item >
            <Button
              type="primary"
              htmlType="submit">
              搜索
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>)
  }

  // 修改采集指令操作  待开发
  showTerminalModal = () => {
    return <Modal
      visible={this.state.modalVisible}
      title="修改终端采集频率"
      onOk={() => { this.setState({ modalVisible: false }) }}
      onCancel={() => { this.setState({ modalVisible: false }) }}
    >
      <Input addonBefore="采集频率" addonAfter="分钟/次" defaultValue="10" />
    </Modal>
  }

  pageSizeOrNumChange = (pageNum, pageSize) => {
    const { form } = this.props;
    const value = form.getFieldsValue();
    let param = {
      pageNum: pageNum,
      pageSize: pageSize,
      terminalType: this.state.terminalType,
      ...value,
    };
    axios.get(`/terminal/listTerminalInUseByTypeFiled`, { params: param })
      .then(response => {
        let result = response.data
        if (result.code == 0) {
          this.setState({
            terminalData: result.data.list,
            pageTotal: result.data.total,
          });
        } else {
          message.info("该服务下暂无终端信息");
        }
      })
      .catch(function (error) {
        message.info("系统异常，请联系管理员");
        console.log(error);
      });
  }

  render() {
    const terminalColumns = [
      {
        title: '终端编号', dataIndex: 'terminalNumber', key: 'terminalNumber', align: 'center',
      }, {
        title: '终端类型', dataIndex: 'terminalType', key: 'terminalType', align: 'center',
      }, {
        title: '采集频率', dataIndex: 'collectionFrequency', key: 'collectionFrequency', align: 'center',
      }, {
        title: '连接状态', dataIndex: 'connectStatus', key: 'connectStatus', align: 'center',
        render: (text, record, index) => {
          let status = 'success';
          if (text === '上线') {
            status = 'success';
          } else if (text === '离线') {
            status = 'error';
          }
          return <Badge status={status} text={text} />;
        },
      }, {
        title: '项目名称', dataIndex: 'projectName', key: 'projectName', align: 'center',
      }, {
        title: '操作', dataIndex: 'operation', key: 'showSensor', align: 'center',
        render: (text, item, index) => {
          return <div><Button onClick={() => {
            this.setState({ modalVisible: true })
          }}>修改采集频率</Button><Button onClick={() => {
            console.log(item)
            const hide = message.loading('正在发送指令，请稍候');
            // axios.get(`/deviceConfig/manualSend`, { params: {...item,queryInstruct:'00160732012945'} })
            axios.get(`/deviceConfig/manualSend`, { params: item })
              .then(response => {
                let result = response.data
                if (result.code == 0) {
                  hide.then(() => message.info(result.msg));
                } else {
                  hide.then(() => message.error(result.msg));
                }
              })
              .catch(function (error) {
                hide.then(() => message.error(error));
                console.log(error);
              });
          }}>修改生效</Button></div>;
        }
      }];

    return (
      <div>
        {this.serachTerminalForm()}
        {this.showTerminalModal()}
        <div>
          <Table columns={terminalColumns} dataSource={this.state.terminalData} pagination={{
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '40', '50'],
            defaultCurrent: this.state.defaultPageNum,
            defaultPageSize: this.state.defaultPageSize,
            total: this.state.pageTotal,
            onShowSizeChange: this.pageSizeOrNumChange,
            onChange: this.pageSizeOrNumChange,
          }} />
        </div>
      </div>
    )
  }
}