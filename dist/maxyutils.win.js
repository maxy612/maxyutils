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

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLndpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5aSn77yM5rua5Yqo6LaK5b+rXG4gKiBAaW50ZXJ2YWwge051bWJlcn0g5a6a5pe25Zmo5omn6KGM6Ze06ZqU44CC6Ze06ZqU6LaK5bCP77yM5rua5Yqo6LaK5b+rIFxuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNixcbiAgICAgICAgaW50ZXJ2YWw6IDEwXG4gICAgfTtcblxuICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgIH0gXG5cbiAgICAvLyDlkIjlubZjb25maWflkozkvKDlhaXnmoRvcHRzXG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRzKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeyBwb3MsIGVsLCBpc1ZlcnRpY2FsLCBzcGVlZCwgaW50ZXJ2YWwgfSA9IGNvbmZpZztcblxuICAgIGlmICh0eXBlb2YgcG9zICE9PSBcIm51bWJlclwiIHx8IHBvcyA8IDAgfHwgaXNOYU4ocG9zKSB8fCAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9wdHMgIT09IFwibnVtYmVyXCIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55YWD57Sg5ZKM6KeG56qX5YWD57SgXG4gICAgbGV0IHJvb3RFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBsZXQgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvLyDmoKHpqoxyb290RWxl5piv5ZCm5Li656m6XG4gICAgaWYgKCFyb290RWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLmjIflrprnmoRlbOS4jeWtmOWcqFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOaguea6kOe0oOeahOWuveaIlumrmFxuICAgIGxldCBlbGVWYWwgPSBpc1ZlcnRpY2FsID8gcm9vdEVsZS5vZmZzZXRIZWlnaHQgOiByb290RWxlLm9mZnNldFdpZHRoO1xuICAgIC8vIOiOt+WPluWIsOinhueql+eahOWuveaIlumrmFxuICAgIGxldCB3aW5WYWwgPSBpc1ZlcnRpY2FsID8gY2xpRWxlLmNsaWVudEhlaWdodCA6IGNsaUVsZS5jbGllbnRXaWR0aDtcbiAgICAvLyDorqHnrpfmu5rliqjnmoTmnIDlpKflgLzvvIzlkIzml7bnlZnlh7oyMOeahOWuieWFqOi3neemu1xuICAgIGxldCBtYXhWYWwgPSBNYXRoLmFicyhlbGVWYWwgLSB3aW5WYWwpIDwgMjAgPyAwIDogZWxlVmFsIC0gd2luVmFsIC0gMjA7XG5cbiAgICAvLyDmr5TovoPlhoXlrrnpq5jvvI/lrr3luqblkozop4bnqpfpq5jvvI/lrr3luqbvvIzlpoLmnpzlhoXlrrnpq5jvvI/lrr3luqbkuI3lpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIzmraTml7bkuI3kvJrlh7rnjrDmu5rliqjmnaHvvIznu5nlh7rmj5DnpLpcbiAgICBpZiAoZWxlVmFsIDw9IHdpblZhbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIuivt+ehruiupOW9k+WJjeS8oOWFpeeahOWGheWuueWMuumrmC/lrr3luqblpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIjmraTml7bmiY3kvJrlh7rnjrDmu5rliqjmnaHvvIlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlr7nmu5rliqjliLDnmoTkvY3nva5wb3Pov5vooYzlpITnkIZcbiAgICBpZiAocG9zID4gbWF4VmFsKSB7XG4gICAgICAgIHBvcyA9IE1hdGgubWF4KDAsIG1heFZhbCk7XG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBzY3JvbGxPcmkgPSBpc1ZlcnRpY2FsID8gd2luZG93LnNjcm9sbFkgOiB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgICAgbGV0IHNjcm9sbERpcyA9IE1hdGguYWJzKHBvcyAtIHNjcm9sbE9yaSk7XG4gICAgICAgIGxldCBkaXMgPSAwO1xuXG4gICAgICAgIC8vIOWmguaenOa7muWKqOWIsOeJueWumuS9jee9rumZhOi/keS6hlxuICAgICAgICBpZiAoc2Nyb2xsRGlzIDwgc3BlZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHBvcywgaXNWZXJ0aWNhbCA/IHBvcyA6IDApO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICB9LCBpbnRlcnZhbClcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsVG9Qb3M7IiwiaW1wb3J0IHNjcm9sbFRvUG9zIGZyb20gXCIuL3V0aWxzL3Njcm9sbFRvUG9zXCJcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2Nyb2xsVG9Qb3Ncbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsInBvcyIsImVsIiwiaXNWZXJ0aWNhbCIsInNwZWVkIiwiaW50ZXJ2YWwiLCJvcHRzIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwia2V5IiwiaXNOYU4iLCJjb25zb2xlIiwiZXJyb3IiLCJjbGVhckludGVydmFsIiwicm9vdEVsZSIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImNsaUVsZSIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJlbGVWYWwiLCJvZmZzZXRIZWlnaHQiLCJvZmZzZXRXaWR0aCIsIndpblZhbCIsImNsaWVudEhlaWdodCIsImNsaWVudFdpZHRoIiwibWF4VmFsIiwiTWF0aCIsImFicyIsIkVycm9yIiwibWF4Iiwic2V0SW50ZXJ2YWwiLCJzY3JvbGxPcmkiLCJ3aW5kb3ciLCJzY3JvbGxZIiwic2Nyb2xsWCIsInNjcm9sbERpcyIsImRpcyIsInNjcm9sbFRvIiwiZmxvb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztFQUFBLElBQUlB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
