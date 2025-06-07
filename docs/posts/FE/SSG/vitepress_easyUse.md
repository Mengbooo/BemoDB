---
title: Vitepress EasyUse
date: '2025-06-07'
tags:
- FE
---

# Vitepress EasyUse

VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。我自己的博客也是基于它来搭建的，这里分享一下如何快速搭建Vitepress的开发环境。

## Why Vitepress？

在正式介绍如何搭建之前，我们来讨论一下为什么要用 Vitepress：

从我个人使用体感来简单总结一下就是：

- Vite极快的冷启动和热更新能保证所写即所见（除非你修改了config导致服务器重启）

- 依托于 [markdown-it](https://markdown-it.github.io/) 作为md渲染器和 [Shiki](https://github.com/shikijs/shiki) 实现高亮，提供了丰富的配置项和多样的写作格式，特别是代码块中的高级功能。

- 可以在 Markdown 中使用任何 Vue 功能:包括动态模板、使用 Vue 组件或通过添加 `<script>` 标签为页面的 Vue 组件添加逻辑。这对于 Vue 开发者非常友好 —— 完全可以自己拓展 （ 这是因为每个 Markdown 文件都被编译成 HTML，而且将其作为 Vue 单文件组件处理）

- 相较于其它 SSG ，例如 Hexo 、Hugo，它的指令更简单，和 Vue 项目差不多。

## 开始搭建吧

可以直接在 [StackBlitz](https://stackblitz.com/edit/vite-bam9djjs?file=docs%2Findex.md) 上进行在线尝试，这里已经 fork 了一个 Vitepress template

### 准备

- Node.js 版本 >= 18
- CLI
- Vscode

### 初始化

VitePress 附带一个命令行设置向导，可以帮助你构建一个基本项目。安装后，通过运行以下命令启动向导：

``` shell
npx vitepress init
```

然后是简单的初始化问题，按需 Yes or No 即可

``` txt
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Where should VitePress look for your markdown files?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  docs
│
└  Done! Now run pnpm run docs:dev and start writing.
```

然后你得到的文件目录应该是：

``` txt
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  ├─ api-examples.md
│  ├─ markdown-examples.md
│  └─ index.md
└─ package.json
```

后面我们再逐一介绍各个文件夹下应该放什么。这里继续我们的配置：

还应该将以下 npm 脚本注入到 package.json 中：

``` json
{
  ...
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  },
  ...
}
```

可以使用 npx 调用 Vitepress 启动服务器：

``` shell
npx vitepress dev docs
```

如果你不想使用 npx 而是 npm 的话，那么需要下载一下 Vitepress 的依赖：

``` shell 
npm add -D vitepress
# or
npm i vitepress
```

> 这里说一下，如果开头不是用 npx 调用 Vitepress 初始化的话，那么就需要先 npm init 一下，下载 Vitepress 后执行 `npm vitepress init`，其它包管理器同理

然后我们就能 `npm run dev` 启动服务器，查看我们的 Vitepress 界面了，目前还只显示 404

### 各个文件夹/文件是干什么的

``` txt
D:\Blog
├── .github
|  └── workflows
|     └── deploy.yml
├── code
|  ├── module
|  |  ├── CJS_Browser
|  |  ├── CJS_Node
|  |  └── IIFE
|  └── temp
├── docs
|  ├── .vitepress
|  |  ├── cache
|  |  ├── dist
|  |  ├── theme
|  |  └── config.ts
|  ├── posts
|  |  ├── algorithm
|  |  ├── annals
|  |  ├── csnet
|  |  ├── FE
|  |  ├── frontalk
|  |  ├── notes
|  |  ├── os
|  |  ├── problems
|  |  ├── recording
|  |  ├── research
|  |  └── software
|  ├── public
|  |  ├── bus.svg
|  |  ├── cat.png
|  |  ├── logo.jpg
|  |  └── webhook.ico
|  ├── doc.md
|  ├── index.md
|  └── nav.md
├── .gitignore
├── package.json
└── pnpm-lock.yaml
```

上面这是 BemoDB 的文件目录，我会根据它来讲讲各个文件夹的“责任”。

- `.github` 这个就是用来自动部署的

- `code` 学习时写的一些代码放这，之后再迁移

- `.gitignore/package.json/pnpm-lock.yaml` 无需多言

- `docs` Vitepress 的核心文件夹

  - `.vitepress` 配置文件夹

  - `posts/doc.md/index.md/nav.md` 文章，posts文件夹里都是md文件

  - `public` 图片资源

所以我们主要来介绍一下 `.vitepress` 文件夹：

``` txt
.vitepress
├── cache\deps
├── dist
├── theme
|  └── style
|     └── var.css
|  └── index.ts
└── config.ts
```

其中，默认情况下，VitePress 将其开发服务器缓存存储在 `.vitepress/cache` 中，并将生产构建输出存储在 `.vitepress/dist` 中。如果使用 Git，应该注意将它们添加到 `.gitignore` 文件中。

theme/style 文件夹中的 `var.css` 则是用来定义全局样式的。

而 `index.ts` 则是用来配置主题（同时也可以用来配置全局组件）belike；

``` typescript
import Theme from "vitepress/theme";
import "./style/var.css";
import imageViewer from "vitepress-plugin-image-viewer";
import vImageViewer from "vitepress-plugin-image-viewer/lib/vImageViewer.vue";
import { useRoute } from "vitepress";

export default {
  ...Theme,
  enhanceApp(ctx) {
    Theme.enhanceApp(ctx);
    ctx.app.component("vImageViewer", vImageViewer);
  },
  setup() {
    const route = useRoute();
    imageViewer(route);
  },
};
```

而 `config.ts` 则用以站点级配置和主题级配置如：

``` typescript
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "temp",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
```

## 接着开发

在清楚各个文件夹的职能后我们可以正式搭建几个必需的部分了。

### 首页

一般我们用 index.md 文件代表首页。

Vitepress 提供了三个 Layout 布局给我们，分别是 `doc|home|page` 这里我们需要使用 page ；

Hero 部分由标题、图片、描述、标签、选项卡组成，interface 为

``` typescript
interface Hero {
  // `text` 上方的字符，带有品牌颜色
  // 预计简短，例如产品名称
  name?: string
  // hero 部分的主要文字，
  // 被定义为 `h1` 标签
  text: string
  // `text` 下方的标语
  tagline?: string
  // text 和 tagline 区域旁的图片
  image?: ThemeableImage
  // 主页 hero 部分的操作按钮
  actions?: HeroAction[]
}
```

然后就是 Feature 部分，它的 interface 为

``` typescript
interface Feature {
  // 在每个 feature 框中显示图标
  icon?: FeatureIcon
  // feature 的标题
  title: string
  // feature 的详情
  details: string
  // 点击 feature 组件时的链接，可以是内部链接，也可以是外部链接。
  link?: string
  // feature 组件内显示的链接文本，最好与 `link` 选项一起使用
  linkText?: string
  // `link` 选项的链接 rel 属性
  rel?: string
  // `link` 选项的链接 target 属性
  target?: string
}
```

示例：

``` 
--- txt
layout: home
hero:
  name: Bolaxious 的文档库
  textsuffix: 'Theme'
  text: Bolaxious's documentation library
  tagline: 代码 · 艺术 · 游戏 · 生活
  image:
    src: cat.png
    alt: 小猫跑了
  actions:
    - theme: brand
      text: 文档
      link: /doc
    - theme: alt
      text: Github
      link: https://github.com/mengbooo
    - theme: brand
      text: Bemosite
      link: https://bemosite.fun/
features:
  - icon: 🛠️
    title: 关于网站
    details: 123
    link: /doc
    linkText: 文章
  - icon: ⚡️
    title: 关于Bolaxious
    details: 321
  - icon: 🌞
    title: Another cool feature
    details: 123
---
```

### 导航栏

Nav 是显示在页面顶部的导航栏。它包含站点标题、全局菜单链接等。它是通过 `.vitepress/config.ts` 配置的


``` typescript
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
})
```

### 站点标题和图标

也就是页面右上角的 Logo 和 文字，在 themeConfig 中添加 logo 和 siteTitle 字段即可

``` typescript
import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "My VitePress Demo Project",
  description: "This is my VitePress demo project",
  themeConfig: {
    logo: '/ext.svg',
    siteTitle: 'Project SitTitle',
  }
})
```

### 侧边栏

首先需要创建 md 文件，位置在 docs 文件夹下，但是建议新建一个 posts 文件夹用来存放所有文章 belike：

``` txt
docs
├── posts
│   ├── api
│   │   ├── api1.md
│   │   ├── api2.md
│   │   └── index.md
│   ├── basic
│   │   ├── basic1.md
│   │   ├── basic2.md
│   │   └── index.md
│   ├── core
│   │   ├── core1.md
│   │   ├── core2.md
│   │   └── index.md
│   ├── summarize
│   │   ├── index.md
│   │   ├── summarize1.md
│   │   └── summarize2.md
│   ├── teach
│   │   ├── index.md
│   │   ├── teach1.md
│   │   └── teach2.md
│   └── team
│       ├── index.md
│       ├── team1.md
│       └── team2.md
```

我们需要配置一下侧边栏才能访问到这些文章：

``` typescript
import { defineConfig } from 'vitepress'
export default defineConfig({
  title: "My VitePress Demo Project",
  description: "This is my VitePress demo project",
  appearance: false,
  themeConfig: {
    ...,
    sidebar: [
      {
        text: '基础篇',
        items: [
          { text: '基础篇', link: '/basic/index' },
          { text: '基础篇1', link: '/basic/basic1' },
          { text: '基础篇2', link: '/basic/basic2' }
        ]
      },
      {
        text: 'API 篇',
        items: [
          { text: 'API篇', link: '/api/index' },
          { text: 'API篇1', link: '/api/api1' },
          { text: 'API篇2', link: '/api/api2' }
        ]
      },
      {
        text: '核心篇',
        items: [
          { text: '核心篇', link: '/core/index' },
          { text: '核心篇1', link: '/core/core1' },
          { text: '核心篇2', link: '/core/core2' }
        ]
      },
      {
        text: '教学篇',
        items: [
          { text: '教学篇', link: '/teach/index' },
          { text: '教学篇1', link: '/teach/teach1' },
          { text: '教学篇2', link: '/teach/teach2' }
        ]
      },
      {
        text: '总结篇',
        items: [
          { text: '总结篇', link: '/summarize/index' },
          { text: '总结篇', link: '/summarize/summarize1' },
          { text: '总结篇', link: '/summarize/summarize2' }
        ]
      },
      {
        text: '团队篇',
        items: [
          { text: '团队篇', link: '/team/index' },
          { text: '团队篇', link: '/team/team1' },
          { text: '团队篇', link: '/team/team2' }
        ]
      }
    ],
  }
})
```

这样，你就能访问到对应的文章了

## 总结

我们现在有了一个主页，还有了一个可以访问所有文章的文档页，这样其实能基本满足它作为文档的作用了。

下一步：

- 想要进一步了解 Markdown 文件是怎么映射到对应的 HTML，请继续阅读[路由指南](https://vitepress.dev/zh/guide/routing)。

- 要了解有关可以在页面上执行的操作的更多信息，例如编写 Markdown 内容或使用 Vue 组件，请参见指南的“编写”部分。一个很好的起点是了解 [Markdown 扩展](https://vitepress.dev/zh/guide/markdown)。

- 要探索默认文档主题提供的功能，请查看[默认主题配置参考](https://vitepress.dev/zh/reference/default-theme-config)。

- 如果想进一步自定义站点的外观，参见[扩展默认主题](https://vitepress.dev/zh/guide/extending-default-theme)或者[构建自定义主题](https://vitepress.dev/zh/guide/custom-theme)。

- 文档成形以后，务必阅读[部署指南](https://vitepress.dev/zh/guide/deploy)。

































































































































































