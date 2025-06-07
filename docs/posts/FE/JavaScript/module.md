---
title: 模块
date: '2025-06-07'
tags:
- FE
---

# 模块

随着我们的应用越来越大，我们想要将其拆分成多个文件，即所谓的“模块（module）”。一个模块可以包含用于特定目的的类或函数库。

很长一段时间，JavaScript 都没有语言级（language-level）的模块语法。这不是一个问题，因为最初的脚本又小又简单，所以没必要将其模块化。

但是最终脚本变得越来越复杂，因此社区发明了许多种方法来将代码组织到模块中，使用特殊的库按需加载模块。

列举一些（出于历史原因）：

- `AMD` —— 最古老的模块系统之一，最初由 require.js 库实现。
- `CommonJS` —— 为 Node.js 服务器创建的模块系统。
- `UMD` —— 另外一个模块系统，建议作为通用的模块系统，它与 AMD 和 CommonJS 都兼容。
现在，它们都在慢慢成为历史的一部分，但我们仍然可以在旧脚本中找到它们。

语言级的模块系统在 2015 年的时候出现在了标准（ES6）中（`ESM`），此后逐渐发展，现在已经得到了所有主流浏览器和 Node.js 的支持。因此，我们将从现在开始学习现代 JavaScript 模块（module）。

## 模块 (Module) 简介

一个模块（module）就是一个文件。一个脚本就是一个模块。就这么简单。

模块可以相互加载，并可以使用特殊的指令 export 和 import 来交换功能，从另一个模块调用一个模块的函数：

- `export` 关键字标记了可以从当前模块外部访问的变量和函数。
- `import` 关键字允许从其他模块导入功能。

例如，我们有一个 sayHi.js 文件导出了一个函数：

``` javascript
// 📁 sayHi.js
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}
```

……然后另一个文件可能导入并使用了这个函数：

``` javascript
// 📁 main.js
import { sayHi } from './sayHi.js';

alert(sayHi); // function...
sayHi('John'); // Hello, John!
```

import 指令通过相对于当前文件的路径 `./sayHi.js` 加载模块，并将导入的函数 `sayHi` 分配（assign）给相应的变量。

让我们在浏览器中运行一下这个示例。

由于模块支持特殊的关键字和功能，因此我们必须通过使用 `<script type="module">` 特性（attribute）来告诉浏览器，此脚本应该被当作模块（module）来对待。

像这样：
``` javascript
// 📁 sayHi.js
export function sayHi(user) {
  return `Hello, ${user}!`;
}
```
``` html
<!-- 📁 index.html -->
<!doctype html>
<script type="module">
  import {sayHi} from './say.js';

  document.body.innerHTML = sayHi('John');
</script>
```

浏览器会自动获取并解析（evaluate）导入的模块（如果需要，还可以分析该模块的导入），然后运行该脚本。

::: warning 模块只通过 HTTP(s) 工作，而非本地
如果你尝试通过 file:// 协议在本地打开一个网页，你会发现 import/export 指令不起作用。你可以使用本地 Web 服务器，例如 `static-server`，或者使用编辑器的“实时服务器”功能，例如 VS Code 的 `Live Server Extension` 来测试模块。
:::

### 模块核心功能

与“常规”脚本相比，模块有什么不同呢？

下面是一些核心的功能，对浏览器和服务端的 JavaScript 来说都有效。

#### 始终使用 “use strict”

模块始终在严格模式下运行。例如，对一个未声明的变量赋值将产生错误（译注：在浏览器控制台可以看到 error 信息）。

``` html
<script type="module">
  a = 5; // error
</script>
```

#### 模块级作用域

每个模块都有自己的`顶级作用域（top-level scope）`。换句话说，一个模块中的顶级作用域变量和函数在其他脚本中是不可见的。

在下面这个例子中，我们导入了两个脚本，`hello.js` 尝试使用在 `user.js` 中声明的变量 `user`。它失败了，因为它是一个单独的模块（你在控制台中可以看到报错）：
``` html
<!doctype html>
<script type="module" src="user.js"></script>
<script type="module" src="hello.js"></script>
```
``` javascript
// 📁 user.js
let user = "John";
```
``` javascript
// 📁 hello.js
alert(user); // no such variable (each module has independent variables)
```

模块应该 export 它们想要被外部访问的内容，并 import 它们所需要的内容。

- `user.js` 应该导出 user 变量。
- `hello.js` 应该从 user.js 模块中导入它。

换句话说，对于模块，我们使用导入/导出而不是依赖全局变量。

这是正确的变体：

``` html
<!doctype html>
<script type="module" src="user.js"></script>
<script type="module" src="hello.js"></script>
```
``` javascript
// 📁 user.js
export let user = "John";
```
``` javascript
// 📁 hello.js
import {user} from './user.js';

document.body.innerHTML = user; // John
```

在浏览器中，对于 HTML 页面，每个 `<script type="module">` 都存在独立的顶级作用域。

下面是同一页面上的两个脚本，都是 type="module"。它们看不到彼此的顶级变量：

``` html
<script type="module">
  // 变量仅在这个 module script 内可见
  let user = "John";
</script>

<script type="module">
  alert(user); // Error: user is not defined
</script>
```

::: tip 请注意：
在浏览器中，我们可以通过将变量显式地分配给 `window` 的一个属性，使其成为窗口级别的全局变量。例如 `window.user = "John"`。

这样所有脚本都会看到它，无论脚本是否带有 `type="module"`。

也就是说，创建这种全局变量并不是一个好的方式。请尽量避免这样做。
::: 

#### 模块代码仅在第一次导入时被解析

如果同一个模块被导入到多个其他位置，那么它的代码只会执行一次，即在第一次被导入时。然后将其导出（export）的内容提供给进一步的导入（importer）。

只执行一次会产生很重要的影响，我们应该意识到这一点。

让我们看几个例子。

首先，如果执行一个模块中的代码会带来副作用（side-effect），例如显示一条消息，那么多次导入它只会触发一次显示 —— 即第一次：

``` javascript
// 📁 alert.js
alert("Module is evaluated!");
```
``` javascript
// 在不同的文件中导入相同的模块

// 📁 1.js
import `./alert.js`; // Module is evaluated!

// 📁 2.js
import `./alert.js`; // (什么都不显示)
```

第二次导入什么也没显示，因为模块已经执行过了。

这里有一条规则：顶层模块代码应该用于初始化，创建模块特定的内部数据结构。如果我们需要多次调用某些东西 —— 我们应该将其以函数的形式导出，就像我们在上面使用 `sayHi` 那样。

现在，让我们看一个更复杂的例子。

我们假设一个模块导出了一个对象：

``` javascript
// 📁 admin.js
export let admin = {
  name: "John"
};
```

如果这个模块被导入到多个文件中，**模块仅在第一次被导入时被解析，并创建 admin 对象，然后将其传入到所有的导入**。

所有的导入都只获得了一个唯一的 admin 对象：

``` javascript
// 📁 1.js
import { admin } from './admin.js';
admin.name = "Pete";

// 📁 2.js
import { admin } from './admin.js';
alert(admin.name); // Pete

// 1.js 和 2.js 引用的是同一个 admin 对象
// 在 1.js 中对对象做的更改，在 2.js 中也是可见的
```

正如你所看到的，当在` 1.js` 中修改了导入的 `admin` 中的 `name` 属性时，我们在 2.js 中可以看到新的 `admin.name`。

这正是因为该模块只执行了一次。生成导出，然后这些导出在导入之间共享，因此如果更改了 `admin` 对象，在其他导入中也会看到。

**这种行为实际上非常方便，因为它允许我们`“配置”`模块**。

换句话说，模块可以提供需要配置的通用功能。例如身份验证需要凭证。那么模块可以导出一个配置对象，期望外部代码可以对其进行赋值。

这是经典的使用模式：

1. 模块导出一些配置方法，例如一个配置对象。
2. 在第一次导入时，我们对其进行初始化，写入其属性。可以在应用顶级脚本中进行此操作。
3. 进一步地导入使用模块。

例如，`admin.js` 模块可能提供了某些功能（例如身份验证），但希望凭证可以从模块之外赋值到 `config` 对象：

``` javascript
// 📁 admin.js
export let config = { };

export function sayHi() {
  alert(`Ready to serve, ${config.user}!`);
}
```

这里，`admin.js` 导出了 `config` 对象（最初是空的，但也可能有默认属性）。

然后，在 `init.js` 中，我们应用的第一个脚本，我们从 `init.js` 导入了 `config` 并设置了 `config.user`：

``` javascript
// 📁 init.js
import { config } from './admin.js';
config.user = "Pete";
```

……现在模块 `admin.js` 已经是被配置过的了。

其他导入可以调用它，它会正确显示当前用户：

``` javascript
// 📁 another.js
import { sayHi } from './admin.js';

sayHi(); // Ready to serve, Pete!
```

#### import.meta  导入.meta

`import.meta` 对象包含关于当前模块的信息。

它的内容取决于其所在的环境。在浏览器环境中，它包含当前脚本的 URL，或者如果它是在 HTML 中的话，则包含当前页面的 URL。

``` html
<script type="module">
  alert(import.meta.url); // 脚本的 URL
  // 对于内联脚本来说，则是当前 HTML 页面的 URL
</script>
```

#### 在一个模块中，“this” 是 undefined

这是一个小功能，但为了完整性，我们应该提到它。

在一个模块中，顶级 `this` 是 `undefined。`

将其与非模块脚本进行比较会发现，非模块脚本的顶级 `this` 是全局对象：

``` html
<script>
  alert(this); // window
</script>

<script type="module">
  alert(this); // undefined
</script>
```

### 浏览器特定功能

与常规脚本相比，拥有 `type="module"` 标识的脚本有一些特定于浏览器的差异。

#### 模块脚本是延迟的

模块脚本 `总是` 被延迟的，与 `defer` 特性（在 脚本：async，defer 一章中描述的）对外部脚本和内联脚本（inline script）的影响相同。

也就是说：

- 下载外部模块脚本 `<script type="module" src="...">` 不会阻塞 HTML 的处理，它们会与其他资源并行加载。
- 模块脚本会等到 HTML 文档完全准备就绪（即使它们很小并且比 HTML 加载速度更快），然后才会运行。
- 保持脚本的相对顺序：在文档中排在前面的脚本先执行。

它的一个副作用是，模块脚本总是会“看到”已完全加载的 HTML 页面，包括在它们下方的 HTML 元素。

例如：

``` html
<script type="module">
  alert(typeof button); // object：脚本可以“看见”下面的 button
  // 因为模块是被延迟的（deferred，所以模块脚本会在整个页面加载完成后才运行
</script>

相较于下面这个常规脚本：

<script>
  alert(typeof button); // button 为 undefined，脚本看不到下面的元素
  // 常规脚本会立即运行，常规脚本的运行是在在处理页面的其余部分之前进行的
</script>

<button id="button">Button</button>
```

请注意：上面的第二个脚本实际上要先于前一个脚本运行！所以我们会先看到 undefined，然后才是 object。

这是因为模块脚本是被延迟的，所以要等到 HTML 文档被处理完成才会执行它。而常规脚本则会立即运行，所以我们会先看到常规脚本的输出。

当使用模块脚本时，我们应该知道 HTML 页面在加载时就会显示出来，在 HTML 页面加载完成后才会执行 JavaScript 模块，因此用户可能会在 JavaScript 应用程序准备好之前看到该页面。某些功能可能还无法使用。我们应该放置“加载指示器（loading indicator）”，或者以其他方式确保访问者不会因此而感到困惑。

#### Async 适用于内联脚本（inline script）

对于非模块脚本，async 特性（attribute）仅适用于外部脚本。异步脚本会在准备好后立即运行，独立于其他脚本或 HTML 文档。

对于模块脚本，它也适用于内联脚本。

例如，下面的内联脚本具有 async 特性，因此它不会等待任何东西。

它执行导入（fetch ./analytics.js），并在导入完成时运行，即使 HTML 文档还未完成，或者其他脚本仍在等待处理中。

这对于不依赖任何其他东西的功能来说是非常棒的，例如计数器，广告，文档级事件监听器。

``` html
<!-- 所有依赖都获取完成（analytics.js）然后脚本开始运行 -->
<!-- 不会等待 HTML 文档或者其他 <script> 标签 -->
<script async type="module">
  import {counter} from './analytics.js';

  counter.count();
</script>
```

#### 外部脚本

具有 `type="module"` 的外部脚本（external script）在两个方面有所不同：

1. 具有相同 `src` 的外部脚本仅运行一次：

``` html
<!-- 脚本 my.js 被加载完成（fetched）并只被运行一次 -->
<script type="module" src="my.js"></script>
<script type="module" src="my.js"></script>
```

2. 从另一个源（例如另一个网站）获取的外部脚本需要 CORS header，如我们在 Fetch：跨源请求 一章中所讲的那样。换句话说，如果一个模块脚本是从另一个源获取的，则远程服务器必须提供表示允许获取的 header `Access-Control-Allow-Origin`。

``` html
<!-- another-site.com 必须提供 Access-Control-Allow-Origin -->
<!-- 否则，脚本将无法执行 -->
<script type="module" src="http://another-site.com/their.js"></script>
```

默认这样做可以确保更好的安全性。

#### 不允许裸模块（“bare” module）

在浏览器中，import 必须给出相对或绝对的 URL 路径。没有任何路径的模块被称为“裸（bare）”模块。在 import 中不允许这种模块。

例如，下面这个 import 是无效的：

``` javascript
import {sayHi} from 'sayHi'; // Error，“裸”模块
// 模块必须有一个路径，例如 './sayHi.js' 或者其他任何路径
```

某些环境，像 Node.js 或者打包工具（bundle tool）允许没有任何路径的裸模块，因为它们有自己的查找模块的方法和钩子（hook）来对它们进行微调。但是浏览器尚不支持裸模块。

#### 兼容性，“nomodule”

旧时的浏览器不理解 type="module"。未知类型的脚本会被忽略。对此，我们可以使用 nomodule 特性来提供一个后备：

``` html
<script type="module">
  alert("Runs in modern browsers");
</script>

<script nomodule>
  alert("Modern browsers know both type=module and nomodule, so skip this")
  alert("Old browsers ignore script with unknown type=module, but execute this.");
</script>
```

### 构建工具

在实际开发中，浏览器模块很少被以“原始”形式进行使用。通常，我们会使用一些特殊工具，例如 Webpack，将它们打包在一起，然后部署到生产环境的服务器。

使用打包工具的一个好处是 —— 它们可以更好地控制模块的解析方式，允许我们使用裸模块和更多的功能，例如 CSS/HTML 模块等。

构建工具做以下这些事儿：

1. 从一个打算放在 HTML 中的 `<script type="module">` “主”模块开始。
2. 分析它的依赖：它的导入，以及它的导入的导入等。
3. 使用所有模块构建一个文件（或者多个文件，这是可调的），并用打包函数（bundler function）替代原生的 import 调用，以使其正常工作。还支持像 HTML/CSS 模块等“特殊”的模块类型。
4. 在处理过程中，可能会应用其他转换和优化：
   - 删除无法访问的代码。
   - 删除未使用的导出（“tree-shaking”）。
   - 删除特定于开发的像 console 和 debugger 这样的语句。
   - 可以使用 Babel 将前沿的现代的 JavaScript 语法转换为具有类似功能的旧的 JavaScript 语法。
   - 压缩生成的文件（删除空格，用短的名字替换变量等）。

如果我们使用打包工具，那么脚本会被打包进一个单一文件（或者几个文件），在这些脚本中的 `import/export` 语句会被替换成特殊的`打包函数（bundler function）`。因此，最终打包好的脚本中不包含任何 `import/export`，它也不需要 `type="module"`，我们可以将其放入常规的 `<script>`：

``` html
<!-- 假设我们从诸如 Webpack 这类的打包工具中获得了 "bundle.js" 脚本 -->
<script src="bundle.js"></script>
```

关于构建工具说了这么多，但其实原生模块也是可以用的。所以，我们在这儿将不会使用 Webpack：你可以稍后再配置它。

## 导出和导入

导出（export）和导入（import）指令有几种语法变体。

在上一节，我们看到了一个简单的用法，现在让我们来探索更多示例吧。

### 在声明前导出

我们可以通过在声明之前放置 `export` 来标记任意声明为导出，无论声明的是变量，函数还是类都可以。

例如，这里的所有导出均有效：

``` javascript
// 导出数组
export let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 导出 const 声明的变量
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// 导出类
export class User {
  constructor(name) {
    this.name = name;
  }
}
```

::: warning 导出 class/function 后没有分号
注意，在类或者函数前的 export 不会让它们变成 函数表达式。尽管被导出了，但它仍然是一个函数声明。

大部分 JavaScript 样式指南都不建议在函数和类声明后使用分号。

这就是为什么在 `export class` 和 `export function` 的末尾不需要加分号：

``` javascript
export function sayHi(user) {
  alert(`Hello, ${user}!`);
}  // 在这里没有分号 ;
```
:::

### 导出与声明分开

另外，我们还可以将 `export` 分开放置。

下面的例子中，我们先声明函数，然后再导出它们：

``` javascript
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export {sayHi, sayBye}; // 导出变量列表
```

……从技术上讲，我们也可以把 `export` 放在函数上面。

### Import *

通常，我们把要导入的东西列在花括号 `import {...}` 中，就像这样：

``` javascript
// 📁 main.js
import {sayHi, sayBye} from './say.js';

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
```

但是如果有很多要导入的内容，我们可以使用 `import * as <obj>` 将所有内容导入为一个对象，例如：

``` javascript
// 📁 main.js
import * as say from './say.js';

say.sayHi('John');
say.sayBye('John');
```

乍一看，“通通导入”看起来很酷，写起来也很短，但是我们通常为什么要明确列出我们需要导入的内容？

这里有几个原因。

1. 现代的构建工具（webpack 和其他工具）将模块打包到一起并对其进行优化，以加快加载速度并删除未使用的代码。

比如说，我们向我们的项目里添加一个第三方库 `say.js`，它具有许多函数：

``` javascript
// 📁 say.js
export function sayHi() { ... }
export function sayBye() { ... }
export function becomeSilent() { ... }
```

现在，如果我们只在我们的项目里使用了 `say.js` 中的一个函数：

``` javascript
// 📁 main.js
import {sayHi} from './say.js';
```

……那么，优化器（optimizer）就会检测到它，并从打包好的代码中删除那些未被使用的函数，从而使构建更小。这就是所谓的“摇树（tree-shaking）”。

2. 明确列出要导入的内容会使得名称较短：`sayHi()` 而不是 `say.sayHi()`。
3. 导入的显式列表可以更好地概述代码结构：使用的内容和位置。它使得代码支持重构，并且重构起来更容易。

### Import “as”

我们也可以使用 `as` 让导入具有不同的名字。

例如，简洁起见，我们将 `sayHi` 导入到局部变量 `hi`，将 `sayBye` 导入到 `bye`：

``` javascript
// 📁 main.js
import {sayHi as hi, sayBye as bye} from './say.js';

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

### Export “as”

导出也具有类似的语法。

我们将函数导出为 `hi` 和 `bye`：

``` javascript
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};
```

现在 `hi` 和 `bye` 是在外面使用时的正式名称：

``` javascript
// 📁 main.js
import * as say from './say.js';

say.hi('John'); // Hello, John!
say.bye('John'); // Bye, John!
```

### Export default

在实际中，主要有两种模块。

- 包含库或函数包的模块，像上面的 `say.js`。
- 声明单个实体的模块，例如模块 `user.js` 仅导出 `class User`。

大部分情况下，开发者倾向于使用第二种方式，以便每个“东西”都存在于它自己的模块中。

当然，这需要大量文件，因为每个东西都需要自己的模块，但这根本不是问题。实际上，如果文件具有良好的命名，并且文件夹结构得当，那么代码导航（navigation）会变得更容易。

模块提供了一个特殊的默认导出 `export default` 语法，以使`“一个模块只做一件事”`的方式看起来更好。

将 `export default` 放在要导出的实体前：

``` javascript
// 📁 user.js
export default class User { // 只需要添加 "default" 即可
  constructor(name) {
    this.name = name;
  }
}
```

每个文件应该只有一个 `export default`：

……然后将其导入而不需要花括号：

``` javascript
// 📁 main.js
import User from './user.js'; // 不需要花括号 {User}，只需要写成 User 即可

new User('John');
```

不用花括号的导入看起来很酷。刚开始使用模块时，一个常见的错误就是忘记写花括号。所以，请记住，`import` 命名的导出时需要花括号，而 `import` 默认的导出时不需要花括号。

从技术上讲，我们可以在一个模块中同时有默认的导出和命名的导出，但是实际上人们通常不会混合使用它们。模块要么是命名的导出要么是默认的导出。

由于每个文件最多只能有一个默认的导出，因此导出的实体可能没有名称。

例如，下面这些都是完全有效的默认的导出：

``` javascript
export default class { // 没有类名
  constructor() { ... }
}
```
``` javascript
export default function(user) { // 没有函数名
  alert(`Hello, ${user}!`);
}
```
``` javascript
// 导出单个值，而不使用变量
export default ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
```
不指定名称是可以的，因为每个文件只有一个 `export default`，因此不带花括号的 `import` 知道要导入的内容是什么。

如果没有 `default`，这样的导出将会出错：

``` javascript
export class { // Error!（非默认的导出需要名称）
  constructor() {}
}
```

#### “default” 名称

在某些情况下，`default` 关键词被用于引用默认的导出。

例如，要将函数与其定义分开导出：

``` javascript
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

// 就像我们在函数之前添加了 "export default" 一样
export {sayHi as default};
```

这是导入默认的导出以及命名的导出的方法：

``` javascript
// 📁 main.js
import {default as User, sayHi} from './user.js';

new User('John');
```

如果我们将所有东西 * 作为一个对象导入，那么 default 属性正是默认的导出：

``` javascript
// 📁 main.js
import * as user from './user.js';

let User = user.default; // 默认的导出
new User('John');
```

#### 我应该使用默认的导出吗？

命名的导出是明确的。它们确切地命名了它们要导出的内容，因此我们能从它们获得这些信息，这是一件好事。

命名的导出会强制我们使用正确的名称进行导入：

``` javascript
import {User} from './user.js';
// 导入 {MyUser} 不起作用，导入名字必须为 {User}
```

……对于默认的导出，我们总是在导入时选择名称：

``` javascript
import User from './user.js'; // 有效
import MyUser from './user.js'; // 也有效
// 使用任何名称导入都没有问题
```

因此，团队成员可能会使用不同的名称来导入相同的内容，这不好。

通常，为了避免这种情况并使代码保持一致，可以遵从这条规则，即导入的变量应与文件名相对应，例如：

``` javascript
import User from './user.js';
import LoginForm from './loginForm.js';
import func from '/path/to/func.js';
```

但是，一些团队仍然认为这是默认的导出的严重缺陷。因此，他们更倾向于始终使用命名的导出。即使只导出一个东西，也仍然使用命名的导出，而不是默认的导出。

这也使得重新导出（见下文）更容易。

### 重新导出

“重新导出（Re-export）”语法` export ... from ... `允许导入内容，并立即将其导出（可能是用的是其他的名字），就像这样：

``` javascript
export {sayHi} from './say.js'; // 重新导出 sayHi

export {default as User} from './user.js'; // 重新导出 default
```

为什么要这样做？我们看一个实际开发中的用例。

想象一下，我们正在编写一个 “package”：一个包含大量模块的文件夹，其中一些功能是导出到外部的（像 NPM 这样的工具允许我们发布和分发这样的 package，但我们不是必须要去使用它们），并且其中一些模块仅仅是供其他 package 中的模块内部使用的 “helpers”。

文件结构可能是这样的：

``` javascript
auth/
    index.js
    user.js
    helpers.js
    tests/
        login.js
    providers/
        github.js
        facebook.js
        ...
```

我们希望通过单个入口暴露包的功能。

换句话说，想要使用我们的包的人，应该只从“主文件” `auth/index.js` 导入。

像这样：

``` javascript
import {login, logout} from 'auth/index.js'
```

“主文件”，`auth/index.js` 导出了我们希望在包中提供的所有功能。

这样做是因为，其他使用我们包的开发者不应该干预其内部结构，不应该搜索我们包的文件夹中的文件。我们只在 `auth/index.js` 中导出必要的部分，并保持其他内容“不可见”。

由于实际导出的功能分散在 `package` 中，所以我们可以将它们导入到 `auth/index.js`，然后再从中导出它们：

``` javascript
// 📁 auth/index.js

// 导入 login/logout 然后立即导出它们
import {login, logout} from './helpers.js';
export {login, logout};

// 将默认导出导入为 User，然后导出它
import User from './user.js';
export {User};
```

现在使用我们 package 的人可以 `import {login} from "auth/index.js"`。

语法 `export ... from ...` 只是下面这种导入-导出的简写：

``` javascript
// 📁 auth/index.js
// 重新导出 login/logout
export {login, logout} from './helpers.js';

// 将默认导出重新导出为 User
export {default as User} from './user.js';
...
```

`export ... from` 与 `import/export` 相比的显着区别是重新导出的模块在当前文件中不可用。所以在上面的 auth/index.js 示例中，我们不能使用重新导出的 `login/logout` 函数。

#### 重新导出默认导出

重新导出时，默认导出需要单独处理。

假设我们有一个 `user.js` 脚本，其中写了 `export default class User`，并且我们想重新导出类 `User`：

我们可能会遇到两个问题：

1. `export User from './user.js'` 无效。这会导致一个语法错误。

要重新导出默认导出，我们必须明确写出 export {default as User}，就像上面的例子中那样。

2. `export * from './user.js'` 重新导出只导出了命名的导出，但是忽略了默认的导出。

如果我们想将命名的导出和默认的导出都重新导出，那么需要两条语句：

``` javascript
export * from './user.js'; // 重新导出命名的导出
export {default} from './user.js'; // 重新导出默认的导出
```

重新导出一个默认导出的这种奇怪现象，是某些开发者不喜欢默认导出，而是喜欢命名的导出的原因之一。

### 总而言之：

- 在声明一个 class/function/… 之前：
  - `export [default] class/function/variable ...`
- 独立的导出：
  - `export {x [as y], ...}`.
- 重新导出：
  - `export {x [as y], ...} from "module"`
  - `export * from "module"`（不会重新导出默认的导出）。
  - `export {default [as y]} from "module"`（重新导出默认的导出）。


导入：
- 导入命名的导出：
  - `import {x [as y], ...} from "module`"
- 导入默认的导出：
  - `import x from "module"`
  - `import {default as x} from "module"`
- 导入所有：
  - `import * as obj from "module"`
- 导入模块（其代码，并运行），但不要将其任何导出赋值给变量：
  - `import "module"`

## 动态导入

我们在前面章节中介绍的导出和导入语句称为“静态”导入。语法非常简单且严格。

首先，我们不能动态生成 `import` 的任何参数。

模块路径必须是原始类型字符串，不能是函数调用，下面这样的 `import` 行不通：

``` javascript
import ... from getModuleName(); // Error, only from "string" is allowed
```

其次，我们无法根据条件或者在运行时导入：

``` javascript
if(...) {
  import ...; // Error, not allowed!
}

{
  import ...; // Error, we can't put import in any block
}
```

这是因为 `import/export` 旨在提供代码结构的主干。这是非常好的事儿，因为这样便于分析代码结构，可以收集模块，可以使用特殊工具将收集的模块打包到一个文件中，可以删除未使用的导出（“tree-shaken”）。这些只有在 `import/export` 结构简单且固定的情况下才能够实现。

但是，我们如何才能动态地按需导入模块呢？

### import() 表达式

`import(module)` 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。我们可以在代码中的任意位置调用这个表达式。

我们可以在代码中的任意位置动态地使用它。例如：

``` javascript
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then(obj => <module object>)
  .catch(err => <loading error, e.g. if no such module>)
```

或者，如果在异步函数中，我们可以使用 `let module = await import(modulePath)`。

例如，如果我们有以下模块 say.js：

``` javascript
// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}
```

……那么，可以像下面这样进行动态导入：

``` javascript
let {hi, bye} = await import('./say.js');

hi();
bye();
```

或者，如果 say.js 有默认的导出：

``` javascript
// 📁 say.js
export default function() {
  alert("Module loaded (export default)!");
}
```

……那么，为了访问它，我们可以使用模块对象的 default 属性：

``` javascript
let obj = await import('./say.js');
let say = obj.default;
// or, in one line: let {default: say} = await import('./say.js');

say();
```
::: tip 注意：
动态导入在常规脚本中工作时，它们不需要 `script type="module"`.
::: 

::: tip 注意：
尽管 import() 看起来像一个函数调用，但它只是一种特殊语法，只是恰好使用了括号（类似于 super()）。

因此，我们不能将 import 复制到一个变量中，或者对其使用 call/apply。因为它不是一个函数。
::: 











































































































































































































































































































































































































































































































































































































