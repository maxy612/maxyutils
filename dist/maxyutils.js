(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.maxyutils = factory());
}(this, (function () { 'use strict';

    var timer = null;
    var scrollToPos = function scrollToPos(_ref) {
        var _ref$pos = _ref.pos,
            pos = _ref$pos === undefined ? 0 : _ref$pos,
            _ref$el = _ref.el,
            el = _ref$el === undefined ? "html" : _ref$el,
            _ref$isVertical = _ref.isVertical,
            isVertical = _ref$isVertical === undefined ? true : _ref$isVertical,
            _ref$speed = _ref.speed,
            speed = _ref$speed === undefined ? 6 : _ref$speed,
            _ref$interval = _ref.interval,
            interval = _ref$interval === undefined ? 10 : _ref$interval;
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
        var eleVal = isVertical ? rootEle.offsetHeight : rootEle.offsetWidth;
        var winVal = isVertical ? cliEle.clientHeight : cliEle.clientWidth;
        var maxVal = Math.abs(eleVal - winVal) < 20 ? 0 : eleVal - winVal - 20;
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
