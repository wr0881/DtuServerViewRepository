import React, { Component } from 'react';
import { Tooltip, Icon, Divider } from 'antd';
import mark from './mark.svg';
import isMark from './isMark.svg';
import styles from './ImgMark.less';

class ImgMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dot: [],
    };
  }
  render() {
    const { style, src } = this.props;
    return (
      <div ref={ref => { this.box = ref }} style={style} className={styles.imgMark}>
        <div
          ref={ref => { this.imgWrapper = ref }}
          onClick={this.markClick}
        >
          <img
            ref={ref => { this.img = ref }}
            style={{ width: '100%', height: 'auto' }}
            src={src}
            draggable={false}
            alt=""
          />
        </div>
        <div className={styles.CurMark}>
          {this.props.dot.map((v, i) => {
            return (
              <div
                key={i}
                style={{ top: v.y - 25, left: v.x - 12.5 }}
                className={styles.CurMarkDot}
              >
                <img src={v.isMark ? isMark : mark} style={{ width: '100%', height: 'auto' }} draggable={false} alt="" />
              </div>
            )
          })}
        </div>
      </div>
    );
  }
  markClick = e => {
    let markXY = this.clickXY(e);
    markXY.number = this.props.dot.length;
    markXY.visible = false;
    let result = this.computeRealXY(markXY);
    this.props.onChange([result]);
  }
  clickXY = e => {
    const currentTarget = e.currentTarget;
    const eleToScreenX = currentTarget.getBoundingClientRect().x;
    const eleToScreenY = currentTarget.getBoundingClientRect().y;
    const clickToScreenX = e.clientX;
    const clickToScreenY = e.clientY;
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
    const realX = (imgWidth * index.x / imgWrapperW).toFixed();
    const realY = (imgHeight * index.y / imgWrapperH).toFixed();
    return { ...index, realX, realY };
  }
}

export default ImgMark;