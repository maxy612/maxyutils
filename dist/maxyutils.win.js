var maxyutils = (function () {
  'use strict';

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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLndpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL3V0aWxzL0ltZ0xhenlsb2FkLmpzIiwiLi4vc3JjL3V0aWxzL2Nvb2tpZS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgdGltZXIgPSBudWxsO1xuXG4vKipcbiAqIFvpobXpnaLlubPmu5Hmu5rliqjliLDmjIflrprkvY3nva7vvIjlpJrnlKjkuo7ov5Tlm57pobbpg6jvvIldXG4gKiBAcGFyYW0gIHtbTnVtYmVyIHx8IE9iamVjdF19IG9wdHMgW+mFjee9ruWPguaVsF1cbiAqIEBvcHRzIOS4uk51bWJlcuexu+Wei+aXtu+8jOm7mOiupOS4iuS4i+a7muWKqOWIsOaMh+WumuS9jee9ru+8jOS7pWh0bWzlhYPntKDkuLrmoLnlhYPntKDorqHnrpflhoXlrrnljLrpq5jluqZcbiAqIEBvcHRzIOS4uk9iamVjdOaXtu+8jOWPr+Whq+eahOWPguaVsOacie+8mlxuICogQHBvcyByZXF1aXJlZCB7TnVtYmVyfSDmu5rliqjliLDnmoTmjIflrprkvY3nva7vvIjot53pobXpnaLlt6bkvqfmiJbogIXot53pobbpg6jnmoTot53nprvvvIlcbiAqIEBpc1ZlcnRpY2FsIHJlcXVpcmVkIHtCb29sZWFufSDpgInmi6nkuIrkuIvmu5rliqjov5jmmK/lt6blj7Pmu5rliqgo5Li6dHJ1ZeaXtuS4iuS4i+a7muWKqO+8jGZhbHNl5pe25bem5Y+z5rua5Yqo77yM6buY6K6k5LiK5LiL5rua5YqoKVxuICogQGVsIHtTdHJpbmd9IOaMh+WumueahGRvbeWFg+e0oO+8jOS4gOiIrOS4umh0bWwsYm9keeaIluiAhWJvZHnkuIvmnIDlpJblsYLnmoRkb21cbiAqIEBzcGVlZCB7TnVtYmVyfSDmr4/mrKHmu5rliqjnmoTot53nprvmmK/nm67liY3mu5rliqjmgLvot53nprvnmoQgMSAvIHNwZWVkLOatpOWAvOi2iuWkp++8jOa7muWKqOi2iuW/q1xuICogQGludGVydmFsIHtOdW1iZXJ9IOWumuaXtuWZqOaJp+ihjOmXtOmalOOAgumXtOmalOi2iuWwj++8jOa7muWKqOi2iuW/qyBcbiAqIEByZXR1cm4ge1t1bmRlZmluZWRdfSAgICAgIFvml6DmhI/kuYnvvIzmsqHmnInov5Tlm57lgLxdXG4gKi9cbmNvbnN0IHNjcm9sbFRvUG9zID0gb3B0cyA9PiB7XG4gICAgLy8g5Yid5aeL5YyW6YWN572uXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBwb3M6IDAsXG4gICAgICAgIGVsOiBlbCB8fCBcImh0bWxcIixcbiAgICAgICAgaXNWZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDYsXG4gICAgICAgIGludGVydmFsOiAxMFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBjb25maWcucG9zID0gb3B0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBpZiAob3B0cyA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOWPguaVsOW6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZfmiJblr7nosaFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlkIjlubZjb25maWflkozkvKDlhaXnmoRvcHRzXG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRzKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeyBwb3MsIGVsLCBpc1ZlcnRpY2FsLCBzcGVlZCwgaW50ZXJ2YWwgfSA9IGNvbmZpZztcblxuICAgIGlmICh0eXBlb2YgcG9zICE9PSBcIm51bWJlclwiIHx8IHBvcyA8IDAgfHwgaXNOYU4ocG9zKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOa7muWKqOWPguaVsHBvc+W6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZdcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDph43nva50aW1lclxuICAgIGlmICh0aW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOagueWFg+e0oOWSjOinhueql+WFg+e0oFxuICAgIGxldCByb290RWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgbGV0IGNsaUVsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xuXG4gICAgLy8g5qCh6aqMcm9vdEVsZeaYr+WQpuS4uuepulxuICAgIGlmICghcm9vdEVsZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi5oyH5a6a55qEZWzkuI3lrZjlnKhcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnmupDntKDnmoTlrr3miJbpq5hcbiAgICBsZXQgZWxlVmFsID0gaXNWZXJ0aWNhbCA/IHJvb3RFbGUub2Zmc2V0SGVpZ2h0IDogcm9vdEVsZS5vZmZzZXRXaWR0aDtcbiAgICAvLyDojrflj5bliLDop4bnqpfnmoTlrr3miJbpq5hcbiAgICBsZXQgd2luVmFsID0gaXNWZXJ0aWNhbCA/IGNsaUVsZS5jbGllbnRIZWlnaHQgOiBjbGlFbGUuY2xpZW50V2lkdGg7XG4gICAgLy8g6K6h566X5rua5Yqo55qE5pyA5aSn5YC877yM5ZCM5pe255WZ5Ye6MjDnmoTlronlhajot53nprtcbiAgICBsZXQgbWF4VmFsID0gTWF0aC5hYnMoZWxlVmFsIC0gd2luVmFsKSA8IDIwID8gMCA6IGVsZVZhbCAtIHdpblZhbCAtIDIwO1xuXG4gICAgLy8g5q+U6L6D5YaF5a656auY77yP5a695bqm5ZKM6KeG56qX6auY77yP5a695bqm77yM5aaC5p6c5YaF5a656auY77yP5a695bqm5LiN5aSn5LqO6KeG56qX6auY77yP5a695bqm77yM5q2k5pe25LiN5Lya5Ye6546w5rua5Yqo5p2h77yM57uZ5Ye65o+Q56S6XG4gICAgaWYgKGVsZVZhbCA8PSB3aW5WYWwpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCLor7fnoa7orqTlvZPliY3kvKDlhaXnmoTlhoXlrrnljLrpq5gv5a695bqm5aSn5LqO6KeG56qX6auY77yP5a695bqm77yI5q2k5pe25omN5Lya5Ye6546w5rua5Yqo5p2h77yJXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5a+55rua5Yqo5Yiw55qE5L2N572ucG9z6L+b6KGM5aSE55CGXG4gICAgaWYgKHBvcyA+IG1heFZhbCkge1xuICAgICAgICBwb3MgPSBNYXRoLm1heCgwLCBtYXhWYWwpO1xuICAgIH1cblxuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgc2Nyb2xsT3JpID0gaXNWZXJ0aWNhbCA/IHdpbmRvdy5zY3JvbGxZIDogd2luZG93LnNjcm9sbFg7XG4gICAgICAgIGxldCBzY3JvbGxEaXMgPSBNYXRoLmFicyhwb3MgLSBzY3JvbGxPcmkpO1xuICAgICAgICBsZXQgZGlzID0gMDtcblxuICAgICAgICAvLyDlpoLmnpzmu5rliqjliLDnibnlrprkvY3nva7pmYTov5HkuoZcbiAgICAgICAgaWYgKHNjcm9sbERpcyA8IHNwZWVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBwb3MsIGlzVmVydGljYWwgPyBwb3MgOiAwKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5q+P5qyh5rua5Yqo5Ymp5L2Z5rua5Yqo6Led56a755qEIDEgLyBzcGVlZFxuICAgICAgICBkaXMgPSBNYXRoLmZsb29yKHNjcm9sbERpcyAvIHNwZWVkKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPiBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSAtPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Nyb2xsT3JpIDwgcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgKz0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogc2Nyb2xsT3JpLCBpc1ZlcnRpY2FsID8gc2Nyb2xsT3JpIDogMCk7XG4gICAgfSwgaW50ZXJ2YWwpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNjcm9sbFRvUG9zOyIsIi8qKlxuICog5Zu+54mH5oeS5Yqg6L29XG4gKiBAcGFyYW1zIG9wdHNcbiAqIG9wdHMuY29udGFpbmVyIOWPr+mAie+8jOm7mOiupOS4umh0bWzvvIzmjIflrprpnIDopoHmh5LliqDovb3lm77niYflhYPntKDnmoTniLblrrnlmahcbiAqIG9wdHMuZGVmYXVsdEltZyDlj6/pgInvvIzliqDovb3kuYvliY3pu5jorqTnmoTlm77niYdcbiAqIG9wdHMuZXJyb3JJbWFnZSDlj6/pgInvvIzliqDovb3nvZHnu5zlm77niYflh7rplJnml7bnmoTlm77niYdcbiAqIG9wdHMuZGVsYXkg5rua5Yqo5qOA5rWL55qE6Ze06ZqU77yI5Ye95pWw6IqC5rWB77yJ44CC5q+P6ZqUZGVsYXnmr6vnp5Lov5vooYzkuIDmrKFjaGVja++8jOadpeWKoOi9veWkhOS6juinhueql+S4reeahOWFg+e0oOWbvueJh+i1hOa6kFxuICovXG5jb25zdCBJbWdMYXp5bG9hZCA9IHtcbiAgICAvLyDms6jlhozmu5rliqjkuovku7ZcbiAgICBpbml0KHsgY29udGFpbmVyID0gXCJodG1sXCIsIGRlZmF1bHRJbWcgPSBcIlwiLCBlcnJvckltYWdlID0gXCJcIiwgZGVsYXkgPSA1MDAgfSkge1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgICAgICAvLyDmlLbpm4blnKhjb250YWluZXLkuIvnmoTmh5LliqDovb3nmoTlm77niYdcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmRlZmF1bHRJbWcgPSBkZWZhdWx0SW1nO1xuICAgICAgICB0aGlzLmVycm9ySW1hZ2UgPSBlcnJvckltYWdlO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcblxuICAgICAgICBjb25zdCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIC8vIOiOt+WPluinhueql+eahOmrmOW6puWSjOWuveW6plxuICAgICAgICB0aGlzLndIZWlnaHQgPSBjbGlFbGUuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLndXaWR0aCA9IGNsaUVsZS5jbGllbnRXaWR0aDtcblxuICAgICAgICBsZXQgY2JmbiA9IHRoaXMudGhyb3R0bGUoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjYmZuLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGNiZm4sIHRydWUpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNiZm4sIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWHveaVsOiKgua1gVxuICAgIHRocm90dGxlKCkge1xuICAgICAgICBsZXQgcHJldiA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHByZXYgPiB0aGlzLmRlbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHByZXYgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5omA5pyJ5bimbGF6eWxvYWTnmoTlsZ7mgKfnmoRkb23lhYPntKBcbiAgICBnZXRMYXp5TG9hZEVscygpIHtcbiAgICAgICAgY29uc3QgZWxlcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIipbbGF6eWxvYWRdXCIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZWxlcy5sZW5ndGg7IGkgPCBsZW47IGkgKysgKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlc1tpXSk7XG4gICAgICAgICAgICAvLyDlpoLmnpzmnInpu5jorqTlm77niYfvvIzorr7nva7pu5jorqTlm77niYdcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWxlc1tpXSwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDkuLrlhYPntKDorr7nva7lm77niYdcbiAgICBzZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpIHtcbiAgICAgICAgLy8g5aaC5p6cZWzkuI3mmK/moIfnrb4s5LiN5aSE55CGXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWwudGFnTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW1nXCIpIHtcbiAgICAgICAgICAgIGVsLnNyYyA9IGltZ1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWdVcmwgfHwgXCJcIn0pYDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDmo4Dmn6XljZXkuKrlhYPntKDmmK/lkKblnKjop4bnqpfkuK1cbiAgICBjaGVja0luVmlldyhlbCkge1xuICAgICAgICBjb25zdCBwb3MgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBwb3M7XG4gICAgICAgIC8vIOWmguaenHjlnKgtd2lkdGjliLB3V2lkdGjkuYvpl7TlubbkuJR55ZyoLWhlaWdodOWIsHdIZWlnaHTkuYvpl7Tml7bvvIzlhYPntKDlpITkuo7op4bnqpfkuK1cbiAgICAgICAgaWYgKHggPCB0aGlzLndXaWR0aCAmJiB4ID4gLXdpZHRoICYmIHkgPCB0aGlzLndIZWlnaHQgJiYgeSA+IC1oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyDpgY3ljoblrZDlhYPntKDvvIzlpITnkIblnKjop4bnqpfkuK3nmoTlhYPntKBcbiAgICBjaGVjaygpIHtcbiAgICAgICAgdGhpcy5nZXRMYXp5TG9hZEVscygpO1xuICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIOWmguaenOWcqOinhueql+S4rSBcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSW5WaWV3KGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFbEluVmlldyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bCG5YWD57Sg55qEbGF6eWxvYWTlsZ7mgKflj5blh7rmnaXvvIznhLblkI7mlrDlu7rkuIDkuKppbWFnZeWvueixoVxuICAgIGhhbmRsZUVsSW5WaWV3KGVsKSB7XG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpbWdVcmwgPSBlbC5nZXRBdHRyaWJ1dGUoXCJsYXp5bG9hZFwiKTtcbiAgICAgICAgaWYgKCFpbWdVcmwpIHJldHVybjtcbiAgICAgICAgY29uc3QgSW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIEltZy5zcmMgPSBpbWdVcmw7XG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIGltZ1VybCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOWbvueJh+WKoOi9veWksei0peS6hu+8jOWwseWKoOi9vemUmeivr+WbvueJh+aIlum7mOiupOWbvueJh1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ySW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZXJyb3JJbWFnZSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbWdMYXp5bG9hZDsiLCJjb25zdCBjYW5Vc2VDb29raWUgPSAoKSA9PiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5jb25zdCBPTkVEQVkgPSAzNjAwICogMTAwMCAqIDI0O1xuY29uc3QgREVGQVVMVEVYUElSRVMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE9ORURBWSkudG9HTVRTdHJpbmcoKTtcbmNvbnN0IENvb2tpZSA9IHtcbiAgc2V0KG5hbWUsIHZhbCwgb3B0ID0ge2V4cGlyZXM6IERFRkFVTFRFWFBJUkVTfSkge1xuICAgIGlmICghbmFtZSB8fCAhY2FuVXNlQ29va2llKCkpIHJldHVybjtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbH07ZXhwaXJlcz0ke29wdC5leHBpcmVzfWA7XG4gIH0sXG4gIGZvcm1hdENvb2tpZSgpIHtcbiAgICBpZiAoIWNhblVzZUNvb2tpZSgpKSByZXR1cm4ge307XG4gICAgXG4gICAgbGV0IGksIGl0ZW07XG4gICAgbGV0IGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICBsZXQgY29va2llT2JqID0ge307XG5cbiAgICBjb29raWUgPSBjb29raWUuc3BsaXQoXCI7XCIpO1xuXG4gICAgaWYgKGNvb2tpZS5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb29raWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNvb2tpZVtpXS50cmltKCkuc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtWzBdICYmIGl0ZW1bMV0pIHtcbiAgICAgICAgICBjb29raWVPYmpbaXRlbVswXS50cmltKCldID0gaXRlbVsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZU9iajtcbiAgfSxcbiAgZ2V0KG5hbWUpIHtcbiAgICBsZXQgcmVzO1xuICAgIHRyeSB7XG4gICAgICByZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZm9ybWF0Q29va2llKClbYCR7bmFtZX1gXSkpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuICBjbGVhcihuYW1lKSB7XG4gICAgaWYgKCFjYW5Vc2VDb29raWUoKSkgcmV0dXJuO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PW51bGw7ZXhwaXJlcz0tMWA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvb2tpZTsiLCJpbXBvcnQgc2Nyb2xsVG9Qb3MgZnJvbSBcIi4vdXRpbHMvc2Nyb2xsVG9Qb3NcIlxuaW1wb3J0IEltZ0xhenlsb2FkIGZyb20gXCIuL3V0aWxzL0ltZ0xhenlsb2FkXCJcbmltcG9ydCBDb29raWUgZnJvbSAnLi91dGlscy9jb29raWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBzY3JvbGxUb1BvcyxcbiAgICBJbWdMYXp5bG9hZCxcbiAgICBDb29raWVcbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsInBvcyIsImVsIiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwiaW50ZXJ2YWwiLCJvcHRzIiwiY29uc29sZSIsImVycm9yIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwia2V5IiwiaXNOYU4iLCJjbGVhckludGVydmFsIiwicm9vdEVsZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNsaUVsZSIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJlbGVWYWwiLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsIndpblZhbCIsImNsaWVudEhlaWdodCIsImNsaWVudFdpZHRoIiwibWF4VmFsIiwiTWF0aCIsImFicyIsIkVycm9yIiwibWF4Iiwic2V0SW50ZXJ2YWwiLCJzY3JvbGxPcmkiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiLCJJbWdMYXp5bG9hZCIsImluaXQiLCJjb250YWluZXIiLCJkZWZhdWx0SW1nIiwiZXJyb3JJbWFnZSIsImRlbGF5IiwiY2hpbGRyZW4iLCJnZXRMYXp5TG9hZEVscyIsIndIZWlnaHQiLCJ3V2lkdGgiLCJjYmZuIiwidGhyb3R0bGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHJldiIsIkRhdGUiLCJub3ciLCJjaGVjayIsImVsZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbiIsImxlbmd0aCIsInB1c2giLCJzZXRJbWFnZUZvckVsIiwiaW1nVXJsIiwibm9kZVR5cGUiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzcmMiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImNoZWNrSW5WaWV3IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImZvckVhY2giLCJpdGVtIiwiaGFuZGxlRWxJblZpZXciLCJnZXRBdHRyaWJ1dGUiLCJJbWciLCJJbWFnZSIsInJlbW92ZUF0dHJpYnV0ZSIsImNhblVzZUNvb2tpZSIsIk9ORURBWSIsIkRFRkFVTFRFWFBJUkVTIiwiZ2V0VGltZSIsInRvR01UU3RyaW5nIiwiQ29va2llIiwic2V0IiwibmFtZSIsInZhbCIsIm9wdCIsImV4cGlyZXMiLCJjb29raWUiLCJmb3JtYXRDb29raWUiLCJjb29raWVPYmoiLCJzcGxpdCIsInRyaW0iLCJnZXQiLCJyZXMiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJlIiwiY2xl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
