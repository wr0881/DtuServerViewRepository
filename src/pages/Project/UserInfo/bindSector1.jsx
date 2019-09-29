/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message, Button, Transfer } from 'antd';
import { getUnbindSector, bindingSector } from '@/services/project';

const { Option } = Select;

class bindSector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            mockData: [],
            targetKeys: [],
            pagination: {
                current: 1,
                pageSize: 10,
                
            },
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
        //this.terminalType();
        this.getMock();
        console.log(this.props.bindSector.key);
    }
    handleOkOrCancel() {
        this.setState({
            visible: false
        })
    }

    getMock = () => {

        //获取未绑定的区间
        const { pagination } = this.state;
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
            //userId: this.props.bindSector.key
            userId: 19
        }
        //console.log(params);
        /* 模拟数据 */
        // let unbindData = [];
        // const unbindList = [
        //     {sectorId:1,sectorName:'长丰路站'},
        //     {sectorId:2,sectorName:'檀木桥站'},
        //     {sectorId:3,sectorName:'黄土岭站'},
        //     {sectorId:4,sectorName:'五一广场站'},
        //     {sectorId:5,sectorName:'长丰路站'},
        //     {sectorId:6,sectorName:'檀木桥站'},
        //     {sectorId:7,sectorName:'黄土岭站'},
        //     {sectorId:8,sectorName:'五一广场站'},
        //     {sectorId:9,sectorName:'长丰路站'},
        //     {sectorId:10,sectorName:'檀木桥站'},
        //     {sectorId:11,sectorName:'黄土岭站'},
        //     {sectorId:12,sectorName:'五一广场站'},
        // ];
        // unbindList.forEach(v => {
        //     unbindData.push({
        //         key:v.sectorId,
        //         title:` ${v.sectorName} `,
        //         description:`${v.sectorName}`
        //     });
        //     this.setState({unbindData});
        // });
        getUnbindSector(params).then(res => {
            const { code, msg, data } = res.data;
            let unbindData = [];
            //console.log(code,msg);            
            if(code === 0){
                //console.log(data.list);
                const unbindList = data.list;
                unbindList.forEach(v => {
                    unbindData.push({
                        key:v.sectorId,
                        title:`${v.sectorName} `,
                        description:`${v.sectorName}`
                    });
                    this.setState({unbindData});
                })
            }
        })        
    };
    onChange = targetKeys => {
        //console.log('Target Keys:', targetKeys);
        this.setState({ targetKeys });
    };
    //确定
    handleSubmit = () => {
        const userId = 19;
        //const userId: this.props.bindSector.key
        const body = this.state.targetKeys;
        //console.log(body);
        bindingSector(userId,body).then(res =>{
            const { code, msg, data } = res.data;
            if(code === 0){
                message.success('绑定区间成功！');
                this.props.handleBindSector();
            }else{
                message.info(msg);
            }
        }).catch(err => {
            message.error(err);
        })
        //this.handleOkOrCancel();
        this.setState({
            visible: false
        })
    }
    
    render() {
        const { targetKeys } = this.state;
        return (
            <div style={{ display: 'inline-block' }}>
                {/* <a onClick={this.handlePopup}>绑定区间</a> */}
                <Button size="small" onClick={this.handlePopup}>绑定区间</Button>
                <Modal
                    title="绑定区间"
                    width='690px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                    okText='绑定'
                >
                   <Transfer
                        listStyle={{
                            width:300,
                            height:500
                        }}
                        render={item => item.title}
                        titles={['未绑定的区间','需绑定的区间']}
                        dataSource={this.state.unbindData}
                        targetKeys={targetKeys}
                        onChange={this.onChange}
                        showSearch
                    /> 
                </Modal>
            </div>
        )
    }
    componentDidMount() {
               
    }
}

export default bindSector;


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
            pagination: {
                current: 1,
                pageSize: 10,
                size: 'small',
                total: 0,  
            },
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup = () => {
        this.setState({
            visible: true
        })
        //this.terminalType();
        this.getMock();
        console.log(this.props.bindSector.key);
    }
    handleOkOrCancel = () => {
        this.setState({
            visible: false
        })
        
    }
    onChange = targetKeys => {
        //console.log('Target Keys:', targetKeys);
        this.setState({ targetKeys });
    };

    //获取数据
    getMock = () => {
        //获取未绑定的区间
        const { pagination } = this.state;
        let params = {
            pageNum: pagination.current,
            pageSize: pagination.pageSize,
            userId: this.props.bindSector.key
        }
        //console.log(params);
        getUnbindSector(params).then(res => {
            const { code, msg, data } = res.data;
            let mockData = [];
            //console.log(code,msg);            
            if(code === 0){
                console.log(data);
                const unbindList = data.list;
                unbindList.forEach(v => {
                    mockData.push({
                        key:v.sectorId,
                        title:`${v.sectorName} `,
                        description:`${v.sectorName}`
                    });
                })
                this.setState({mockData});
                this.setState({ pagination: { ...this.state.pagination, total: data.total } });
            }
        })        
    };
    //确定
    handleSubmit = () => {
        //const userId = 19;
        const userId = this.props.bindSector.key
        const body = this.state.targetKeys;
        //console.log(body);
        bindingSector(userId,body).then(res =>{
            const { code, msg, data } = res.data;
            if(code === 0){
                message.success('绑定区间成功！');
                this.props.handleBindSector();
                this.getMock(); 
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
                    console.log(filteredItems);
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
                    if(direction === 'left'){                  
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
                                pagination={this.state.pagination}
                                onChange={(pagination) => {
                                    this.setState({ pagination }, this.getMock.bind(this));
                                }}
                            />
                        );
                    }else if(direction === 'right'){
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
                                // pagination={this.state.pagination}
                                // onChange={(pagination) => {
                                //     this.setState({ pagination }, this.getMock.bind(this));
                                // }}
                            />
                            
                        );
                    }
                }}
            </Transfer>
        );

        //模拟数据
        // const mockData = [];
        // for (let i = 0; i < 20; i++) {
        //     mockData.push({
        //         key: i.toString(),
        //         title: `区间${i + 1}`,
        //         description: `区间描述${i + 1}`,
        //         //disabled: i % 4 === 0,
        //         //tag: mockTags[i % 3],
        //     });
        // }

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
        console.log("targetKeys:",targetKeys);
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
                    {/* <Transfer
                        listStyle={{
                            width:300,
                            height:500
                        }}
                        render={item => item.title}
                        titles={['未绑定的区间','需绑定的区间']}
                        dataSource={this.state.unbindData}
                        targetKeys={targetKeys}
                        onChange={this.onChange}
                        showSearch
                    />  */}
                    <TableTransfer
                        listStyle={{
                            width:320,
                        }}
                        dataSource={this.state.mockData}
                        targetKeys={targetKeys}
                        titles={['未绑定的区间','需绑定的区间']}
                        // showSearch
                        onChange={this.onChange}
                        filterOption={(inputValue, item) =>
                            item.title.indexOf(inputValue) !== -1 || item.tag.indexOf(inputValue) !== -1
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