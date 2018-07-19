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

module.exports = index;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLmNqcy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5aSn77yM5rua5Yqo6LaK5b+rXG4gKiBAaW50ZXJ2YWwge051bWJlcn0g5a6a5pe25Zmo5omn6KGM6Ze06ZqU44CC6Ze06ZqU6LaK5bCP77yM5rua5Yqo6LaK5b+rIFxuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNixcbiAgICAgICAgaW50ZXJ2YWw6IDEwXG4gICAgfTtcblxuICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgIH0gXG5cbiAgICAvLyDlkIjlubZjb25maWflkozkvKDlhaXnmoRvcHRzXG4gICAgaWYgKHR5cGVvZiBvcHRzID09PSBcIm9iamVjdFwiICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvcHRzKSA9PT0gXCJbb2JqZWN0IE9iamVjdF1cIikge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjb25maWcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0c1trZXldICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSBvcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeyBwb3MsIGVsLCBpc1ZlcnRpY2FsLCBzcGVlZCwgaW50ZXJ2YWwgfSA9IGNvbmZpZztcblxuICAgIGlmICh0eXBlb2YgcG9zICE9PSBcIm51bWJlclwiIHx8IHBvcyA8IDAgfHwgaXNOYU4ocG9zKSB8fCAodHlwZW9mIG9wdHMgIT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG9wdHMgIT09IFwibnVtYmVyXCIpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55YWD57Sg5ZKM6KeG56qX5YWD57SgXG4gICAgbGV0IHJvb3RFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBsZXQgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvLyDmoKHpqoxyb290RWxl5piv5ZCm5Li656m6XG4gICAgaWYgKCFyb290RWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLmjIflrprnmoRlbOS4jeWtmOWcqFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOaguea6kOe0oOeahOWuveaIlumrmFxuICAgIGxldCBlbGVWYWwgPSBpc1ZlcnRpY2FsID8gcm9vdEVsZS5vZmZzZXRIZWlnaHQgOiByb290RWxlLm9mZnNldFdpZHRoO1xuICAgIC8vIOiOt+WPluWIsOinhueql+eahOWuveaIlumrmFxuICAgIGxldCB3aW5WYWwgPSBpc1ZlcnRpY2FsID8gY2xpRWxlLmNsaWVudEhlaWdodCA6IGNsaUVsZS5jbGllbnRXaWR0aDtcbiAgICAvLyDorqHnrpfmu5rliqjnmoTmnIDlpKflgLzvvIzlkIzml7bnlZnlh7oyMOeahOWuieWFqOi3neemu1xuICAgIGxldCBtYXhWYWwgPSBNYXRoLmFicyhlbGVWYWwgLSB3aW5WYWwpIDwgMjAgPyAwIDogZWxlVmFsIC0gd2luVmFsIC0gMjA7XG5cbiAgICAvLyDmr5TovoPlhoXlrrnpq5jvvI/lrr3luqblkozop4bnqpfpq5jvvI/lrr3luqbvvIzlpoLmnpzlhoXlrrnpq5jvvI/lrr3luqbkuI3lpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIzmraTml7bkuI3kvJrlh7rnjrDmu5rliqjmnaHvvIznu5nlh7rmj5DnpLpcbiAgICBpZiAoZWxlVmFsIDw9IHdpblZhbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIuivt+ehruiupOW9k+WJjeS8oOWFpeeahOWGheWuueWMuumrmC/lrr3luqblpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIjmraTml7bmiY3kvJrlh7rnjrDmu5rliqjmnaHvvIlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlr7nmu5rliqjliLDnmoTkvY3nva5wb3Pov5vooYzlpITnkIZcbiAgICBpZiAocG9zID4gbWF4VmFsKSB7XG4gICAgICAgIHBvcyA9IE1hdGgubWF4KDAsIG1heFZhbCk7XG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBzY3JvbGxPcmkgPSBpc1ZlcnRpY2FsID8gd2luZG93LnNjcm9sbFkgOiB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgICAgbGV0IHNjcm9sbERpcyA9IE1hdGguYWJzKHBvcyAtIHNjcm9sbE9yaSk7XG4gICAgICAgIGxldCBkaXMgPSAwO1xuXG4gICAgICAgIC8vIOWmguaenOa7muWKqOWIsOeJueWumuS9jee9rumZhOi/keS6hlxuICAgICAgICBpZiAoc2Nyb2xsRGlzIDwgc3BlZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHBvcywgaXNWZXJ0aWNhbCA/IHBvcyA6IDApO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICB9LCBpbnRlcnZhbClcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsVG9Qb3M7IiwiaW1wb3J0IHNjcm9sbFRvUG9zIGZyb20gXCIuL3V0aWxzL3Njcm9sbFRvUG9zXCJcblxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgc2Nyb2xsVG9Qb3Ncbn0iXSwibmFtZXMiOlsidGltZXIiLCJzY3JvbGxUb1BvcyIsImNvbmZpZyIsImVsIiwib3B0cyIsInBvcyIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImtleSIsImlzVmVydGljYWwiLCJzcGVlZCIsImludGVydmFsIiwiaXNOYU4iLCJlcnJvciIsInJvb3RFbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjbGlFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiZWxlVmFsIiwib2Zmc2V0SGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJ3aW5WYWwiLCJjbGllbnRIZWlnaHQiLCJjbGllbnRXaWR0aCIsIm1heFZhbCIsIk1hdGgiLCJhYnMiLCJFcnJvciIsIm1heCIsInNldEludGVydmFsIiwic2Nyb2xsT3JpIiwid2luZG93Iiwic2Nyb2xsWSIsInNjcm9sbFgiLCJzY3JvbGxEaXMiLCJkaXMiLCJzY3JvbGxUbyIsImZsb29yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLFFBQVEsSUFBWjtBQWNBLElBQU1DLGNBQWMs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
