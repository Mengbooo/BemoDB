import { RssPlugin, RSSOptions } from "vitepress-plugin-rss";

const baseUrl = "https://mengbooo.github.io";
const base = "/BemoDB/";
const RSS: RSSOptions = {
  title: "BemoDB",
  baseUrl,
  copyright: "Copyright (c) 2025-present, Bolaxious",
};

export default {
  vite: {
    plugins: [RssPlugin(RSS)],
  },
  // 基础路径
  base,
  // 站点级选项
  lastUpdated: true,
  title: "BemoDB", // 网站标题
  description: "这是 Bolaxious 的文档库，用于各种文章的存放",
  head: [["link", { rel: "icon", href: "/base/logo.jpg" }]],
  themeConfig: {
    search: {
      provider: "local",
    },
    logo: "/logo.jpg",
    // 主题级选项
    nav: [
      { text: "主页", link: "/" },
      { text: "文档", link: "/doc" },
      { text: "导航", link: "/nav" },
    ],
    sidebar: [
      { text: "你好", link: "/doc" },
      { text: "导航", link: "/nav" },
      {
        text: "年记",
        collapsed: true,
        items: [{ text: "2024:Teenager Forever", link: "/posts/annals/2024" }],
      },
      {
        text: "随记",
        collapsed: true,
        items: [
          { text: "构建之法", link: "/posts/notes/goujianzhifa" },
          { text: "AI与中年人", link: "/posts/notes/AI&MiddleAged" },
          { text: "元宵夜游", link: "/posts/notes/fireFlower" },
        ],
      },
      {
        text: "转载",
        collapsed: true,
        items: [
          {
            text: "70% 问题：关于 AI 辅助编码的残酷真相",
            link: "/posts/recording/70_ai",
          },
          { text: "CSS设计中的缺陷列表", link: "/posts/recording/mistakesOfCSS" },
          { text: "圆周估算猜想", link: "/posts/recording/Multiply" },
        ],
      },
      {
        text: "小研究",
        collapsed: true,
        items: [
          {
            text: "Hello Halo —— 使用Halo搭建个人博客",
            link: "/posts/research/halo",
          },
          { text: "subtick简谈", link: "/posts/research/subtick" },
          { text: "something about Cursor", link: "/posts/research/cursor" },
        ],
      },
      {
        text: "算法",
        collapsed: true,
        items: [
          { text: "算法篇", link: "/posts/algorithm/index" },
          {
            text: "其它题目",
            collapsed: true,
            items: [
              { text: "Marscode-T41 滑动窗口算法", link: "/posts/algorithm/other/sliding_window" },
            ],
          },
        ],
      },
      {
        text: "计算机网络",
        collapsed: true,
        items: [
          { text: "网络篇", link: "/posts/csnet/index" },
          { text: "OSI七层模型简介", link: "/posts/csnet/OSI" },
          { text: "HTTP 笔记", link: "/posts/csnet/http" },
        ],
      },
      {
        text: "操作系统",
        collapsed: true,
        items: [
          { text: "操作系统课后作业 1", link: "/posts/os/hw_1/hw_1" },
          { text: "[转载] 操作系统课后作业 1", link: "/posts/os/Q_hw_1/Q_hw_1" },
        ],
      },
      {
        text: "软件工程",
        collapsed: true,
        items: [
          { text: "导论", link: "/posts/software/base" },
          { text: "软件过程", link: "/posts/software/process" },
          { text: "敏捷开发", link: "/posts/software/agile-development" },
        ],
      },
      {
        text: "FrontEnd",
        collapsed: true,
        items: [
          {
            text: "HTML",
            collapsed: true,
            items: [
              { text: "HTML 文档首页", link: "/posts/FE/HTML/index" },
              { text: "HTML基础", link: "/posts/FE/HTML/HTML" },
              {
                text: "HTML、XHTML、HTMX、SGML、XML之间的关系",
                link: "/posts/FE/HTML/htmlHtmlxXhtml",
              },
              {
                text: "头里面有什么 - meta标签",
                link: "/posts/FE/HTML/somethingInHead",
              },
              { text: "URL简介", link: "/posts/FE/HTML/URL" },
              { text: "HTML属性详解", link: "/posts/FE/HTML/attribute" },
              {
                text: "HTML5语义化标签",
                link: "/posts/FE/HTML/Semanticization",
              },
              { text: "HTML文本标签", link: "/posts/FE/HTML/text" },
              { text: "HTML列表标签", link: "/posts/FE/HTML/list" },
              { text: "HTML图像标签", link: "/posts/FE/HTML/image" },
              { text: "HTML超链接", link: "/posts/FE/HTML/Hyperlinks" },
              { text: "HTML链接标签", link: "/posts/FE/HTML/link" },
              {
                text: "script 与 noscript",
                link: "/posts/FE/HTML/script",
              },
              {
                text: "HTML多媒体标签",
                link: "/posts/FE/HTML/multimedia",
              },
              { text: "iframe 与 frame", link: "/posts/FE/HTML/iframe" },
              { text: "表格 table", link: "/posts/FE/HTML/table" },
              { text: "表单 form", link: "/posts/FE/HTML/form" },
              { text: "HTML5 新引入标签", link: "/posts/FE/HTML/other" },
            ],
          },
          {
            text: "CSS",
            collapsed: true,
            items: [
              { text: "CSS 文档首页", link: "/posts/FE/CSS/index" },
              { text: "Why CSS", link: "/posts/FE/CSS/css_whyUseCSS" },
              { text: "CSS选择器", link: "/posts/FE/CSS/css_selector" },
              { text: "CSS盒模型", link: "/posts/FE/CSS/css_boxModel" },
              {
                text: "层叠、继承与优先级",
                link: "/posts/FE/CSS/css_cascade",
              },
              { text: "值与单位", link: "/posts/FE/CSS/css_value" },
              { text: "调整大小", link: "/posts/FE/CSS/css_change" },
              { text: "背景和边框", link: "/posts/FE/CSS/css_bg" },
              { text: "处理溢出", link: "/posts/FE/CSS/css_overflow" },
              { text: "图像、表单元素的处理", link: "/posts/FE/CSS/css_multimedia" }, 
              { text: "表格的处理", link: "/posts/FE/CSS/css_table" },
              { text: "文本与字体", link: "/posts/FE/CSS/css_fonts" },
              { text: "列表样式", link: "/posts/FE/CSS/css_list" },
              { text: "链接样式", link: "/posts/FE/CSS/css_a" },
              { text: "web字体", link: "/posts/FE/CSS/css_webFonts" },
              { text: "intro to css layout", link: "/posts/FE/CSS/css_introToLayout" },
              { text: "浮动", link: "/posts/FE/CSS/css_float" },
              { text: "定位", link: "/posts/FE/CSS/css_position" },
              { text: "Flex", link: "/posts/FE/CSS/css_flex" },
              { text: "Grid", link: "/posts/FE/CSS/css_grid" },
              { text: "响应式设计", link: "/posts/FE/CSS/css_responsive" },
              { text: "媒体查询入门", link: "/posts/FE/CSS/css_mediaQueries" },
            ],
          },
          {
            text: "JavaScript",
            collapsed: true,
            items: [
              {
                text: "JavaScript 文档首页",
                link: "/posts/FE/JavaScript/index",
              },
              { text: "JavaScript 基础", link: "/posts/FE/JavaScript/js-grammar" },
              { text: "JavaScript 代码质量", link: "/posts/FE/JavaScript/code-quality" },
            ],
          },
          {
            text: "Web API",
            collapsed: true,
            items: [
              { text: "交互：alert、prompt 和 confirm", link: "/posts/FE/webAPI/interaction" },
            ],
          },
          {
            text: "包管理器",
            collapsed: true,
            items: [],
          },
          {
            text: "模块化",
            collapsed: true,
            items: [],
          },
          {
            text: "DevTools",
            collapsed: true,
            items: [],
          },
          {
            text: "React",
            collapsed: true,
            items: [],
          },
          {
            text: "Vue",
            collapsed: true,
            items: [],
          },
          {
            text: "TypeScript",
            collapsed: true,
            items: [],
          },
          {
            text: "Node",
            collapsed: true,
            items: [
              { text: "Node.js 篇", link: "/posts/FE/node/index" },
              { text: "Node.js 基础相关", link: "/posts/FE/node/base" },
            ],
          },
          {
            text: "SSG",
            collapsed: true,
            items: [
              {
                text: "浅尝VitePress🤗",
                link: "/posts/FE/SSG/vitepress_easyUse",
              },
            ],
          },
          {
            text: "VCS Hosting",
            collapsed: true,
            items: [
              {
                text: "Github",
                link: "/posts/FE/VCS HOST/useGithub",
              },
            ],
          },
        ],
      },
      {
        text: "Frontalk",
        collapsed: true,
        items: [],
      },
      {
        text: "Problems & Solutions",
        collapsed: true,
        items: [],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/mengbooo" },
      {
        icon: {
          svg: '<svg t="1740230160441" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2735" width="200" height="200"><path d="M835.5 165.9c-5.9-13.3-13.9-24.9-23.9-35-10-10-21.7-18-34.9-23.9-13.3-5.9-27.6-8.8-42.9-8.8H291.6c-15.3 0-29.6 3-42.9 8.8-13.3 5.9-24.9 13.9-34.9 23.9-10 10-18 21.7-23.9 35-5.9 13.3-8.8 27.6-8.8 42.9V707c0 15.3 0.1 29.6 0.4 42.9 0.3 13.3 1.9 24.9 4.9 34.9 2.9 10 8.3 18 15.9 23.9 7.7 5.9 18.9 8.8 33.6 8.8v54.9c0 15.3 5.5 28.5 16.4 39.4 10.9 10.9 24 16.4 39.4 16.4 15.3 0 28.3-5.5 38.9-16.4 10.6-10.9 15.9-24 15.9-39.4v-54.9H679v54.9c0 15.3 5.3 28.5 15.9 39.4 10.6 10.9 23.6 16.4 38.9 16.4 15.3 0 28.5-5.5 39.4-16.4 10.9-10.9 16.4-24 16.4-39.4v-54.9c15.3 0 26.8-2.9 34.5-8.8 7.7-5.9 13-13.9 15.9-23.9 2.9-10 4.4-21.8 4.4-35.4V208.8c0-15.3-3-29.6-8.9-42.9zM380.9 161c5.3-5.3 11.8-8 19.5-8H625c7.7 0 14.2 2.6 19.5 8 5.3 5.3 8 11.8 8 19.5 0 8.3-2.6 15-8 20.4-5.3 5.3-11.8 8-19.5 8H400.4c-7.7 0-14.2-2.7-19.5-8-5.3-5.3-8-12.1-8-20.4 0.1-7.7 2.7-14.1 8-19.5zM346 703.9c-8 8-17.5 11.9-28.7 11.9-11.8 0-21.5-4-29.2-11.9-7.7-8-11.5-17.6-11.5-28.8s3.8-20.8 11.5-28.8 17.4-11.9 29.2-11.9c11.2 0 20.8 4 28.7 11.9 8 8 11.9 17.5 11.9 28.8s-4 20.8-11.9 28.8z m385.6-1.3c-7.4 7.7-16.4 11.5-27 11.5-11.2 0-20.5-3.8-27.9-11.5-7.4-7.7-11.1-16.8-11.1-27.4 0-10.6 3.7-19.8 11.1-27.4 7.4-7.7 16.7-11.5 27.9-11.5 10.6 0 19.6 3.8 27 11.5 7.4 7.7 11.1 16.8 11.1 27.4 0 10.6-3.7 19.7-11.1 27.4z m57.9-217.7H235.9V263.7h553.7v221.2z" p-id="2736" fill="#98989e"></path></svg>',
        },
        link: "https://www.travellings.cn/go.html",
      },
    ],
  },
};
