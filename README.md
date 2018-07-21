# maxyutils
放置一些平时前端常用的工具函数，不定期更新

### scrollToPos 滑动到指定位置
- @pos required {Number} 滚动到的指定位置（距页面左侧或者距顶部的距离）
- @el {String} 指定的dom元素，一般为html,body或者body下最外层的dom，可选
- @isVertical {Boolean} 选择上下滚动还是左右滚动(为true时上下滚动，false时左右滚动，默认上下滚动)
- @speed {Number} 每次滚动的距离是目前滚动总距离的 1 / speed,此值越大，滚动越快，可选
- @interval {Number} 定时器执行间隔。间隔越小，滚动越快，可选

``` javascript
// 在浏览器中直接使用
maxyutils.scrollToPos({pos: 50}); // 滚动到距页面顶部50px的位置
// 在webpack下使用
import { scrollToPos } from "maxyutils" 
scrollToPos({pos: 50})  
// 单个参数上下滚动到距顶部50px的位置
scrollToPos(50)
// 详细配置
scrollToPos({
    pos: 30, 
    el: ".wrapper", 
    speed: 5, 
    interval: 15, 
    isVertical: true
})
```

### ImgLazyload 图片懒加载（移动端暂时请勿使用）
- 图片懒加载
- @params opts
- opts.container 可选，默认为html，指定需要懒加载图片元素的父容器
- opts.defaultImg 可选，加载之前默认的图片
- opts.errorImage 可选，加载网络图片出错时的图片
- opts.delay 滚动检测的间隔（函数节流）。每隔delay毫秒进行一次check，来加载处于视窗中的元素图片资源

``` javascript
maxyutils.ImgLazyload.init({container: "#test", delay: 500, defaultImg: "", errorImg: ""});
// 简写
maxyutils.ImgLazyload.init();
// webpack下用法同scrollToPos
```

