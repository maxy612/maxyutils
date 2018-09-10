const canUseCookie = () => typeof document !== "undefined";
const ONEDAY = 3600 * 1000 * 24;
const DEFAULTEXPIRES = new Date(new Date().getTime() + ONEDAY).toGMTString();
const Cookie = {
  set(name, val, opt = {expires: DEFAULTEXPIRES}) {
    if (!name || !canUseCookie()) return;
    document.cookie = `${name}=${val};expires=${opt.expires}`;
  },
  formatCookie() {
    if (!canUseCookie()) return {};
    
    let i, item;
    let cookie = document.cookie;
    let cookieObj = {};

    cookie = cookie.split(";");

    if (cookie.length) {
      for (i = 0; i < cookie.length; i++) {
        item = cookie[i].trim().split("=");
        if (item && item[0] && item[1]) {
          cookieObj[item[0].trim()] = item[1].trim();
        }
      }
    }
    return cookieObj;
  },
  get(name) {
    let res;
    try {
      res = JSON.parse(JSON.stringify(this.formatCookie()[`${name}`]));
      if (typeof res === "string") {
        res = JSON.parse(res);
      }
    } catch(e) {}
    return res;
  },
  clear(name) {
    if (!canUseCookie()) return;
    document.cookie = `${name}=null;expires=-1`;
  }
};

export default Cookie;