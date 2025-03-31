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
  head: [["link", { rel: "icon", href: `${base}/webhook.ico` }]],
  themeConfig: {
    outline: [2, 4], // 显示 h2, h3, h4 标题
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
        items: [{ text: "2024:Teenager Forever", link: "/posts/annals/2024" }],
      },
      {
        text: "随记",
        items: [
          { text: "构建之法", link: "/posts/notes/goujianzhifa" },
          { text: "AI与中年人", link: "/posts/notes/AI&MiddleAged" },
          { text: "元宵夜游", link: "/posts/notes/fireFlower/fireFlower" },
          { text: "玉兰开了", link: "/posts/notes/yuLan/yuLan" },
        ],
      },
      {
        text: "转载",
        items: [
          {
            text: "70% 问题：关于 AI 辅助编码的残酷真相",
            link: "/posts/recording/70_ai",
          },
          {
            text: "CSS设计中的缺陷列表",
            link: "/posts/recording/mistakesOfCSS",
          },
          { text: "圆周估算猜想", link: "/posts/recording/Multiply" },
        ],
      },
      {
        text: "小研究",
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
        items: [
          { text: "算法篇", link: "/posts/algorithm/index" },
          {
            text: "其它题目",
            collapsed: true,
            items: [
              {
                text: "Marscode-T41 滑动窗口算法",
                link: "/posts/algorithm/other/sliding_window",
              },
            ],
          },
        ],
      },
      {
        text: "计算机网络",
        items: [
          { text: "网络篇", link: "/posts/csnet/index" },
          { text: "OSI七层模型简介", link: "/posts/csnet/OSI" },
          { text: "HTTP 笔记", link: "/posts/csnet/http" },
        ],
      },
      {
        text: "操作系统",
        items: [
          {
            text: "课后作业",
            collapsed: true,
            items: [
              {
                text: "操作系统课后作业 1",
                link: "/posts/os/homework/hw_1/hw_1",
              },
              {
                text: "[转载] 操作系统课后作业 1",
                link: "/posts/os/homework/Q_hw_1/Q_hw_1",
              },
            ],
          },
          {
            text: "实验报告",
            collapsed: true,
            items: [
              {
                text: "[转载] 操作系统上机实验 1",
                link: "/posts/os/experiment/Q_ex_1/sys-1",
              },
            ],
          },
        ],
      },
      {
        text: "软件工程",
        items: [
          { text: "导论", link: "/posts/software/base" },
          { text: "软件过程", link: "/posts/software/process" },
          { text: "敏捷开发", link: "/posts/software/agile-development" },
        ],
      },
      {
        text: "FrontEnd",
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
              {
                text: "图像、表单元素的处理",
                link: "/posts/FE/CSS/css_multimedia",
              },
              { text: "表格的处理", link: "/posts/FE/CSS/css_table" },
              { text: "文本与字体", link: "/posts/FE/CSS/css_fonts" },
              { text: "列表样式", link: "/posts/FE/CSS/css_list" },
              { text: "链接样式", link: "/posts/FE/CSS/css_a" },
              { text: "web字体", link: "/posts/FE/CSS/css_webFonts" },
              {
                text: "intro to css layout",
                link: "/posts/FE/CSS/css_introToLayout",
              },
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
              {
                text: "JavaScript 基础",
                link: "/posts/FE/JavaScript/js-grammar",
              },
              {
                text: "JavaScript 代码质量",
                link: "/posts/FE/JavaScript/code-quality",
              },
              {
                text: "Object（对象）",
                link: "/posts/FE/JavaScript/object",
              },
              {
                text: "数据类型",
                link: "/posts/FE/JavaScript/data-type",
              },
              {
                text: "函数进阶",
                link: "/posts/FE/JavaScript/advance-function",
              },
              {
                text: "对象属性配置",
                link: "/posts/FE/JavaScript/OPC",
              },
              {
                text: "原型与继承",
                link: "/posts/FE/JavaScript/prototype",
              },
              {
                text: "类",
                link: "/posts/FE/JavaScript/class",
              },
            ],
          },
          {
            text: "Web API",
            collapsed: true,
            items: [
              {
                text: "交互：alert、prompt 和 confirm",
                link: "/posts/FE/webAPI/interaction",
              },
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
        items: [],
      },
      {
        text: "Problems & Solutions",
        items: [
          {
            text: "SSG",
            collapsed: true,
            items: [
              {
                text: "Vitepress 内含 deadlink 导致部署失败",
                link: "/posts/problems/SSG/vitepressDeadLink",
              },
            ],
          },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/mengbooo" },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus-front"><path d="M4 6 2 7"/><path d="M10 6h4"/><path d="m22 7-2-1"/><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M8 15h.01"/><path d="M16 15h.01"/><path d="M6 19v2"/><path d="M18 21v-2"/></svg>',
        },
        link: "https://www.travellings.cn/go.html",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>',
        },
        link: "https://foreverblog.cn/go.html",
      },
    ],
  },
};
