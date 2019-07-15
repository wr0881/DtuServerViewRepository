import React, { Component } from 'react';
import { Table, Form, Card, Button, Row, Col, Select, message, Tooltip, BackTop, Input, Icon, List } from 'antd';
import axios from '@/services/axios';

@Form.create()
export default class LogInfo extends Component {

    state = {
        terminalNumbers: [],
        terminalType: 1,
        logDateList: [],
        logFileNameList: [],
        logContent: [],
    }

    componentWillMount() {
        this.setState({ terminalNumbers: this.props.terminalNumbers })
        this.setState({ terminalType: this.props.terminalType });
        // 获取日志产生日期（yyyy-MM-dd）文件夹名称
        axios.get(`/sysLog/getLogDateFileName`)
            .then(response => {
                let result = response.data
                if (result.code == 0) {
                    this.setState({
                        logDateList: result.data,
                    });
                } else {
                    message.warn(result.msg);
                }
            })
            .catch(function (error) {
                message.error(error);
                console.log(error);
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.get(`/sysLog/selectLogByKeyword`, { params: values })
                    .then(response => {
                        // console.log(response)
                        let result = response.data
                        if (result.code == 0) {
                            message.info(result.msg);
                            this.setState({
                                logContent: result.data,
                            });
                        } else {
                            message.warn(result.msg);
                        }
                    })
                    .catch(function (error) {
                        message.error(error);
                        console.log(error);
                    });
            }
        });
    }

    getLogFileNameFun = (selectValue) => {
        // 获取日志文件名称（包括后缀）
        axios.get(`/sysLog/getLogFileName`, { params: { 'logDate': selectValue } })
            .then(response => {
                let result = response.data
                if (result.code == 0) {
                    this.setState({
                        logFileNameList: result.data,
                    });
                } else {
                    message.warn(result.msg);
                }
            })
            .catch(function (error) {
                message.error(error);
                console.log(error);
            });
    }

    searchForm = () => {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { sm: { span: 9 }, xs: { span: 24 }, },
            wrapperCol: { sm: { span: 15 }, xs: { span: 24 } },
        };

        return <div>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: -5 }}>
                <Row gutter={8}>
                    <Col span={4}>
                        <Form.Item label="日志日期" {...formItemLayout}>
                            {getFieldDecorator('logDate', {
                                rules: [{
                                    required: true,
                                    message: '请选择日志日期',
                                }],
                            })
                                (
                                    <Select
                                        placeholder="日志日期"
                                        showSearch={true}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onSelect={this.getLogFileNameFun}
                                    >
                                        {this.state.logDateList.map(dateList => <Select.Option key={dateList}>{dateList}</Select.Option>)}
                                    </Select>
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={4} offset={2} >
                        <Form.Item label={
                            <span>
                                日志文件&nbsp;
                                <Tooltip placement="bottom" title="请先选择日志日期，再选择日志文件">
                                    <Icon type="question-circle-o" />
                                </Tooltip>
                            </span>
                        } {...formItemLayout}
                        >
                            {getFieldDecorator('fileName', {
                                rules: [{
                                    required: true,
                                    message: '请选择日志文件',
                                }],
                            })
                                (
                                    <Select
                                        placeholder="日志文件"
                                        showSearch={true}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                    >
                                        {this.state.logFileNameList.map(logFileName => <Select.Option key={logFileName}>{logFileName}</Select.Option>)}
                                    </Select>
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={4} offset={2} >
                        <Form.Item label="关键字" {...formItemLayout}>
                            {getFieldDecorator('keyword')
                                (
                                    <Input placeholder="关键字" />
                                )}
                        </Form.Item>
                    </Col>
                    <Col span={2} offset={2} >
                        <Form.Item {...formItemLayout}>
                            <Button
                                type="primary"
                                style={{ width: '100%' }}
                                htmlType="submit">
                                查询
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    }

    render() {
        return (
            <div>
                {this.searchForm()}
                <div>
                    <List
                        pagination={{
                            pageSize: 50,
                        }}
                        header={'查询结果'}
                        dataSource={this.state.logContent}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                </div>
                <div>
                    <BackTop>
                        <div style={{
                            'height': '40px',
                            'width': '40px',
                            'lineHeight': '40px',
                            'borderRadius': '4px',
                            'backgroundColor': '#1088e9',
                            'color': '#fff',
                            'textAlign': 'center',
                            'fontSize': '20px',
                        }}>UP</div>
                    </BackTop>
                </div>
            </div >
        )
    }

}