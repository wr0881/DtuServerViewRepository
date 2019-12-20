import React, { Component } from 'react';
import { _getOffset, _getOffsetInElement, _getImageOriginSize } from './util';
import img from './test.png';
import styles from './ImgViewer.less';

class ImgViewer extends Component {
  constructor(props) {
    super(props);
    this.viewportDOM = null;
    this.imgDOM = null;
    this.state = {
      focus: false,
      imageWidth: 0,
      imageHeight: 0,

      eleStartX: 0,
      eleStartY: 0,
      mouseStartX: 0,
      mouseStartY: 0,

      startLeft: 0,
      startTop: 0,
      currentLeft: 0,
      currentTop: 0,
      scale: 1,
    };
  }
  static defaultProps = {
    id: 'viewport',
    center: true,
    contain: true,
    style: {
      width: '500px',
      height: '500px',
    },
    url: img,
    onChange: (scale, left, top) => { },
    onScale: scale => { },
    children: <img style={{ width: '100%' }} src={img} draggable="false" alt='' />
  }
  render() {
    const { children, className, style } = this.props;
    return (
      <div
        ref={node => { this.viewportDOM = node }}
        className={styles.reactPictureViewer}
        style={style}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
      >
        <div ref={node => { this.imgWrapper = node }} className={styles.imgWrapper}>
          {children}
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.viewportDOM.addEventListener('mousewheel', this.handleMouseWheel);

    _getImageOriginSize(this.props.url).then(res => {
      const { width, height } = res;
      this.setState({
        imageWidth: width,
        imageHeight: height
      });
      this.imgWrapper.style.width = width + 'px';
      this.imgWrapper.style.height = height + 'px';
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentLeft !== this.state.currentLeft || prevState.currentTop !== this.state.currentTop) {
      this.changePosition(this.state.currentLeft, this.state.currentTop);
      // this.props.onChange(this.state.currentLeft, this.state.currentTop, this.state.scale);
    };
    if (prevState.scale !== this.state.scale) {
      this.changeSize(this.state.scale);
      // this.props.onChange(this.state.currentLeft, this.state.currentTop, this.state.scale);
      this.props.onScale(this.state.scale);
    };
  }
  changePosition = (currentLeft, currentTop) => {
    this.imgWrapper.style.top = `${currentTop}px`;
    this.imgWrapper.style.left = `${currentLeft}px`;
  }
  changeSize(scale) {
    const { imageWidth, imageHeight } = this.state;
    this.imgWrapper.style.width = `${imageWidth * scale}px`;
    this.imgWrapper.style.height = `${imageHeight * scale}px`;
  }
  handleMouseDown = (e) => {
    const currentDOM = e.target || e.toElement;
    if (currentDOM.tagName !== 'IMG') return;
    let { diffLeft, diffTop } = _getOffsetInElement(e, this.viewportDOM);
    this.setState({
      focus: true,
      eleStartX: diffLeft,
      eleStartY: diffTop,
      mouseStartX: e.pageX,
      mouseStartY: e.pageY,
    }, _ => {
      // console.log('down');
    });
  }
  handleMouseMove = (e) => {
    const { focus, eleStartX, eleStartY, mouseStartX, mouseStartY } = this.state;
    if (!focus) return;
    let [diffX, diffY] = [e.pageX - mouseStartX, e.pageY - mouseStartY];
    this.setState({
      currentLeft: eleStartX + diffX,
      currentTop: eleStartY + diffY
    }, _ => {
      // console.log('move', this.state.currentLeft, this.state.currentTop);
    });
  }
  handleMouseUp = () => {
    if (this.state.focus) {
      this.setState({
        focus: false,
        eleStartX: 0,
        eleStartY: 0,
        mouseStartX: 0,
        mouseStartY: 0,
      }, _ => {
        // console.log('up');
      });
    }
  }
  handleMouseLeave = () => {
    if (this.state.focus) {
      this.handleMouseUp();
    }
  }
  handleMouseWheel = (e) => {
    const { scale, imageWidth, imageHeight } = this.state;
    let newScale = scale + e.wheelDelta / (1200);
    if (newScale > 0.2) {
      let newWidth = imageWidth * newScale;
      let newHeight = imageHeight * newScale;
      let mouseRuleX = (e.pageX - _getOffset(this.imgWrapper).left) / this.imgWrapper.clientWidth;
      let mouseRuleY = (e.pageY - _getOffset(this.imgWrapper).top) / this.imgWrapper.clientHeight;
      let diffX = (newWidth - this.imgWrapper.clientWidth) * mouseRuleX;
      let diffY = (newHeight - this.imgWrapper.clientHeight) * mouseRuleY;
      this.setState({ currentLeft: this.state.currentLeft - diffX, currentTop: this.state.currentTop - diffY });
      this.setState({ scale: newScale }, _ => { console.log('scale', newScale); });
    } else {
      return;
    }
  }
}

export default ImgViewer;
