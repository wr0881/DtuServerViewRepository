/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message, Button, Transfer, Table } from 'antd';
import { getUnbindSector, bindingSector } from '@/services/project';
import difference from 'lodash/difference';

const { Option } = Select;

class bindSector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            mockData: [],
            targetKeys: [],
            showSearch: false
        }
        // this.handlePopup = this.handlePopup.bind(this);
        // this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup = () => {
        this.getMock();
        this.setState({
            visible: true
        })
        //console.log(this.props.bindSector.key);
    }
    handleOkOrCancel = () => {
        this.setState({
            visible: false
        })
        
    }
    onChange = nextTargetKeys => {
        this.setState({ targetKeys:nextTargetKeys });
    };

    //获取数据
    getMock = () => {
        //获取未绑定的区间
        const { pagination } = this.state;
        let params = {
            userId: this.props.bindSector.key
        }
        getUnbindSector(params).then(res => {
            const { code, msg, data } = res.data;
            let mockData = [];           
            if(code === 0){
                const unbindList = data;
                unbindList.forEach(v => {
                    mockData.push({
                        key:v.sectorId,
                        title:`${v.sectorName} `,
                        description:`${v.sectorName}`
                    });
                })
                this.setState({mockData});
            }
        })        
    };
    //确定
    handleSubmit = () => {
        const userId = this.props.bindSector.key
        const body = this.state.targetKeys;
        bindingSector(userId,body).then(res =>{
            const { code, msg, data } = res.data;
            if(code === 0){
                message.success('绑定区间成功！');
                //this.props.handleBindSector();
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
                <Button size="small" onClick={this.handlePopup}>绑定区间</Button>
                <Modal
                    title="绑定区间"
                    width='730px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                    okText='绑定'
                >
                    <TableTransfer
                        listStyle={{
                            width:320,
                        }}
                        dataSource={this.state.mockData}
                        targetKeys={targetKeys}
                        titles={['未绑定的区间','需绑定的区间']}
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

export default bindSector;