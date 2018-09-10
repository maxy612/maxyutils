let timer = null;

/**
 * [页面平滑滚动到指定位置（多用于返回顶部）]
 * @param  {[Number || Object]} opts [配置参数]
 * @opts 为Number类型时，默认上下滚动到指定位置，以html元素为根元素计算内容区高度
 * @opts 为Object时，可填的参数有：
 * @pos required {Number} 滚动到的指定位置（距页面左侧或者距顶部的距离）
 * @isVertical required {Boolean} 选择上下滚动还是左右滚动(为true时上下滚动，false时左右滚动，默认上下滚动)
 * @el {String} 指定的dom元素，一般为html,body或者body下最外层的dom
 * @speed {Number} 每次滚动的距离是目前滚动总距离的 1 / speed,此值越大，滚动越快
 * @interval {Number} 定时器执行间隔。间隔越小，滚动越快 
 * @return {[undefined]}      [无意义，没有返回值]
 */
const scrollToPos = opts => {
    // 初始化配置
    const config = {
        pos: 0,
        el: el || "html",
        isVertical: true,
        speed: 6,
        interval: 10
    };

    if (typeof opts !== "object") {
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

    // 合并config和传入的opts
    if (typeof opts === "object" && Object.prototype.toString.call(opts) === "[object Object]") {
        for (const key in config) {
            if (typeof opts[key] !== "undefined") {
                config[key] = opts[key];
            }
        }
    }

    let { pos, el, isVertical, speed, interval } = config;

    if (typeof pos !== "number" || pos < 0 || isNaN(pos)) {
        console.error("scrollToPos: 滚动参数pos应为大于等于0的数字");
        return;
    }

    // 重置timer
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // 获取到根元素和视窗元素
    let rootEle = document.querySelector(el);
    let cliEle = document.documentElement || document.body;

    // 校验rootEle是否为空
    if (!rootEle) {
        console.error("指定的el不存在");
        return;
    }

    // 获取到根源素的宽或高
    let eleVal = isVertical ? rootEle.offsetHeight : rootEle.offsetWidth;
    // 获取到视窗的宽或高
    let winVal = isVertical ? cliEle.clientHeight : cliEle.clientWidth;
    // 计算滚动的最大值，同时留出20的安全距离
    let maxVal = Math.abs(eleVal - winVal) < 20 ? 0 : eleVal - winVal - 20;

    // 比较内容高／宽度和视窗高／宽度，如果内容高／宽度不大于视窗高／宽度，此时不会出现滚动条，给出提示
    if (eleVal <= winVal) {
        throw Error("请确认当前传入的内容区高/宽度大于视窗高／宽度（此时才会出现滚动条）");
        return;
    }

    // 对滚动到的位置pos进行处理
    if (pos > maxVal) {
        pos = Math.max(0, maxVal);
    }

    timer = setInterval(() => {
        let scrollOri = isVertical ? window.scrollY : window.scrollX;
        let scrollDis = Math.abs(pos - scrollOri);
        let dis = 0;

        // 如果滚动到特定位置附近了
        if (scrollDis < speed) {
            window.scrollTo(isVertical ? 0 : pos, isVertical ? pos : 0);
            clearInterval(timer);
            timer = null;
            return;
        }

        // 每次滚动剩余滚动距离的 1 / speed
        dis = Math.floor(scrollDis / speed);
        
        if (scrollOri > pos) {
            scrollOri -= dis;
        }

        if (scrollOri < pos) {
            scrollOri += dis;
        }

        window.scrollTo(isVertical ? 0 : scrollOri, isVertical ? scrollOri : 0);
    }, interval)
}

export default scrollToPos;