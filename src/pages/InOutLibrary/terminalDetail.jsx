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
                        <p><span style={{float:'left',width:'200px'}}>终端编号:</span>{this.props.pass.terminalNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端名称:</span>{this.props.pass.terminalName}</p>
                        <p><span style={{float:'left',width:'200px'}}>厂家:</span>{this.props.pass.manufacturer}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端类型:</span>{this.props.pass.terminalType}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端型号:</span>{this.props.pass.terminalModel}</p>
                        <p><span style={{float:'left',width:'200px'}}>电压:</span>{this.props.pass.voltage}</p>
                        <p><span style={{float:'left',width:'200px'}}>通道数:</span>{this.props.pass.channelNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>采集频率:</span>{this.props.pass.collectionFrequency}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端状态:</span>未使用
                        </p>
                        <p><span style={{float:'left',width:'200px'}}>生产日期:</span>{this.props.pass.productDate}</p>
                        <p><span style={{float:'left',width:'200px'}}>结束日期:</span>{this.props.pass.endDate}</p>
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
                        <p><span style={{float:'left',width:'200px'}}>终端编号:</span>{this.props.pass.terminalNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端名称:</span>{this.props.pass.terminalName}</p>
                        <p><span style={{float:'left',width:'200px'}}>厂家:</span>{this.props.pass.manufacturer}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端类型:</span>{this.props.pass.terminalType}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端型号:</span>{this.props.pass.terminalModel}</p>
                        <p><span style={{float:'left',width:'200px'}}>电压:</span>{this.props.pass.voltage}</p>
                        <p><span style={{float:'left',width:'200px'}}>通道数:</span>{this.props.pass.channelNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>采集频率:</span>{this.props.pass.collectionFrequency}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端状态:</span>使用中
                        </p>
                        <p><span style={{float:'left',width:'200px'}}>生产日期:</span>{this.props.pass.productDate}</p>
                        <p><span style={{float:'left',width:'200px'}}>结束日期:</span>{this.props.pass.endDate}</p>
                    </Modal>
                </div>
            )
        }else if(status===3){
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
                        <p><span style={{float:'left',width:'200px'}}>终端编号:</span>{this.props.pass.terminalNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端名称:</span>{this.props.pass.terminalName}</p>
                        <p><span style={{float:'left',width:'200px'}}>厂家:</span>{this.props.pass.manufacturer}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端类型:</span>{this.props.pass.terminalType}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端型号:</span>{this.props.pass.terminalModel}</p>
                        <p><span style={{float:'left',width:'200px'}}>电压:</span>{this.props.pass.voltage}</p>
                        <p><span style={{float:'left',width:'200px'}}>通道数:</span>{this.props.pass.channelNumber}</p>
                        <p><span style={{float:'left',width:'200px'}}>采集频率:</span>{this.props.pass.collectionFrequency}</p>
                        <p><span style={{float:'left',width:'200px'}}>终端状态:</span>已损坏
                        </p>
                        <p><span style={{float:'left',width:'200px'}}>生产日期:</span>{this.props.pass.productDate}</p>
                        <p><span style={{float:'left',width:'200px'}}>结束日期:</span>{this.props.pass.endDate}</p>
                    </Modal>
                </div>
            )
        }


    }
}

export default terminalDetail;