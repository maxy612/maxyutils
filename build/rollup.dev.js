const path = require("path");
const babel = require("rollup-plugin-babel");
const uglify = require("rollup-plugin-uglify").uglify;
const clean = require("rollup-plugin-cleanup");

const rootPath = path.resolve(__dirname, "../");

const config = {
    input: `${rootPath}/src/index.js`,
    output: [{
            file: `${rootPath}/dist/maxyutils.cjs.js`,
            format: "cjs",
            name: "maxyutils"
        },
        {
            file: `${rootPath}/dist/maxyutils.js`,
            format: "umd",
            name: "maxyutils"
        },
        {
            file: `${rootPath}/dist/maxyutils.win.js`,
            format: "iife",
            name: "maxyutils"
        }
    ],
    plugins: [
        babel({
            exclude: `${rootPath}/node_modules/**`
        }),
        clean()
    ],
    sourcemap: "inline"
}

export default config;