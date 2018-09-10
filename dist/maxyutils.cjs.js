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

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL3V0aWxzL0ltZ0xhenlsb2FkLmpzIiwiLi4vc3JjL3V0aWxzL2Nvb2tpZS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgdGltZXIgPSBudWxsO1xuXG4vKipcbiAqIFvpobXpnaLlubPmu5Hmu5rliqjliLDmjIflrprkvY3nva7vvIjlpJrnlKjkuo7ov5Tlm57pobbpg6jvvIldXG4gKiBAcGFyYW0gIHtbTnVtYmVyIHx8IE9iamVjdF19IG9wdHMgW+mFjee9ruWPguaVsF1cbiAqIEBvcHRzIOS4uk51bWJlcuexu+Wei+aXtu+8jOm7mOiupOS4iuS4i+a7muWKqOWIsOaMh+WumuS9jee9ru+8jOS7pWh0bWzlhYPntKDkuLrmoLnlhYPntKDorqHnrpflhoXlrrnljLrpq5jluqZcbiAqIEBvcHRzIOS4uk9iamVjdOaXtu+8jOWPr+Whq+eahOWPguaVsOacie+8mlxuICogQHBvcyByZXF1aXJlZCB7TnVtYmVyfSDmu5rliqjliLDnmoTmjIflrprkvY3nva7vvIjot53pobXpnaLlt6bkvqfmiJbogIXot53pobbpg6jnmoTot53nprvvvIlcbiAqIEBpc1ZlcnRpY2FsIHJlcXVpcmVkIHtCb29sZWFufSDpgInmi6nkuIrkuIvmu5rliqjov5jmmK/lt6blj7Pmu5rliqgo5Li6dHJ1ZeaXtuS4iuS4i+a7muWKqO+8jGZhbHNl5pe25bem5Y+z5rua5Yqo77yM6buY6K6k5LiK5LiL5rua5YqoKVxuICogQGVsIHtTdHJpbmd9IOaMh+WumueahGRvbeWFg+e0oO+8jOS4gOiIrOS4umh0bWwsYm9keeaIluiAhWJvZHnkuIvmnIDlpJblsYLnmoRkb21cbiAqIEBzcGVlZCB7TnVtYmVyfSDmr4/mrKHmu5rliqjnmoTot53nprvmmK/nm67liY3mu5rliqjmgLvot53nprvnmoQgMSAvIHNwZWVkLOatpOWAvOi2iuWkp++8jOa7muWKqOi2iuW/q1xuICogQGludGVydmFsIHtOdW1iZXJ9IOWumuaXtuWZqOaJp+ihjOmXtOmalOOAgumXtOmalOi2iuWwj++8jOa7muWKqOi2iuW/qyBcbiAqIEByZXR1cm4ge1t1bmRlZmluZWRdfSAgICAgIFvml6DmhI/kuYnvvIzmsqHmnInov5Tlm57lgLxdXG4gKi9cbmNvbnN0IHNjcm9sbFRvUG9zID0gb3B0cyA9PiB7XG4gICAgLy8g5Yid5aeL5YyW6YWN572uXG4gICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICBwb3M6IDAsXG4gICAgICAgIGVsOiBlbCB8fCBcImh0bWxcIixcbiAgICAgICAgaXNWZXJ0aWNhbDogdHJ1ZSxcbiAgICAgICAgc3BlZWQ6IDYsXG4gICAgICAgIGludGVydmFsOiAxMFxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBjb25maWcucG9zID0gb3B0cztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICBpZiAob3B0cyA9PT0gbnVsbCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOWPguaVsOW6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZfmiJblr7nosaFcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlkIjlubZjb25maWflkozkvKDlhaXnmoRvcHRzXG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRzKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeyBwb3MsIGVsLCBpc1ZlcnRpY2FsLCBzcGVlZCwgaW50ZXJ2YWwgfSA9IGNvbmZpZztcblxuICAgIGlmICh0eXBlb2YgcG9zICE9PSBcIm51bWJlclwiIHx8IHBvcyA8IDAgfHwgaXNOYU4ocG9zKSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwic2Nyb2xsVG9Qb3M6IOa7muWKqOWPguaVsHBvc+W6lOS4uuWkp+S6juetieS6jjDnmoTmlbDlrZdcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDph43nva50aW1lclxuICAgIGlmICh0aW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBudWxsO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOagueWFg+e0oOWSjOinhueql+WFg+e0oFxuICAgIGxldCByb290RWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgbGV0IGNsaUVsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5O1xuXG4gICAgLy8g5qCh6aqMcm9vdEVsZeaYr+WQpuS4uuepulxuICAgIGlmICghcm9vdEVsZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwi5oyH5a6a55qEZWzkuI3lrZjlnKhcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnmupDntKDnmoTlrr3miJbpq5hcbiAgICBsZXQgZWxlVmFsID0gaXNWZXJ0aWNhbCA/IHJvb3RFbGUub2Zmc2V0SGVpZ2h0IDogcm9vdEVsZS5vZmZzZXRXaWR0aDtcbiAgICAvLyDojrflj5bliLDop4bnqpfnmoTlrr3miJbpq5hcbiAgICBsZXQgd2luVmFsID0gaXNWZXJ0aWNhbCA/IGNsaUVsZS5jbGllbnRIZWlnaHQgOiBjbGlFbGUuY2xpZW50V2lkdGg7XG4gICAgLy8g6K6h566X5rua5Yqo55qE5pyA5aSn5YC877yM5ZCM5pe255WZ5Ye6MjDnmoTlronlhajot53nprtcbiAgICBsZXQgbWF4VmFsID0gTWF0aC5hYnMoZWxlVmFsIC0gd2luVmFsKSA8IDIwID8gMCA6IGVsZVZhbCAtIHdpblZhbCAtIDIwO1xuXG4gICAgLy8g5q+U6L6D5YaF5a656auY77yP5a695bqm5ZKM6KeG56qX6auY77yP5a695bqm77yM5aaC5p6c5YaF5a656auY77yP5a695bqm5LiN5aSn5LqO6KeG56qX6auY77yP5a695bqm77yM5q2k5pe25LiN5Lya5Ye6546w5rua5Yqo5p2h77yM57uZ5Ye65o+Q56S6XG4gICAgaWYgKGVsZVZhbCA8PSB3aW5WYWwpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCLor7fnoa7orqTlvZPliY3kvKDlhaXnmoTlhoXlrrnljLrpq5gv5a695bqm5aSn5LqO6KeG56qX6auY77yP5a695bqm77yI5q2k5pe25omN5Lya5Ye6546w5rua5Yqo5p2h77yJXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g5a+55rua5Yqo5Yiw55qE5L2N572ucG9z6L+b6KGM5aSE55CGXG4gICAgaWYgKHBvcyA+IG1heFZhbCkge1xuICAgICAgICBwb3MgPSBNYXRoLm1heCgwLCBtYXhWYWwpO1xuICAgIH1cblxuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBsZXQgc2Nyb2xsT3JpID0gaXNWZXJ0aWNhbCA/IHdpbmRvdy5zY3JvbGxZIDogd2luZG93LnNjcm9sbFg7XG4gICAgICAgIGxldCBzY3JvbGxEaXMgPSBNYXRoLmFicyhwb3MgLSBzY3JvbGxPcmkpO1xuICAgICAgICBsZXQgZGlzID0gMDtcblxuICAgICAgICAvLyDlpoLmnpzmu5rliqjliLDnibnlrprkvY3nva7pmYTov5HkuoZcbiAgICAgICAgaWYgKHNjcm9sbERpcyA8IHNwZWVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBwb3MsIGlzVmVydGljYWwgPyBwb3MgOiAwKTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICAgICAgdGltZXIgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5q+P5qyh5rua5Yqo5Ymp5L2Z5rua5Yqo6Led56a755qEIDEgLyBzcGVlZFxuICAgICAgICBkaXMgPSBNYXRoLmZsb29yKHNjcm9sbERpcyAvIHNwZWVkKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPiBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSAtPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Nyb2xsT3JpIDwgcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgKz0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogc2Nyb2xsT3JpLCBpc1ZlcnRpY2FsID8gc2Nyb2xsT3JpIDogMCk7XG4gICAgfSwgaW50ZXJ2YWwpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHNjcm9sbFRvUG9zOyIsIi8qKlxuICog5Zu+54mH5oeS5Yqg6L29XG4gKiBAcGFyYW1zIG9wdHNcbiAqIG9wdHMuY29udGFpbmVyIOWPr+mAie+8jOm7mOiupOS4umh0bWzvvIzmjIflrprpnIDopoHmh5LliqDovb3lm77niYflhYPntKDnmoTniLblrrnlmahcbiAqIG9wdHMuZGVmYXVsdEltZyDlj6/pgInvvIzliqDovb3kuYvliY3pu5jorqTnmoTlm77niYdcbiAqIG9wdHMuZXJyb3JJbWFnZSDlj6/pgInvvIzliqDovb3nvZHnu5zlm77niYflh7rplJnml7bnmoTlm77niYdcbiAqIG9wdHMuZGVsYXkg5rua5Yqo5qOA5rWL55qE6Ze06ZqU77yI5Ye95pWw6IqC5rWB77yJ44CC5q+P6ZqUZGVsYXnmr6vnp5Lov5vooYzkuIDmrKFjaGVja++8jOadpeWKoOi9veWkhOS6juinhueql+S4reeahOWFg+e0oOWbvueJh+i1hOa6kFxuICovXG5jb25zdCBJbWdMYXp5bG9hZCA9IHtcbiAgICAvLyDms6jlhozmu5rliqjkuovku7ZcbiAgICBpbml0KHsgY29udGFpbmVyID0gXCJodG1sXCIsIGRlZmF1bHRJbWcgPSBcIlwiLCBlcnJvckltYWdlID0gXCJcIiwgZGVsYXkgPSA1MDAgfSkge1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihjb250YWluZXIpO1xuICAgICAgICAvLyDmlLbpm4blnKhjb250YWluZXLkuIvnmoTmh5LliqDovb3nmoTlm77niYdcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgICAgICB0aGlzLmRlZmF1bHRJbWcgPSBkZWZhdWx0SW1nO1xuICAgICAgICB0aGlzLmVycm9ySW1hZ2UgPSBlcnJvckltYWdlO1xuICAgICAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgICAgIHRoaXMuZ2V0TGF6eUxvYWRFbHMoKTtcblxuICAgICAgICBjb25zdCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIC8vIOiOt+WPluinhueql+eahOmrmOW6puWSjOWuveW6plxuICAgICAgICB0aGlzLndIZWlnaHQgPSBjbGlFbGUuY2xpZW50SGVpZ2h0O1xuICAgICAgICB0aGlzLndXaWR0aCA9IGNsaUVsZS5jbGllbnRXaWR0aDtcblxuICAgICAgICBsZXQgY2JmbiA9IHRoaXMudGhyb3R0bGUoKTtcbiAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBjYmZuLCB0cnVlKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGNiZm4sIHRydWUpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNiZm4sIHRydWUpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWHveaVsOiKgua1gVxuICAgIHRocm90dGxlKCkge1xuICAgICAgICBsZXQgcHJldiA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHByZXYgPiB0aGlzLmRlbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHByZXYgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g6I635Y+W5omA5pyJ5bimbGF6eWxvYWTnmoTlsZ7mgKfnmoRkb23lhYPntKBcbiAgICBnZXRMYXp5TG9hZEVscygpIHtcbiAgICAgICAgY29uc3QgZWxlcyA9IHRoaXMuZWwucXVlcnlTZWxlY3RvckFsbChcIipbbGF6eWxvYWRdXCIpO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gZWxlcy5sZW5ndGg7IGkgPCBsZW47IGkgKysgKSB7XG4gICAgICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlc1tpXSk7XG4gICAgICAgICAgICAvLyDlpoLmnpzmnInpu5jorqTlm77niYfvvIzorr7nva7pu5jorqTlm77niYdcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWxlc1tpXSwgdGhpcy5kZWZhdWx0SW1nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDkuLrlhYPntKDorr7nva7lm77niYdcbiAgICBzZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpIHtcbiAgICAgICAgLy8g5aaC5p6cZWzkuI3mmK/moIfnrb4s5LiN5aSE55CGXG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZWwudGFnTmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IFwiaW1nXCIpIHtcbiAgICAgICAgICAgIGVsLnNyYyA9IGltZ1VybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHtpbWdVcmwgfHwgXCJcIn0pYDtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDmo4Dmn6XljZXkuKrlhYPntKDmmK/lkKblnKjop4bnqpfkuK1cbiAgICBjaGVja0luVmlldyhlbCkge1xuICAgICAgICBjb25zdCBwb3MgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBwb3M7XG4gICAgICAgIC8vIOWmguaenHjlnKgtd2lkdGjliLB3V2lkdGjkuYvpl7TlubbkuJR55ZyoLWhlaWdodOWIsHdIZWlnaHTkuYvpl7Tml7bvvIzlhYPntKDlpITkuo7op4bnqpfkuK1cbiAgICAgICAgaWYgKHggPCB0aGlzLndXaWR0aCAmJiB4ID4gLXdpZHRoICYmIHkgPCB0aGlzLndIZWlnaHQgJiYgeSA+IC1oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyDpgY3ljoblrZDlhYPntKDvvIzlpITnkIblnKjop4bnqpfkuK3nmoTlhYPntKBcbiAgICBjaGVjaygpIHtcbiAgICAgICAgdGhpcy5nZXRMYXp5TG9hZEVscygpO1xuICAgICAgICBpZiAoIXRoaXMuY2hpbGRyZW4ubGVuZ3RoKSByZXR1cm47XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgICAgIC8vIOWmguaenOWcqOinhueql+S4rSBcbiAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrSW5WaWV3KGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFbEluVmlldyhpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LFxuXG4gICAgLy8g5bCG5YWD57Sg55qEbGF6eWxvYWTlsZ7mgKflj5blh7rmnaXvvIznhLblkI7mlrDlu7rkuIDkuKppbWFnZeWvueixoVxuICAgIGhhbmRsZUVsSW5WaWV3KGVsKSB7XG4gICAgICAgIGlmIChlbC5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuICAgICAgICBjb25zdCBpbWdVcmwgPSBlbC5nZXRBdHRyaWJ1dGUoXCJsYXp5bG9hZFwiKTtcbiAgICAgICAgaWYgKCFpbWdVcmwpIHJldHVybjtcbiAgICAgICAgY29uc3QgSW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgIEltZy5zcmMgPSBpbWdVcmw7XG5cbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFwibGF6eWxvYWRcIik7XG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIGltZ1VybCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIOWmguaenOWbvueJh+WKoOi9veWksei0peS6hu+8jOWwseWKoOi9vemUmeivr+WbvueJh+aIlum7mOiupOWbvueJh1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ySW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZXJyb3JJbWFnZSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0SW1nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbWdMYXp5bG9hZDsiLCJjb25zdCBjYW5Vc2VDb29raWUgPSAoKSA9PiB0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCI7XG5jb25zdCBPTkVEQVkgPSAzNjAwICogMTAwMCAqIDI0O1xuY29uc3QgREVGQVVMVEVYUElSRVMgPSBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArIE9ORURBWSkudG9HTVRTdHJpbmcoKTtcbmNvbnN0IENvb2tpZSA9IHtcbiAgc2V0KG5hbWUsIHZhbCwgb3B0ID0ge2V4cGlyZXM6IERFRkFVTFRFWFBJUkVTfSkge1xuICAgIGlmICghbmFtZSB8fCAhY2FuVXNlQ29va2llKCkpIHJldHVybjtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbH07ZXhwaXJlcz0ke29wdC5leHBpcmVzfWA7XG4gIH0sXG4gIGZvcm1hdENvb2tpZSgpIHtcbiAgICBpZiAoIWNhblVzZUNvb2tpZSgpKSByZXR1cm4ge307XG4gICAgXG4gICAgbGV0IGksIGl0ZW07XG4gICAgbGV0IGNvb2tpZSA9IGRvY3VtZW50LmNvb2tpZTtcbiAgICBsZXQgY29va2llT2JqID0ge307XG5cbiAgICBjb29raWUgPSBjb29raWUuc3BsaXQoXCI7XCIpO1xuXG4gICAgaWYgKGNvb2tpZS5sZW5ndGgpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjb29raWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaXRlbSA9IGNvb2tpZVtpXS50cmltKCkuc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtWzBdICYmIGl0ZW1bMV0pIHtcbiAgICAgICAgICBjb29raWVPYmpbaXRlbVswXS50cmltKCldID0gaXRlbVsxXS50cmltKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZU9iajtcbiAgfSxcbiAgZ2V0KG5hbWUpIHtcbiAgICBsZXQgcmVzO1xuICAgIHRyeSB7XG4gICAgICByZXMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZm9ybWF0Q29va2llKClbYCR7bmFtZX1gXSkpO1xuICAgICAgaWYgKHR5cGVvZiByZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmVzID0gSlNPTi5wYXJzZShyZXMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge31cbiAgICByZXR1cm4gcmVzO1xuICB9LFxuICBjbGVhcihuYW1lKSB7XG4gICAgaWYgKCFjYW5Vc2VDb29raWUoKSkgcmV0dXJuO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IGAke25hbWV9PW51bGw7ZXhwaXJlcz0tMWA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IENvb2tpZTsiLCJpbXBvcnQgc2Nyb2xsVG9Qb3MgZnJvbSBcIi4vdXRpbHMvc2Nyb2xsVG9Qb3NcIlxuaW1wb3J0IEltZ0xhenlsb2FkIGZyb20gXCIuL3V0aWxzL0ltZ0xhenlsb2FkXCJcbmltcG9ydCBDb29raWUgZnJvbSAnLi91dGlscy9jb29raWUnXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBzY3JvbGxUb1BvcyxcbiAgICBJbWdMYXp5bG9hZCxcbiAgICBDb29raWVcbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsImVsIiwib3B0cyIsInBvcyIsImVycm9yIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwia2V5IiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwiaW50ZXJ2YWwiLCJpc05hTiIsInJvb3RFbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjbGlFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiZWxlVmFsIiwib2Zmc2V0SGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJ3aW5WYWwiLCJjbGllbnRIZWlnaHQiLCJjbGllbnRXaWR0aCIsIm1heFZhbCIsIk1hdGgiLCJhYnMiLCJFcnJvciIsIm1heCIsInNldEludGVydmFsIiwic2Nyb2xsT3JpIiwid2luZG93Iiwic2Nyb2xsWSIsInNjcm9sbFgiLCJzY3JvbGxEaXMiLCJkaXMiLCJzY3JvbGxUbyIsImZsb29yIiwiSW1nTGF6eWxvYWQiLCJjb250YWluZXIiLCJkZWZhdWx0SW1nIiwiZXJyb3JJbWFnZSIsImRlbGF5IiwiY2hpbGRyZW4iLCJnZXRMYXp5TG9hZEVscyIsIndIZWlnaHQiLCJ3V2lkdGgiLCJjYmZuIiwidGhyb3R0bGUiLCJhZGRFdmVudExpc3RlbmVyIiwicHJldiIsIkRhdGUiLCJub3ciLCJjaGVjayIsImVsZXMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaSIsImxlbiIsImxlbmd0aCIsInB1c2giLCJzZXRJbWFnZUZvckVsIiwiaW1nVXJsIiwibm9kZVR5cGUiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJzcmMiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJmb3JFYWNoIiwiY2hlY2tJblZpZXciLCJpdGVtIiwiaGFuZGxlRWxJblZpZXciLCJnZXRBdHRyaWJ1dGUiLCJJbWciLCJJbWFnZSIsInJlbW92ZUF0dHJpYnV0ZSIsImNhblVzZUNvb2tpZSIsIk9ORURBWSIsIkRFRkFVTFRFWFBJUkVTIiwiZ2V0VGltZSIsInRvR01UU3RyaW5nIiwiQ29va2llIiwibmFtZSIsInZhbCIsIm9wdCIsImV4cGlyZXMiLCJjb29raWUiLCJjb29raWVPYmoiLCJzcGxpdCIsInRyaW0iLCJyZXMiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJmb3JtYXRDb29raWUiLCJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQVEsSUFBWjtBQWNBLElB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
