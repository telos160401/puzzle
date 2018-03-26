function getRandomInt(min, max) {
      return Math.floor( Math.random() * (max - min + 1) ) + min;
}

function getStyleValue(e, s) {
      var elm = e;
      var style;
      if (document.defaultView) {
        style = document.defaultView.getComputedStyle(elm, '');
      } else {
        style = elm[currentStyle].getAttribute(s);
      }
      return style[s];
};