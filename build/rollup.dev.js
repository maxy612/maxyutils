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
            name: "maxyutils",
            sourcemap: "inline"
        },
        {
            file: `${rootPath}/dist/maxyutils.js`,
            format: "umd",
            name: "maxyutils",
            sourcemap: "inline"
        },
        {
            file: `${rootPath}/dist/maxyutils.win.js`,
            format: "iife",
            name: "maxyutils",
            sourcemap: "inline"
        }
    ],
    plugins: [
        babel({
            exclude: `${rootPath}/node_modules/**`
        }),
        clean()
    ],
    watch: {
        include: `${rootPath}/src/**/**.js`
    }
}

export default config;