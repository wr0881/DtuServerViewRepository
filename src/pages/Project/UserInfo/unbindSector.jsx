/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Col, Form, Input, Row, Select, DatePicker, message, Button, Transfer } from 'antd';
import { getBindSector, unbindSector } from '@/services/project'


const { Option } = Select;

class UnbindSector extends Component {
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
        console.log(this.props.unbindSector.key);
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
            userId: this.props.unbindSector.key
            //userId: 19
        }
        //console.log(params);
        getBindSector(params).then(res => {
            const { code, msg, data } = res.data;
            let bindData = [];
            //console.log(code,msg);
            if(code === 0){
                //console.log(data.list);
                const bindList = data.list;
                bindList.forEach(v => {
                    bindData.push({
                        key:v.sectorId,
                        title:`区间ID:${v.sectorId} ${v.sectorName}`,
                        description:`${v.sectorName}`
                    });
                    this.setState({bindData});
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
        //const userId = 19;
        const userId = this.props.unbindSector.key;
        const body = this.state.targetKeys;
        //console.log(body);
        unbindSector(userId,body).then(res =>{
            const { code, msg, data } = res.data;
            if(code === 0){
                message.success('解绑区间成功！');
                this.props.handleUnBindSector();
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
                <Button size="small" onClick={this.handlePopup}>解绑区间</Button>
                <Modal
                    title="解绑区间"
                    width='694px'
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    onCancel={this.handleOkOrCancel}
                    okText='解绑'
                >
                   <Transfer
                        listStyle={{
                            width:300,
                            height:300
                        }}
                        render={item => item.title}
                        titles={['已绑定的区间','需解绑的区间']}
                        dataSource={this.state.bindData}
                        targetKeys={targetKeys}
                        onChange={this.onChange}
                    /> 
                </Modal>
            </div>
        )
    }
    componentDidMount() {
               
    }
}

export default UnbindSector;