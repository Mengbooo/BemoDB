# JavaScript 篇

::: tip Todo
复健 JavaScript|ES6+ 

产出一些文章
:::
## 语言简介
JavaScript 的确是一门非常强大和伟大的语言，虽然它的“特性”非常多。JavaScript 最初被创建的目的是“使网页更生动”。这种编程语言写出来的程序被称为 脚本。它们可以被直接写在网页的 HTML 中，在页面加载的时候自动执行：脚本被以纯文本的形式提供和执行。它们不需要特殊的准备或编译即可运行。

现在，JavaScript 只需要有运行时/JS引擎即可运行，它的运用场景变得越来越大——我的舍友Q最近在学Python爬虫相关知识，前两天说要学JavaScript：因为他需要去做逆向。

JavaScript 的能力很大程度上取决于它运行的环境。例如，Node.js 支持允许 JavaScript 读取/写入任意文件，执行网络请求等的函数、浏览器中的JavaScript则能处理极大部分交互。

## 参考规范
ECMA-262 规范 包含了大部分深入的、详细的、规范化的关JavaScript 的信息。这份规范明确地定义了这门语言。

## 参考手册
- MDN（Mozilla）JavaScript 索引 是一个带有用例和其他信息的主要的手册
- JavaScript Info 也就是我正在学习的这个教程
- 阮一峰的JavaScript/ES6+教程
- JavaScript Tutorial （看起来比较全面，不过我粗略的看了一遍似乎没有找到 ES6+ 后面的部分内容，例如async/await

## 兼容性
JavaScript 是一门还在发展中的语言，定期会添加一些新的功能。

要查看它们在基于浏览器的引擎及其他引擎中的支持情况：

- https://caniuse.com —— 每个功能的支持表，例如，查看哪个引擎支持现代加密（cryptography）函数：https://caniuse.com/#feat=cryptography。
- https://kangax.github.io/compat-table —— 一份列有语言功能以及引擎是否支持这些功能的表格。

## IDE
- Cursor OR VScode
- WebStorm （我不用，但是据说个人用户免费了）

## 插件
- Prettier
- Snippets
- ··· 有需要就下载


## DevTools
无论你用的是Chrome还是Edge（或者FireFox）右键应该都能看到“检查”（或者点F12），打开就是开发者工具，能清楚的看到 警告|报错|输出 信息。关于详细信息，我们在 `在浏览器中调试`或者我博客的DevTools部分再去详细说明 （虽然我还没写，虽然我不知道会不会写😭😭😭）