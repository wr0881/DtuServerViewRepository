import React, { Component } from 'react';
import { Row, Form, Col, Badge, List, Drawer, Divider, Timeline } from 'antd';
import style from '../Platform/SensorLib/SensorLib.css';

const pStyle = {
  fontSize: 16,
  color: 'rgba(0,0,0,0.85)',
  lineHeight: '24px',
  display: 'block',
  marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: '22px',
      marginBottom: 7,
      color: 'rgba(0,0,0,0.65)',
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: 'inline-block',
        color: 'rgba(0,0,0,0.85)',
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

@Form.create()
export default class SensorInfoDrawer extends Component {
  state = {
    timeLineHeight: '800px',
  };

  componentWillMount() {
    window.onresize = () => {
      this.setState({
        timeLineHeight: `${Math.round(window.innerHeight * 0.72)}px`,
      });
    };
  }

  sensorStatus = text => {
    let status = 'success';
    if (text === '未使用') {
      status = 'default';
    } else if (text === '已损坏') {
      status = 'error';
    }
    return <Badge status={status} text={text} />;
  };

  myTimeLine = data => {
    if (data.length !== 0) {
      let aray = [];
      data.forEach(data => {
        aray.push(
          <Timeline.Item key={data.irId}>
            <p>{data.createDate}</p>
            <Row>
              <Col span={12}>
                <DescriptionItem title="操作人员" content={data.userName} />
              </Col>
              <Col span={12}>
                <DescriptionItem title="操作方式" content={data.operating} />
              </Col>
            </Row>

            <DescriptionItem title="操作具体描述" content={data.operatingDesc} />
          </Timeline.Item>
        );
      });
      return aray;
    } else {
      return <List />;
    }
  };

  render() {
    const timeLinestyle = {
      height: this.state.timeLineHeight,
    };
    return (
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={this.props.click}
        visible={this.props.show}
      >
        <p style={{ ...pStyle, marginBottom: 24 }}>{this.props.datasource.sensorNumber}</p>
        <p style={pStyle}>基本信息</p>
        <Row>
          <Col span={11}>
            <Row>
              <Col span={24}>
                <DescriptionItem title="编号" content={this.props.datasource.sensorNumber} />{' '}
              </Col>
              <Col span={24}>
                <DescriptionItem
                  title="地址(十进制)"
                  content={this.props.datasource.sensorAddress}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="位置" content={this.props.datasource.position} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="状态" content={this.props.datasource.status} />
              </Col>
              <Col span={24}>
                <DescriptionItem title="名称" content={this.props.datasource.sensorName} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="厂家" content={this.props.datasource.manufacturer} />
              </Col>
              <Col span={24}>
                <DescriptionItem title="型号" content={this.props.datasource.sensorModel} />
              </Col>
            </Row>
            <p style={pStyle}>其他信息</p>
            <Row>
              <Col span={24}>
                <DescriptionItem title="量程" content={this.props.datasource.sensorRange} />
              </Col>
              <Col span={24}>
                <DescriptionItem title="精度" content={this.props.datasource.sensorAccuracy} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="标定系数K" content={this.props.datasource.timingFactor} />
              </Col>
              {/* <Col span={24}>
                <DescriptionItem title="解析方式" content={this.props.datasource.parserMethods} />
              </Col> */}
            </Row>
            <Row>
              <Col span={24}>
                <DescriptionItem title="生产日期" content={this.props.datasource.productDate} />
              </Col>
              <Col span={24}>
                <DescriptionItem title="结束日期" content={this.props.datasource.endDate} />
              </Col>
            </Row>
          </Col>
          <Col span={2}>
            <Divider type="vertical" style={{ height: '700px' }} />
          </Col>
          <Col span={11} className={style.lmp_sc_col} style={timeLinestyle}>
            <Timeline>{this.myTimeLine(this.props.timelineData)}</Timeline>
          </Col>
        </Row>
      </Drawer>
    );
  }
}
