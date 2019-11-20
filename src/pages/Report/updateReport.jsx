import React, { Component } from 'react';
import {
    Table,
    Row,
    Col,
    Form,
    Card,
    Button
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;


@Form.create()
class UpdateReport extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        // const { getFieldDecorator } = this.props.form;
        // const current = this.state.pagination.current;
        // const pageSize = this.state.pagination.pageSize;
        const columns = [
            {
                title: '序号',
                dataIndex: '',
                //render: (text, record, index) => `${(current - 1) * pageSize + index + 1}`
            },
            {
                title: '报告名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                render: (record) => {
                    return(
                        <div>
                            <Button>预览</Button>
                            <Button>下载</Button>
                        </div>
                    )
                }
            }
        ]
        return (
            <PageHeaderWrapper title='报告下载'>
                <Card bordered={false}>
                    <div>
                        <div>
                            <Table 
                                columns={columns}
                                //dataSource={this.state.dataSource}
                            />
                        </div>
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }

    componentDidMount() {

    }
}

export default UpdateReport;