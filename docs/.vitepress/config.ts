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
        ],
      },
      {
        text: "算法",
        collapsed: true,
        items: [
          { text: "相关资料", link: "/posts/algorithm/index" },
          { text: "滑动窗口算法", link: "/posts/algorithm/sliding_window" },
        ],
      },
      {
        text: "计算机网络",
        collapsed: true,
        items: [
          { text: "相关资料", link: "/posts/csnet/index" },
          { text: "HTTP 笔记", link: "/posts/csnet/http" },
        ],
      },
      {
        text: "前端",
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
            ],
          },
          {
            text: "Web API",
            collapsed: true,
            items: [],
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
            items: [],
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
          svg: '<svg t="1706340521261" class="icon" viewBox="0 0 1129 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4230" width="200" height="200"><path d="M234.909 9.656a80.468 80.468 0 0 1 68.398 0 167.374 167.374 0 0 1 41.843 30.578l160.937 140.82h115.07l160.936-140.82a168.983 168.983 0 0 1 41.843-30.578A80.468 80.468 0 0 1 930.96 76.445a80.468 80.468 0 0 1-17.703 53.914 449.818 449.818 0 0 1-35.406 32.187 232.553 232.553 0 0 1-22.531 18.508h100.585a170.593 170.593 0 0 1 118.289 53.109 171.397 171.397 0 0 1 53.914 118.288v462.693a325.897 325.897 0 0 1-4.024 70.007 178.64 178.64 0 0 1-80.468 112.656 173.007 173.007 0 0 1-92.539 25.75h-738.7a341.186 341.186 0 0 1-72.421-4.024A177.835 177.835 0 0 1 28.91 939.065a172.202 172.202 0 0 1-27.36-92.539V388.662a360.498 360.498 0 0 1 0-66.789A177.03 177.03 0 0 1 162.487 178.64h105.414c-16.899-12.07-31.383-26.555-46.672-39.43a80.468 80.468 0 0 1-25.75-65.984 80.468 80.468 0 0 1 39.43-63.57M216.4 321.873a80.468 80.468 0 0 0-63.57 57.937 108.632 108.632 0 0 0 0 30.578v380.615a80.468 80.468 0 0 0 55.523 80.469 106.218 106.218 0 0 0 34.601 5.632h654.208a80.468 80.468 0 0 0 76.444-47.476 112.656 112.656 0 0 0 8.047-53.109v-354.06a135.187 135.187 0 0 0 0-38.625 80.468 80.468 0 0 0-52.304-54.719 129.554 129.554 0 0 0-49.89-7.242H254.22a268.764 268.764 0 0 0-37.82 0z m0 0" fill="#ff1d55" p-id="4231"></path><path d="M348.369 447.404a80.468 80.468 0 0 1 55.523 18.507 80.468 80.468 0 0 1 28.164 59.547v80.468a80.468 80.468 0 0 1-16.094 51.5 80.468 80.468 0 0 1-131.968-9.656 104.609 104.609 0 0 1-10.46-54.719v-80.468a80.468 80.468 0 0 1 70.007-67.593z m416.02 0a80.468 80.468 0 0 1 86.102 75.64v80.468a94.148 94.148 0 0 1-12.07 53.11 80.468 80.468 0 0 1-132.773 0 95.757 95.757 0 0 1-12.875-57.133V519.02a80.468 80.468 0 0 1 70.007-70.812z m0 0" fill="#ff1d55" p-id="4232"></path></svg>',
        },
        link: "https://space.bilibili.com/522673567",
      },
    ],
  },
};
