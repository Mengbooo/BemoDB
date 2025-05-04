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
        collapsed: true,
        items: [{ text: "2024:Teenager Forever", link: "/posts/annals/2024" }],
      },
      {
        text: "DiaryGo",
        collapsed: true,
        items: [
          { text: "250207 构建之法", link: "/posts/notes/goujianzhifa" },
          { text: "250208 AI与中年人", link: "/posts/notes/AI&MiddleAged" },
          { text: "250313 元宵夜游", link: "/posts/notes/fireFlower/fireFlower" },
          { text: "250313 玉兰开了", link: "/posts/notes/yuLan/yuLan" },
          { text: "250504 金榜题名之后", link: "/posts/notes/JBTM" },
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
          {
            text: "CSS设计中的缺陷列表",
            link: "/posts/recording/mistakesOfCSS",
          },
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
          {
            text: "作业",
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
            text: "实验",
            collapsed: true,
            items: [
              {
                text: "[转载] 操作系统上机实验 1",
                link: "/posts/os/experiment/Q_ex_1/sys-1",
              },
              {
                text: "[转载] 操作系统上机实验 2",
                link: "/posts/os/experiment/Q_ex_2/sys-2",
              },
            ],
          },
        ],
      },
      {
        text: "软件工程",
        collapsed: true,
        items: [
          {
            text: "归纳",
            collapsed:true,
            items:[
              { text: "软件工程导论", link: "/posts/software/summary/base" },
              { text: "敏捷开发", link: "/posts/software/summary/agile-development" },
              { text: "软件过程", link: "/posts/software/summary/process" },
              { text: "需求工程", link: "/posts/software/summary/demand`" },
            ]
          },
          {
            text: "实验",
            collapsed:true,
            items:[
              { text: "实验1 消除坏味道代码", link: "/posts/software/experiment/bad-code" },
              { text: "实验2 TDD测试驱动开发", link: "/posts/software/experiment/TDD" },
            ]
          }
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
              {
                text: "错误处理",
                link: "/posts/FE/JavaScript/error-handling",
              },
              {
                text: "异步",
                link: "/posts/FE/JavaScript/async",
              },
              {
                text: "Generator",
                link: "/posts/FE/JavaScript/generator",
              },
              {
                text: "模块",
                link: "/posts/FE/JavaScript/module",
              },
              {
                text: "杂项",
                link: "/posts/FE/JavaScript/miscellaneous",
              },
            ],
          },
          {
            text: "Web API & 浏览器",
            collapsed: true,
            items: [
              {
                text: "交互：alert、prompt 和 confirm",
                link: "/posts/FE/webAPI/interaction",
              },
              {
                text: "Dom",
                link: "/posts/FE/webAPI/dom",
              },
              {
                text: "Event",
                link: "/posts/FE/webAPI/event",
              },
              {
                text: "UI事件",
                link: "/posts/FE/webAPI/UI-event",
              },
              {
                text: "表单和控件",
                link: "/posts/FE/webAPI/form-event",
              },
              {
                text: "加载资源和生命周期",
                link: "/posts/FE/webAPI/load",
              },
              {
                text: "事件循环：微任务和宏任务",
                link: "/posts/FE/webAPI/event-loop",
              },
            ],
          },
          {
            text: "包管理器",
            collapsed: true,
            items: [
              {
                text:"npm",
                collapsed:true,
                items:[
                  {
                    text: "关于 npm",
                    link: "/posts/FE/package/npm/basic",
                  }
                ]
              },
              {
                text:"yarn",
                collapsed:true,
                items:[
                  {
                  
                  }
                ]
              },
              {
                text:"pnpm",
                collapsed:true,
                items:[
                  {
                   
                  }
                ]
              },
            ],
          },
          {
            text: "模块化",
            collapsed: true,
            items: [],
          },
          {
            text: "DevTools",
            collapsed: true,
            items: [
              {
                text: "通用",
                link: "/posts/FE/DevTools/basic",
              },
              {
                text: "Console",
                link: "/posts/FE/DevTools/console",
              },
              {
                text: "Network",
                link: "/posts/FE/DevTools/network",
              },
              {
                text: "Elements",
                link: "/posts/FE/DevTools/elements",
              },
              {
                text: "Drawer",
                link: "/posts/FE/DevTools/drawer",
              },
              {
                text: "Workspace",
                link: "/posts/FE/DevTools/workspace",
              },
            ],
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
            items: [
              {
                text: "Intro",
                link: "/posts/FE/typescript/intro",
              },
              {
                text: "环境搭建tip",
                link: "/posts/FE/typescript/environment",
              },
              {
                text: "原始类型和对象类型",
                link: "/posts/FE/typescript/datatype",
              },
              {
                text: "函数类型与重载",
                link: "/posts/FE/typescript/functype",
              },
              {
                text: "Class",
                link: "/posts/FE/typescript/class",
              },
              {
                text: "any、unknown类型与类型断言",
                link: "/posts/FE/typescript/any",
              },
              {
                text: "泛型",
                link: "/posts/FE/typescript/generics",
              },
              {
                text: "类型声明",
                link: "/posts/FE/typescript/typedec",
              },
              {
                text: "类型别名、联合类型与交叉类型",
                link: "/posts/FE/typescript/typealias",
              },
              {
                text: "内置工具类型",
                link: "/posts/FE/typescript/utiltype",
              },
              {
                text: "模板字符串类型",
                link: "/posts/FE/typescript/temstring",
              },
              {
                text: "从 JS 迁移到 TS",
                link: "/posts/FE/typescript/migration",
              },
              {
                text: "使用 TS 开发 npm 包",
                link: "/posts/FE/typescript/npmdev",
              },
            ],
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
                text: "VitePress Easyuse",
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
        items: [
          {
            text: "Frontalk 首页",
            link: "/posts/frontalk/index",
          },
          {
            text: "Frame 和 window",
            link: "/posts/frontalk/frame",
          },
          {
            text: "处理二进制数据/文件",
            link: "/posts/frontalk/binary",
          },
          {
            text: "动画",
            link: "/posts/frontalk/animation",
          },
          {
            text: "浏览器存储",
            link: "/posts/frontalk/cache",
          },
          {
            text: "Web Components",
            link: "/posts/frontalk/web-components",
          },
          {
            text: "网络请求",
            link: "/posts/frontalk/requests",
          },
          {
            text: "正则表达式",
            link: "/posts/frontalk/reg-expression",
          },
        ],
      },
      {
        text: "Problems & Solutions",
        collapsed: true,
        items: [
          {
            text: "Javascript",
            collapsed: true,
            items: [
              {
                text: "Sushi JavaScript",
                link: "/posts/problems/Javascript/sushi-JS",
              },
            ],
          },
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
