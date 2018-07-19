(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.maxyutils = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var timer = null;
  var scrollToPos = function scrollToPos(opts) {
      var config = {
          pos: 0,
          el: el || "html",
          isVertical: true,
          speed: 6,
          interval: 10
      };
      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) !== "object") {
          if (typeof opts === "number") {
              config.pos = opts;
          } else {
              console.error("scrollToPos: 参数应为大于等于0的数字或对象");
              return;
          }
      }
      if (opts === null) {
          console.error("scrollToPos: 参数应为大于等于0的数字或对象");
          return;
      }
      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) === "object" && Object.prototype.toString.call(opts) === "[object Object]") {
          for (var key in config) {
              if (typeof opts[key] !== "undefined") {
                  config[key] = opts[key];
              }
          }
      }
      var pos = config.pos,
          el = config.el,
          isVertical = config.isVertical,
          speed = config.speed,
          interval = config.interval;
      if (typeof pos !== "number" || pos < 0 || isNaN(pos)) {
          console.error("scrollToPos: 滚动参数pos应为大于等于0的数字");
          return;
      }
      if (timer) {
          clearInterval(timer);
          timer = null;
      }
      var rootEle = document.querySelector(el);
      var cliEle = document.documentElement || document.body;
      if (!rootEle) {
          console.error("指定的el不存在");
          return;
      }
      var eleVal = isVertical ? rootEle.offsetHeight : rootEle.offsetWidth;
      var winVal = isVertical ? cliEle.clientHeight : cliEle.clientWidth;
      var maxVal = Math.abs(eleVal - winVal) < 20 ? 0 : eleVal - winVal - 20;
      if (eleVal <= winVal) {
          throw Error("请确认当前传入的内容区高/宽度大于视窗高／宽度（此时才会出现滚动条）");
          return;
      }
      if (pos > maxVal) {
          pos = Math.max(0, maxVal);
      }
      timer = setInterval(function () {
          var scrollOri = isVertical ? window.scrollY : window.scrollX;
          var scrollDis = Math.abs(pos - scrollOri);
          var dis = 0;
          if (scrollDis < speed) {
              window.scrollTo(isVertical ? 0 : pos, isVertical ? pos : 0);
              clearInterval(timer);
              timer = null;
              return;
          }
          dis = Math.floor(scrollDis / speed);
          if (scrollOri > pos) {
              scrollOri -= dis;
          }
          if (scrollOri < pos) {
              scrollOri += dis;
          }
          window.scrollTo(isVertical ? 0 : scrollOri, isVertical ? scrollOri : 0);
      }, interval);
  };

  var ImgLazyload = function () {
      function ImgLazyload(_ref) {
          var _ref$container = _ref.container,
              container = _ref$container === undefined ? "html" : _ref$container,
              _ref$defaultImg = _ref.defaultImg,
              defaultImg = _ref$defaultImg === undefined ? "" : _ref$defaultImg,
              _ref$errorImage = _ref.errorImage,
              errorImage = _ref$errorImage === undefined ? "" : _ref$errorImage,
              _ref$delay = _ref.delay,
              delay = _ref$delay === undefined ? 500 : _ref$delay;
          classCallCheck(this, ImgLazyload);
          this.el = document.querySelector(container);
          this.children = [];
          this.defaultImg = defaultImg;
          this.errorImage = errorImage;
          this.delay = delay;
          this.getLazyLoadEls();
          var cliEle = document.documentElement;
          this.wHeight = cliEle.clientHeight;
          this.wWidth = cliEle.clientWidth;
          this.init();
      }
      createClass(ImgLazyload, [{
          key: "init",
          value: function init() {
              var cbfn = this.throttle();
              if (window.addEventListener) {
                  window.addEventListener("scroll", cbfn, false);
                  window.addEventListener("touchmove", cbfn, false);
                  window.addEventListener("load", cbfn, false);
              }
          }
      }, {
          key: "throttle",
          value: function throttle() {
              var _this = this;
              var prev = Date.now();
              this.check();
              return function () {
                  var now = Date.now();
                  if (now - prev > _this.delay) {
                      _this.check();
                      prev = now;
                  }
              };
          }
      }, {
          key: "getLazyLoadEls",
          value: function getLazyLoadEls() {
              var eles = this.el.querySelectorAll("*[lazyload]");
              for (var i = 0, len = eles.length; i < len; i++) {
                  this.children.push(eles[i]);
                  if (this.defaultImg) {
                      this.setImageForEl(eles[i], this.defaultImg);
                  }
              }
          }
      }, {
          key: "setImageForEl",
          value: function setImageForEl(el, imgUrl) {
              if (el.nodeType !== 1) return;
              if (typeof el.tagName === "string" && el.tagName.toLowerCase() === "img") {
                  el.src = imgUrl;
              } else {
                  el.style.backgroundImage = "url(" + (imgUrl || "") + ")";
              }
          }
      }, {
          key: "checkInView",
          value: function checkInView(el) {
              var pos = el.getBoundingClientRect();
              var x = pos.x,
                  y = pos.y,
                  width = pos.width,
                  height = pos.height;
              if (x < this.wWidth && x > -width && y < this.wHeight && y > -height) {
                  return true;
              }
              return false;
          }
      }, {
          key: "check",
          value: function check() {
              var _this2 = this;
              this.children.forEach(function (item) {
                  if (_this2.checkInView(item)) {
                      _this2.handleElInView(item);
                  }
              });
          }
      }, {
          key: "handleElInView",
          value: function handleElInView(el) {
              var _this3 = this;
              var imgUrl = el.getAttribute("lazyload");
              var Img = new Image();
              Img.src = imgUrl;
              Img.addEventListener("load", function () {
                  _this3.setImageForEl(el, imgUrl);
              }, false);
              Img.addEventListener("error", function () {
                  if (_this3.errorImage) {
                      _this3.setImageForEl(el, _this3.errorImage);
                  }
                  if (_this3.defaultImg) {
                      _this3.setImageForEl(el, _this3.defaultImg);
                  }
              }, false);
          }
      }]);
      return ImgLazyload;
  }();

  var index = {
      scrollToPos: scrollToPos,
      ImgLazyload: ImgLazyload
  };

  return index;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvc2Nyb2xsVG9Qb3MuanMiLCIuLi9zcmMvdXRpbHMvSW1nTGF6eWxvYWQuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVyID0gbnVsbDtcblxuLyoqXG4gKiBb6aG16Z2i5bmz5ruR5rua5Yqo5Yiw5oyH5a6a5L2N572u77yI5aSa55So5LqO6L+U5Zue6aG26YOo77yJXVxuICogQHBhcmFtICB7W051bWJlciB8fCBPYmplY3RdfSBvcHRzIFvphY3nva7lj4LmlbBdXG4gKiBAb3B0cyDkuLpOdW1iZXLnsbvlnovml7bvvIzpu5jorqTkuIrkuIvmu5rliqjliLDmjIflrprkvY3nva7vvIzku6VodG1s5YWD57Sg5Li65qC55YWD57Sg6K6h566X5YaF5a655Yy66auY5bqmXG4gKiBAb3B0cyDkuLpPYmplY3Tml7bvvIzlj6/loavnmoTlj4LmlbDmnInvvJpcbiAqIEBwb3MgcmVxdWlyZWQge051bWJlcn0g5rua5Yqo5Yiw55qE5oyH5a6a5L2N572u77yI6Led6aG16Z2i5bem5L6n5oiW6ICF6Led6aG26YOo55qE6Led56a777yJXG4gKiBAaXNWZXJ0aWNhbCByZXF1aXJlZCB7Qm9vbGVhbn0g6YCJ5oup5LiK5LiL5rua5Yqo6L+Y5piv5bem5Y+z5rua5YqoKOS4unRydWXml7bkuIrkuIvmu5rliqjvvIxmYWxzZeaXtuW3puWPs+a7muWKqO+8jOm7mOiupOS4iuS4i+a7muWKqClcbiAqIEBlbCB7U3RyaW5nfSDmjIflrprnmoRkb23lhYPntKDvvIzkuIDoiKzkuLpodG1sLGJvZHnmiJbogIVib2R55LiL5pyA5aSW5bGC55qEZG9tXG4gKiBAc3BlZWQge051bWJlcn0g5q+P5qyh5rua5Yqo55qE6Led56a75piv55uu5YmN5rua5Yqo5oC76Led56a755qEIDEgLyBzcGVlZCzmraTlgLzotorlpKfvvIzmu5rliqjotorlv6tcbiAqIEBpbnRlcnZhbCB7TnVtYmVyfSDlrprml7blmajmiafooYzpl7TpmpTjgILpl7TpmpTotorlsI/vvIzmu5rliqjotorlv6sgXG4gKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgICBb5peg5oSP5LmJ77yM5rKh5pyJ6L+U5Zue5YC8XVxuICovXG5jb25zdCBzY3JvbGxUb1BvcyA9IG9wdHMgPT4ge1xuICAgIC8vIOWIneWni+WMlumFjee9rlxuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgcG9zOiAwLFxuICAgICAgICBlbDogZWwgfHwgXCJodG1sXCIsXG4gICAgICAgIGlzVmVydGljYWw6IHRydWUsXG4gICAgICAgIHNwZWVkOiA2LFxuICAgICAgICBpbnRlcnZhbDogMTBcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY29uZmlnLnBvcyA9IG9wdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOWPguaVsOW6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZfmiJblr7nosaFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9IFxuXG4gICAgaWYgKG9wdHMgPT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5ZCI5bm2Y29uZmln5ZKM5Lyg5YWl55qEb3B0c1xuICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gXCJvYmplY3RcIiAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3B0cykgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldID0gb3B0c1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHsgcG9zLCBlbCwgaXNWZXJ0aWNhbCwgc3BlZWQsIGludGVydmFsIH0gPSBjb25maWc7XG5cbiAgICBpZiAodHlwZW9mIHBvcyAhPT0gXCJudW1iZXJcIiB8fCBwb3MgPCAwIHx8IGlzTmFOKHBvcykpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDmu5rliqjlj4LmlbBwb3PlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2XXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6YeN572udGltZXJcbiAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnlhYPntKDlkozop4bnqpflhYPntKBcbiAgICBsZXQgcm9vdEVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGxldCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgIC8vIOagoemqjHJvb3RFbGXmmK/lkKbkuLrnqbpcbiAgICBpZiAoIXJvb3RFbGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIuaMh+WumueahGVs5LiN5a2Y5ZyoXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55rqQ57Sg55qE5a695oiW6auYXG4gICAgbGV0IGVsZVZhbCA9IGlzVmVydGljYWwgPyByb290RWxlLm9mZnNldEhlaWdodCA6IHJvb3RFbGUub2Zmc2V0V2lkdGg7XG4gICAgLy8g6I635Y+W5Yiw6KeG56qX55qE5a695oiW6auYXG4gICAgbGV0IHdpblZhbCA9IGlzVmVydGljYWwgPyBjbGlFbGUuY2xpZW50SGVpZ2h0IDogY2xpRWxlLmNsaWVudFdpZHRoO1xuICAgIC8vIOiuoeeul+a7muWKqOeahOacgOWkp+WAvO+8jOWQjOaXtueVmeWHujIw55qE5a6J5YWo6Led56a7XG4gICAgbGV0IG1heFZhbCA9IE1hdGguYWJzKGVsZVZhbCAtIHdpblZhbCkgPCAyMCA/IDAgOiBlbGVWYWwgLSB3aW5WYWwgLSAyMDtcblxuICAgIC8vIOavlOi+g+WGheWuuemrmO+8j+WuveW6puWSjOinhueql+mrmO+8j+WuveW6pu+8jOWmguaenOWGheWuuemrmO+8j+WuveW6puS4jeWkp+S6juinhueql+mrmO+8j+WuveW6pu+8jOatpOaXtuS4jeS8muWHuueOsOa7muWKqOadoe+8jOe7meWHuuaPkOekulxuICAgIGlmIChlbGVWYWwgPD0gd2luVmFsKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwi6K+356Gu6K6k5b2T5YmN5Lyg5YWl55qE5YaF5a655Yy66auYL+WuveW6puWkp+S6juinhueql+mrmO+8j+WuveW6pu+8iOatpOaXtuaJjeS8muWHuueOsOa7muWKqOadoe+8iVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWvuea7muWKqOWIsOeahOS9jee9rnBvc+i/m+ihjOWkhOeQhlxuICAgIGlmIChwb3MgPiBtYXhWYWwpIHtcbiAgICAgICAgcG9zID0gTWF0aC5tYXgoMCwgbWF4VmFsKTtcbiAgICB9XG5cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IHNjcm9sbE9yaSA9IGlzVmVydGljYWwgPyB3aW5kb3cuc2Nyb2xsWSA6IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgICBsZXQgc2Nyb2xsRGlzID0gTWF0aC5hYnMocG9zIC0gc2Nyb2xsT3JpKTtcbiAgICAgICAgbGV0IGRpcyA9IDA7XG5cbiAgICAgICAgLy8g5aaC5p6c5rua5Yqo5Yiw54m55a6a5L2N572u6ZmE6L+R5LqGXG4gICAgICAgIGlmIChzY3JvbGxEaXMgPCBzcGVlZCkge1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogcG9zLCBpc1ZlcnRpY2FsID8gcG9zIDogMCk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOavj+asoea7muWKqOWJqeS9mea7muWKqOi3neemu+eahCAxIC8gc3BlZWRcbiAgICAgICAgZGlzID0gTWF0aC5mbG9vcihzY3JvbGxEaXMgLyBzcGVlZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2Nyb2xsT3JpID4gcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgLT0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjcm9sbE9yaSA8IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpICs9IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbE9yaSwgaXNWZXJ0aWNhbCA/IHNjcm9sbE9yaSA6IDApO1xuICAgIH0sIGludGVydmFsKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzY3JvbGxUb1BvczsiLCJjbGFzcyBJbWdMYXp5bG9hZCB7XG4gICAgY29uc3RydWN0b3Ioe2NvbnRhaW5lciA9IFwiaHRtbFwiLCBkZWZhdWx0SW1nID0gXCJcIiwgZXJyb3JJbWFnZSA9IFwiXCIsIGRlbGF5ID0gNTAwfSkge1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgICAgICAvLyDmlLbpm4blnKhjb250YWluZXLkuIvnmoTmh5LliqDovb3nmoTlm77niYdcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmRlZmF1bHRJbWcgPSBkZWZhdWx0SW1nO1xuICAgICAgICB0aGlzLmVycm9ySW1hZ2UgPSBlcnJvckltYWdlO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcblxuICAgICAgICBjb25zdCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIC8vIOiOt+WPluinhueql+eahOmrmOW6puWSjOWuveW6plxuICAgICAgICB0aGlzLndIZWlnaHQgPSBjbGlFbGUuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLndXaWR0aCA9IGNsaUVsZS5jbGllbnRXaWR0aDtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICAvLyDms6jlhozmu5rliqjkuovku7ZcbiAgICBpbml0KCkge1xuICAgICAgICBsZXQgY2JmbiA9IHRoaXMudGhyb3R0bGUoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjYmZuLCBmYWxzZSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBjYmZuLCBmYWxzZSk7ICAgICAgICAgICAgXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgY2JmbiwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Ye95pWw6IqC5rWBXG4gICAgdGhyb3R0bGUoKSB7XG4gICAgICAgIGxldCBwcmV2ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAobm93IC0gcHJldiA+IHRoaXMuZGVsYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgcHJldiA9IG5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOiOt+WPluaJgOacieW4pmxhenlsb2Fk55qE5bGe5oCn55qEZG9t5YWD57SgXG4gICAgZ2V0TGF6eUxvYWRFbHMoKSB7XG4gICAgICAgIGNvbnN0IGVsZXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2xhenlsb2FkXVwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVsZXMubGVuZ3RoOyBpIDwgbGVuOyBpICsrICkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZXNbaV0pO1xuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6buY6K6k5Zu+54mH77yM6K6+572u6buY6K6k5Zu+54mHXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsZXNbaV0sIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDkuLrlhYPntKDorr7nva7lm77niYdcbiAgICBzZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpIHtcbiAgICAgICAgLy8g5aaC5p6cZWzkuI3mmK/moIfnrb4s5LiN5aSE55CGXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWwudGFnTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW1nXCIpIHtcbiAgICAgICAgICAgIGVsLnNyYyA9IGltZ1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWdVcmwgfHwgXCJcIn0pYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOajgOafpeWNleS4quWFg+e0oOaYr+WQpuWcqOinhueql+S4rVxuICAgIGNoZWNrSW5WaWV3KGVsKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHBvcztcbiAgICAgICAgLy8g5aaC5p6ceOWcqC13aWR0aOWIsHdXaWR0aOS5i+mXtOW5tuS4lHnlnKgtaGVpZ2h05Yiwd0hlaWdodOS5i+mXtOaXtu+8jOWFg+e0oOWkhOS6juinhueql+S4rVxuICAgICAgICBpZiAoeCA8IHRoaXMud1dpZHRoICYmIHggPiAtd2lkdGggJiYgeSA8IHRoaXMud0hlaWdodCAmJiB5ID4gLWhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8g6YGN5Y6G5a2Q5YWD57Sg77yM5aSE55CG5Zyo6KeG56qX5Lit55qE5YWD57SgXG4gICAgY2hlY2soKSB7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIOWmguaenOWcqOinhueql+S4rSBcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSW5WaWV3KGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFbEluVmlldyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyDlsIblhYPntKDnmoRsYXp5bG9hZOWxnuaAp+WPluWHuuadpe+8jOeEtuWQjuaWsOW7uuS4gOS4qmltYWdl5a+56LGhXG4gICAgaGFuZGxlRWxJblZpZXcoZWwpIHtcbiAgICAgICAgY29uc3QgaW1nVXJsID0gZWwuZ2V0QXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIGNvbnN0IEltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIEltZy5zcmMgPSBpbWdVcmw7XG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIGltZ1VybCk7XG4gICAgICAgIH0sIGZhbHNlKTtcblxuICAgICAgICAvLyDlpoLmnpzlm77niYfliqDovb3lpLHotKXkuobvvIzlsLHliqDovb3plJnor6/lm77niYfmiJbpu5jorqTlm77niYdcbiAgICAgICAgSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvckltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmVycm9ySW1hZ2UpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1nTGF6eWxvYWQ7IiwiaW1wb3J0IHNjcm9sbFRvUG9zIGZyb20gXCIuL3V0aWxzL3Njcm9sbFRvUG9zXCI7XG5pbXBvcnQgSW1nTGF6eWxvYWQgZnJvbSBcIi4vdXRpbHMvSW1nTGF6eWxvYWRcIjtcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2Nyb2xsVG9Qb3MsXG4gICAgSW1nTGF6eWxvYWRcbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsInBvcyIsImVsIiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwiaW50ZXJ2YWwiLCJvcHRzIiwiY29uc29sZSIsImVycm9yIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwia2V5IiwiaXNOYU4iLCJjbGVhckludGVydmFsIiwicm9vdEVsZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNsaUVsZSIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJlbGVWYWwiLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsIndpblZhbCIsImNsaWVudEhlaWdodCIsImNsaWVudFdpZHRoIiwibWF4VmFsIiwiTWF0aCIsImFicyIsIkVycm9yIiwibWF4Iiwic2V0SW50ZXJ2YWwiLCJzY3JvbGxPcmkiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiLCJJbWdMYXp5bG9hZCIsImNvbnRhaW5lciIsImRlZmF1bHRJbWciLCJlcnJvckltYWdlIiwiZGVsYXkiLCJjaGlsZHJlbiIsImdldExhenlMb2FkRWxzIiwid0hlaWdodCIsIndXaWR0aCIsImluaXQiLCJjYmZuIiwidGhyb3R0bGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHJldiIsIkRhdGUiLCJub3ciLCJjaGVjayIsImVsZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbiIsImxlbmd0aCIsInB1c2giLCJzZXRJbWFnZUZvckVsIiwiaW1nVXJsIiwibm9kZVR5cGUiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzcmMiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJmb3JFYWNoIiwiY2hlY2tJblZpZXciLCJpdGVtIiwiaGFuZGxlRWxJblZpZXciLCJnZXRBdHRyaWJ1dGUiLCJJbWciLCJJbWFnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUEsSUFBSUEsUUFBUSxJQUFaO0VBY0EsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLE9BQVE7RUFFeEIsUUFBTUMsU0FBUztFQUNYQyxhQUFLLENBRE07RUFFWEMsWUFBSUEsTUFBTSxNQUZDO0VBR1hDLG9CQUFZLElBSEQ7RUFJWEMsZUFBTyxDQUpJO0VBS1hDLGtCQUFVO0VBTEMsS0FBZjtFQVFBLFFBQUksUUFBT0MsSUFBUCx5Q0FB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
