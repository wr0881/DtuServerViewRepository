import React, { Component, Fragment } from 'react';
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



class editReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Fragment>
        <Card bordered={false}>
          <a href="javascript:POBrowser.openWindowModeless('http://10.88.89.116:9093/page/demoReport','width=1920px;height=1080px;')">demo</a>
        </Card>
      </Fragment>
    );
  }
}

export default editReport;