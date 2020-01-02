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
    Checkbox
} from 'antd';
import { observer } from 'mobx-react';

const { Option } = Select;

@observer
@Form.create()
class GenerateReport extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;

        return (
        <Fragment>
            <Card bordered={false}>
            <Button type='primary' onClick={_ => {  }}>报告上传</Button>
            <Divider />
            
            <Select
                mode="multiple"
                style={{ width: '30%' }}
                showArrow
                placeholder="选择报告类型"
                //defaultValue={['china']}
                onChange={ this.handleChange}
                optionLabelProp="label"
            >
                <Option value="china" label="China">
                <span role="img" aria-label="China">
                    CN
                </span>
                China (中国)
                </Option>
                <Option value="usa" label="USA">
                <span role="img" aria-label="USA">
                    🇺🇸
                </span>
                USA (美国)
                </Option>
                <Option value="japan" label="Japan">
                <span role="img" aria-label="Japan">
                    🇯🇵
                </span>
                Japan (日本)
                </Option>
                <Option value="korea" label="Korea">
                <span role="img" aria-label="Korea">
                    🇰🇷
                </span>
                Korea (韩国)
                </Option>
            </Select>
            </Card>

        </Fragment>
        );
    }
    componentDidMount() {

    }

    
}

export default GenerateReport;
