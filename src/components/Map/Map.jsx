import React, { Component } from 'react';
import axios from 'axios';
import { Map, Marker, NavigationControl, InfoWindow, ScaleControl, OverviewMapControl } from 'react-bmap'
import $script from 'scriptjs';
import { Input, Button } from 'antd';

class BaiduMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            point: null
        };
    }
    static defaultProps = {
        address: '',
        scale: 10
    }
    render() {
        return (
            <div>
                <Button onClick={this.getLocation}>定位</Button>
                <div ref='BMap' style={{ width: '500px', height: '500px' }}></div>
            </div>            
        );
    }
    componentDidMount() {
        this.initBMap();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.scale !== this.props.scale) {
            this.scaleChange();
        }
        if (prevProps.address !== this.props.address) {
            this.addressChange();
        }
    }
    initBMap() {
        this.map = new BMap.Map(this.refs.BMap);
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 10);
        this.map.enableScrollWheelZoom(true);

        this.map.addEventListener("click", e => {
            this.setState( _ => { this.props.setJW(e.point) });
           
            this.map.centerAndZoom(e.point, this.state.scale);
            this.map.clearOverlays();
            this.map.addOverlay(new BMap.Marker(e.point));
            //console.log('获取定位:',e.point.lng,e.point.lat);  
            
        });
        //鼠标滚动缩放监听
        this.map.addEventListener("zoomend", () => {
            const zoom = this.map.getZoom();
            //console.log('当前缩放比例:',zoom);
            this.setState( _ =>{this.props.setScale(zoom)} );
        })
    }
    
    //获取定位
    getLocation = () => {
        const lng = this.props.lng;
        const lat = this.props.lat;
        //console.log('输入框当前经纬度:',lng,lat);
        if(lng !=="" && lat !== ""){
            this.map.clearOverlays();
            let new_point = new BMap.Point(lng,lat);
            let marker = new BMap.Marker(new_point);
            this.map.addOverlay(marker);
            this.map.panTo(new_point);
        }
    }
    addressChange() {
        const { MapCenter, scale, address } = this.props;
        new BMap.Geocoder().getPoint(address, point => {
            if (point) {
                this.setState({ point }, _ => { this.props.setJW(point) });
                this.map.centerAndZoom(point, scale);
                this.map.clearOverlays();
                this.map.addOverlay(new BMap.Marker(point));
            } else {
                //alert("请先选择地址!");
            }
        });
    }
    scaleChange() {
        const { scale } = this.props;
        this.map.centerAndZoom(this.state.point, scale);
    }
    JWChange() {

    }
}

export default BaiduMap;