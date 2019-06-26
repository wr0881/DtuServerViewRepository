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
        width: '0',
        height: '0'
      },
      dot: [],
    };
  }
  // computeRowCol = e => {
  //   if (e) {
  //     const boxW = this.box.clientWidth;
  //     const boxH = this.box.clientHeight;

  //     const imgWidth = e.currentTarget.naturalWidth;
  //     const imgHeight = e.currentTarget.naturalHeight;

  //     const scale = boxW / imgWidth;

  //     if (imgHeight * scale > boxH) {
  //       let size = {
  //         width: 'auto',
  //         height: boxH
  //       }
  //       this.setState({ imgSize: size });
  //     } else {
  //       let size = {
  //         width: boxW,
  //         height: 'auto'
  //       }
  //       this.setState({ imgSize: size });
  //     }
  //   }
  // }
  clickXY = e => {
    const currentTarget = e.currentTarget;
    const eleToScreenX = currentTarget.getBoundingClientRect().x;
    const eleToScreenY = currentTarget.getBoundingClientRect().y + 71;
    const clickToScreenX = e.screenX;
    const clickToScreenY = e.screenY;
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
    console.log({ ...index, realX, realY });
    return { ...index, realX, realY };
  }
  markClick = e => {
    let markXY = this.clickXY(e);
    markXY.number = this.props.dot.length;
    markXY.visible = false;
    this.computeRealXY(markXY);
    this.props.onChange([...this.props.dot, markXY]);
  }
  render() {
    const { style, src } = this.props;
    return (
      <div ref={ref => { this.box = ref }} style={style} className={styles.imgMark}>
        <div
          ref={ref => { this.imgWrapper = ref }}
          // className={styles.CurImg}
          onClick={this.markClick}
        >
          <img
            ref={ref => { this.img = ref }}
            // style={this.state.imgSize}
            style={{ width: '100%', height: 'auto' }}
            src={src}
            // onLoad={this.computeRowCol}
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
                <Tooltip
                  visible={v.visible}
                  title={
                    <div onClick={_ => {
                      let dot = this.props.dot;
                      dot.splice(i, 1);
                      this.props.onChange(dot);
                    }}>
                      {v.indexName ? v.indexName : `编号${i}`}
                      &nbsp;&nbsp;
                    <Icon type="close-circle" />
                    </div>
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
  componentDidMount() {
    // console.log(this.computeRowCol());
  }
}

export default ImgMark;