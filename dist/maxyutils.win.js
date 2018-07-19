var maxyutils = (function () {
  'use strict';

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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLndpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL3V0aWxzL0ltZ0xhenlsb2FkLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5aSn77yM5rua5Yqo6LaK5b+rXG4gKiBAaW50ZXJ2YWwge051bWJlcn0g5a6a5pe25Zmo5omn6KGM6Ze06ZqU44CC6Ze06ZqU6LaK5bCP77yM5rua5Yqo6LaK5b+rIFxuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNixcbiAgICAgICAgaW50ZXJ2YWw6IDEwXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0cyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBcblxuICAgIGlmIChvcHRzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWQiOW5tmNvbmZpZ+WSjOS8oOWFpeeahG9wdHNcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdHMpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB7IHBvcywgZWwsIGlzVmVydGljYWwsIHNwZWVkLCBpbnRlcnZhbCB9ID0gY29uZmlnO1xuXG4gICAgaWYgKHR5cGVvZiBwb3MgIT09IFwibnVtYmVyXCIgfHwgcG9zIDwgMCB8fCBpc05hTihwb3MpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55YWD57Sg5ZKM6KeG56qX5YWD57SgXG4gICAgbGV0IHJvb3RFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBsZXQgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvLyDmoKHpqoxyb290RWxl5piv5ZCm5Li656m6XG4gICAgaWYgKCFyb290RWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLmjIflrprnmoRlbOS4jeWtmOWcqFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOaguea6kOe0oOeahOWuveaIlumrmFxuICAgIGxldCBlbGVWYWwgPSBpc1ZlcnRpY2FsID8gcm9vdEVsZS5vZmZzZXRIZWlnaHQgOiByb290RWxlLm9mZnNldFdpZHRoO1xuICAgIC8vIOiOt+WPluWIsOinhueql+eahOWuveaIlumrmFxuICAgIGxldCB3aW5WYWwgPSBpc1ZlcnRpY2FsID8gY2xpRWxlLmNsaWVudEhlaWdodCA6IGNsaUVsZS5jbGllbnRXaWR0aDtcbiAgICAvLyDorqHnrpfmu5rliqjnmoTmnIDlpKflgLzvvIzlkIzml7bnlZnlh7oyMOeahOWuieWFqOi3neemu1xuICAgIGxldCBtYXhWYWwgPSBNYXRoLmFicyhlbGVWYWwgLSB3aW5WYWwpIDwgMjAgPyAwIDogZWxlVmFsIC0gd2luVmFsIC0gMjA7XG5cbiAgICAvLyDmr5TovoPlhoXlrrnpq5jvvI/lrr3luqblkozop4bnqpfpq5jvvI/lrr3luqbvvIzlpoLmnpzlhoXlrrnpq5jvvI/lrr3luqbkuI3lpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIzmraTml7bkuI3kvJrlh7rnjrDmu5rliqjmnaHvvIznu5nlh7rmj5DnpLpcbiAgICBpZiAoZWxlVmFsIDw9IHdpblZhbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIuivt+ehruiupOW9k+WJjeS8oOWFpeeahOWGheWuueWMuumrmC/lrr3luqblpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIjmraTml7bmiY3kvJrlh7rnjrDmu5rliqjmnaHvvIlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlr7nmu5rliqjliLDnmoTkvY3nva5wb3Pov5vooYzlpITnkIZcbiAgICBpZiAocG9zID4gbWF4VmFsKSB7XG4gICAgICAgIHBvcyA9IE1hdGgubWF4KDAsIG1heFZhbCk7XG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBzY3JvbGxPcmkgPSBpc1ZlcnRpY2FsID8gd2luZG93LnNjcm9sbFkgOiB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgICAgbGV0IHNjcm9sbERpcyA9IE1hdGguYWJzKHBvcyAtIHNjcm9sbE9yaSk7XG4gICAgICAgIGxldCBkaXMgPSAwO1xuXG4gICAgICAgIC8vIOWmguaenOa7muWKqOWIsOeJueWumuS9jee9rumZhOi/keS6hlxuICAgICAgICBpZiAoc2Nyb2xsRGlzIDwgc3BlZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHBvcywgaXNWZXJ0aWNhbCA/IHBvcyA6IDApO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICB9LCBpbnRlcnZhbClcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsVG9Qb3M7IiwiY2xhc3MgSW1nTGF6eWxvYWQge1xuICAgIGNvbnN0cnVjdG9yKHtjb250YWluZXIgPSBcImh0bWxcIiwgZGVmYXVsdEltZyA9IFwiXCIsIGVycm9ySW1hZ2UgPSBcIlwiLCBkZWxheSA9IDUwMH0pIHtcbiAgICAgICAgdGhpcy5lbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyKTtcbiAgICAgICAgLy8g5pS26ZuG5ZyoY29udGFpbmVy5LiL55qE5oeS5Yqg6L2955qE5Zu+54mHXG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgdGhpcy5kZWZhdWx0SW1nID0gZGVmYXVsdEltZztcbiAgICAgICAgdGhpcy5lcnJvckltYWdlID0gZXJyb3JJbWFnZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmdldExhenlMb2FkRWxzKCk7XG5cbiAgICAgICAgY29uc3QgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAvLyDojrflj5bop4bnqpfnmoTpq5jluqblkozlrr3luqZcbiAgICAgICAgdGhpcy53SGVpZ2h0ID0gY2xpRWxlLmNsaWVudEhlaWdodDtcbiAgICAgICAgdGhpcy53V2lkdGggPSBjbGlFbGUuY2xpZW50V2lkdGg7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgLy8g5rOo5YaM5rua5Yqo5LqL5Lu2XG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IGNiZm4gPSB0aGlzLnRocm90dGxlKCk7XG4gICAgICAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgY2JmbiwgZmFsc2UpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2JmbiwgZmFsc2UpOyAgICAgICAgICAgIFxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGNiZm4sIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOWHveaVsOiKgua1gVxuICAgIHRocm90dGxlKCkge1xuICAgICAgICBsZXQgcHJldiA9IERhdGUubm93KCk7XG4gICAgICAgIHRoaXMuY2hlY2soKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGxldCBub3cgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKG5vdyAtIHByZXYgPiB0aGlzLmRlbGF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICAgICAgICAgIHByZXYgPSBub3c7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDojrflj5bmiYDmnInluKZsYXp5bG9hZOeahOWxnuaAp+eahGRvbeWFg+e0oFxuICAgIGdldExhenlMb2FkRWxzKCkge1xuICAgICAgICBjb25zdCBlbGVzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiKltsYXp5bG9hZF1cIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBlbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVzW2ldKTtcbiAgICAgICAgICAgIC8vIOWmguaenOaciem7mOiupOWbvueJh++8jOiuvue9rum7mOiupOWbvueJh1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbGVzW2ldLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Li65YWD57Sg6K6+572u5Zu+54mHXG4gICAgc2V0SW1hZ2VGb3JFbChlbCwgaW1nVXJsKSB7XG4gICAgICAgIC8vIOWmguaenGVs5LiN5piv5qCH562+LOS4jeWkhOeQhlxuICAgICAgICBpZiAoZWwubm9kZVR5cGUgIT09IDEpIHJldHVybjtcblxuICAgICAgICBpZiAodHlwZW9mIGVsLnRhZ05hbWUgPT09IFwic3RyaW5nXCIgJiYgZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSBcImltZ1wiKSB7XG4gICAgICAgICAgICBlbC5zcmMgPSBpbWdVcmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7aW1nVXJsIHx8IFwiXCJ9KWA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDmo4Dmn6XljZXkuKrlhYPntKDmmK/lkKblnKjop4bnqpfkuK1cbiAgICBjaGVja0luVmlldyhlbCkge1xuICAgICAgICBjb25zdCBwb3MgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3QgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBwb3M7XG4gICAgICAgIC8vIOWmguaenHjlnKgtd2lkdGjliLB3V2lkdGjkuYvpl7TlubbkuJR55ZyoLWhlaWdodOWIsHdIZWlnaHTkuYvpl7Tml7bvvIzlhYPntKDlpITkuo7op4bnqpfkuK1cbiAgICAgICAgaWYgKHggPCB0aGlzLndXaWR0aCAmJiB4ID4gLXdpZHRoICYmIHkgPCB0aGlzLndIZWlnaHQgJiYgeSA+IC1oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIOmBjeWOhuWtkOWFg+e0oO+8jOWkhOeQhuWcqOinhueql+S4reeahOWFg+e0oFxuICAgIGNoZWNrKCkge1xuICAgICAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlnKjop4bnqpfkuK0gXG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0luVmlldyhpdGVtKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRWxJblZpZXcoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8g5bCG5YWD57Sg55qEbGF6eWxvYWTlsZ7mgKflj5blh7rmnaXvvIznhLblkI7mlrDlu7rkuIDkuKppbWFnZeWvueixoVxuICAgIGhhbmRsZUVsSW5WaWV3KGVsKSB7XG4gICAgICAgIGNvbnN0IGltZ1VybCA9IGVsLmdldEF0dHJpYnV0ZShcImxhenlsb2FkXCIpO1xuICAgICAgICBjb25zdCBJbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBJbWcuc3JjID0gaW1nVXJsO1xuICAgICAgICBJbWcuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRJbWFnZUZvckVsKGVsLCBpbWdVcmwpO1xuICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgLy8g5aaC5p6c5Zu+54mH5Yqg6L295aSx6LSl5LqG77yM5bCx5Yqg6L296ZSZ6K+v5Zu+54mH5oiW6buY6K6k5Zu+54mHXG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JJbWFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5lcnJvckltYWdlKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEltZ0xhenlsb2FkOyIsImltcG9ydCBzY3JvbGxUb1BvcyBmcm9tIFwiLi91dGlscy9zY3JvbGxUb1Bvc1wiO1xuaW1wb3J0IEltZ0xhenlsb2FkIGZyb20gXCIuL3V0aWxzL0ltZ0xhenlsb2FkXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHNjcm9sbFRvUG9zLFxuICAgIEltZ0xhenlsb2FkXG59Il0sIm5hbWVzIjpbInRpbWVyIiwic2Nyb2xsVG9Qb3MiLCJjb25maWciLCJwb3MiLCJlbCIsImlzVmVydGljYWwiLCJzcGVlZCIsImludGVydmFsIiwib3B0cyIsImNvbnNvbGUiLCJlcnJvciIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImtleSIsImlzTmFOIiwiY2xlYXJJbnRlcnZhbCIsInJvb3RFbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjbGlFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiZWxlVmFsIiwib2Zmc2V0SGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJ3aW5WYWwiLCJjbGllbnRIZWlnaHQiLCJjbGllbnRXaWR0aCIsIm1heFZhbCIsIk1hdGgiLCJhYnMiLCJFcnJvciIsIm1heCIsInNldEludGVydmFsIiwic2Nyb2xsT3JpIiwid2luZG93Iiwic2Nyb2xsWSIsInNjcm9sbFgiLCJzY3JvbGxEaXMiLCJkaXMiLCJzY3JvbGxUbyIsImZsb29yIiwiSW1nTGF6eWxvYWQiLCJjb250YWluZXIiLCJkZWZhdWx0SW1nIiwiZXJyb3JJbWFnZSIsImRlbGF5IiwiY2hpbGRyZW4iLCJnZXRMYXp5TG9hZEVscyIsIndIZWlnaHQiLCJ3V2lkdGgiLCJpbml0IiwiY2JmbiIsInRocm90dGxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXYiLCJEYXRlIiwibm93IiwiY2hlY2siLCJlbGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW4iLCJsZW5ndGgiLCJwdXNoIiwic2V0SW1hZ2VGb3JFbCIsImltZ1VybCIsIm5vZGVUeXBlIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwic3JjIiwic3R5bGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ4IiwieSIsIndpZHRoIiwiaGVpZ2h0IiwiZm9yRWFjaCIsImNoZWNrSW5WaWV3IiwiaXRlbSIsImhhbmRsZUVsSW5WaWV3IiwiZ2V0QXR0cmlidXRlIiwiSW1nIiwiSW1hZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBLElBQUlBLFFBQVEsSUFBWjtFQWNBLElBQU1DLGNBQWMsU0FBZEEsV0FBYyxPQUFRO0VBRXhCLFFBQU1DLFNBQVM7RUFDWEMsYUFBSyxDQURNO0VBRVhDLFlBQUlBLE1BQU0sTUFGQztFQUdYQyxvQkFBWSxJQUhEO0VBSVhDLGVBQU8sQ0FKSTtFQUtYQyxrQkFBVTtFQUxDLEtBQWY7RUFRQSxRQUFJLFFBQU9DLElBQVAseUNB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
