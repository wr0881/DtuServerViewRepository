import React, { Component } from 'react';
import axios from 'axios';
import { Map, Marker, NavigationControl, InfoWindow, ScaleControl, OverviewMapControl } from 'react-bmap'
import $script from 'scriptjs';
import { Input } from 'antd';

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
                <div>
                    <Input.Group compact>
                        {/* <Input style={{ width: 170, textAlign: 'center' }} placeholder="经度" value={this.state.JW.lng} disabled />  */}
                        <Input id="longitude" style={{ width: 170, textAlign: 'center' }}  />
                        
                        <Input
                        style={{
                            width: 30,
                            borderLeft: 0,
                            pointerEvents: 'none',
                            backgroundColor: '#fff',
                        }}
                        placeholder="~"
                        disabled
                        />
                        {/* <Input style={{ width: 170, textAlign: 'center', borderLeft: 0 }} placeholder="纬度" value={this.state.JW.lat} disabled />  */}
                        
                        <Input id="latitude" style={{ width: 170, textAlign: 'center' }}  />
                    </Input.Group>
                </div>
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
        this.map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        this.map.enableScrollWheelZoom(true);

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


import React, { Component } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react';
import { Map, Marker, NavigationControl, InfoWindow, ScaleControl, OverviewMapControl } from 'react-bmap'
import $script from 'scriptjs';
import { Input, Slider, Form, Button } from 'antd';

@observer
@Form.create()
class BaiduMap extends Component{
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

    onValidateForm = () => {
        const { form } = this.props;
        const { validateFields } = form;
        validateFields((err, values) => {
            if (!err) {

            }
        })
    }
    
    mapForm = () => {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <Form layout="horizontal" className=''>
                <Form.Item label="">
                    {getFieldDecorator('mapScale',{
                        initialValue: 10,
                        rules: [{ required: true }],
                    })(
                        <Slider min={3} max={19} tipFormatter={v => `缩放比例: ${v}`} 
                        tooltipPlacement='right'
                        tooltipVisible={true}
                        />
                    )}
                </Form.Item>
                <Input.Group compact>
                <Form.Item>
                    {getFieldDecorator('longitude')(
                        <Input style={{ width: 170, textAlign: 'center' }} placeholder="经度" />
                    )}
                </Form.Item>
                <Form.Item>
                    <div style={{paddingLeft:'10px',paddingRight:'10px',color:'#d9d9d9'}}>~</div>
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('latitude')(
                        <Input style={{ width: 170, textAlign: 'center' }} placeholder="纬度" />
                    )}
                </Form.Item>
                <Button onClick={this.getLocation}>定位</Button>
                </Input.Group>
            </Form>
        )
    }

    render() {
        return (
            <div>
                <div>
                    {this.mapForm()}
                </div>
                <div className='map'>
                    <div ref='BMap' style={{ width: '500px', height: '500px' }}></div>
                </div>
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
            this.setState({ point: e.point }, _ => { this.props.setJW(e.point) });
            this.map.centerAndZoom(e.point, this.state.scale);
            this.map.clearOverlays();
            this.map.addOverlay(new BMap.Marker(e.point));
        });

        //鼠标滚动缩放监听
        this.map.addEventListener("zoomend", e => {
            const zoom = this.map.getZoom();
            console.log('当前缩放比例:',zoom);
            // const mapscale = this.props.form.getFieldValue('mapScale');
            // console.log('滑动输入条当前缩放比例',mapscale);
        })
        
    }
    //获取定位
    getLocation = () => {
        const lng = this.props.form.getFieldValue('longitude');
        console.log('输入框当前经度:',lng);
        const lat = this.props.form.getFieldValue('latitude');
        console.log('输入框当前纬度:',lat);
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
}

export default BaiduMap;

