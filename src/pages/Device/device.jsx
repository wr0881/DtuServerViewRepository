/* eslint-disable */
import React, { Component } from 'react';
import {Checkbox, Table, Form, Popconfirm, Alert, Divider, Switch} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@Form.create()
class Device extends Component {
	constructor (props) {
		super(props);
		this.state = {
			visible: false,
			indeterminate: true,
			checkAll: false,
			data: this.getData(),
            pageSize: 10,
            selectedRowKeys: [],
            selectedRows: []
		};
	}

	state = {
		collapsed: false,
		mode: 'inline',
		selectedRowKeys: [],
		value: undefined,
	};

	onChange = (value) => {
		console.log(value);
		this.setState({ value });
	};

	onSelectChange = (selectedRowKeys) => {
		console.log('selectedRowKeys: ', selectedRowKeys);
		this.setState({selectedRowKeys});
	};

	/**
	 * 全选
	 * @param e
	 */
	onCheckAllChange = (e) => {
		const { data } = this.state;
		this.setState({
			selectedRowKeys: e.target.checked ? data.map((item, index) => index) : [],
		});
	};

	getData = () => {
		const data = [];
		for (let i = 0; i < 8; i += 1) {
			data.push({
				id: '00'+i,
				name: '李四'+i,
				inAndOutSensor: '入库',
				address: '长沙市区...',
				phone: 247839279,
			});
		}
		return data;
	};

	/**
	 * 删除
	 * @param {object} id
	 */
	handleDel = (id) => {
		this.setState(prevState => ({
			data: prevState.data.filter(item => item.id !== id)
		}));
	};

	/**
	 * 分页的改变
	 */
	onShowSizeChange=(current, pageSize)=> {
		//console.log(current, pageSize);
		this.setState({
			pageSize: pageSize,
		});
	}

	get columns () {
		const self = this;
		return [
			{
				title: '学号',
				dataIndex: 'id',
				align: 'center',
				key: '1',

			}, {
				title: '姓名',
				dataIndex: 'name',
				align: 'center',
				key: '2',

			}, {
				title: '出入库',
				dataIndex: 'inAndOutSensor',
				align: 'center',
                key: '3',
                render: (text, record, index) => {
                    const checked = text === '入库' ? true : false;
                    return (
                        <Switch 
                            checkedChildren="已入库"
                            uncheckedChildren="未入库"
                            checked={checked}
                            onChange={e=>{
                                const inAndOutSensor = e ? '入库' : '出库';
                                //updateInAndOut({})
                            }}
                        />
                    )
                }

			}, {
				title: '住址',
				dataIndex: 'address',
				align: 'center',
				key: '4',

			}, {
				title: '电话',
				align: 'center',
				dataIndex: 'phone',
				key: '5',

			}, {
				title: '操作',
				align: 'center',
				dataIndex: 'operation',

				render(text,record) {
					// console.log(111, record);
					return (
						<div align="center">
							<a className="edit-data">添加</a>
                            <Divider type="vertical" />
							<a>编辑</a>
                            <Divider type="vertical" />
							<Popconfirm
								title="确定删除？"
								onConfirm={() => self.handleDel(record.id)}
							>
								<span style={{cursor: 'pointer', color: '#3f87f6'}}>删除</span>
							</Popconfirm>
						</div>
					);
				}
			}
		];
	}

	render() {
		const {selectedRowKeys} = this.state;
		const { data } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys, selectedRows });
            },
			hideDefaultSelections: true,
			onSelection: this.onSelection,
		};

		return (
			<div className="right">
                <Alert 
                    message={
                        <div>
                            已选择{this.state.selectedRowKeys.length}项
                        </div>
                    }
                />
				<Table
                    key={Math.random()}
					columns={this.columns}
					dataSource={data}
					rowSelection={rowSelection}
					pagination={{
						simple: false,
						showSizeChanger: true,
						showTotal: (count) => {
							let pageNum = Math.ceil(count / this.state.pageSize);
							return '共 ' + pageNum + '页' + '/' + count + ' 条数据';
						},
						onShowSizeChange: this.onShowSizeChange
					}}
					bordered
				/>
				{/* <div className="">
					<Checkbox
						indeterminate={this.state.data.length !== this.state.selectedRowKeys.length && this.state.selectedRowKeys.length !== 0}
						onChange={this.onCheckAllChange}
						checked={this.state.data.length === this.state.selectedRowKeys.length}
					>全选
					</Checkbox>
					<span style={{cursor: 'pointer',color: '#3f87f6'}}>
								批量删除
							</span>
				</div> */}
			</div>
		);
	}
}
export default Device;