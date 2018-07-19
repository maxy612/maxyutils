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
      if (opts && typeof opts === "number") {
          config.pos = opts;
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
      if (typeof pos !== "number" || pos < 0 || isNaN(pos) || (typeof opts === "undefined" ? "undefined" : _typeof(opts)) !== "object" && typeof opts !== "number") {
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

  var index = {
      scrollToPos: scrollToPos
  };

  return index;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmpzIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMvc2Nyb2xsVG9Qb3MuanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHRpbWVyID0gbnVsbDtcblxuLyoqXG4gKiBb6aG16Z2i5bmz5ruR5rua5Yqo5Yiw5oyH5a6a5L2N572u77yI5aSa55So5LqO6L+U5Zue6aG26YOo77yJXVxuICogQHBhcmFtICB7W051bWJlciB8fCBPYmplY3RdfSBvcHRzIFvphY3nva7lj4LmlbBdXG4gKiBAb3B0cyDkuLpOdW1iZXLnsbvlnovml7bvvIzpu5jorqTkuIrkuIvmu5rliqjliLDmjIflrprkvY3nva7vvIzku6VodG1s5YWD57Sg5Li65qC55YWD57Sg6K6h566X5YaF5a655Yy66auY5bqmXG4gKiBAb3B0cyDkuLpPYmplY3Tml7bvvIzlj6/loavnmoTlj4LmlbDmnInvvJpcbiAqIEBwb3MgcmVxdWlyZWQge051bWJlcn0g5rua5Yqo5Yiw55qE5oyH5a6a5L2N572u77yI6Led6aG16Z2i5bem5L6n5oiW6ICF6Led6aG26YOo55qE6Led56a777yJXG4gKiBAaXNWZXJ0aWNhbCByZXF1aXJlZCB7Qm9vbGVhbn0g6YCJ5oup5LiK5LiL5rua5Yqo6L+Y5piv5bem5Y+z5rua5YqoKOS4unRydWXml7bkuIrkuIvmu5rliqjvvIxmYWxzZeaXtuW3puWPs+a7muWKqO+8jOm7mOiupOS4iuS4i+a7muWKqClcbiAqIEBlbCB7U3RyaW5nfSDmjIflrprnmoRkb23lhYPntKDvvIzkuIDoiKzkuLpodG1sLGJvZHnmiJbogIVib2R55LiL5pyA5aSW5bGC55qEZG9tXG4gKiBAc3BlZWQge051bWJlcn0g5q+P5qyh5rua5Yqo55qE6Led56a75piv55uu5YmN5rua5Yqo5oC76Led56a755qEIDEgLyBzcGVlZCzmraTlgLzotorlpKfvvIzmu5rliqjotorlv6tcbiAqIEBpbnRlcnZhbCB7TnVtYmVyfSDlrprml7blmajmiafooYzpl7TpmpTjgILpl7TpmpTotorlsI/vvIzmu5rliqjotorlv6sgXG4gKiBAcmV0dXJuIHtbdW5kZWZpbmVkXX0gICAgICBb5peg5oSP5LmJ77yM5rKh5pyJ6L+U5Zue5YC8XVxuICovXG5jb25zdCBzY3JvbGxUb1BvcyA9IG9wdHMgPT4ge1xuICAgIC8vIOWIneWni+WMlumFjee9rlxuICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgcG9zOiAwLFxuICAgICAgICBlbDogZWwgfHwgXCJodG1sXCIsXG4gICAgICAgIGlzVmVydGljYWw6IHRydWUsXG4gICAgICAgIHNwZWVkOiA2LFxuICAgICAgICBpbnRlcnZhbDogMTBcbiAgICB9O1xuXG4gICAgaWYgKG9wdHMgJiYgdHlwZW9mIG9wdHMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgY29uZmlnLnBvcyA9IG9wdHM7XG4gICAgfSBcblxuICAgIC8vIOWQiOW5tmNvbmZpZ+WSjOS8oOWFpeeahG9wdHNcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdHMpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB7IHBvcywgZWwsIGlzVmVydGljYWwsIHNwZWVkLCBpbnRlcnZhbCB9ID0gY29uZmlnO1xuXG4gICAgaWYgKHR5cGVvZiBwb3MgIT09IFwibnVtYmVyXCIgfHwgcG9zIDwgMCB8fCBpc05hTihwb3MpIHx8ICh0eXBlb2Ygb3B0cyAhPT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygb3B0cyAhPT0gXCJudW1iZXJcIikpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDmu5rliqjlj4LmlbBwb3PlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2XXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6YeN572udGltZXJcbiAgICBpZiAodGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICB9XG5cbiAgICAvLyDojrflj5bliLDmoLnlhYPntKDlkozop4bnqpflhYPntKBcbiAgICBsZXQgcm9vdEVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGxldCBjbGlFbGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgIC8vIOagoemqjHJvb3RFbGXmmK/lkKbkuLrnqbpcbiAgICBpZiAoIXJvb3RFbGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIuaMh+WumueahGVs5LiN5a2Y5ZyoXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55rqQ57Sg55qE5a695oiW6auYXG4gICAgbGV0IGVsZVZhbCA9IGlzVmVydGljYWwgPyByb290RWxlLm9mZnNldEhlaWdodCA6IHJvb3RFbGUub2Zmc2V0V2lkdGg7XG4gICAgLy8g6I635Y+W5Yiw6KeG56qX55qE5a695oiW6auYXG4gICAgbGV0IHdpblZhbCA9IGlzVmVydGljYWwgPyBjbGlFbGUuY2xpZW50SGVpZ2h0IDogY2xpRWxlLmNsaWVudFdpZHRoO1xuICAgIC8vIOiuoeeul+a7muWKqOeahOacgOWkp+WAvO+8jOWQjOaXtueVmeWHujIw55qE5a6J5YWo6Led56a7XG4gICAgbGV0IG1heFZhbCA9IE1hdGguYWJzKGVsZVZhbCAtIHdpblZhbCkgPCAyMCA/IDAgOiBlbGVWYWwgLSB3aW5WYWwgLSAyMDtcblxuICAgIC8vIOavlOi+g+WGheWuuemrmO+8j+WuveW6puWSjOinhueql+mrmO+8j+WuveW6pu+8jOWmguaenOWGheWuuemrmO+8j+WuveW6puS4jeWkp+S6juinhueql+mrmO+8j+WuveW6pu+8jOatpOaXtuS4jeS8muWHuueOsOa7muWKqOadoe+8jOe7meWHuuaPkOekulxuICAgIGlmIChlbGVWYWwgPD0gd2luVmFsKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwi6K+356Gu6K6k5b2T5YmN5Lyg5YWl55qE5YaF5a655Yy66auYL+WuveW6puWkp+S6juinhueql+mrmO+8j+WuveW6pu+8iOatpOaXtuaJjeS8muWHuueOsOa7muWKqOadoe+8iVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWvuea7muWKqOWIsOeahOS9jee9rnBvc+i/m+ihjOWkhOeQhlxuICAgIGlmIChwb3MgPiBtYXhWYWwpIHtcbiAgICAgICAgcG9zID0gTWF0aC5tYXgoMCwgbWF4VmFsKTtcbiAgICB9XG5cbiAgICB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgbGV0IHNjcm9sbE9yaSA9IGlzVmVydGljYWwgPyB3aW5kb3cuc2Nyb2xsWSA6IHdpbmRvdy5zY3JvbGxYO1xuICAgICAgICBsZXQgc2Nyb2xsRGlzID0gTWF0aC5hYnMocG9zIC0gc2Nyb2xsT3JpKTtcbiAgICAgICAgbGV0IGRpcyA9IDA7XG5cbiAgICAgICAgLy8g5aaC5p6c5rua5Yqo5Yiw54m55a6a5L2N572u6ZmE6L+R5LqGXG4gICAgICAgIGlmIChzY3JvbGxEaXMgPCBzcGVlZCkge1xuICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKGlzVmVydGljYWwgPyAwIDogcG9zLCBpc1ZlcnRpY2FsID8gcG9zIDogMCk7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIHRpbWVyID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOavj+asoea7muWKqOWJqeS9mea7muWKqOi3neemu+eahCAxIC8gc3BlZWRcbiAgICAgICAgZGlzID0gTWF0aC5mbG9vcihzY3JvbGxEaXMgLyBzcGVlZCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2Nyb2xsT3JpID4gcG9zKSB7XG4gICAgICAgICAgICBzY3JvbGxPcmkgLT0gZGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNjcm9sbE9yaSA8IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpICs9IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbE9yaSwgaXNWZXJ0aWNhbCA/IHNjcm9sbE9yaSA6IDApO1xuICAgIH0sIGludGVydmFsKVxufVxuXG5leHBvcnQgZGVmYXVsdCBzY3JvbGxUb1BvczsiLCJpbXBvcnQgc2Nyb2xsVG9Qb3MgZnJvbSBcIi4vdXRpbHMvc2Nyb2xsVG9Qb3NcIlxuXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBzY3JvbGxUb1Bvc1xufSJdLCJuYW1lcyI6WyJ0aW1lciIsInNjcm9sbFRvUG9zIiwiY29uZmlnIiwicG9zIiwiZWwiLCJpc1ZlcnRpY2FsIiwic3BlZWQiLCJpbnRlcnZhbCIsIm9wdHMiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJrZXkiLCJpc05hTiIsImNvbnNvbGUiLCJlcnJvciIsImNsZWFySW50ZXJ2YWwiLCJyb290RWxlIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiY2xpRWxlIiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImVsZVZhbCIsIm9mZnNldEhlaWdodCIsIm9mZnNldFdpZHRoIiwid2luVmFsIiwiY2xpZW50SGVpZ2h0IiwiY2xpZW50V2lkdGgiLCJtYXhWYWwiLCJNYXRoIiwiYWJzIiwiRXJyb3IiLCJtYXgiLCJzZXRJbnRlcnZhbCIsInNjcm9sbE9yaSIsIndpbmRvdyIsInNjcm9sbFkiLCJzY3JvbGxYIiwic2Nyb2xsRGlzIiwiZGlzIiwic2Nyb2xsVG8iLCJmbG9vciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0VBQUEsSUFBSUEs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
