class ImgLazyload {
    constructor({container = "html", defaultImg = "", errorImage = "", delay = 500}) {
        this.el = document.querySelector(container);
        // 收集在container下的懒加载的图片
        this.children = [];
        this.defaultImg = defaultImg;
        this.errorImage = errorImage;
        this.delay = delay;
        this.getLazyLoadEls();

        const cliEle = document.documentElement;
        // 获取视窗的高度和宽度
        this.wHeight = cliEle.clientHeight;
        this.wWidth = cliEle.clientWidth;

        this.init();
    }

    // 注册滚动事件
    init() {
        let cbfn = this.throttle();
        if (window.addEventListener) {
            window.addEventListener("scroll", cbfn, false);
            window.addEventListener("touchmove", cbfn, false);            
            window.addEventListener("load", cbfn, false);
        }
    }

    // 函数节流
    throttle() {
        let prev = Date.now();
        this.check();
        return () => {
            let now = Date.now();
            if (now - prev > this.delay) {
                this.check();
                prev = now;
            }
        }
    }

    // 获取所有带lazyload的属性的dom元素
    getLazyLoadEls() {
        const eles = this.el.querySelectorAll("*[lazyload]");
        for (let i = 0, len = eles.length; i < len; i ++ ) {
            this.children.push(eles[i]);
            // 如果有默认图片，设置默认图片
            if (this.defaultImg) {
                this.setImageForEl(eles[i], this.defaultImg);
            }
        }
    }

    // 为元素设置图片
    setImageForEl(el, imgUrl) {
        // 如果el不是标签,不处理
        if (el.nodeType !== 1) return;

        if (typeof el.tagName === "string" && el.tagName.toLowerCase() === "img") {
            el.src = imgUrl;
        } else {
            el.style.backgroundImage = `url(${imgUrl || ""})`;
        }
    }

    // 检查单个元素是否在视窗中
    checkInView(el) {
        const pos = el.getBoundingClientRect();
        const { x, y, width, height } = pos;
        // 如果x在-width到wWidth之间并且y在-height到wHeight之间时，元素处于视窗中
        if (x < this.wWidth && x > -width && y < this.wHeight && y > -height) {
            return true;
        }

        return false;
    }

    // 遍历子元素，处理在视窗中的元素
    check() {
        this.children.forEach(item => {
            // 如果在视窗中 
            if (this.checkInView(item)) {
                this.handleElInView(item);
            }
        })
    }

    // 将元素的lazyload属性取出来，然后新建一个image对象
    handleElInView(el) {
        const imgUrl = el.getAttribute("lazyload");
        const Img = new Image();

        Img.src = imgUrl;
        Img.addEventListener("load", () => {
            this.setImageForEl(el, imgUrl);
        }, false);

        // 如果图片加载失败了，就加载错误图片或默认图片
        Img.addEventListener("error", () => {
            if (this.errorImage) {
                this.setImageForEl(el, this.errorImage);
            } 
            
            if (this.defaultImg) {
                this.setImageForEl(el, this.defaultImg);
            }
        }, false);
    }
}

export default ImgLazyload;