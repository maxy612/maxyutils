'use strict';

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

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL3V0aWxzL0ltZ0xhenlsb2FkLmpzIiwiLi4vc3JjL3V0aWxzL2Nvb2tpZS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgdGltZXIgPSBudWxsO1xuXG4vKipcbiAqIFvpobXpnaLlubPmu5Hmu5rliqjliLDmjIflrprkvY3nva7vvIjlpJrnlKjkuo7ov5Tlm57pobbpg6jvvIldXG4gKiBAcGFyYW0gIHtbTnVtYmVyIHx8IE9iamVjdF19IG9wdHMgW+mFjee9ruWPguaVsF1cbiAqIEBvcHRzIOS4uk51bWJlcuexu+Wei+aXtu+8jOm7mOiupOS4iuS4i+a7muWKqOWIsOaMh+WumuS9jee9ru+8jOS7pWh0bWzlhYPntKDkuLrmoLnlhYPntKDorqHnrpflhoXlrrnljLrpq5jluqZcbiAqIEBvcHRzIOS4uk9iamVjdOaXtu+8jOWPr+Whq+eahOWPguaVsOacie+8mlxuICogQHBvcyByZXF1aXJlZCB7TnVtYmVyfSDmu5rliqjliLDnmoTmjIflrprkvY3nva7vvIjot53pobXpnaLlt6bkvqfmiJbogIXot53pobbpg6jnmoTot53nprvvvIlcbiAqIEBpc1ZlcnRpY2FsIHJlcXVpcmVkIHtCb29sZWFufSDpgInmi6nkuIrkuIvmu5rliqjov5jmmK/lt6blj7Pmu5rliqgo5Li6dHJ1ZeaXtuS4iuS4i+a7muWKqO+8jGZhbHNl5pe25bem5Y+z5rua5Yqo77yM6buY6K6k5LiK5LiL5rua5YqoKVxuICogQGVsIHtTdHJpbmd9IOaMh+WumueahGRvbeWFg+e0oO+8jOS4gOiIrOS4umh0bWwsYm9keeaIluiAhWJvZHnkuIvmnIDlpJblsYLnmoRkb21cbiAqIEBzcGVlZCB7TnVtYmVyfSDmr4/mrKHmu5rliqjnmoTot53nprvmmK/nm67liY3mu5rliqjmgLvot53nprvnmoQgMSAvIHNwZWVkLOatpOWAvOi2iuWwj++8jOa7muWKqOi2iuW/q1xuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNlxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBjb25maWcucG9zID0gb3B0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBpZiAob3B0cyA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOWPguaVsOW6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZfmiJblr7nosaFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlkIjlubZjb25maWflkozkvKDlhaXnmoRvcHRzXG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRzKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeyBwb3MsIGVsLCBpc1ZlcnRpY2FsLCBzcGVlZCB9ID0gY29uZmlnO1xuXG4gICAgaWYgKHR5cGVvZiBwb3MgIT09IFwibnVtYmVyXCIgfHwgcG9zIDwgMCB8fCBpc05hTihwb3MpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnlhYPntKDlkozop4bnqpflhYPntKBcbiAgICBsZXQgcm9vdEVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGxldCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgIC8vIOagoemqjHJvb3RFbGXmmK/lkKbkuLrnqbpcbiAgICBpZiAoIXJvb3RFbGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIuaMh+WumueahGVs5LiN5a2Y5ZyoXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55rqQ57Sg55qE5a695oiW6auYXG4gICAgbGV0IGVsZVZhbCA9IGlzVmVydGljYWwgPyByb290RWxlLm9mZnNldEhlaWdodCA6IHJvb3RFbGUub2Zmc2V0V2lkdGg7XG4gICAgLy8g6I635Y+W5Yiw6KeG56qX55qE5a695oiW6auYXG4gICAgbGV0IHdpblZhbCA9IGlzVmVydGljYWwgPyBjbGlFbGUuY2xpZW50SGVpZ2h0IDogY2xpRWxlLmNsaWVudFdpZHRoO1xuICAgIC8vIOiuoeeul+a7muWKqOeahOacgOWkp+WAvO+8jOWQjOaXtueVmeWHujIw55qE5a6J5YWo6Led56a7XG4gICAgbGV0IG1heFZhbCA9IE1hdGguYWJzKGVsZVZhbCAtIHdpblZhbCkgPCAyMCA/IDAgOiBlbGVWYWwgLSB3aW5WYWwgLSAyMDtcblxuICAgIC8vIOavlOi+g+WGheWuuemrmO+8j+WuveW6puWSjOinhueql+mrmO+8j+WuveW6pu+8jOWmguaenOWGheWuuemrmO+8j+WuveW6puS4jeWkp+S6juinhueql+mrmO+8j+WuveW6pu+8jOatpOaXtuS4jeS8muWHuueOsOa7muWKqOadoe+8jOe7meWHuuaPkOekulxuICAgIGlmIChlbGVWYWwgPD0gd2luVmFsKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwi6K+356Gu6K6k5b2T5YmN5Lyg5YWl55qE5YaF5a655Yy66auYL+WuveW6puWkp+S6juinhueql+mrmO+8j+WuveW6pu+8iOatpOaXtuaJjeS8muWHuueOsOa7muWKqOadoe+8iVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWvuea7muWKqOWIsOeahOS9jee9rnBvc+i/m+ihjOWkhOeQhlxuICAgIGlmIChwb3MgPiBtYXhWYWwpIHtcbiAgICAgICAgcG9zID0gTWF0aC5tYXgoMCwgbWF4VmFsKTtcbiAgICB9XG5cbiAgICB0aW1lciA9ICgpID0+IHtcbiAgICAgICAgbGV0IHNjcm9sbE9yaSA9IGlzVmVydGljYWwgPyB3aW5kb3cuc2Nyb2xsWSA6IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgICBsZXQgc2Nyb2xsRGlzID0gTWF0aC5hYnMocG9zIC0gc2Nyb2xsT3JpKTtcbiAgICAgICAgbGV0IGRpcyA9IDA7XG5cbiAgICAgICAgLy8g5aaC5p6c5rua5Yqo5Yiw54m55a6a5L2N572u6ZmE6L+R5LqGXG4gICAgICAgIGlmIChzY3JvbGxEaXMgPCBzcGVlZCkge1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogcG9zLCBpc1ZlcnRpY2FsID8gcG9zIDogMCk7XG4gICAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZXIpXG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lcilcbiAgICB9XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWVyKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzY3JvbGxUb1BvczsiLCIvKipcbiAqIOWbvueJh+aHkuWKoOi9vVxuICogQHBhcmFtcyBvcHRzXG4gKiBvcHRzLmNvbnRhaW5lciDlj6/pgInvvIzpu5jorqTkuLpodG1s77yM5oyH5a6a6ZyA6KaB5oeS5Yqg6L295Zu+54mH5YWD57Sg55qE54i25a655ZmoXG4gKiBvcHRzLmRlZmF1bHRJbWcg5Y+v6YCJ77yM5Yqg6L295LmL5YmN6buY6K6k55qE5Zu+54mHXG4gKiBvcHRzLmVycm9ySW1hZ2Ug5Y+v6YCJ77yM5Yqg6L29572R57uc5Zu+54mH5Ye66ZSZ5pe255qE5Zu+54mHXG4gKiBvcHRzLmRlbGF5IOa7muWKqOajgOa1i+eahOmXtOmalO+8iOWHveaVsOiKgua1ge+8ieOAguavj+malGRlbGF55q+r56eS6L+b6KGM5LiA5qyhY2hlY2vvvIzmnaXliqDovb3lpITkuo7op4bnqpfkuK3nmoTlhYPntKDlm77niYfotYTmupBcbiAqL1xuY29uc3QgSW1nTGF6eWxvYWQgPSB7XG4gICAgLy8g5rOo5YaM5rua5Yqo5LqL5Lu2XG4gICAgaW5pdCh7IGNvbnRhaW5lciA9IFwiaHRtbFwiLCBkZWZhdWx0SW1nID0gXCJcIiwgZXJyb3JJbWFnZSA9IFwiXCIsIGRlbGF5ID0gNTAwIH0pIHtcbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcbiAgICAgICAgLy8g5pS26ZuG5ZyoY29udGFpbmVy5LiL55qE5oeS5Yqg6L2955qE5Zu+54mHXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5kZWZhdWx0SW1nID0gZGVmYXVsdEltZztcbiAgICAgICAgdGhpcy5lcnJvckltYWdlID0gZXJyb3JJbWFnZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmdldExhenlMb2FkRWxzKCk7XG5cbiAgICAgICAgY29uc3QgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAvLyDojrflj5bop4bnqpfnmoTpq5jluqblkozlrr3luqZcbiAgICAgICAgdGhpcy53SGVpZ2h0ID0gY2xpRWxlLmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy53V2lkdGggPSBjbGlFbGUuY2xpZW50V2lkdGg7XG5cbiAgICAgICAgbGV0IGNiZm4gPSB0aGlzLnRocm90dGxlKCk7XG4gICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgY2JmbiwgdHJ1ZSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBjYmZuLCB0cnVlKTsgICAgICAgICAgICBcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBjYmZuLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDlh73mlbDoioLmtYFcbiAgICB0aHJvdHRsZSgpIHtcbiAgICAgICAgbGV0IHByZXYgPSBEYXRlLm5vdygpO1xuICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmIChub3cgLSBwcmV2ID4gdGhpcy5kZWxheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgICAgICAgICBwcmV2ID0gbm93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOiOt+WPluaJgOacieW4pmxhenlsb2Fk55qE5bGe5oCn55qEZG9t5YWD57SgXG4gICAgZ2V0TGF6eUxvYWRFbHMoKSB7XG4gICAgICAgIGNvbnN0IGVsZXMgPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIqW2xhenlsb2FkXVwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGVsZXMubGVuZ3RoOyBpIDwgbGVuOyBpICsrICkge1xuICAgICAgICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZXNbaV0pO1xuICAgICAgICAgICAgLy8g5aaC5p6c5pyJ6buY6K6k5Zu+54mH77yM6K6+572u6buY6K6k5Zu+54mHXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsZXNbaV0sIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Li65YWD57Sg6K6+572u5Zu+54mHXG4gICAgc2V0SW1hZ2VGb3JFbChlbCwgaW1nVXJsKSB7XG4gICAgICAgIC8vIOWmguaenGVs5LiN5piv5qCH562+LOS4jeWkhOeQhlxuICAgICAgICBpZiAoZWwubm9kZVR5cGUgIT09IDEpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIGVsLnRhZ05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImltZ1wiKSB7XG4gICAgICAgICAgICBlbC5zcmMgPSBpbWdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1nVXJsIHx8IFwiXCJ9KWA7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5qOA5p+l5Y2V5Liq5YWD57Sg5piv5ZCm5Zyo6KeG56qX5LitXG4gICAgY2hlY2tJblZpZXcoZWwpIHtcbiAgICAgICAgY29uc3QgcG9zID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gcG9zO1xuICAgICAgICAvLyDlpoLmnpx45ZyoLXdpZHRo5Yiwd1dpZHRo5LmL6Ze05bm25LiUeeWcqC1oZWlnaHTliLB3SGVpZ2h05LmL6Ze05pe277yM5YWD57Sg5aSE5LqO6KeG56qX5LitXG4gICAgICAgIGlmICh4IDwgdGhpcy53V2lkdGggJiYgeCA+IC13aWR0aCAmJiB5IDwgdGhpcy53SGVpZ2h0ICYmIHkgPiAtaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuXG4gICAgLy8g6YGN5Y6G5a2Q5YWD57Sg77yM5aSE55CG5Zyo6KeG56qX5Lit55qE5YWD57SgXG4gICAgY2hlY2soKSB7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkcmVuLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlnKjop4bnqpfkuK0gXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0luVmlldyhpdGVtKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRWxJblZpZXcoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8vIOWwhuWFg+e0oOeahGxhenlsb2Fk5bGe5oCn5Y+W5Ye65p2l77yM54S25ZCO5paw5bu65LiA5LiqaW1hZ2Xlr7nosaFcbiAgICBoYW5kbGVFbEluVmlldyhlbCkge1xuICAgICAgICBpZiAoZWwubm9kZVR5cGUgIT09IDEpIHJldHVybjtcbiAgICAgICAgY29uc3QgaW1nVXJsID0gZWwuZ2V0QXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIGlmICghaW1nVXJsKSByZXR1cm47XG4gICAgICAgIGNvbnN0IEltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBJbWcuc3JjID0gaW1nVXJsO1xuXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShcImxhenlsb2FkXCIpO1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIFxuICAgICAgICAvLyDlpoLmnpzlm77niYfliqDovb3lpLHotKXkuobvvIzlsLHliqDovb3plJnor6/lm77niYfmiJbpu5jorqTlm77niYdcbiAgICAgICAgSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvckltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmVycm9ySW1hZ2UpO1xuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSW1nTGF6eWxvYWQ7IiwiY29uc3QgY2FuVXNlQ29va2llID0gKCkgPT4gdHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiO1xuY29uc3QgT05FREFZID0gMzYwMCAqIDEwMDAgKiAyNDtcbmNvbnN0IERFRkFVTFRFWFBJUkVTID0gbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyBPTkVEQVkpLnRvR01UU3RyaW5nKCk7XG5jb25zdCBDb29raWUgPSB7XG4gIHNldChuYW1lLCB2YWwsIG9wdCA9IHtleHBpcmVzOiBERUZBVUxURVhQSVJFU30pIHtcbiAgICBpZiAoIW5hbWUgfHwgIWNhblVzZUNvb2tpZSgpKSByZXR1cm47XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09JHt2YWx9O2V4cGlyZXM9JHtvcHQuZXhwaXJlc31gO1xuICB9LFxuICBmb3JtYXRDb29raWUoKSB7XG4gICAgaWYgKCFjYW5Vc2VDb29raWUoKSkgcmV0dXJuIHt9O1xuICAgIFxuICAgIGxldCBpLCBpdGVtO1xuICAgIGxldCBjb29raWUgPSBkb2N1bWVudC5jb29raWU7XG4gICAgbGV0IGNvb2tpZU9iaiA9IHt9O1xuXG4gICAgY29va2llID0gY29va2llLnNwbGl0KFwiO1wiKTtcblxuICAgIGlmIChjb29raWUubGVuZ3RoKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY29va2llLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGl0ZW0gPSBjb29raWVbaV0udHJpbSgpLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgaWYgKGl0ZW0gJiYgaXRlbVswXSAmJiBpdGVtWzFdKSB7XG4gICAgICAgICAgY29va2llT2JqW2l0ZW1bMF0udHJpbSgpXSA9IGl0ZW1bMV0udHJpbSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb29raWVPYmo7XG4gIH0sXG4gIGdldChuYW1lKSB7XG4gICAgbGV0IHJlcztcbiAgICB0cnkge1xuICAgICAgcmVzID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmZvcm1hdENvb2tpZSgpW2Ake25hbWV9YF0pKTtcbiAgICAgIGlmICh0eXBlb2YgcmVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHJlcyA9IEpTT04ucGFyc2UocmVzKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHt9XG4gICAgcmV0dXJuIHJlcztcbiAgfSxcbiAgY2xlYXIobmFtZSkge1xuICAgIGlmICghY2FuVXNlQ29va2llKCkpIHJldHVybjtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT1udWxsO2V4cGlyZXM9LTFgO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBDb29raWU7IiwiaW1wb3J0IHNjcm9sbFRvUG9zIGZyb20gXCIuL3V0aWxzL3Njcm9sbFRvUG9zXCJcbmltcG9ydCBJbWdMYXp5bG9hZCBmcm9tIFwiLi91dGlscy9JbWdMYXp5bG9hZFwiXG5pbXBvcnQgQ29va2llIGZyb20gJy4vdXRpbHMvY29va2llJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2Nyb2xsVG9Qb3MsXG4gICAgSW1nTGF6eWxvYWQsXG4gICAgQ29va2llXG59Il0sIm5hbWVzIjpbInRpbWVyIiwic2Nyb2xsVG9Qb3MiLCJjb25maWciLCJlbCIsIm9wdHMiLCJwb3MiLCJlcnJvciIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImtleSIsImlzVmVydGljYWwiLCJzcGVlZCIsImlzTmFOIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJyb290RWxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2xpRWxlIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImVsZVZhbCIsIm9mZnNldEhlaWdodCIsIm9mZnNldFdpZHRoIiwid2luVmFsIiwiY2xpZW50SGVpZ2h0IiwiY2xpZW50V2lkdGgiLCJtYXhWYWwiLCJNYXRoIiwiYWJzIiwiRXJyb3IiLCJtYXgiLCJzY3JvbGxPcmkiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJJbWdMYXp5bG9hZCIsImNvbnRhaW5lciIsImRlZmF1bHRJbWciLCJlcnJvckltYWdlIiwiZGVsYXkiLCJjaGlsZHJlbiIsImdldExhenlMb2FkRWxzIiwid0hlaWdodCIsIndXaWR0aCIsImNiZm4iLCJ0aHJvdHRsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJwcmV2IiwiRGF0ZSIsIm5vdyIsImNoZWNrIiwiZWxlcyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpIiwibGVuIiwibGVuZ3RoIiwicHVzaCIsInNldEltYWdlRm9yRWwiLCJpbWdVcmwiLCJub2RlVHlwZSIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsInNyYyIsInN0eWxlIiwiYmFja2dyb3VuZEltYWdlIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwieCIsInkiLCJ3aWR0aCIsImhlaWdodCIsImZvckVhY2giLCJjaGVja0luVmlldyIsIml0ZW0iLCJoYW5kbGVFbEluVmlldyIsImdldEF0dHJpYnV0ZSIsIkltZyIsIkltYWdlIiwicmVtb3ZlQXR0cmlidXRlIiwiY2FuVXNlQ29va2llIiwiT05FREFZIiwiREVGQVVMVEVYUElSRVMiLCJnZXRUaW1lIiwidG9HTVRTdHJpbmciLCJDb29raWUiLCJuYW1lIiwidmFsIiwib3B0IiwiZXhwaXJlcyIsImNvb2tpZSIsImNvb2tpZU9iaiIsInNwbGl0IiwidHJpbSIsInJlcyIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsImZvcm1hdENvb2tpZSIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsU0FBUSxJQUFaO0FBYUEsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLE9BQVE7UUFFbEJDLFNBQVM7YUFDTixDQURNO1lBRVBDLE1BQU0sTUFGQztvQkFHQyxJQUhEO2VBSUo7S0FKWDtRQU9JLFFBQU9DLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEIsRUFBOEI7WUFDdEIsT0FBT0EsSUFBUCxLQUFnQixRQUFwQixFQUE4QjttQkFDbkJDLEdBQVAsR0FBYUQsSUFBYjtTQURKLE1BRU87b0JBQ0tFLEtBQVIsQ0FBYyw4QkFBZDs7OztRQUtKRixTQUFTLElBQWIsRUFBbUI7Z0JBQ1BFLEtBQVIsQ0FBYyw4QkFBZDs7O1FBS0EsUUFBT0YsSUFBUCx5Q0FBT0EsSUFBUCxPQUFnQixRQUFoQixJQUE0QkcsT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCTixJQUEvQixNQUF5QyxpQkFBekUsRUFBNEY7YUFDbkYsSUFBTU8sR0FBWCxJQUFrQlQsTUFBbEIsRUFBMEI7Z0JBQ2xCLE9BQU9FLEtBQUtPLEdBQUwsQ0FBUCxLQUFxQixXQUF6QixFQUFzQzt1QkFDM0JBLEdBQVAsSUFBY1AsS0FBS08sR0FBTCxDQUFkOzs7O1FBS05OLEdBaENrQixHQWdDYUgsTUFoQ2IsQ0FnQ2xCRyxHQWhDa0I7UUFnQ2JGLEVBaENhLEdBZ0NhRCxNQWhDYixDQWdDYkMsRUFoQ2E7UUFnQ1RTLFVBaENTLEdBZ0NhVixNQWhDYixDQWdDVFUsVUFoQ1M7UUFnQ0dDLEtBaENILEdBZ0NhWCxNQWhDYixDQWdDR1csS0FoQ0g7UUFrQ3BCLE9BQU9SLEdBQVAsS0FBZSxRQUFmLElBQTJCQSxNQUFNLENBQWpDLElBQXNDUyxNQUFNVCxHQUFOLENBQTFDLEVBQXNEO2dCQUMxQ0MsS0FBUixDQUFjLGdDQUFkOzs7UUFLQU4sTUFBSixFQUFXO2VBQ0FlLG9CQUFQLENBQTRCZixNQUE1QjtpQkFDUSxJQUFSOztRQUlBZ0IsVUFBVUMsU0FBU0MsYUFBVCxDQUF1QmYsRUFBdkIsQ0FBZDtRQUNJZ0IsU0FBU0YsU0FBU0csZUFBVCxJQUE0QkgsU0FBU0ksSUFBbEQ7UUFHSSxDQUFDTCxPQUFMLEVBQWM7Z0JBQ0ZWLEtBQVIsQ0FBYyxVQUFkOzs7UUFLQWdCLFNBQVNWLGFBQWFJLFFBQVFPLFlBQXJCLEdBQW9DUCxRQUFRUSxXQUF6RDtRQUVJQyxTQUFTYixhQUFhTyxPQUFPTyxZQUFwQixHQUFtQ1AsT0FBT1EsV0FBdkQ7UUFFSUMsU0FBU0MsS0FBS0MsR0FBTCxDQUFTUixTQUFTRyxNQUFsQixJQUE0QixFQUE1QixHQUFpQyxDQUFqQyxHQUFxQ0gsU0FBU0csTUFBVCxHQUFrQixFQUFwRTtRQUdJSCxVQUFVRyxNQUFkLEVBQXNCO2NBQ1pNLE1BQU0sb0NBQU4sQ0FBTjs7O1FBS0ExQixNQUFNdUIsTUFBVixFQUFrQjtjQUNSQyxLQUFLRyxHQUFMLENBQVMsQ0FBVCxFQUFZSixNQUFaLENBQU47O2FBR0ksaUJBQU07WUFDTkssWUFBWXJCLGFBQWFzQixPQUFPQyxPQUFwQixHQUE4QkQsT0FBT0UsT0FBckQ7WUFDSUMsWUFBWVIsS0FBS0MsR0FBTCxDQUFTekIsTUFBTTRCLFNBQWYsQ0FBaEI7WUFDSUssTUFBTSxDQUFWO1lBR0lELFlBQVl4QixLQUFoQixFQUF1QjttQkFDWjBCLFFBQVAsQ0FBZ0IzQixhQUFhLENBQWIsR0FBaUJQLEdBQWpDLEVBQXNDTyxhQUFhUCxHQUFiLEdBQW1CLENBQXpEO21CQUNPVSxvQkFBUCxDQUE0QmYsTUFBNUI7cUJBQ1EsSUFBUjs7O2NBS0U2QixLQUFLVyxLQUFMLENBQVdILFlBQVl4QixLQUF2QixDQUFOO1lBRUlvQixZQUFZNUIsR0FBaEIsRUFBcUI7eUJBQ0ppQyxHQUFiOztZQUdBTCxZQUFZNUIsR0FBaEIsRUFBcUI7eUJBQ0ppQyxHQUFiOztlQUdHQyxRQUFQLENBQWdCM0IsYUFBYSxDQUFiLEdBQWlCcUIsU0FBakMsRUFBNENyQixhQUFhcUIsU0FBYixHQUF5QixDQUFyRTtlQUNPUSxxQkFBUCxDQUE2QnpDLE1BQTdCO0tBekJKO1dBNEJPeUMscUJBQVAsQ0FBNkJ6QyxNQUE3QjtDQXJHSjs7QUNMQSxJQUFNMEMsY0FBYztRQUFBLHNCQUU0RDtrQ0FBckVDLFNBQXFFO1lBQXJFQSxTQUFxRSxrQ0FBekQsTUFBeUQ7bUNBQWpEQyxVQUFpRDtZQUFqREEsVUFBaUQsbUNBQXBDLEVBQW9DO21DQUFoQ0MsVUFBZ0M7WUFBaENBLFVBQWdDLG1DQUFuQixFQUFtQjs4QkFBZkMsS0FBZTtZQUFmQSxLQUFlLDhCQUFQLEdBQU87YUFDbkUzQyxFQUFMLEdBQVVjLFNBQVNDLGFBQVQsQ0FBdUJ5QixTQUF2QixDQUFWO2FBRUtJLFFBQUwsR0FBZ0IsRUFBaEI7YUFDS0gsVUFBTCxHQUFrQkEsVUFBbEI7YUFDS0MsVUFBTCxHQUFrQkEsVUFBbEI7YUFDS0MsS0FBTCxHQUFhQSxLQUFiO2FBQ0tFLGNBQUw7WUFFTTdCLFNBQVNGLFNBQVNHLGVBQXhCO2FBRUs2QixPQUFMLEdBQWU5QixPQUFPTyxZQUF0QjthQUNLd0IsTUFBTCxHQUFjL0IsT0FBT1EsV0FBckI7WUFFSXdCLE9BQU8sS0FBS0MsUUFBTCxFQUFYO1lBQ0lsQixPQUFPbUIsZ0JBQVgsRUFBNkI7bUJBQ2xCQSxnQkFBUCxDQUF3QixRQUF4QixFQUFrQ0YsSUFBbEMsRUFBd0MsSUFBeEM7bUJBQ09FLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDRixJQUFyQyxFQUEyQyxJQUEzQzttQkFDT0UsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0NGLElBQWhDLEVBQXNDLElBQXRDOztLQXBCUTtZQUFBLHNCQXlCTDs7WUFDSEcsT0FBT0MsS0FBS0MsR0FBTCxFQUFYO2FBQ0tDLEtBQUw7ZUFDTyxZQUFNO2dCQUNMRCxNQUFNRCxLQUFLQyxHQUFMLEVBQVY7Z0JBQ0lBLE1BQU1GLElBQU4sR0FBYSxNQUFLUixLQUF0QixFQUE2QjtzQkFDcEJXLEtBQUw7dUJBQ09ELEdBQVA7O1NBSlI7S0E1Qlk7a0JBQUEsNEJBc0NDO1lBQ1BFLE9BQU8sS0FBS3ZELEVBQUwsQ0FBUXdELGdCQUFSLENBQXlCLGFBQXpCLENBQWI7YUFDSyxJQUFJQyxJQUFJLENBQVIsRUFBV0MsTUFBTUgsS0FBS0ksTUFBM0IsRUFBbUNGLElBQUlDLEdBQXZDLEVBQTRDRCxHQUE1QyxFQUFtRDtpQkFDMUNiLFFBQUwsQ0FBY2dCLElBQWQsQ0FBbUJMLEtBQUtFLENBQUwsQ0FBbkI7Z0JBRUksS0FBS2hCLFVBQVQsRUFBcUI7cUJBQ1pvQixhQUFMLENBQW1CTixLQUFLRSxDQUFMLENBQW5CLEVBQTRCLEtBQUtoQixVQUFqQzs7O0tBNUNJO2lCQUFBLHlCQWtERnpDLEVBbERFLEVBa0RFOEQsTUFsREYsRUFrRFU7WUFFbEI5RCxHQUFHK0QsUUFBSCxLQUFnQixDQUFwQixFQUF1QjtZQUVuQixPQUFPL0QsR0FBR2dFLE9BQVYsS0FBc0IsUUFBdEIsSUFBa0NoRSxHQUFHZ0UsT0FBSCxDQUFXQyxXQUFYLE9BQTZCLEtBQW5FLEVBQTBFO2VBQ25FQyxHQUFILEdBQVNKLE1BQVQ7U0FESixNQUVPO2VBQ0FLLEtBQUgsQ0FBU0MsZUFBVCxhQUFrQ04sVUFBVSxFQUE1Qzs7S0F6RFE7ZUFBQSx1QkE4REo5RCxFQTlESSxFQThEQTtZQUNORSxNQUFNRixHQUFHcUUscUJBQUgsRUFBWjtZQUNRQyxDQUZJLEdBRW9CcEUsR0FGcEIsQ0FFSm9FLENBRkk7WUFFREMsQ0FGQyxHQUVvQnJFLEdBRnBCLENBRURxRSxDQUZDO1lBRUVDLEtBRkYsR0FFb0J0RSxHQUZwQixDQUVFc0UsS0FGRjtZQUVTQyxNQUZULEdBRW9CdkUsR0FGcEIsQ0FFU3VFLE1BRlQ7WUFJUkgsSUFBSSxLQUFLdkIsTUFBVCxJQUFtQnVCLElBQUksQ0FBQ0UsS0FBeEIsSUFBaUNELElBQUksS0FBS3pCLE9BQTFDLElBQXFEeUIsSUFBSSxDQUFDRSxNQUE5RCxFQUFzRTttQkFDM0QsSUFBUDs7ZUFHRyxLQUFQO0tBdEVZO1NBQUEsbUJBMEVSOzthQUNDNUIsY0FBTDtZQUNJLENBQUMsS0FBS0QsUUFBTCxDQUFjZSxNQUFuQixFQUEyQjthQUN0QmYsUUFBTCxDQUFjOEIsT0FBZCxDQUFzQixnQkFBUTtnQkFFdEIsT0FBS0MsV0FBTCxDQUFpQkMsSUFBakIsQ0FBSixFQUE0Qjt1QkFDbkJDLGNBQUwsQ0FBb0JELElBQXBCOztTQUhSO0tBN0VZO2tCQUFBLDBCQXNGRDVFLEVBdEZDLEVBc0ZHOztZQUNYQSxHQUFHK0QsUUFBSCxLQUFnQixDQUFwQixFQUF1QjtZQUNqQkQsU0FBUzlELEdBQUc4RSxZQUFILENBQWdCLFVBQWhCLENBQWY7WUFDSSxDQUFDaEIsTUFBTCxFQUFhO1lBQ1BpQixNQUFNLElBQUlDLEtBQUosRUFBWjtZQUNJZCxHQUFKLEdBQVVKLE1BQVY7V0FFR21CLGVBQUgsQ0FBbUIsVUFBbkI7WUFDSS9CLGdCQUFKLENBQXFCLE1BQXJCLEVBQTZCLFlBQU07bUJBQzFCVyxhQUFMLENBQW1CN0QsRUFBbkIsRUFBdUI4RCxNQUF2QjtTQURKLEVBRUcsS0FGSDtZQUtJWixnQkFBSixDQUFxQixPQUFyQixFQUE4QixZQUFNO2dCQUM1QixPQUFLUixVQUFULEVBQXFCO3VCQUNabUIsYUFBTCxDQUFtQjdELEVBQW5CLEVBQXVCLE9BQUswQyxVQUE1Qjs7Z0JBR0EsT0FBS0QsVUFBVCxFQUFxQjt1QkFDWm9CLGFBQUwsQ0FBbUI3RCxFQUFuQixFQUF1QixPQUFLeUMsVUFBNUI7O1NBTlIsRUFRRyxLQVJIOztDQW5HUjs7QUNSQSxJQUFNeUMsZUFBZSxTQUFmQSxZQUFlO1NBQU0sT0FBT3BFLFFBQVAsS0FBb0IsV0FBMUI7Q0FBckI7QUFDQSxJQUFNcUUsU0FBUyxPQUFPLElBQVAsR0FBYyxFQUE3QjtBQUNBLElBQU1DLGlCQUFpQixJQUFJaEMsSUFBSixDQUFTLElBQUlBLElBQUosR0FBV2lDLE9BQVgsS0FBdUJGLE1BQWhDLEVBQXdDRyxXQUF4QyxFQUF2QjtBQUNBLElBQU1DLFNBQVM7S0FBQSxlQUNUQyxJQURTLEVBQ0hDLEdBREcsRUFDbUM7UUFBakNDLEdBQWlDLHVFQUEzQixFQUFDQyxTQUFTUCxjQUFWLEVBQTJCO1FBQzFDLENBQUNJLElBQUQsSUFBUyxDQUFDTixjQUFkLEVBQThCO2FBQ3JCVSxNQUFULEdBQXFCSixJQUFyQixTQUE2QkMsR0FBN0IsaUJBQTRDQyxJQUFJQyxPQUFoRDtHQUhXO2NBQUEsMEJBS0U7UUFDVCxDQUFDVCxjQUFMLEVBQXFCLE9BQU8sRUFBUDtRQUVqQnpCLFVBQUo7UUFBT21CLGFBQVA7UUFDSWdCLFNBQVM5RSxTQUFTOEUsTUFBdEI7UUFDSUMsWUFBWSxFQUFoQjthQUVTRCxPQUFPRSxLQUFQLENBQWEsR0FBYixDQUFUO1FBRUlGLE9BQU9qQyxNQUFYLEVBQW1CO1dBQ1pGLElBQUksQ0FBVCxFQUFZQSxJQUFJbUMsT0FBT2pDLE1BQXZCLEVBQStCRixHQUEvQixFQUFvQztlQUMzQm1DLE9BQU9uQyxDQUFQLEVBQVVzQyxJQUFWLEdBQWlCRCxLQUFqQixDQUF1QixHQUF2QixDQUFQO1lBQ0lsQixRQUFRQSxLQUFLLENBQUwsQ0FBUixJQUFtQkEsS0FBSyxDQUFMLENBQXZCLEVBQWdDO29CQUNwQkEsS0FBSyxDQUFMLEVBQVFtQixJQUFSLEVBQVYsSUFBNEJuQixLQUFLLENBQUwsRUFBUW1CLElBQVIsRUFBNUI7Ozs7V0FJQ0YsU0FBUDtHQXRCVztLQUFBLGVBd0JUTCxJQXhCUyxFQXdCSDtRQUNKUSxZQUFKO1FBQ0k7WUFDSUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWUsS0FBS0MsWUFBTCxRQUF1QlosSUFBdkIsQ0FBZixDQUFYLENBQU47VUFDSSxPQUFPUSxHQUFQLEtBQWUsUUFBbkIsRUFBNkI7Y0FDckJDLEtBQUtDLEtBQUwsQ0FBV0YsR0FBWCxDQUFOOztLQUhKLENBS0UsT0FBTUssQ0FBTixFQUFTO1dBQ0pMLEdBQVA7R0FoQ1c7T0FBQSxpQkFrQ1BSLElBbENPLEVBa0NEO1FBQ04sQ0FBQ04sY0FBTCxFQUFxQjthQUNaVSxNQUFULEdBQXFCSixJQUFyQjs7Q0FwQ0o7O0FDQ0EsWUFBZTs0QkFBQTs0QkFBQTs7Q0FBZjs7OzsifQ==
