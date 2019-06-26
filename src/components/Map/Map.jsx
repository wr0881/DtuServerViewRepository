import React, { Component } from 'react';
import axios from 'axios';
import { Map, Marker, NavigationControl, InfoWindow, ScaleControl, OverviewMapControl } from 'react-bmap'
import $script from 'scriptjs';

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
            <div ref='BMap' style={{ width: '500px', height: '500px' }}></div>
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
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        this.map.addEventListener("click", e => {
            this.setState({ point: e.point }, _ => { this.props.setJW(e.point) });
            this.map.centerAndZoom(e.point, this.state.scale);
            this.map.clearOverlays();
            this.map.addOverlay(new BMap.Marker(e.point));
        });
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
                // alert("请先选择地址!");
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