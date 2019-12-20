import React, { Component, Fragment } from 'react';
import axios from 'axios';
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
  Avatar,
  Upload
} from 'antd';
import EditPoint from './EditPoint';
import AddPoint from './AddPoint';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import sectorModel from './sectorModel';
import styles from './style.less';
import { clearPointInfo } from '@/services/project';

const FormItem = Form.Item;
const { TextArea } = Input;

// @observer
class PointList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handleEditPointVisible: false,
      handleAddPointVisible: false,

      PointInfoList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        size: 'midden',
        total: 0,
        showSizeChanger: true,
      },

      getPointInfoListLoading: false,
    };
  }

  handleEditPointVisible = flag => {
    this.setState({ handleEditPointVisible: flag });
  }

  handleAddPointVisible = flag => {
    this.setState({ handleAddPointVisible: flag });
  }

  handleTableChange(pagination) {
    this.setState({ pagination }, this.getPointInfoList.bind(this));
  }

  delectPoint = id => {
    axios.delete('/monitorPoint/removeMonitorPointByMpId', {
      params: {
        mpId: id
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        message.info('删除成功');
        this.getPointInfoList();
      }
    });
  }

  render() {
    const renderContent = (value, row, index) => {
      return (
        <div className="manageTd">
          {value.map(v => {
            return <div key={Math.random()} className="manageTd1">{v === undefined || v === null ? '无' : v}</div>;
          })}
        </div>
      )
    };

    const renderKContent = (value, row, index) => {
      return (
        <div className="manageTd">
          {value && value.map((v, i) => {
            return (
              <Tooltip title={v} key={Math.random()} placement='bottom'>
                <div
                  key={Math.random()}
                  className='k-select'
                  // onClick={_ => {
                  //   pagedata.sector = { sectorId: row.sectorId[i], sectorName: row.sectorName[i] };
                  //   this.props.history.push('/project/manage/detail');
                  // }}
                  style={{ textDecoration: 'none' }}
                >{v}</div>
              </Tooltip>)
          })}
        </div>
      )
    };

    const columns = [
      {
        title: '测点名称',
        dataIndex: 'monitorPointNumber',
        render: (value) => {
          return (
            <div className="manageTd0">{value}</div>
          )
        },
        width: '9%'
      },
      {
        title: '基准点',
        dataIndex: 'benchmarkId',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '监测类型',
        dataIndex: 'monitorTypeName',
        // render: renderContent,
        width: '9%'
      },
      {
        title: 'x轴坐标',
        dataIndex: 'picx',
        // render: renderContent,
        width: '9%'
      },
      {
        title: 'y轴坐标',
        dataIndex: 'picy',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '传感器深度',
        dataIndex: 'sensorDeep',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '传感器编号',
        dataIndex: 'sensorNumber',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '终端通道',
        dataIndex: 'terminalChannel',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '终端编号',
        dataIndex: 'terminalNumber',
        // render: renderContent,
        width: '9%'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={_ => {
              this.handleEditPointVisible(true);
              console.log(text);
              sectorModel.selectPointInfo = text;
            }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确定删除?"
              onConfirm={this.delectPoint.bind(this, text.mpId)}
              okText="是"
              cancelText="否"
            >
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={_ => {
              console.log(record);
              this.resetPointInfo(record);
            }}>重置</a>
          </span>
        ),
        width: '19%'
      },
    ];

    return (
      <Fragment>
        <Drawer
          title={(
            <div>
              <span>布点图测点信息</span>
              <Divider type='vertical' />
              <Button size='small' type='primary' onClick={_ => {
                this.setState({ handleAddPointVisible: true });
              }}>添加测点</Button>
            </div>
          )}
          width={1000}
          onClose={_ => { this.props.handlePointListVisible(false) }}
          visible={this.props.visible}
        >
          <div>
            <Table loading={this.state.getPointInfoListLoading} dataSource={this.state.PointInfoList} columns={columns} pagination={{ ...this.state.pagination }} onChange={this.handleTableChange.bind(this)} />
          </div>

          <div
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
          </div>
        </Drawer >
        {/* 编辑测点 */}
        <EditPoint
          visible={this.state.handleEditPointVisible}
          handleEditPointVisible={this.handleEditPointVisible}
          getPointInfoList={this.getPointInfoList}
        />
        {/* 新增测点 */}
        <AddPoint
          visible={this.state.handleAddPointVisible}
          handleAddPointVisible={this.handleAddPointVisible}
          getPointInfoList={this.getPointInfoList}
          key={Math.random()}
        />
      </Fragment>
    );
  }
  componentDidMount() {
    autorun(() => {
      if (sectorModel.selectImageId) {
        this.getPointInfoList();
      }
    })
  }
  getPointInfoList = () => {
    const { pagination } = this.state;
    this.setState({ getPointInfoListLoading: true });
    axios.get('/monitorPoint/listMonitorPointInfo', {
      params: {
        sectorId: sectorModel.sectorId,
        imageId: sectorModel.selectImageId,
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      }
    }).then(res => {
      const { code, msg, data } = res.data;
      if (code === 0) {
        this.setState({ pagination: { ...this.state.pagination, total: data.total } });
        this.setState({ PointInfoList: data.list }, _ => {
          //console.log(this.state.PointInfoList);
        });
      } else {
        this.setState({ PointInfoList: [] });
      }
      this.setState({ getPointInfoListLoading: false });
    }).catch(err => {
      this.setState({ PointInfoList: [] });
      this.setState({ getPointInfoListLoading: false });
      console.log(err);
    });
  }
  //重置测点
  resetPointInfo = (record) => {
    let body = {
      sensorNumber:record.sensorNumber,
      terminalChannel:record.terminalChannel,
      terminalNumber:record.terminalNumber
    };
    console.log(body);
    clearPointInfo(body).then(res => {
      const { code, msg, data } = res.data;
      console.log(code);
      if(code === 0) {
        message.info("重置成功!");
      }else{
        message.info(msg);
      }
    }).catch(err => {
      message.error(err);
    })
  }

  // formatData(ary) {
  //   let formatData = [];
  //   // ary.forEach(v => {
  //   //   let obj = {};
  //   //   let obj2 = {
  //   //     benchmarkId: [],
  //   //     monitorTypeName: [],
  //   //     picx: [],
  //   //     picy: [],
  //   //     sensorDeep: [],
  //   //     sensorNumber: [],
  //   //     terminalChannel: [],
  //   //     terminalNumber: [],
  //   //   };
  //   //   obj.key = v.mpId;
  //   //   obj.monitorPointNumber = v.monitorPointNumber;
  //   //   v.pointSensorInfos.forEach(v2 => {
  //   //     obj2.benchmarkId.push(v2.benchmarkId);
  //   //     obj2.monitorTypeName.push(v2.monitorTypeName);
  //   //     obj2.picx.push(v2.picx);
  //   //     obj2.picy.push(v2.picy);
  //   //     obj2.sensorDeep.push(v2.sensorDeep);
  //   //     obj2.sensorNumber.push(v2.sensorNumber);
  //   //     obj2.terminalChannel.push(v2.terminalChannel);
  //   //     obj2.terminalNumber.push(v2.terminalNumber);
  //   //   });
  //   //   formatData.push({ ...obj, ...obj2 });
  //   // });
  //   ary.forEach(v => {
  //     let monitorPointNumber = v.monitorPointNumber;
  //     v.pointSensorInfos.forEach(v2 => {
  //       let obj = { monitorPointNumber };
  //       obj.mpId = v2.mpId;
  //       // obj.key = v2.sensorNumber;
  //       obj.benchmarkId = v2.benchmarkId === undefined || v2.benchmarkId === null ? '无' : v2.benchmarkId;
  //       obj.monitorTypeName = v2.monitorTypeName;
  //       obj.picx = v2.picx;
  //       obj.picy = v2.picy;
  //       obj.sensorDeep = v2.sensorDeep;
  //       obj.sensorNumber = v2.sensorNumber;
  //       obj.terminalChannel = v2.terminalChannel;
  //       obj.terminalNumber = v2.terminalNumber;
  //       formatData.push(obj);
  //     });
  //   });
  //   return formatData;
  // }
}

export default PointList;