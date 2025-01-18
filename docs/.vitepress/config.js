const base = "/BemoDB/";

export default {
  // 基础路径
  base,
  // 站点级选项
  title: "BemoDB", // 网站标题
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
      { text: "归档", link: "/archive" },
      { text: "导航", link: "/nav" },
    ],
    sidebar: [
      {text: "文档首页", link: "/doc"},
      {
        text: "年记",
        collapsed: false,
        items: [
          { text: "2024:Teenager Forever", link: "/nianji/2024" },
        ],
      },
      {
        text: "随记",
        collapsed: false,
        items: [
          { text: "构建之法", link: "/suiji/goujianzhifa" },
        ],
      },
      {
        text: "小研究",
        collapsed: false,
        items: [
          { text: "Hello Halo —— 使用Halo搭建个人博客", link: "/xiaoyanjiu/halo" },
          { text: "subtick简谈", link: "/xiaoyanjiu/subtick" },
        ],
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2015-present Bolaxious",
    },
  },
};
