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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvc2Nyb2xsVG9Qb3MuanMiLCIuLi9zcmMvdXRpbHMvSW1nTGF6eWxvYWQuanMiLCIuLi9zcmMvdXRpbHMvY29va2llLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5aSn77yM5rua5Yqo6LaK5b+rXG4gKiBAaW50ZXJ2YWwge051bWJlcn0g5a6a5pe25Zmo5omn6KGM6Ze06ZqU44CC6Ze06ZqU6LaK5bCP77yM5rua5Yqo6LaK5b+rIFxuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNixcbiAgICAgICAgaW50ZXJ2YWw6IDEwXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0cyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBcblxuICAgIGlmIChvcHRzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWQiOW5tmNvbmZpZ+WSjOS8oOWFpeeahG9wdHNcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdHMpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB7IHBvcywgZWwsIGlzVmVydGljYWwsIHNwZWVkLCBpbnRlcnZhbCB9ID0gY29uZmlnO1xuXG4gICAgaWYgKHR5cGVvZiBwb3MgIT09IFwibnVtYmVyXCIgfHwgcG9zIDwgMCB8fCBpc05hTihwb3MpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55YWD57Sg5ZKM6KeG56qX5YWD57SgXG4gICAgbGV0IHJvb3RFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBsZXQgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvLyDmoKHpqoxyb290RWxl5piv5ZCm5Li656m6XG4gICAgaWYgKCFyb290RWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLmjIflrprnmoRlbOS4jeWtmOWcqFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOaguea6kOe0oOeahOWuveaIlumrmFxuICAgIGxldCBlbGVWYWwgPSBpc1ZlcnRpY2FsID8gcm9vdEVsZS5vZmZzZXRIZWlnaHQgOiByb290RWxlLm9mZnNldFdpZHRoO1xuICAgIC8vIOiOt+WPluWIsOinhueql+eahOWuveaIlumrmFxuICAgIGxldCB3aW5WYWwgPSBpc1ZlcnRpY2FsID8gY2xpRWxlLmNsaWVudEhlaWdodCA6IGNsaUVsZS5jbGllbnRXaWR0aDtcbiAgICAvLyDorqHnrpfmu5rliqjnmoTmnIDlpKflgLzvvIzlkIzml7bnlZnlh7oyMOeahOWuieWFqOi3neemu1xuICAgIGxldCBtYXhWYWwgPSBNYXRoLmFicyhlbGVWYWwgLSB3aW5WYWwpIDwgMjAgPyAwIDogZWxlVmFsIC0gd2luVmFsIC0gMjA7XG5cbiAgICAvLyDmr5TovoPlhoXlrrnpq5jvvI/lrr3luqblkozop4bnqpfpq5jvvI/lrr3luqbvvIzlpoLmnpzlhoXlrrnpq5jvvI/lrr3luqbkuI3lpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIzmraTml7bkuI3kvJrlh7rnjrDmu5rliqjmnaHvvIznu5nlh7rmj5DnpLpcbiAgICBpZiAoZWxlVmFsIDw9IHdpblZhbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIuivt+ehruiupOW9k+WJjeS8oOWFpeeahOWGheWuueWMuumrmC/lrr3luqblpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIjmraTml7bmiY3kvJrlh7rnjrDmu5rliqjmnaHvvIlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlr7nmu5rliqjliLDnmoTkvY3nva5wb3Pov5vooYzlpITnkIZcbiAgICBpZiAocG9zID4gbWF4VmFsKSB7XG4gICAgICAgIHBvcyA9IE1hdGgubWF4KDAsIG1heFZhbCk7XG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBzY3JvbGxPcmkgPSBpc1ZlcnRpY2FsID8gd2luZG93LnNjcm9sbFkgOiB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgICAgbGV0IHNjcm9sbERpcyA9IE1hdGguYWJzKHBvcyAtIHNjcm9sbE9yaSk7XG4gICAgICAgIGxldCBkaXMgPSAwO1xuXG4gICAgICAgIC8vIOWmguaenOa7muWKqOWIsOeJueWumuS9jee9rumZhOi/keS6hlxuICAgICAgICBpZiAoc2Nyb2xsRGlzIDwgc3BlZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHBvcywgaXNWZXJ0aWNhbCA/IHBvcyA6IDApO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICB9LCBpbnRlcnZhbClcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsVG9Qb3M7IiwiLyoqXG4gKiDlm77niYfmh5LliqDovb1cbiAqIEBwYXJhbXMgb3B0c1xuICogb3B0cy5jb250YWluZXIg5Y+v6YCJ77yM6buY6K6k5Li6aHRtbO+8jOaMh+WumumcgOimgeaHkuWKoOi9veWbvueJh+WFg+e0oOeahOeItuWuueWZqFxuICogb3B0cy5kZWZhdWx0SW1nIOWPr+mAie+8jOWKoOi9veS5i+WJjem7mOiupOeahOWbvueJh1xuICogb3B0cy5lcnJvckltYWdlIOWPr+mAie+8jOWKoOi9vee9kee7nOWbvueJh+WHuumUmeaXtueahOWbvueJh1xuICogb3B0cy5kZWxheSDmu5rliqjmo4DmtYvnmoTpl7TpmpTvvIjlh73mlbDoioLmtYHvvInjgILmr4/pmpRkZWxheeavq+enkui/m+ihjOS4gOasoWNoZWNr77yM5p2l5Yqg6L295aSE5LqO6KeG56qX5Lit55qE5YWD57Sg5Zu+54mH6LWE5rqQXG4gKi9cbmNvbnN0IEltZ0xhenlsb2FkID0ge1xuICAgIC8vIOazqOWGjOa7muWKqOS6i+S7tlxuICAgIGluaXQoeyBjb250YWluZXIgPSBcImh0bWxcIiwgZGVmYXVsdEltZyA9IFwiXCIsIGVycm9ySW1hZ2UgPSBcIlwiLCBkZWxheSA9IDUwMCB9KSB7XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG4gICAgICAgIC8vIOaUtumbhuWcqGNvbnRhaW5lcuS4i+eahOaHkuWKoOi9veeahOWbvueJh1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuZGVmYXVsdEltZyA9IGRlZmF1bHRJbWc7XG4gICAgICAgIHRoaXMuZXJyb3JJbWFnZSA9IGVycm9ySW1hZ2U7XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5nZXRMYXp5TG9hZEVscygpO1xuXG4gICAgICAgIGNvbnN0IGNsaUVsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgLy8g6I635Y+W6KeG56qX55qE6auY5bqm5ZKM5a695bqmXG4gICAgICAgIHRoaXMud0hlaWdodCA9IGNsaUVsZS5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMud1dpZHRoID0gY2xpRWxlLmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGxldCBjYmZuID0gdGhpcy50aHJvdHRsZSgpO1xuICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNiZm4sIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2JmbiwgdHJ1ZSk7ICAgICAgICAgICAgXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgY2JmbiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Ye95pWw6IqC5rWBXG4gICAgdGhyb3R0bGUoKSB7XG4gICAgICAgIGxldCBwcmV2ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAobm93IC0gcHJldiA+IHRoaXMuZGVsYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgcHJldiA9IG5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDojrflj5bmiYDmnInluKZsYXp5bG9hZOeahOWxnuaAp+eahGRvbeWFg+e0oFxuICAgIGdldExhenlMb2FkRWxzKCkge1xuICAgICAgICBjb25zdCBlbGVzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiKltsYXp5bG9hZF1cIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBlbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVzW2ldKTtcbiAgICAgICAgICAgIC8vIOWmguaenOaciem7mOiupOWbvueJh++8jOiuvue9rum7mOiupOWbvueJh1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbGVzW2ldLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOS4uuWFg+e0oOiuvue9ruWbvueJh1xuICAgIHNldEltYWdlRm9yRWwoZWwsIGltZ1VybCkge1xuICAgICAgICAvLyDlpoLmnpxlbOS4jeaYr+agh+etvizkuI3lpITnkIZcbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbC50YWdOYW1lID09PSBcInN0cmluZ1wiICYmIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbWdcIikge1xuICAgICAgICAgICAgZWwuc3JjID0gaW1nVXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2ltZ1VybCB8fCBcIlwifSlgO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOajgOafpeWNleS4quWFg+e0oOaYr+WQpuWcqOinhueql+S4rVxuICAgIGNoZWNrSW5WaWV3KGVsKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHBvcztcbiAgICAgICAgLy8g5aaC5p6ceOWcqC13aWR0aOWIsHdXaWR0aOS5i+mXtOW5tuS4lHnlnKgtaGVpZ2h05Yiwd0hlaWdodOS5i+mXtOaXtu+8jOWFg+e0oOWkhOS6juinhueql+S4rVxuICAgICAgICBpZiAoeCA8IHRoaXMud1dpZHRoICYmIHggPiAtd2lkdGggJiYgeSA8IHRoaXMud0hlaWdodCAmJiB5ID4gLWhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIOmBjeWOhuWtkOWFg+e0oO+8jOWkhOeQhuWcqOinhueql+S4reeahOWFg+e0oFxuICAgIGNoZWNrKCkge1xuICAgICAgICB0aGlzLmdldExhenlMb2FkRWxzKCk7XG4gICAgICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgLy8g5aaC5p6c5Zyo6KeG56qX5LitIFxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tJblZpZXcoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVsSW5WaWV3KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDlsIblhYPntKDnmoRsYXp5bG9hZOWxnuaAp+WPluWHuuadpe+8jOeEtuWQjuaWsOW7uuS4gOS4qmltYWdl5a+56LGhXG4gICAgaGFuZGxlRWxJblZpZXcoZWwpIHtcbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGltZ1VybCA9IGVsLmdldEF0dHJpYnV0ZShcImxhenlsb2FkXCIpO1xuICAgICAgICBpZiAoIWltZ1VybCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBJbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgSW1nLnNyYyA9IGltZ1VybDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJsYXp5bG9hZFwiKTtcbiAgICAgICAgSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgaW1nVXJsKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBcbiAgICAgICAgLy8g5aaC5p6c5Zu+54mH5Yqg6L295aSx6LSl5LqG77yM5bCx5Yqg6L296ZSZ6K+v5Zu+54mH5oiW6buY6K6k5Zu+54mHXG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JJbWFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5lcnJvckltYWdlKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEltZ0xhenlsb2FkOyIsImNvbnN0IGNhblVzZUNvb2tpZSA9ICgpID0+IHR5cGVvZiBkb2N1bWVudCAhPT0gXCJ1bmRlZmluZWRcIjtcbmNvbnN0IE9ORURBWSA9IDM2MDAgKiAxMDAwICogMjQ7XG5jb25zdCBERUZBVUxURVhQSVJFUyA9IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgT05FREFZKS50b0dNVFN0cmluZygpO1xuY29uc3QgQ29va2llID0ge1xuICBzZXQobmFtZSwgdmFsLCBvcHQgPSB7ZXhwaXJlczogREVGQVVMVEVYUElSRVN9KSB7XG4gICAgaWYgKCFuYW1lIHx8ICFjYW5Vc2VDb29raWUoKSkgcmV0dXJuO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PSR7dmFsfTtleHBpcmVzPSR7b3B0LmV4cGlyZXN9YDtcbiAgfSxcbiAgZm9ybWF0Q29va2llKCkge1xuICAgIGlmICghY2FuVXNlQ29va2llKCkpIHJldHVybiB7fTtcbiAgICBcbiAgICBsZXQgaSwgaXRlbTtcbiAgICBsZXQgY29va2llID0gZG9jdW1lbnQuY29va2llO1xuICAgIGxldCBjb29raWVPYmogPSB7fTtcblxuICAgIGNvb2tpZSA9IGNvb2tpZS5zcGxpdChcIjtcIik7XG5cbiAgICBpZiAoY29va2llLmxlbmd0aCkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNvb2tpZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpdGVtID0gY29va2llW2ldLnRyaW0oKS5zcGxpdChcIj1cIik7XG4gICAgICAgIGlmIChpdGVtICYmIGl0ZW1bMF0gJiYgaXRlbVsxXSkge1xuICAgICAgICAgIGNvb2tpZU9ialtpdGVtWzBdLnRyaW0oKV0gPSBpdGVtWzFdLnRyaW0oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29va2llT2JqO1xuICB9LFxuICBnZXQobmFtZSkge1xuICAgIGxldCByZXM7XG4gICAgdHJ5IHtcbiAgICAgIHJlcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5mb3JtYXRDb29raWUoKVtgJHtuYW1lfWBdKSk7XG4gICAgICBpZiAodHlwZW9mIHJlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXMgPSBKU09OLnBhcnNlKHJlcyk7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7fVxuICAgIHJldHVybiByZXM7XG4gIH0sXG4gIGNsZWFyKG5hbWUpIHtcbiAgICBpZiAoIWNhblVzZUNvb2tpZSgpKSByZXR1cm47XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09bnVsbDtleHBpcmVzPS0xYDtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29va2llOyIsImltcG9ydCBzY3JvbGxUb1BvcyBmcm9tIFwiLi91dGlscy9zY3JvbGxUb1Bvc1wiXG5pbXBvcnQgSW1nTGF6eWxvYWQgZnJvbSBcIi4vdXRpbHMvSW1nTGF6eWxvYWRcIlxuaW1wb3J0IENvb2tpZSBmcm9tICcuL3V0aWxzL2Nvb2tpZSdcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHNjcm9sbFRvUG9zLFxuICAgIEltZ0xhenlsb2FkLFxuICAgIENvb2tpZVxufSJdLCJuYW1lcyI6WyJ0aW1lciIsInNjcm9sbFRvUG9zIiwiY29uZmlnIiwicG9zIiwiZWwiLCJpc1ZlcnRpY2FsIiwic3BlZWQiLCJpbnRlcnZhbCIsIm9wdHMiLCJjb25zb2xlIiwiZXJyb3IiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJrZXkiLCJpc05hTiIsImNsZWFySW50ZXJ2YWwiLCJyb290RWxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2xpRWxlIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImVsZVZhbCIsIm9mZnNldEhlaWdodCIsIm9mZnNldFdpZHRoIiwid2luVmFsIiwiY2xpZW50SGVpZ2h0IiwiY2xpZW50V2lkdGgiLCJtYXhWYWwiLCJNYXRoIiwiYWJzIiwiRXJyb3IiLCJtYXgiLCJzZXRJbnRlcnZhbCIsInNjcm9sbE9yaSIsIndpbmRvdyIsInNjcm9sbFkiLCJzY3JvbGxYIiwic2Nyb2xsRGlzIiwiZGlzIiwic2Nyb2xsVG8iLCJmbG9vciIsIkltZ0xhenlsb2FkIiwiaW5pdCIsImNvbnRhaW5lciIsImRlZmF1bHRJbWciLCJlcnJvckltYWdlIiwiZGVsYXkiLCJjaGlsZHJlbiIsImdldExhenlMb2FkRWxzIiwid0hlaWdodCIsIndXaWR0aCIsImNiZm4iLCJ0aHJvdHRsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcmV2IiwiRGF0ZSIsIm5vdyIsImNoZWNrIiwiZWxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuIiwibGVuZ3RoIiwicHVzaCIsInNldEltYWdlRm9yRWwiLCJpbWdVcmwiLCJub2RlVHlwZSIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInNyYyIsInN0eWxlIiwiYmFja2dyb3VuZEltYWdlIiwiY2hlY2tJblZpZXciLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0IiwiZm9yRWFjaCIsIml0ZW0iLCJoYW5kbGVFbEluVmlldyIsImdldEF0dHJpYnV0ZSIsIkltZyIsIkltYWdlIiwicmVtb3ZlQXR0cmlidXRlIiwiY2FuVXNlQ29va2llIiwiT05FREFZIiwiREVGQVVMVEVYUElSRVMiLCJnZXRUaW1lIiwidG9HTVRTdHJpbmciLCJDb29raWUiLCJzZXQiLCJuYW1lIiwidmFsIiwib3B0IiwiZXhwaXJlcyIsImNvb2tpZSIsImZvcm1hdENvb2tpZSIsImNvb2tpZU9iaiIsInNwbGl0IiwidHJpbSIsImdldCIsInJlcyIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImUiLCJjbGVhciJd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
