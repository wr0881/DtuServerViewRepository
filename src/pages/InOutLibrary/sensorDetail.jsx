/* eslint-disable */
import React, { Component } from 'react';
import { Modal } from 'antd';

class sensorDetail extends Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false
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
        return(
            <div style={{display:'inline-block'}}>
                <a onClick={this.handlePopup}>详情</a>
                <Modal
                    title={this.props.pass.sensorNumber+'传感器详情'}
                    destroyOnClose={true}
                    footer={null}
                    visible={this.state.visible}
                    onOk={this.handleOkOrCancel}
                    onCancel={this.handleOkOrCancel}
                >
                    <p>传感器编号:{this.props.pass.sensorNumber}</p>
                    <p>传感器地址:{this.props.pass.sensorAddress}</p>
                    <p>厂家:{this.props.pass.manufacturer}</p>
                    <p>传感器型号:{this.props.pass.sensorModel}</p>
                    <p>传感器名称:{this.props.pass.sensorName}</p>
                    <p>传感器量程:{this.props.pass.sensorRange}</p>
                    <p>传感器精度:{this.props.pass.sensorAccuracy}</p>
                    <p>传感器标定系数K:{this.props.pass.timingFactor}</p>
                    <p>传感器状态:{this.props.pass.status}</p>
                    <p>生产日期:{this.props.pass.productDate}</p>
                    <p>结束日期:{this.props.pass.endDate}</p>
                </Modal>
            </div>
        )
    }
}

export default sensorDetail;