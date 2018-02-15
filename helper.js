function getRandomInt(min, max) {
      return Math.floor( Math.random() * (max - min + 1) ) + min;
}

function getStyleValue(_elem, _StyleName) {
      var _Element = _elem;
      if (!_elem) {
        console.error('Element is null : Elementが存在しません。');
            return '';
      }
      var style;
      if (document.defaultView) {
        style = document.defaultView.getComputedStyle(_Element, '');
      } else {
        style = _Element[currentStyle].getAttribute(_StyleName);
      }
      return style[_StyleName];
};