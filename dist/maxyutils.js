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

  var ImgLazyload = {
      init: function init(_ref) {
          var _ref$container = _ref.container,
              container = _ref$container === undefined ? "html" : _ref$container,
              _ref$defaultImg = _ref.defaultImg,
              defaultImg = _ref$defaultImg === undefined ? "" : _ref$defaultImg,
              _ref$errorImage = _ref.errorImage,
              errorImage = _ref$errorImage === undefined ? "" : _ref$errorImage,
              _ref$delay = _ref.delay,
              delay = _ref$delay === undefined ? 500 : _ref$delay;
          this.el = document.querySelector(container);
          this.children = [];
          this.defaultImg = defaultImg;
          this.errorImage = errorImage;
          this.delay = delay;
          this.getLazyLoadEls();
          var cliEle = document.documentElement;
          this.wHeight = cliEle.clientHeight;
          this.wWidth = cliEle.clientWidth;
          var cbfn = this.throttle();
          if (window.addEventListener) {
              window.addEventListener("scroll", cbfn, true);
              window.addEventListener("touchmove", cbfn, true);
              window.addEventListener("load", cbfn, true);
          }
      },
      throttle: function throttle() {
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
      },
      getLazyLoadEls: function getLazyLoadEls() {
          var eles = this.el.querySelectorAll("*[lazyload]");
          for (var i = 0, len = eles.length; i < len; i++) {
              this.children.push(eles[i]);
              if (this.defaultImg) {
                  this.setImageForEl(eles[i], this.defaultImg);
              }
          }
      },
      setImageForEl: function setImageForEl(el, imgUrl) {
          if (el.nodeType !== 1) return;
          if (typeof el.tagName === "string" && el.tagName.toLowerCase() === "img") {
              el.src = imgUrl;
          } else {
              el.style.backgroundImage = "url(" + (imgUrl || "") + ")";
          }
      },
      checkInView: function checkInView(el) {
          var pos = el.getBoundingClientRect();
          var x = pos.x,
              y = pos.y,
              width = pos.width,
              height = pos.height;
          if (x < this.wWidth && x > -width && y < this.wHeight && y > -height) {
              return true;
          }
          return false;
      },
      check: function check() {
          var _this2 = this;
          this.getLazyLoadEls();
          if (!this.children.length) return;
          this.children.forEach(function (item) {
              if (_this2.checkInView(item)) {
                  _this2.handleElInView(item);
              }
          });
      },
      handleElInView: function handleElInView(el) {
          var _this3 = this;
          if (el.nodeType !== 1) return;
          var imgUrl = el.getAttribute("lazyload");
          if (!imgUrl) return;
          var Img = new Image();
          Img.src = imgUrl;
          el.removeAttribute("lazyload");
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
  };

  var index = {
      scrollToPos: scrollToPos,
      ImgLazyload: ImgLazyload
  };

  return index;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvc2Nyb2xsVG9Qb3MuanMiLCIuLi9zcmMvdXRpbHMvSW1nTGF6eWxvYWQuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVyID0gbnVsbDtcblxuLyoqXG4gKiBb6aG16Z2i5bmz5ruR5rua5Yqo5Yiw5oyH5a6a5L2N572u77yI5aSa55So5LqO6L+U5Zue6aG26YOo77yJXVxuICogQHBhcmFtICB7W051bWJlciB8fCBPYmplY3RdfSBvcHRzIFvphY3nva7lj4LmlbBdXG4gKiBAb3B0cyDkuLpOdW1iZXLnsbvlnovml7bvvIzpu5jorqTkuIrkuIvmu5rliqjliLDmjIflrprkvY3nva7vvIzku6VodG1s5YWD57Sg5Li65qC55YWD57Sg6K6h566X5YaF5a655Yy66auY5bqmXG4gKiBAb3B0cyDkuLpPYmplY3Tml7bvvIzlj6/loavnmoTlj4LmlbDmnInvvJpcbiAqIEBwb3MgcmVxdWlyZWQge051bWJlcn0g5rua5Yqo5Yiw55qE5oyH5a6a5L2N572u77yI6Led6aG16Z2i5bem5L6n5oiW6ICF6Led6aG26YOo55qE6Led56a777yJXG4gKiBAaXNWZXJ0aWNhbCByZXF1aXJlZCB7Qm9vbGVhbn0g6YCJ5oup5LiK5LiL5rua5Yqo6L+Y5piv5bem5Y+z5rua5YqoKOS4unRydWXml7bkuIrkuIvmu5rliqjvvIxmYWxzZeaXtuW3puWPs+a7muWKqO+8jOm7mOiupOS4iuS4i+a7muWKqClcbiAqIEBlbCB7U3RyaW5nfSDmjIflrprnmoRkb23lhYPntKDvvIzkuIDoiKzkuLpodG1sLGJvZHnmiJbogIVib2R55LiL5pyA5aSW5bGC55qEZG9tXG4gKiBAc3BlZWQge051bWJlcn0g5q+P5qyh5rua5Yqo55qE6Led56a75piv55uu5YmN5rua5Yqo5oC76Led56a755qEIDEgLyBzcGVlZCzmraTlgLzotorlpKfvvIzmu5rliqjotorlv6tcbiAqIEBpbnRlcnZhbCB7TnVtYmVyfSDlrprml7blmajmiafooYzpl7TpmpTjgILpl7TpmpTotorlsI/vvIzmu5rliqjotorlv6sgXG4gKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgICBb5peg5oSP5LmJ77yM5rKh5pyJ6L+U5Zue5YC8XVxuICovXG5jb25zdCBzY3JvbGxUb1BvcyA9IG9wdHMgPT4ge1xuICAgIC8vIOWIneWni+WMlumFjee9rlxuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgcG9zOiAwLFxuICAgICAgICBlbDogZWwgfHwgXCJodG1sXCIsXG4gICAgICAgIGlzVmVydGljYWw6IHRydWUsXG4gICAgICAgIHNwZWVkOiA2LFxuICAgICAgICBpbnRlcnZhbDogMTBcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRzICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgY29uZmlnLnBvcyA9IG9wdHM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOWPguaVsOW6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZfmiJblr7nosaFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9IFxuXG4gICAgaWYgKG9wdHMgPT09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5ZCI5bm2Y29uZmln5ZKM5Lyg5YWl55qEb3B0c1xuICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gXCJvYmplY3RcIiAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3B0cykgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHNba2V5XSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgIGNvbmZpZ1trZXldID0gb3B0c1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHsgcG9zLCBlbCwgaXNWZXJ0aWNhbCwgc3BlZWQsIGludGVydmFsIH0gPSBjb25maWc7XG5cbiAgICBpZiAodHlwZW9mIHBvcyAhPT0gXCJudW1iZXJcIiB8fCBwb3MgPCAwIHx8IGlzTmFOKHBvcykpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDmu5rliqjlj4LmlbBwb3PlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2XXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6YeN572udGltZXJcbiAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnlhYPntKDlkozop4bnqpflhYPntKBcbiAgICBsZXQgcm9vdEVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGxldCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgIC8vIOagoemqjHJvb3RFbGXmmK/lkKbkuLrnqbpcbiAgICBpZiAoIXJvb3RFbGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIuaMh+WumueahGVs5LiN5a2Y5ZyoXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55rqQ57Sg55qE5a695oiW6auYXG4gICAgbGV0IGVsZVZhbCA9IGlzVmVydGljYWwgPyByb290RWxlLm9mZnNldEhlaWdodCA6IHJvb3RFbGUub2Zmc2V0V2lkdGg7XG4gICAgLy8g6I635Y+W5Yiw6KeG56qX55qE5a695oiW6auYXG4gICAgbGV0IHdpblZhbCA9IGlzVmVydGljYWwgPyBjbGlFbGUuY2xpZW50SGVpZ2h0IDogY2xpRWxlLmNsaWVudFdpZHRoO1xuICAgIC8vIOiuoeeul+a7muWKqOeahOacgOWkp+WAvO+8jOWQjOaXtueVmeWHujIw55qE5a6J5YWo6Led56a7XG4gICAgbGV0IG1heFZhbCA9IE1hdGguYWJzKGVsZVZhbCAtIHdpblZhbCkgPCAyMCA/IDAgOiBlbGVWYWwgLSB3aW5WYWwgLSAyMDtcblxuICAgIC8vIOavlOi+g+WGheWuuemrmO+8j+WuveW6puWSjOinhueql+mrmO+8j+WuveW6pu+8jOWmguaenOWGheWuuemrmO+8j+WuveW6puS4jeWkp+S6juinhueql+mrmO+8j+WuveW6pu+8jOatpOaXtuS4jeS8muWHuueOsOa7muWKqOadoe+8jOe7meWHuuaPkOekulxuICAgIGlmIChlbGVWYWwgPD0gd2luVmFsKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwi6K+356Gu6K6k5b2T5YmN5Lyg5YWl55qE5YaF5a655Yy66auYL+WuveW6puWkp+S6juinhueql+mrmO+8j+WuveW6pu+8iOatpOaXtuaJjeS8muWHuueOsOa7muWKqOadoe+8iVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWvuea7muWKqOWIsOeahOS9jee9rnBvc+i/m+ihjOWkhOeQhlxuICAgIGlmIChwb3MgPiBtYXhWYWwpIHtcbiAgICAgICAgcG9zID0gTWF0aC5tYXgoMCwgbWF4VmFsKTtcbiAgICB9XG5cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IHNjcm9sbE9yaSA9IGlzVmVydGljYWwgPyB3aW5kb3cuc2Nyb2xsWSA6IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgICBsZXQgc2Nyb2xsRGlzID0gTWF0aC5hYnMocG9zIC0gc2Nyb2xsT3JpKTtcbiAgICAgICAgbGV0IGRpcyA9IDA7XG5cbiAgICAgICAgLy8g5aaC5p6c5rua5Yqo5Yiw54m55a6a5L2N572u6ZmE6L+R5LqGXG4gICAgICAgIGlmIChzY3JvbGxEaXMgPCBzcGVlZCkge1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogcG9zLCBpc1ZlcnRpY2FsID8gcG9zIDogMCk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOavj+asoea7muWKqOWJqeS9mea7muWKqOi3neemu+eahCAxIC8gc3BlZWRcbiAgICAgICAgZGlzID0gTWF0aC5mbG9vcihzY3JvbGxEaXMgLyBzcGVlZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2Nyb2xsT3JpID4gcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgLT0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjcm9sbE9yaSA8IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpICs9IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbE9yaSwgaXNWZXJ0aWNhbCA/IHNjcm9sbE9yaSA6IDApO1xuICAgIH0sIGludGVydmFsKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzY3JvbGxUb1BvczsiLCIvKipcbiAqIOWbvueJh+aHkuWKoOi9vVxuICogQHBhcmFtcyBvcHRzXG4gKiBvcHRzLmNvbnRhaW5lciDlj6/pgInvvIzpu5jorqTkuLpodG1s77yM5oyH5a6a6ZyA6KaB5oeS5Yqg6L295Zu+54mH5YWD57Sg55qE54i25a655ZmoXG4gKiBvcHRzLmRlZmF1bHRJbWcg5Y+v6YCJ77yM5Yqg6L295LmL5YmN6buY6K6k55qE5Zu+54mHXG4gKiBvcHRzLmVycm9ySW1hZ2Ug5Y+v6YCJ77yM5Yqg6L29572R57uc5Zu+54mH5Ye66ZSZ5pe255qE5Zu+54mHXG4gKiBvcHRzLmRlbGF5IOa7muWKqOajgOa1i+eahOmXtOmalO+8iOWHveaVsOiKgua1ge+8ieOAguavj+malGRlbGF55q+r56eS6L+b6KGM5LiA5qyhY2hlY2vvvIzmnaXliqDovb3lpITkuo7op4bnqpfkuK3nmoTlhYPntKDlm77niYfotYTmupBcbiAqL1xuY29uc3QgSW1nTGF6eWxvYWQgPSB7XG4gICAgLy8g5rOo5YaM5rua5Yqo5LqL5Lu2XG4gICAgaW5pdCh7IGNvbnRhaW5lciA9IFwiaHRtbFwiLCBkZWZhdWx0SW1nID0gXCJcIiwgZXJyb3JJbWFnZSA9IFwiXCIsIGRlbGF5ID0gNTAwIH0pIHtcbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcbiAgICAgICAgLy8g5pS26ZuG5ZyoY29udGFpbmVy5LiL55qE5oeS5Yqg6L2955qE5Zu+54mHXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5kZWZhdWx0SW1nID0gZGVmYXVsdEltZztcbiAgICAgICAgdGhpcy5lcnJvckltYWdlID0gZXJyb3JJbWFnZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmdldExhenlMb2FkRWxzKCk7XG5cbiAgICAgICAgY29uc3QgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAvLyDojrflj5bop4bnqpfnmoTpq5jluqblkozlrr3luqZcbiAgICAgICAgdGhpcy53SGVpZ2h0ID0gY2xpRWxlLmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy53V2lkdGggPSBjbGlFbGUuY2xpZW50V2lkdGg7XG5cbiAgICAgICAgbGV0IGNiZm4gPSB0aGlzLnRocm90dGxlKCk7XG4gICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgY2JmbiwgdHJ1ZSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBjYmZuLCB0cnVlKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBjYmZuLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDlh73mlbDoioLmtYFcbiAgICB0aHJvdHRsZSgpIHtcbiAgICAgICAgbGV0IHByZXYgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChub3cgLSBwcmV2ID4gdGhpcy5kZWxheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgICAgICAgICBwcmV2ID0gbm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiOt+WPluaJgOacieW4pmxhenlsb2Fk55qE5bGe5oCn55qEZG9t5YWD57SgXG4gICAgZ2V0TGF6eUxvYWRFbHMoKSB7XG4gICAgICAgIGNvbnN0IGVsZXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2xhenlsb2FkXVwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVsZXMubGVuZ3RoOyBpIDwgbGVuOyBpICsrICkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZXNbaV0pO1xuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6buY6K6k5Zu+54mH77yM6K6+572u6buY6K6k5Zu+54mHXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsZXNbaV0sIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Li65YWD57Sg6K6+572u5Zu+54mHXG4gICAgc2V0SW1hZ2VGb3JFbChlbCwgaW1nVXJsKSB7XG4gICAgICAgIC8vIOWmguaenGVs5LiN5piv5qCH562+LOS4jeWkhOeQhlxuICAgICAgICBpZiAoZWwubm9kZVR5cGUgIT09IDEpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIGVsLnRhZ05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImltZ1wiKSB7XG4gICAgICAgICAgICBlbC5zcmMgPSBpbWdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1nVXJsIHx8IFwiXCJ9KWA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5qOA5p+l5Y2V5Liq5YWD57Sg5piv5ZCm5Zyo6KeG56qX5LitXG4gICAgY2hlY2tJblZpZXcoZWwpIHtcbiAgICAgICAgY29uc3QgcG9zID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gcG9zO1xuICAgICAgICAvLyDlpoLmnpx45ZyoLXdpZHRo5Yiwd1dpZHRo5LmL6Ze05bm25LiUeeWcqC1oZWlnaHTliLB3SGVpZ2h05LmL6Ze05pe277yM5YWD57Sg5aSE5LqO6KeG56qX5LitXG4gICAgICAgIGlmICh4IDwgdGhpcy53V2lkdGggJiYgeCA+IC13aWR0aCAmJiB5IDwgdGhpcy53SGVpZ2h0ICYmIHkgPiAtaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8g6YGN5Y6G5a2Q5YWD57Sg77yM5aSE55CG5Zyo6KeG56qX5Lit55qE5YWD57SgXG4gICAgY2hlY2soKSB7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlnKjop4bnqpfkuK0gXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0luVmlldyhpdGVtKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRWxJblZpZXcoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIOWwhuWFg+e0oOeahGxhenlsb2Fk5bGe5oCn5Y+W5Ye65p2l77yM54S25ZCO5paw5bu65LiA5LiqaW1hZ2Xlr7nosaFcbiAgICBoYW5kbGVFbEluVmlldyhlbCkge1xuICAgICAgICBpZiAoZWwubm9kZVR5cGUgIT09IDEpIHJldHVybjtcbiAgICAgICAgY29uc3QgaW1nVXJsID0gZWwuZ2V0QXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIGlmICghaW1nVXJsKSByZXR1cm47XG4gICAgICAgIGNvbnN0IEltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBJbWcuc3JjID0gaW1nVXJsO1xuXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImxhenlsb2FkXCIpO1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIFxuICAgICAgICAvLyDlpoLmnpzlm77niYfliqDovb3lpLHotKXkuobvvIzlsLHliqDovb3plJnor6/lm77niYfmiJbpu5jorqTlm77niYdcbiAgICAgICAgSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvckltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmVycm9ySW1hZ2UpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1nTGF6eWxvYWQ7IiwiaW1wb3J0IHNjcm9sbFRvUG9zIGZyb20gXCIuL3V0aWxzL3Njcm9sbFRvUG9zXCI7XG5pbXBvcnQgSW1nTGF6eWxvYWQgZnJvbSBcIi4vdXRpbHMvSW1nTGF6eWxvYWRcIjtcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2Nyb2xsVG9Qb3MsXG4gICAgSW1nTGF6eWxvYWRcbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsInBvcyIsImVsIiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwiaW50ZXJ2YWwiLCJvcHRzIiwiY29uc29sZSIsImVycm9yIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwia2V5IiwiaXNOYU4iLCJjbGVhckludGVydmFsIiwicm9vdEVsZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNsaUVsZSIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJlbGVWYWwiLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsIndpblZhbCIsImNsaWVudEhlaWdodCIsImNsaWVudFdpZHRoIiwibWF4VmFsIiwiTWF0aCIsImFicyIsIkVycm9yIiwibWF4Iiwic2V0SW50ZXJ2YWwiLCJzY3JvbGxPcmkiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiLCJJbWdMYXp5bG9hZCIsImluaXQiLCJjb250YWluZXIiLCJkZWZhdWx0SW1nIiwiZXJyb3JJbWFnZSIsImRlbGF5IiwiY2hpbGRyZW4iLCJnZXRMYXp5TG9hZEVscyIsIndIZWlnaHQiLCJ3V2lkdGgiLCJjYmZuIiwidGhyb3R0bGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHJldiIsIkRhdGUiLCJub3ciLCJjaGVjayIsImVsZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbiIsImxlbmd0aCIsInB1c2giLCJzZXRJbWFnZUZvckVsIiwiaW1nVXJsIiwibm9kZVR5cGUiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzcmMiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImNoZWNrSW5WaWV3IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImZvckVhY2giLCJpdGVtIiwiaGFuZGxlRWxJblZpZXciLCJnZXRBdHRyaWJ1dGUiLCJJbWciLCJJbWFnZSIsInJlbW92ZUF0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0VBQUEsSUFBSUEsUUFBUSxJQUFaO0VBY0EsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLE9BQVE7RUFFeEIsUUFBTUMsU0FBUztFQUNYQyxhQUFLLENBRE07RUFFWEMsWUFBSUEsTUFBTSxNQUZDO0VBR1hDLG9CQUFZLElBSEQ7RUFJWEMsZUFBTyxDQUpJO0VBS1hDLGtCQUFVO0VBTEMsS0FBZjtFQVFBLFFBQUksUUFBT0MsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUFwQixFQUE4QjtFQUMxQixZQUFJLE9BQU9BLElBQVAsS0FBZ0IsUUFBcEIsRUFBOEI7RUFDMUJOLG1CQUFPQyxHQUFQLEdBQWFLLElBQWI7RUFDSCxTQUZELE1BRU87RUFDSEMsb0JBQVFDLEtBQVIsQ0FBYyw4QkFBZDtFQUNBO0VBQ0g7RUFDSjtFQUVELFFBQUlGLFNBQVMsSUFBYixFQUFtQjtFQUNmQyxnQkFBUUMsS0FBUixDQUFjLDhCQUFkO0VBQ0E7RUFDSDtFQUdELFFBQUksUUFBT0YsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUFoQixJQUE0QkcsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCTixJQUEvQixNQUF5QyxpQkFBekUsRUFBNEY7RUFDeEYsYUFBSyxJ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
