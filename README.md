# maxyutils
放置一些平时前端常用的工具函数，不定期更新

### scrollToPos 滑动到指定位置
- @pos required {Number} 滚动到的指定位置（距页面左侧或者距顶部的距离）
- @el {String} 指定的dom元素，一般为html,body或者body下最外层的dom，可选
- @speed {Number} 每次滚动的距离是目前滚动总距离的 1 / speed,此值越大，滚动越快，可选
- @interval {Number} 定时器执行间隔。间隔越小，滚动越快，可选

<code>
    > // scrollToPos({pos: 30, el: ".wrapper", speed: 5, interval: 15})
    > // 在浏览器中直接使用
    > maxyutils.scrollToPos({pos: 50}); // 滚动到距页面顶部50px的位置
    > // 在webpack下使用
    > import { scrollToPos } from "maxyutils"
    > scrollToPos({pos: 50})
</code>   
