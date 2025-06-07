---
title: Typescript 开发环境搭建
date: '2025-06-07'
tags:
- FE
---

# Typescript 开发环境搭建

我们只需要非常简单的配置就能完成 TypeScript 开发环境的搭建。

## IDE
::: tip
这里使用的IDE是Vscode
:::

`设置 > 工作区 > 搜索typescript > 开始配置`

推荐开启的配置项主要是这几个：

- `Function Like Return Types`，显示推导得到的函数返回值类型；

- `Parameter Names`，显示函数入参的名称；

- `Parameter Types`，显示函数入参的类型；

- `Variable Types`，显示变量的类型。

这些配置的主要能力就是把参数名，参数类型，以及推导得到的类型等等信息直接展示在屏幕上，否则你就需要悬浮鼠标在代码上来查看这些信息了。

这其实基本上就配置完前期需要的配置项了

## TypeScript Playground
本地的代码开发环境是最重要的。但有时候，如果我们在敲代码的时候遇到了问题，需要求助他人，如何让好心人看到我们的代码呢？截图？还是整个文件甚至整个项目发过去？认真地说，这是一种对双方都不利的行为，对于被求助的人来说，很难有愉悦的心情配置环境，安装依赖，再在一个项目里找寻那一两处问题，而对于求助者来说，可能就丧失了正确进行提问的能力。更推荐的方式是使用 Web IDE，比如 CodeSandbox.

对于 TypeScript，如果你需要粘贴 TypeScript 代码进行求助，其实还有一个更好的选择——TypeScript 官方提供的 [TypeScript Playground](https://www.typescriptlang.org/play/)：

在你编写代码后，URL 会自动更新，将代码信息保存到地址上，因此你同样可以通过链接分享来快速地共享代码。

我们来简单地介绍一下它的功能，主要是检查、配置以及编译执行这么几个能力。首先是检查，与 VS Code 中的类型检查一致，TypeScript Playground 中也能进行类型检查：

同时，由于某些检查行为其实和 TS 的配置项有关，在 Playground 中你可以通过上方的 TS Config ，来配置相关的信息。关于 TS 的配置项，我们在后面也会介绍到。而需要说明的是，如果你是将本地代码粘贴上来后发现表现不一致，可能就是配置项和 TS 版本的差异导致的。你可以在左上角调整 Playground 使用的 TS 版本。

同时，Playground 中也能够直接查看编译后的 JS 代码

## Hello，World

现在，我们就可以在配置完毕的环境里写下我们的第一行 Hello World 了！就像你初学 JavaScript 时写下的那行代码一样，这句 Hello World 会为你打开新世界的大门：

``` typescript
const message: string = 'Hello World!';

console.log(message);
```

诶，这个时候你可能会想，当我们初学 JavaScript 时，通常会使用浏览器控制台或 NodeJs 来执行第一个 Hello World，那 TypeScript 并不能在浏览器中直接执行，我们又该如何见证第一个 Hello World 成功运行？前面我们已经说过，TS 文件会在编译后得到 JS 文件，也就是说我们可以先编译后再进行执行——但这样会不会太麻烦了？此时我们可以使用来自社区的 npm 包 esno：

``` typescript
$ npx esno index.ts

Hello World!
```

## 关于 Typescript 的编译能力

严格来说，TypeScript 提供的编译能力和 Webpack 并不是一个维度的，它只能进行语法降级和类型定义的生成，而不能实现代码压缩，代码分割， Tree Shaking（移除未使用到的代码）以及 Plugin 体系等。

但即便如此，TypeScript 也提供了相当数量的配置项。而在这一节，我们就会来学习 TypeScript 中使用相对高频的一系列配置项。

按照这些配置的能力来划分，可以分为`产物控制、输入与输出控制、类型声明、代码检查几大类`，你并不需要每次创建新项目都把它们配置一遍，按照自己的实际需求进行微调即可。

### 产物控制

首先是产物控制部分，这也是通常配置最频繁的部分，主要是 `target` 与 `module` 这两个配置项，它们分别`控制产物语法的 ES 版本`以及`使用的模块`（CommonJs / ES Module），我们来看看同一段代码在这两个配置组合下会被编译成什么样子，以此来更直观地了解它们的作用：

``` typescript
const arr = [1, 2, 3];

for (let i of arr) {
  console.log(i);
}

const obj = {
  a: 1,
  b: 2,
  c: 3
};

for (let key in obj) {
  console.log(key);
}
```

这段代码在 target ES6 和 target ES5 下的编译产物如下：

``` typescript
// ES6
"use strict";
const arr = [1, 2, 3];
for (let i of arr) {
    console.log(i);
}
const obj = {
    a: 1,
    b: 2,
    c: 3
};
for (let key in obj) {
    console.log(key);
}

// ES5
"use strict";
var arr = [1, 2, 3];
for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
    var i = arr_1[_i];
    console.log(i);
}
var obj = {
    a: 1,
    b: 2,
    c: 3
};
for (var key in obj) {
    console.log(key);
}
```

需要注意的是，如果我们的 target 指定了一个版本，比如 es5，但你又希望使用 es6 中才有的 `Promise` 语法，此时就需要在 lib 配置项中新增 '`es2015.promise`'，来告诉 TypeScript 你的目标环境中需要启用这个能力，否则就会得到一个错误：

``` typescript
const handler = async () => {};
```

::: warning
异步函数或方法必须返回 “Promise”。请确保具有对 “Promise” 的声明或在 “--lib” 选项中包含了 “ES2015”。ts(2697)
:::

配置方式如下：

``` json
// 📂 tsconfig.json

{
  "compilerOptions": {
    "lib": ["ES2015"],
    "target": "ES5"
  }
}
```

除了 target 以外，module 配置项也会造成编译产物的差异：

``` typescript
export const foo = "foo";

export function bar() {
  console.log("bar");
}

// module 配置为 CommonJs
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bar = exports.foo = void 0;
exports.foo = "foo";
function bar() {
    console.log("bar");
}
exports.bar = bar;


// module 配置为 ESNext
export const foo = "foo";

export function bar() {
  console.log("bar");
}
```

### 输入控制

TypeScript 怎么知道哪些代码是需要进行处理的？输出的文件放到哪里？这就是我们主要的关注点了

在 TypeScript 中，我们首先使用 include 和 exclude 这两个配置项来确定要包括哪些代码文件，再通过 outDir 选项配置你要存放输出文件的文件夹，比如你可以这么配置：

``` json
// 📂 tsconfig.json

{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "src/generated",
    "**/*.spec.ts"
  ]
}
```

首先通过 include ，我们指定了要包括 src 目录下所有的文件，再通过 exclude 选项，剔除掉已经被 include 进去的文件，包括 `src/generated` 文件夹，以及所有 `.spec.ts` 后缀的测试用例文件。然后在完成编译后，你就可以在 `dist` 目录下找到编译产物了。

上面说到在使用高于当前 target 时的语法，需要在 lib 中显式添加这部分语法的类型声明，那么如果使用了来自外部 npm 包的类型声明呢？

在类型声明一节中我们已经学到，TypeScript 会加载所有 `node_modules` 中 所有 @types 文件夹下的声明文件，假设我们的项目中被三方依赖安装了大量的 `@types` 文件，导致类型加载缓慢或者冲突，此时就可以使用 `types 配置项`来显式指定你需要加载的类型定义：

``` json
// 📂 tsconfig.json

{
  "compilerOptions": {
    "types": ["node", "jest", "react"],
  }
}
```

以上配置会加载 `@types/node`，`@types/jest`，`@types/react` 这几个类型定义包。

### 类型相关的配置项

类型相关的配置项也是一个重要的组成部分，这里我们只挑几个使用频率最高的。

首先是 `declaration` ，它的作用就一个 —— 控制是否生成 .d.ts 文件，如果禁用的话你的编译产物将只包含 JS 文件，与之相对的是 `emitDeclarationOnly` ，如果启用，则只会生成 .d.ts 文件，而不会生成 JS 文件，如果你两个都不想要呢？—— 请使用 `noEmit` ！启用后将不会输出 JS 文件与声明文件，但类型检查能力还是能保留的。

你可能会想，这些配置有啥用？如果你的项目只使用 TS，那可能确实作用寥寥。但很多时候，为了追求编译时的性能优化，我们可能会将 tsc 和其它编译工具组合在一起。

比如，使用 Webpack 进行语法降级，只是使用 TS 来生成类型声明文件（此时就可以启用 emitDeclarationOnly），或进行类型检查（此时启用 noEmit）等等。

### 检查相关的配置

最后是检查相关的配置，即你看到的 `no-XXX` 格式的规则，我们简要介绍下其中主要的部分：

- `noImplicitAny`，当 TypeScript 无法推断出你这个变量或者参数到底是什么类型时，它只能默默给一个 any 类型。如果你的项目维护地还比较认真，可以启用这个配置，来检查看看代码里有没有什么地方是遗漏了类型标注的。

- `noUnusedLocals` 与 `noUnusedParameters`，类似于 ESLint 中的 no-unused-var，它会检查你的代码中是否有声明了但没有被使用的变量/函数。是否开启同样取决于你对项目质量的要求，毕竟正常情况下项目中其实不应该出现定义了但没有消费的变量，这可能就意味着哪里的逻辑出错了。

- `noImplicitReturns`，启用这个配置项会要求你的函数中所有分支代码块都必须有显示的 return 语句，我们知道 JavaScript 中不写 return （即这里的 Implicit Returns）和只写一个简单的 return 的效果是完全一致的，但从类型层面来说却不一致，它标志着你到底是没有返回值还是返回了一个 undefined 类型的值。因此，启用这个配置项可以让你确保函数中所有的分支都有一个有效的 return 语句，在那些分支层层嵌套的情况下尤其好用。








































































































