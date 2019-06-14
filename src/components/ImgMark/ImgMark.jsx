import React, { Component } from 'react';
import { Tooltip, Icon, Divider } from 'antd';
import mark from './mark.svg';
import styles from './ImgMark.less';

class ImgMark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dot: []
    };
  }
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
  markClick = e => {
    let markXY = this.clickXY(e);
    markXY.number = this.props.dot.length;
    markXY.visible = false;
    this.props.onChange([...this.props.dot, markXY]);
  }
  render() {
    const { style, src } = this.props;
    return (
      <div style={style} className={styles.imgMark}>
        <div
          className={styles.CurImg}
          onClick={this.markClick}
        >
          <img
            style={{ width: '100%', height: 'auto' }}
            src={src}
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
                  <img src={mark} style={{ width: '100%', height: 'auto' }} alt="" />
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