/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message, Button, Transfer, Table } from 'antd';
import { getBindSector, unbindSector } from '@/services/project';
import difference from 'lodash/difference';


const { Option } = Select;

class UnbindSector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            mockData: [],
            targetKeys: [],
        }
        //this.handlePopup = this.handlePopup.bind(this);
        //this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup = () => {
        this.getMock();
        this.setState({
            visible: true
        })
        //console.log(this.props.unbindSector.key);
    }
    handleOkOrCancel = () => {
        this.setState({
            visible: false
        })
    }

    getMock = () => {
        //获取未绑定的区间
        const { pagination } = this.state;
        let params = {
            userId: this.props.unbindSector.key
        }
        getBindSector(params).then(res => {
            const { code, msg, data } = res.data;
            let mockData = [];
            if(code === 0){
                const bindList = data;
                bindList.forEach(v => {
                    mockData.push({
                        key:v.sectorId,
                        title:`${v.sectorName}`,
                        description:`${v.sectorName}`
                    });
                    this.setState({mockData});
                })
            }
        })        
    };
    onChange = targetKeys => {
        this.setState({ targetKeys });
    };
    //确定
    handleSubmit = () => {
        const userId = this.props.unbindSector.key;
        const body = this.state.targetKeys;
        //console.log(body);
        unbindSector(userId,body).then(res =>{
            const { code, msg, data } = res.data;
            if(code === 0){
                message.success('解绑区间成功！');
                //this.props.handleUnBindSector();
                //this.getMock();
            }else{
                message.info(msg);
            }
        }).catch(err => {
            message.error(err);
        })
        this.setState({
            visible: false
        })
    }
    
    render() {

        //表格穿梭框
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={false}>
                {({
                    direction,
                    filteredItems,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;
                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                            .filter(item => !item.disabled)
                            .map(({ key }) => key);
                            const diffKeys = selected
                            ? difference(treeSelectedKeys, listSelectedKeys)
                            : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ key }, selected) {
                            onItemSelect(key, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };
                                      
                    return (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                            })}
                        />
                    );
                }}
            </Transfer>
        );

        const leftTableColumns = [
            {
                dataIndex: 'title',
                title: '区间',
            },
        ];
        const rightTableColumns = [
            {
                dataIndex: 'title',
                title: '区间',
            },
        ];
        const { targetKeys } = this.state;
        return (
            <div style={{ display: 'inline-block' }}>
                <Button size="small" onClick={this.handlePopup}>解绑区间</Button>
                <Modal
                    title="解绑区间"
                    width='730px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                    okText='解绑'
                >
                    <TableTransfer
                        listStyle={{
                            width:320,
                        }}
                        dataSource={this.state.mockData}
                        targetKeys={targetKeys}
                        titles={['已绑定的区间','需解绑的区间']}
                        showSearch
                        onChange={this.onChange}
                        filterOption={(inputValue, item) =>
                            item.title.indexOf(inputValue) !== -1
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />
                </Modal>
            </div>
        )
    }
    componentDidMount() {
               
    }
}

export default UnbindSector;