import React, { Component } from 'react';
import { Table, Form, Input, Modal, Button, Row, Col, Select, message, Badge, Popconfirm, Typography } from 'antd';
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
    terminalNumber: null,
    collectionFrequency: null,
    currentPageNum: null,
    currentPageSize: null,
    taskStatus: null,
  }

  componentWillReceiveProps(props) {
    this.setState({ terminalNumbers: props.terminalNumbers });
    this.setState({ terminalType: props.terminalType }, () => { this.initTerminalTableData() });
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
            // console.log("handleSubmit 返回值");
            // console.log(response);
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

  flush = () => {
    let pageNum = this.state.currentPageNum;
    let pageSize = this.state.currentPageSize;
    if (this.state.currentPageNum === null) {
      pageNum = this.state.defaultPageNum;
    }
    if (this.state.currentPageSize === null) {
      pageSize = this.state.defaultPageSize;
    }
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
        // console.log("flush 返回值");
        // console.log(response);
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

    const formItemLayout1 = {
      labelCol: { sm: { span: 3 }, xs: { span: 24 }, },
      wrapperCol: { sm: { span: 21 }, xs: { span: 24 } },
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
          <Form.Item label="项目名称"  {...formItemLayout1}>
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
              style={{width:'100%',paddingLeft:'8px',paddingRight:'8px'}}
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
      destroyOnClose={true}
      visible={this.state.modalVisible}
      title="修改终端采集频率"
      onOk={() => {
        let oldCollectionFrequency = this.state.collectionFrequency;
        let newCollectionFrequency = this.refs.collectionFrequencyInput.state.value;
        if (oldCollectionFrequency == newCollectionFrequency) {
          message.warn("终端采集频率的值未修改");
          return;
        }
        let params = { terminalNumber: this.state.terminalNumber, collectionFrequency: newCollectionFrequency };
        this.setState({ modalVisible: false }),
          axios.put(`/terminal/updateTerminal`, params)
            .then(response => {
              let result = response.data
              if (result.code == 0) {
                message.info("修改终端采集频率为 " + newCollectionFrequency + " 成功，如需要是定时任务生效，请点击右边的[ 修改生效 ]按钮");
                this.flush();
              } else {
                message.info("终端采集频率修改失败");
              }
            })
            .catch(function (error) {
              message.info("系统异常，请联系管理员");
              console.log(error);
            });
      }}
      onCancel={() => { this.setState({ modalVisible: false }) }}
    >
      <Input ref="collectionFrequencyInput" addonBefore="采集频率" addonAfter="分钟/次" defaultValue={this.state.collectionFrequency} />
    </Modal>
  }

  pageSizeOrNumChange = (pageNum, pageSize) => {
    this.setState({
      currentPageNum: pageNum,
      currentPageSize: pageSize,
    });
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
        // console.log("pageSizeOrNumChange 返回值");
        // console.log(response);
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

  deleteTask = (terminalNumber) => {
    this.checkTaskStatus(terminalNumber, () => {
      let taskStatus = this.state.taskStatus;
      if (taskStatus === 'NONE') {
        message.warn("该任务已删除，删除任务失败");
      } else {
        axios.delete(`/quartz/deleteTask`, {
          data: { taskName: terminalNumber }
        })
          .then(response => {
            let result = response.data
            if (result.code == 0) {
              message.info(result.msg);
            } else {
              message.error(result.msg);
            }
            this.flush();
          })
          .catch(function (error) {
            message.error(error);
            console.log(error);
          });
      }
    })
  }

  checkTaskStatus = (terminalNumber, callCheckTaskStatus) => {
    axios.get(`/quartz/getTaskStatus`, { params: { 'taskName': terminalNumber } })
      .then(response => {
        let result = response.data.msg
        console.log(result);
        this.setState({
          taskStatus: result,
        })
        callCheckTaskStatus();
      })
      .catch(function (error) {
        message.error(error);
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
        render: (text, item, index) => {
          return <div><Typography.Paragraph
            editable={{
              onChange: (textx) => {

                item.collectionFrequency = textx;
                let arr = this.state.terminalData;
                arr[index] = item;
                this.setState({ terminalData: arr })
              }
            }}>{text + ""}</Typography.Paragraph></div>
        }
      }, {
        title: '连接状态', dataIndex: 'connectStatus', key: 'connectStatus', align: 'center',
        render: (text, record, index) => {
          let status = 'default';
          if (text === '上线') {
            status = 'success';
          } else if (text === '离线') {
            status = 'error';
          }
          return <Badge status={status} text={text} />;
        },
      }, {
        title: '任务状态', dataIndex: 'quartzStatus', key: 'quartzStatus', align: 'center',
        render: (text, record, index) => {
          let status = 'default';
          if (text === 'NORMAL') {
            status = 'success';
            text = '已启动';
          } else if (text === 'NONE') {
            status = 'default';
            text = '未启动';
          } else if (text === 'PAUSED') {
            status = 'processing';
            text = '已暂停';
          } else if (text === 'BLOCKED') {
            status = 'error';
            text = '阻塞';
          } else if (text === 'ERROR') {
            status = 'error';
            text = '错误';
          } else if (text === 'COMPLETE') {
            status = 'default';
            text = '完成';
          }
          return <Badge status={status} text={text} />;
        },
      }, {
        title: '项目名称', dataIndex: 'projectName', key: 'projectName', align: 'center',
      }, {
        title: '操作', dataIndex: 'operation', key: 'showSensor', align: 'center',
        render: (text, item, index) => {
          return <div>
            <Button onClick={() => {
              this.setState({
                modalVisible: true,
                terminalNumber: item.terminalNumber,
                collectionFrequency: item.collectionFrequency,
              })
            }}>修改采集频率</Button>
            <Button onClick={() => {
              const hide = message.loading('正在按照新采集频率重启任务，请稍候', 1);
              const params = new URLSearchParams();
              params.append('taskName', item.terminalNumber);
              params.append('intervalInMinutes', item.collectionFrequency);
              // axios.put(`/quartz/updateByIntegralPoint?taskName=${item.terminalNumber}&intervalInMinutes=${item.collectionFrequency}`)
              // PUT 方式用下面的格式不可行
              // axios.put(`/quartz/updateByIntegralPoint`, {params: {'taskName':item.terminalNumber, 'intervalInMinutes': item.collectionFrequency}})
              axios.put(`/quartz/updateByIntegralPoint`, params)
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
            }}>修改生效</Button>
            <Button onClick={() => {
              let terminalNumber = item.terminalNumber;
              this.checkTaskStatus(terminalNumber, () => {
                let taskStatus = this.state.taskStatus;
                if (taskStatus !== 'NONE') {
                  message.warn("该任务已存在，新建任务失败");
                } else {
                  const params = new URLSearchParams();
                  params.append('terminalNumber', terminalNumber);
                  params.append('collectionFrequency', item.collectionFrequency);
                  axios.post(`/quartz/newSimpleTask`, params)
                    .then(response => {
                      let result = response.data
                      if (result.code == 0) {
                        message.info(result.msg);
                      } else {
                        message.error(result.msg);
                      }
                      this.flush();
                    })
                    .catch(function (error) {
                      message.error(error);
                      console.log(error);
                    });
                }
              })
            }}>新建任务</Button>
            <Button onClick={() => {
              let taskName = item.terminalNumber;
              this.checkTaskStatus(taskName, () => {
                let taskStatus = this.state.taskStatus;
                if (taskStatus === 'NONE') {
                  message.warn("该任务已删除，启动任务失败");
                } else if (taskStatus === 'PAUSED') {
                  message.warn("该任务已暂停，启动任务失败，如需重启，请点击恢复任务");
                } else if (taskStatus === 'NORMAL' || taskStatus === 'BLOCKED' || taskStatus === 'COMPLETE') {
                  const params = new URLSearchParams();
                  params.append('taskName', taskName);
                  axios.put(`/quartz/runTask`, params)
                    .then(response => {
                      let result = response.data
                      if (result.code == 0) {
                        message.info(result.msg);
                      } else {
                        message.error(result.msg);
                      }
                      this.flush();
                    })
                    .catch(function (error) {
                      message.error(error);
                      console.log(error);
                    });
                } else {
                  message.warn("该任务异常，启动任务失败，请联系管理员");
                }
              })
            }}>启动任务</Button>
            <Button onClick={() => {
              let taskName = item.terminalNumber;
              this.checkTaskStatus(taskName, () => {
                let taskStatus = this.state.taskStatus;
                if (taskStatus === 'NONE') {
                  message.warn("该任务已删除，暂停任务失败");
                } else if (taskStatus === 'NORMAL') {
                  const params = new URLSearchParams();
                  params.append('taskName', taskName);
                  // axios.put(`/quartz/pauseTask?taskName=` + item.terminalNumber)
                  axios.put(`/quartz/pauseTask`, params)
                    .then(response => {
                      let result = response.data
                      if (result.code == 0) {
                        message.info(result.msg);
                      } else {
                        message.error(result.msg);
                      }
                      this.flush();
                    })
                    .catch(function (error) {
                      message.error(error);
                      console.log(error);
                    });
                } else if (taskStatus === 'PAUSED') {
                  message.warn("该任务已暂停，暂停任务失败");
                } else {
                  message.warn("该任务异常，暂停任务失败");
                }
              })
            }}>暂停任务</Button>
            <Button onClick={() => {
              let taskName = item.terminalNumber;
              this.checkTaskStatus(taskName, () => {
                let taskStatus = this.state.taskStatus;
                if (taskStatus === 'PAUSED') {
                  const params = new URLSearchParams();
                  params.append('taskName', taskName);
                  axios.put(`/quartz/resumeTask`, params)
                    .then(response => {
                      let result = response.data
                      if (result.code == 0) {
                        message.info(result.msg);
                      } else {
                        message.error(result.msg);
                      }
                      this.flush();
                    })
                    .catch(function (error) {
                      message.error(error);
                      console.log(error);
                    });
                } else {
                  message.warn("该任务不是暂停状态，恢复任务失败");
                }
              })
            }}>恢复任务</Button>
            <Popconfirm placement="top" title={"是否删除任务"} onConfirm={() => this.deleteTask(item.terminalNumber)} okText="是" cancelText="否">
              <Button>删除任务</Button>
            </Popconfirm>
            <Button onClick={() => {
              this.checkTaskStatus(item.terminalNumber, () => {
                console.log("taskStatus = " + this.state.taskStatus)
              })
            }}>测试</Button>
          </div>;
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