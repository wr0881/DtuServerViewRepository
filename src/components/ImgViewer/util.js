const _inTargetArea = (DOM, targetDOM) => {
  if (DOM === targetDOM) return true;
  let parent = DOM.parentNode;
  while (parent != null) {
    if (parent === targetDOM) return true;
    parent = parent.parentNode;
  }
  return false;
}

const _getOffset = (el) => {
  let positionInfo = el.getBoundingClientRect();
  return {
    left: positionInfo.left,
    right: positionInfo.right,
    top: positionInfo.top,
    bottom: positionInfo.bottom
  }
}

const _getOffsetInElement = (e, target) => {
  let currentDOM = e.target || e.toElement;
  let diffLeft, diffRight, diffTop, diffBottom;
  if (!_inTargetArea(currentDOM, target)) return null;
  const { left, right, top, bottom } = _getOffset(target);
  const { left: eleLeft, right: eleRight, top: eleTop, bottom: eleBottom } = _getOffset(currentDOM);
  diffLeft = eleLeft - left;
  diffRight = eleRight - right;
  diffTop = eleTop - top;
  diffBottom = eleBottom - bottom;
  return { diffLeft, diffRight, diffTop, diffBottom };
}

const _getImageOriginSize = (image) => {
  const src = typeof image === 'object' ? image.src : image;
  return new Promise(resolve => {
    const image = new Image();
    image.src = src;
    image.onload = function () {
      const { width, height } = image;
      resolve({
        width,
        height
      })
    }
  })
}

const _getNodeSize = (node) => {
  return {
    width: node.clientWidth,
    height: node.clientHeight
  }
}

export { _inTargetArea, _getOffset, _getOffsetInElement, _getImageOriginSize, _getNodeSize };