/* eslint-disable */
import React, { Component } from 'react';
import { Modal } from 'antd';

class terminalDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            terminalStatus: ''
        }
        this.handlePopup = this.handlePopup.bind(this);
        this.handleOkOrCancel = this.handleOkOrCancel.bind(this);
    }
    handlePopup() {
        this.setState({
            visible: true
        })
    }
    handleOkOrCancel() {
        this.setState({
            visible: false
        })
    }
    render(){
        const status = this.props.pass.terminalStatus;
        if(status===1){
            return(
                <div style={{display:'inline-block'}}>
                    <a onClick={this.handlePopup}>详情</a>
                    <Modal
                        title={this.props.pass.terminalNumber+'终端详情'}
                        destroyOnClose={true}
                        footer={null}
                        visible={this.state.visible}
                        onOk={this.handleOkOrCancel}
                        onCancel={this.handleOkOrCancel}
                    >
                        <p>终端编号:{this.props.pass.terminalNumber}</p>
                        <p>终端名称:{this.props.pass.terminalName}</p>
                        <p>厂家:{this.props.pass.manufacturer}</p>
                        <p>终端类型:{this.props.pass.terminalType}</p>
                        <p>终端型号:{this.props.pass.terminalModel}</p>
                        <p>电压:{this.props.pass.voltage}</p>
                        <p>通道数:{this.props.pass.channelNumber}</p>
                        <p>采集频率:{this.props.pass.collectionFrequency}</p>
                        <p>终端状态:未使用
                        </p>
                        <p>生产日期:{this.props.pass.productDate}</p>
                        <p>结束日期:{this.props.pass.endDate}</p>
                    </Modal>
                </div>
            )
        }else if(status===2){
            return(
                <div style={{display:'inline-block'}}>
                    <a onClick={this.handlePopup}>详情</a>
                    <Modal
                        title={this.props.pass.terminalNumber+'终端详情'}
                        destroyOnClose={true}
                        footer={null}
                        visible={this.state.visible}
                        onOk={this.handleOkOrCancel}
                        onCancel={this.handleOkOrCancel}
                    >
                        <p>终端编号:{this.props.pass.terminalNumber}</p>
                        <p>终端名称:{this.props.pass.terminalName}</p>
                        <p>厂家:{this.props.pass.manufacturer}</p>
                        <p>终端类型:{this.props.pass.terminalType}</p>
                        <p>终端型号:{this.props.pass.terminalModel}</p>
                        <p>电压:{this.props.pass.voltage}</p>
                        <p>通道数:{this.props.pass.channelNumber}</p>
                        <p>采集频率:{this.props.pass.collectionFrequency}</p>
                        <p>终端状态:使用中
                        </p>
                        <p>生产日期:{this.props.pass.productDate}</p>
                        <p>结束日期:{this.props.pass.endDate}</p>
                    </Modal>
                </div>
            )
        }

    }
}

export default terminalDetail;