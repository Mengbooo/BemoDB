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






































































































































































