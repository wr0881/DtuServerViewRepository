/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Table, Row, Col } from 'antd';
import style from './inOutLibrary.less'

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
                    {/* <div className={style.sensorTable}>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器编号</span>
                            <span>{this.props.pass.sensorNumber}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器地址</span>
                            <span>{this.props.pass.sensorAddress}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>厂家</span>
                            <span>{this.props.pass.manufacturer}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器型号</span>
                            <span>{this.props.pass.sensorModel}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器名称</span>
                            <span>{this.props.pass.sensorName}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器量程</span>
                            <span>{this.props.pass.sensorRange}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器精度</span>
                            <span>{this.props.pass.sensorAccuracy}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器标定系数K</span>
                            <span>{this.props.pass.timingFactor}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>传感器状态</span>
                            <span>{this.props.pass.status}</span>
                        </div>
                        <div className={style.sensorTableItem} style={{ borderBottom: '0' }}>
                            <span>生产日期</span>
                            <span>{this.props.pass.productDate}</span>
                        </div>
                        <div className={style.sensorTableItem}>
                            <span>结束日期</span>
                            <span>{this.props.pass.endDate}</span>
                        </div>
                    </div> */}
                    <p><span style={{float:'left',width:'200px'}}>传感器编号:</span>{this.props.pass.sensorNumber}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器地址:</span>{this.props.pass.sensorAddress}</p>
                    <p><span style={{float:'left',width:'200px'}}>厂家:</span>{this.props.pass.manufacturer}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器型号:</span>{this.props.pass.sensorModel}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器名称:</span>{this.props.pass.sensorName}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器量程:</span>{this.props.pass.sensorRange}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器精度:</span>{this.props.pass.sensorAccuracy}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器标定系数K:</span>{this.props.pass.timingFactor}</p>
                    <p><span style={{float:'left',width:'200px'}}>传感器状态:</span>{this.props.pass.status}</p>
                    <p><span style={{float:'left',width:'200px'}}>生产日期:</span>{this.props.pass.productDate}</p>
                    <p><span style={{float:'left',width:'200px'}}>结束日期:</span>{this.props.pass.endDate}</p>
                </Modal>
            </div>
        )
    }
}

export default sensorDetail;