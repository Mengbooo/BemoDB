import { defineConfig } from 'vitepress'

const base = "/BemoDB/"; 

export default {
  // 基础路径
  base,
  // 站点级选项
  title: "BemoDB", // 网站标题
  themeConfig: {
    logo: '/logo.jpg',
    // 主题级选项
    nav: [
      { text: "关于", link: "/about" },
      {
        text: "大前端",
        items: [
          { text: "html", link: "/bigFrontEnd/html/" },
          { text: "css", link: "/bigFrontEnd/css/" },
          { text: "js", link: "/bigFrontEnd/js/" },
        ],
      },
    ],
    sidebar: {
      "/bigFrontEnd/html/": {
        text: "html",
        items: [
          { text: "html", link: "/bigFrontEnd/html/" },
          { text: "html1", link: "/bigFrontEnd/html/html1" },
          { text: "html2", link: "bigFrontEnd/html/html2" },
        ],
      },
      "/bigFrontEnd/css/": {
        text: "css",
        items: [
          { text: "css1", link: "/bigFrontEnd/css/css1" },
          { text: "css2", link: "/bigFrontEnd/css/css2" },
        ],
      },
      "/bigFrontEnd/js/": {
        text: "js",
        items: [
          { text: "js1", link: "/bigFrontEnd/js/js1" },
          { text: "js2", link: "/bigFrontEnd/js/js2" },
        ],
      },
    },
    head: [
      // 配置网站的图标（显示在浏览器的 tab 上）
      ["link", { rel: "jpg", href: '/logo.jpg`'}],
    ],
  },
};
