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

  var _timer = null;
  var scrollToPos = function scrollToPos(opts) {
      var config = {
          pos: 0,
          el: el || "html",
          isVertical: true,
          speed: 6
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
          speed = config.speed;
      if (typeof pos !== "number" || pos < 0 || isNaN(pos)) {
          console.error("scrollToPos: 滚动参数pos应为大于等于0的数字");
          return;
      }
      if (_timer) {
          window.cancelAnimationFrame(_timer);
          _timer = null;
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
      _timer = function timer() {
          var scrollOri = isVertical ? window.scrollY : window.scrollX;
          var scrollDis = Math.abs(pos - scrollOri);
          var dis = 0;
          if (scrollDis < speed) {
              window.scrollTo(isVertical ? 0 : pos, isVertical ? pos : 0);
              window.cancelAnimationFrame(_timer);
              _timer = null;
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
          window.requestAnimationFrame(_timer);
      };
      window.requestAnimationFrame(_timer);
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

  var canUseCookie = function canUseCookie() {
    return typeof document !== "undefined";
  };
  var ONEDAY = 3600 * 1000 * 24;
  var DEFAULTEXPIRES = new Date(new Date().getTime() + ONEDAY).toGMTString();
  var Cookie = {
    set: function set(name, val) {
      var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { expires: DEFAULTEXPIRES };
      if (!name || !canUseCookie()) return;
      document.cookie = name + "=" + val + ";expires=" + opt.expires;
    },
    formatCookie: function formatCookie() {
      if (!canUseCookie()) return {};
      var i = void 0,
          item = void 0;
      var cookie = document.cookie;
      var cookieObj = {};
      cookie = cookie.split(";");
      if (cookie.length) {
        for (i = 0; i < cookie.length; i++) {
          item = cookie[i].trim().split("=");
          if (item && item[0] && item[1]) {
            cookieObj[item[0].trim()] = item[1].trim();
          }
        }
      }
      return cookieObj;
    },
    get: function get(name) {
      var res = void 0;
      try {
        res = JSON.parse(JSON.stringify(this.formatCookie()["" + name]));
        if (typeof res === "string") {
          res = JSON.parse(res);
        }
      } catch (e) {}
      return res;
    },
    clear: function clear(name) {
      if (!canUseCookie()) return;
      document.cookie = name + "=null;expires=-1";
    }
  };

  var index = {
      scrollToPos: scrollToPos,
      ImgLazyload: ImgLazyload,
      Cookie: Cookie
  };

  return index;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvc2Nyb2xsVG9Qb3MuanMiLCIuLi9zcmMvdXRpbHMvSW1nTGF6eWxvYWQuanMiLCIuLi9zcmMvdXRpbHMvY29va2llLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5bCP77yM5rua5Yqo6LaK5b+rXG4gKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgICBb5peg5oSP5LmJ77yM5rKh5pyJ6L+U5Zue5YC8XVxuICovXG5jb25zdCBzY3JvbGxUb1BvcyA9IG9wdHMgPT4ge1xuICAgIC8vIOWIneWni+WMlumFjee9rlxuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgcG9zOiAwLFxuICAgICAgICBlbDogZWwgfHwgXCJodG1sXCIsXG4gICAgICAgIGlzVmVydGljYWw6IHRydWUsXG4gICAgICAgIHNwZWVkOiA2XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0cyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBcblxuICAgIGlmIChvcHRzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWQiOW5tmNvbmZpZ+WSjOS8oOWFpeeahG9wdHNcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdHMpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB7IHBvcywgZWwsIGlzVmVydGljYWwsIHNwZWVkIH0gPSBjb25maWc7XG5cbiAgICBpZiAodHlwZW9mIHBvcyAhPT0gXCJudW1iZXJcIiB8fCBwb3MgPCAwIHx8IGlzTmFOKHBvcykpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDmu5rliqjlj4LmlbBwb3PlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2XXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6YeN572udGltZXJcbiAgICBpZiAodGltZXIpIHtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOagueWFg+e0oOWSjOinhueql+WFg+e0oFxuICAgIGxldCByb290RWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgbGV0IGNsaUVsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xuXG4gICAgLy8g5qCh6aqMcm9vdEVsZeaYr+WQpuS4uuepulxuICAgIGlmICghcm9vdEVsZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi5oyH5a6a55qEZWzkuI3lrZjlnKhcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnmupDntKDnmoTlrr3miJbpq5hcbiAgICBsZXQgZWxlVmFsID0gaXNWZXJ0aWNhbCA/IHJvb3RFbGUub2Zmc2V0SGVpZ2h0IDogcm9vdEVsZS5vZmZzZXRXaWR0aDtcbiAgICAvLyDojrflj5bliLDop4bnqpfnmoTlrr3miJbpq5hcbiAgICBsZXQgd2luVmFsID0gaXNWZXJ0aWNhbCA/IGNsaUVsZS5jbGllbnRIZWlnaHQgOiBjbGlFbGUuY2xpZW50V2lkdGg7XG4gICAgLy8g6K6h566X5rua5Yqo55qE5pyA5aSn5YC877yM5ZCM5pe255WZ5Ye6MjDnmoTlronlhajot53nprtcbiAgICBsZXQgbWF4VmFsID0gTWF0aC5hYnMoZWxlVmFsIC0gd2luVmFsKSA8IDIwID8gMCA6IGVsZVZhbCAtIHdpblZhbCAtIDIwO1xuXG4gICAgLy8g5q+U6L6D5YaF5a656auY77yP5a695bqm5ZKM6KeG56qX6auY77yP5a695bqm77yM5aaC5p6c5YaF5a656auY77yP5a695bqm5LiN5aSn5LqO6KeG56qX6auY77yP5a695bqm77yM5q2k5pe25LiN5Lya5Ye6546w5rua5Yqo5p2h77yM57uZ5Ye65o+Q56S6XG4gICAgaWYgKGVsZVZhbCA8PSB3aW5WYWwpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCLor7fnoa7orqTlvZPliY3kvKDlhaXnmoTlhoXlrrnljLrpq5gv5a695bqm5aSn5LqO6KeG56qX6auY77yP5a695bqm77yI5q2k5pe25omN5Lya5Ye6546w5rua5Yqo5p2h77yJXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5a+55rua5Yqo5Yiw55qE5L2N572ucG9z6L+b6KGM5aSE55CGXG4gICAgaWYgKHBvcyA+IG1heFZhbCkge1xuICAgICAgICBwb3MgPSBNYXRoLm1heCgwLCBtYXhWYWwpO1xuICAgIH1cblxuICAgIHRpbWVyID0gKCkgPT4ge1xuICAgICAgICBsZXQgc2Nyb2xsT3JpID0gaXNWZXJ0aWNhbCA/IHdpbmRvdy5zY3JvbGxZIDogd2luZG93LnNjcm9sbFg7XG4gICAgICAgIGxldCBzY3JvbGxEaXMgPSBNYXRoLmFicyhwb3MgLSBzY3JvbGxPcmkpO1xuICAgICAgICBsZXQgZGlzID0gMDtcblxuICAgICAgICAvLyDlpoLmnpzmu5rliqjliLDnibnlrprkvY3nva7pmYTov5HkuoZcbiAgICAgICAgaWYgKHNjcm9sbERpcyA8IHNwZWVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBwb3MsIGlzVmVydGljYWwgPyBwb3MgOiAwKTtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lcilcbiAgICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOavj+asoea7muWKqOWJqeS9mea7muWKqOi3neemu+eahCAxIC8gc3BlZWRcbiAgICAgICAgZGlzID0gTWF0aC5mbG9vcihzY3JvbGxEaXMgLyBzcGVlZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2Nyb2xsT3JpID4gcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgLT0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjcm9sbE9yaSA8IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpICs9IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbE9yaSwgaXNWZXJ0aWNhbCA/IHNjcm9sbE9yaSA6IDApO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWVyKVxuICAgIH1cblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZXIpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNjcm9sbFRvUG9zOyIsIi8qKlxuICog5Zu+54mH5oeS5Yqg6L29XG4gKiBAcGFyYW1zIG9wdHNcbiAqIG9wdHMuY29udGFpbmVyIOWPr+mAie+8jOm7mOiupOS4umh0bWzvvIzmjIflrprpnIDopoHmh5LliqDovb3lm77niYflhYPntKDnmoTniLblrrnlmahcbiAqIG9wdHMuZGVmYXVsdEltZyDlj6/pgInvvIzliqDovb3kuYvliY3pu5jorqTnmoTlm77niYdcbiAqIG9wdHMuZXJyb3JJbWFnZSDlj6/pgInvvIzliqDovb3nvZHnu5zlm77niYflh7rplJnml7bnmoTlm77niYdcbiAqIG9wdHMuZGVsYXkg5rua5Yqo5qOA5rWL55qE6Ze06ZqU77yI5Ye95pWw6IqC5rWB77yJ44CC5q+P6ZqUZGVsYXnmr6vnp5Lov5vooYzkuIDmrKFjaGVja++8jOadpeWKoOi9veWkhOS6juinhueql+S4reeahOWFg+e0oOWbvueJh+i1hOa6kFxuICovXG5jb25zdCBJbWdMYXp5bG9hZCA9IHtcbiAgICAvLyDms6jlhozmu5rliqjkuovku7ZcbiAgICBpbml0KHsgY29udGFpbmVyID0gXCJodG1sXCIsIGRlZmF1bHRJbWcgPSBcIlwiLCBlcnJvckltYWdlID0gXCJcIiwgZGVsYXkgPSA1MDAgfSkge1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgICAgICAvLyDmlLbpm4blnKhjb250YWluZXLkuIvnmoTmh5LliqDovb3nmoTlm77niYdcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmRlZmF1bHRJbWcgPSBkZWZhdWx0SW1nO1xuICAgICAgICB0aGlzLmVycm9ySW1hZ2UgPSBlcnJvckltYWdlO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcblxuICAgICAgICBjb25zdCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIC8vIOiOt+WPluinhueql+eahOmrmOW6puWSjOWuveW6plxuICAgICAgICB0aGlzLndIZWlnaHQgPSBjbGlFbGUuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLndXaWR0aCA9IGNsaUVsZS5jbGllbnRXaWR0aDtcblxuICAgICAgICBsZXQgY2JmbiA9IHRoaXMudGhyb3R0bGUoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjYmZuLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGNiZm4sIHRydWUpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNiZm4sIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWHveaVsOiKgua1gVxuICAgIHRocm90dGxlKCkge1xuICAgICAgICBsZXQgcHJldiA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHByZXYgPiB0aGlzLmRlbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHByZXYgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5omA5pyJ5bimbGF6eWxvYWTnmoTlsZ7mgKfnmoRkb23lhYPntKBcbiAgICBnZXRMYXp5TG9hZEVscygpIHtcbiAgICAgICAgY29uc3QgZWxlcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIipbbGF6eWxvYWRdXCIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZWxlcy5sZW5ndGg7IGkgPCBsZW47IGkgKysgKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlc1tpXSk7XG4gICAgICAgICAgICAvLyDlpoLmnpzmnInpu5jorqTlm77niYfvvIzorr7nva7pu5jorqTlm77niYdcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWxlc1tpXSwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDkuLrlhYPntKDorr7nva7lm77niYdcbiAgICBzZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpIHtcbiAgICAgICAgLy8g5aaC5p6cZWzkuI3mmK/moIfnrb4s5LiN5aSE55CGXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWwudGFnTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW1nXCIpIHtcbiAgICAgICAgICAgIGVsLnNyYyA9IGltZ1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWdVcmwgfHwgXCJcIn0pYDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDmo4Dmn6XljZXkuKrlhYPntKDmmK/lkKblnKjop4bnqpfkuK1cbiAgICBjaGVja0luVmlldyhlbCkge1xuICAgICAgICBjb25zdCBwb3MgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBwb3M7XG4gICAgICAgIC8vIOWmguaenHjlnKgtd2lkdGjliLB3V2lkdGjkuYvpl7TlubbkuJR55ZyoLWhlaWdodOWIsHdIZWlnaHTkuYvpl7Tml7bvvIzlhYPntKDlpITkuo7op4bnqpfkuK1cbiAgICAgICAgaWYgKHggPCB0aGlzLndXaWR0aCAmJiB4ID4gLXdpZHRoICYmIHkgPCB0aGlzLndIZWlnaHQgJiYgeSA+IC1oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyDpgY3ljoblrZDlhYPntKDvvIzlpITnkIblnKjop4bnqpfkuK3nmoTlhYPntKBcbiAgICBjaGVjaygpIHtcbiAgICAgICAgdGhpcy5nZXRMYXp5TG9hZEVscygpO1xuICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIOWmguaenOWcqOinhueql+S4rSBcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSW5WaWV3KGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFbEluVmlldyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bCG5YWD57Sg55qEbGF6eWxvYWTlsZ7mgKflj5blh7rmnaXvvIznhLblkI7mlrDlu7rkuIDkuKppbWFnZeWvueixoVxuICAgIGhhbmRsZUVsSW5WaWV3KGVsKSB7XG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpbWdVcmwgPSBlbC5nZXRBdHRyaWJ1dGUoXCJsYXp5bG9hZFwiKTtcbiAgICAgICAgaWYgKCFpbWdVcmwpIHJldHVybjtcbiAgICAgICAgY29uc3QgSW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIEltZy5zcmMgPSBpbWdVcmw7XG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIGltZ1VybCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOWbvueJh+WKoOi9veWksei0peS6hu+8jOWwseWKoOi9vemUmeivr+WbvueJh+aIlum7mOiupOWbvueJh1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ySW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZXJyb3JJbWFnZSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbWdMYXp5bG9hZDsiLCJjb25zdCBjYW5Vc2VDb29raWUgPSAoKSA9PiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5jb25zdCBPTkVEQVkgPSAzNjAwICogMTAwMCAqIDI0O1xuY29uc3QgREVGQVVMVEVYUElSRVMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE9ORURBWSkudG9HTVRTdHJpbmcoKTtcbmNvbnN0IENvb2tpZSA9IHtcbiAgc2V0KG5hbWUsIHZhbCwgb3B0ID0ge2V4cGlyZXM6IERFRkFVTFRFWFBJUkVTfSkge1xuICAgIGlmICghbmFtZSB8fCAhY2FuVXNlQ29va2llKCkpIHJldHVybjtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbH07ZXhwaXJlcz0ke29wdC5leHBpcmVzfWA7XG4gIH0sXG4gIGZvcm1hdENvb2tpZSgpIHtcbiAgICBpZiAoIWNhblVzZUNvb2tpZSgpKSByZXR1cm4ge307XG4gICAgXG4gICAgbGV0IGksIGl0ZW07XG4gICAgbGV0IGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICBsZXQgY29va2llT2JqID0ge307XG5cbiAgICBjb29raWUgPSBjb29raWUuc3BsaXQoXCI7XCIpO1xuXG4gICAgaWYgKGNvb2tpZS5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb29raWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNvb2tpZVtpXS50cmltKCkuc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtWzBdICYmIGl0ZW1bMV0pIHtcbiAgICAgICAgICBjb29raWVPYmpbaXRlbVswXS50cmltKCldID0gaXRlbVsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZU9iajtcbiAgfSxcbiAgZ2V0KG5hbWUpIHtcbiAgICBsZXQgcmVzO1xuICAgIHRyeSB7XG4gICAgICByZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZm9ybWF0Q29va2llKClbYCR7bmFtZX1gXSkpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuICBjbGVhcihuYW1lKSB7XG4gICAgaWYgKCFjYW5Vc2VDb29raWUoKSkgcmV0dXJuO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PW51bGw7ZXhwaXJlcz0tMWA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvb2tpZTsiLCJpbXBvcnQgc2Nyb2xsVG9Qb3MgZnJvbSBcIi4vdXRpbHMvc2Nyb2xsVG9Qb3NcIlxuaW1wb3J0IEltZ0xhenlsb2FkIGZyb20gXCIuL3V0aWxzL0ltZ0xhenlsb2FkXCJcbmltcG9ydCBDb29raWUgZnJvbSAnLi91dGlscy9jb29raWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBzY3JvbGxUb1BvcyxcbiAgICBJbWdMYXp5bG9hZCxcbiAgICBDb29raWVcbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsInBvcyIsImVsIiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwib3B0cyIsImNvbnNvbGUiLCJlcnJvciIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImtleSIsImlzTmFOIiwid2luZG93IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb290RWxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2xpRWxlIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImVsZVZhbCIsIm9mZnNldEhlaWdodCIsIm9mZnNldFdpZHRoIiwid2luVmFsIiwiY2xpZW50SGVpZ2h0IiwiY2xpZW50V2lkdGgiLCJtYXhWYWwiLCJNYXRoIiwiYWJzIiwiRXJyb3IiLCJtYXgiLCJzY3JvbGxPcmkiLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJJbWdMYXp5bG9hZCIsImluaXQiLCJjb250YWluZXIiLCJkZWZhdWx0SW1nIiwiZXJyb3JJbWFnZSIsImRlbGF5IiwiY2hpbGRyZW4iLCJnZXRMYXp5TG9hZEVscyIsIndIZWlnaHQiLCJ3V2lkdGgiLCJjYmZuIiwidGhyb3R0bGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHJldiIsIkRhdGUiLCJub3ciLCJjaGVjayIsImVsZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbiIsImxlbmd0aCIsInB1c2giLCJzZXRJbWFnZUZvckVsIiwiaW1nVXJsIiwibm9kZVR5cGUiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzcmMiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImNoZWNrSW5WaWV3IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImZvckVhY2giLCJpdGVtIiwiaGFuZGxlRWxJblZpZXciLCJnZXRBdHRyaWJ1dGUiLCJJbWciLCJJbWFnZSIsInJlbW92ZUF0dHJpYnV0ZSIsImNhblVzZUNvb2tpZSIsIk9ORURBWSIsIkRFRkFVTFRFWFBJUkVTIiwiZ2V0VGltZSIsInRvR01UU3RyaW5nIiwiQ29va2llIiwic2V0IiwibmFtZSIsInZhbCIsIm9wdCIsImV4cGlyZXMiLCJjb29raWUiLCJmb3JtYXRDb29raWUiLCJjb29raWVPYmoiLCJzcGxpdCIsInRyaW0iLCJnZXQiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJlIiwiY2xlYXIiXSwibWFwcGluZ3Mi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
