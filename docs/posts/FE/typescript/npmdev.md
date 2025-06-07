---
title: 使用 TS 开发 npm 包
date: '2025-06-07'
tags:
- FE
---

# 使用 TS 开发 npm 包

在使用 JavaScript 进行 npm 包开发时，基本上不需要任何额外的编译和配置——即使你使用了非常新的语法，也只需要使用者更新到与你一致的 NodeJs 版本即可，而在本地开发阶段，也只需要使用一个 node 命令即可。

但使用 TypeScript 就不一样了，你现在需要关心如何在本地调试，发布前需要构建，还得确认好构建配置...

为什么我们要用 TypeScript 来开发 npm 包？

首先最重要的一点，一定是对开发者与使用者的类型提示。

> 即使你是在 JavaScript 工程中引用 TypeScript 编写的包，只要配置了 TypeScript 开发环境，也一样能够享受到这些基于类型的辅助能力。

另外一个重要的原因则是，此前如果你希望使用 NodeJs 19 才支持的语法编写包，但使用者的 NodeJs 版本只需要大于 14 版本即可，此时你需要引入 Babel / Rollup 这样的编译工具来做一次语法降级，Babel 的配置略显繁琐，简单场景上 Rollup 又像高射炮打蚊子

这个时候 TypeScript 自带的语法降级能力就香起来了：只需要简单的几行配置就够用，还带类型，还带简单的 Lint 能力...何乐而不为？

因此在这一节，我们会从头学习如何基于 TypeScript 来编写 + 发布一个 npm 包，包括环境搭建、本地调试、编译配置以及发布等等。

## 环境搭建

我们可以只用 TS 和 esno （一个用来执行 TS 文件的工具）来搭一个极简的环境，我们也可以加上 Lint 配置和发布工具。

本地开发方面，由于 NodeJs 不能直接执行 TS 文件，我们需要 esno 的帮助，它是一个基于 ESBuild 的执行工具，借助 ESBuild 闪电般的速度，首先编译 TS 文件然后再使用 Node 执行。你可能会想，但是 ESBuild 不支持类型检查吧？不用担心，VS Code 本地有类型检查，加上我们发布前仍然会使用 tsc 进行编译。

你可以全局安装 esno，或者使用 npx 来执行它：

``` bash 
$ npm i esno -g
$ esno ./src/index.ts

$ npx esno ./src/index.ts
```

而在日常开发时，我们往往会需要频繁地修改然后执行，不断查看代码的输出和表现。在日常的网页开发中，Webpack Dev Server 已经帮我们很好地处理了这个需要，使用 JavaScript 开发 NodeJs 应用时你可能也习惯了 nodemon，那么 TypeScript 下我们应该怎么做？

首先，你仍然可以使用 nodemon，我们习惯的 nodemon index.js 只是它最基本的用法，你其实可以自由地配置文件的执行程序，以及监听哪些文件等等，我们全局安装 nodemon：

``` bash 
npm i nodemon -g
```

然后在 package.json 中进行配置：

``` json 
{
  "nodemonConfig": {
    "delay": 500,
    "env": {
      "NODE_ENV": "development"
    },
    "execMap": {
      "ts": "esno",
      "js": "node"
    },
    "ignore": ["node_modules"],
    "verbose": true
  },
}
```

这样一来，在你执行 `nodemon index.ts` 时，就能够自动使用 `esno` 来执行 `ts` 文件了。

编译配置方面，由于此前我们已经学习过了常用的 `TSConfig` 配置项，这里只要再复习下和 npm 包开发的几个配置，即 `target、module、lib、outDir` 这几个控制编译产物表现的配置即可。以模板中的配置文件为例：

``` json 
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ES2015",
    "types": [],
    "outDir": "dist", // 输出到 dist 目录下
    "skipLibCheck": true,
    "moduleResolution": "node",
    "strictNullChecks": true, // 开启严格检查
    "declaration": true, // 输出声明文件
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedParameters": false,
    "noUnusedLocals": false,
    "esModuleInterop": true, // ESM 与 CJS 相关，推荐开启来解决大部分问题
    "allowSyntheticDefaultImports": true, // ESM 与 CJS 相关，推荐开启来解决大部分问题
    "baseUrl": "."
  }
}
```

注意，由于 npm 包需要你手动指定入口，记得确保 outDir 与 package.json 中的 main 指向是一致的：

``` json 
{
  "main": "./dist/index.js"
}
```

以及，还记得 TypeScript 的构建产物会有哪些吗？.js 文件和 .d.ts 文件！在开发一个 npm 包时，我们需要指定这个包的入口文件，虽然 Node 会自动查找 npm 包下的 index.js 文件，但有些时候我们发布的包并不会是符合默认查找规则的结构，此时就需要你通过 main 字段指定一下：

``` json 
{
  "main": "./dist/index.js"
}
```

类似的，类型声明也是如此，通常我们推荐使用 types 字段来指定你的类型声明入口——不用担心其它没被指定的类型声明文件怎么办，TypeScript 会收集所有的声明文件，然后按照这个入口声明文件的导入关系来加载这些类型声明。

``` json 
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
}
```

发布方面，又出现了基于风格的选择。你可以使用包管理器的 publish 命令，也可以使用 release-it 这样的工具。唯一的区别在于，你是想“修改下版本，把它发布到 npm 仓库”，还是希望“基于版本变更的大小自动升级版本，然后将它发布到 npm 仓库，同时基于版本信息生成 git tag，基于 commit 信息生成 CHANGELOG...”？

对于新手同学，只需要了解第一种方式，以及 patch / minor / major 三种类型变更的定义即可。但如果你希望追求更高质量的 npm 包，还是强烈建议你了解一下各个大型开源项目的发布流程是怎样的，它们是如何确保高质量发布的？

首先，patch 版本，即 1.0.0 到 1.0.1 ，表示一个微小的变更，如 bugfix 与安全漏洞，这个变更不影响使用者，使用者也完全无需感知。而 minor 版本，即 1.0.0 到 1.1.0，表示一个向下兼容的新功能发布，使用者可以升级到 1.1.0 版本的同时保持 1.0.0 的使用方式，这个变更不会破坏项目运行。最后则是 major 版本，即 1.0.0 到 2.0.0，它代表着一个大型的新版本发布，出现了破坏性变更，因此如果你升级到了 2.0.0，此前有一部分代码就无法工作，而是需要使用新写法了，或者移除废弃的 API 了。

这里我们只需要遵守变更规范，然后按照规范手动修改版本号即可。而发布前，我们通常需要确保进行过一次编译，避免说自己本地调试通过了，就直接发布，结果发布的还是上一次编译的代码。要实现这种效果，你可以使用 npm scripts 中的 prepublish：

``` json 
{
  "scripts": {
    "build": "tsc",
    "prepublish": "npm run build"
  }
}
```

这样在你执行 npm publish 时，npm 会自动帮你执行一次构建工作，就不需要担心自己忘记构建，错误发布老的代码了。

总结一下，完整的 package.json 配置会是这样的：

``` json 
{
  "name": "your-lib",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "prepublish": "npm run build"
  },
  "nodemonConfig": {
    "delay": 500,
    "env": {
      "NODE_ENV": "development"
    },
    "execMap": {
      "ts": "esno",
      "js": "node"
    },
    "ignore": ["node_modules"],
    "verbose": true
  },
  "dependencies": { },
  "devDependencies": { },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```














































































































































































