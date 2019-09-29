import React, { Component } from 'react';
import { Tooltip, Icon, Divider } from 'antd';
import mark from './mark.svg';
import isMark from './isMark.svg';
import styles from './ImgMark.less';

class ImgMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSize: {
        width: 0,
        height: 0
      },
      dot: [],
    };
  }
  computeRowCol = e => {
    if (e) {
      const boxW = this.box.clientWidth;
      const boxH = this.box.clientHeight;

      const imgWidth = e.currentTarget.naturalWidth;
      const imgHeight = e.currentTarget.naturalHeight;

      // console.log(`box宽高:${boxW},${boxH}  图片宽高:${imgWidth},${imgHeight}`);

      let size = {};
      if (boxW / boxH < imgWidth / imgHeight) {
        size = {
          width: boxW,
          height: imgHeight * boxW / imgWidth,
        }
      } else {
        size = {
          width: imgWidth * boxH / imgHeight,
          height: boxH
        }
      }
      this.setState({ imgSize: size });
    }
  }
  clickXY = e => {
    const currentTarget = e.currentTarget;
    const eleToScreenX = currentTarget.getBoundingClientRect().x;
    const eleToScreenY = currentTarget.getBoundingClientRect().y;
    const clickToScreenX = e.pageX;
    const clickToScreenY = e.pageY;
    return {
      x: clickToScreenX - eleToScreenX,
      y: clickToScreenY - eleToScreenY
    }
  }
  computeRealXY = index => {
    const imgWrapperW = this.imgWrapper.clientWidth;
    const imgWrapperH = this.imgWrapper.clientHeight;
    const imgWidth = this.img.naturalWidth;
    const imgHeight = this.img.naturalHeight;
    const realX = imgWidth * index.x / imgWrapperW;
    const realY = imgHeight * index.y / imgWrapperH;
    return { realX, realY };
  }
  markClick = e => {
    let markXY = this.clickXY(e);
    // markXY.number = this.props.dot.length;
    // markXY.visible = false;
    let realXY = this.computeRealXY(markXY);
    this.props.onChange([...this.props.dot, { ...markXY, ...realXY, id: Date.now().toString(36) }]);
  }
  render() {
    const { style, src } = this.props;
    return (
      <div ref={ref => { this.box = ref }} style={style} className={styles.imgMark}>
        <div
          style={{ width: this.state.imgSize.width, height: this.state.imgSize.height }}
          ref={ref => { this.imgWrapper = ref }}
          className={styles.imgWrapper}
          onClick={this.markClick}
        >
          <img
            ref={ref => { this.img = ref }}
            style={{ width: '100%', height: 'auto' }}
            src={src}
            onLoad={this.computeRowCol}
            alt=""
          />

          {this.props.dot.map((v, i) => {
            return (
              <div
                key={i}
                style={{ top: v.y - 25, left: v.x - 12.5 }}
                className={styles.CurMarkDot}
              >
                <Tooltip
                  // visible={v.visible}
                  title={
                    v.indexName ? v.indexName : `在下面表格填写测点名称`
                  }>
                  <img src={v.isMark ? isMark : mark} style={{ width: '100%', height: 'auto' }} alt="" />
                </Tooltip >
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default ImgMark;