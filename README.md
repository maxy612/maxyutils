# maxyutils
放置一些平时前端常用的工具函数，不定期更新

### scrollToPos 滑动到指定位置
- @pos required {Number} 滚动到的指定位置（距页面左侧或者距顶部的距离）
- @el {String} 指定的dom元素，一般为html,body或者body下最外层的dom
- @speed {Number} 每次滚动的距离是目前滚动总距离的 1 / speed,此值越大，滚动越快
- @interval {Number} 定时器执行间隔。间隔越小，滚动越快

const maxyutils = require("maxyutils");
maxyutils.scrollToPos(50); // 滚动到距页面顶部50px的位置
