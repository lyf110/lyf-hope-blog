import {defineUserConfig} from "vuepress";
import theme from "./theme.js";
import {viteBundler} from "@vuepress/bundler-vite"

export default defineUserConfig({
    base: "/",

    head: [
        // 导入相应链接
        ["link", {rel: "preconnect", href: "https://fonts.googleapis.com"}],
        [
            "link",
            {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""},
        ],
        [
            "link",
            {
                href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap",
                rel: "stylesheet",
            },
        ],
    ],

    locales: {
        "/": {
            lang: "zh-CN",
            title: "lyf blog",
            description: "一个工作了六年的Java开发，技术源于不断的学习与积累",
        }
    },

    bundler: viteBundler(),
    theme,
});
