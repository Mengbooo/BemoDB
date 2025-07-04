---
title: FEE#002 - Lint | 模块规范
date: "2025-07-04"
tags:
  - Front-end engineering
---

# FEE#002 - Lint | 模块规范

模块化是一种软件设计原则，它提倡将一个复杂的系统分解为多个独立的、可复用的部分（即模块），每个模块负责实现特定的功能或解决特定的问题。它处理的问题是代码和资源的聚合和分割。

## 为什么我们需要模块化？

在做实际开发时，经常会遇到变量名称或函数名称一样的情况。这不仅容易造成命名冲突，还会污染全局变量。若在应用特别复杂，存在大量相似代码，又引用很多第三方库的情况下，稍不注意就很易造成文件的依赖混乱。

基于此，JS 也引入模块化的概念。早期的模块化不是真正的模块化，只是通过例如立即调用函数表达式(简称 IIFE)就是一个在定义时可立即执行的函数，实现类似模块化的效果。

后期的模块化才算是真正的模块化，它包括 CJS、AMD、CMD、UMD 和 ESM，经过多年演变，目前 Web 开发倾向于 ESM，Node 开发倾向于 CJS。

模块化让 JS 也能拥有自己的模块化效果，在实际开发中，一个模块就是一个文件。模块化的核心包括以下特性，基本都是围绕如何处理文件(模块)：

- 拆分：将代码根据功能拆分为多个可复用模块
- 加载：通过指定方式加载模块并执行与输出模块
- 注入：将一个模块的输出注入到另一个模块
- 管理：因为工程模块数量众多需管理模块间的依赖关系

在 JS 发展历程中，主要有六种常见模块方案，分别是 IIFE、CJS、AMD、CMD、UMD 和 ESM，接下来对于各个模块化方案会进行一定的阐述，之后，尤其学习一下 CJS 和 ESM 。

## IIFE (立即调用函数表达式)

IIFE 是早期 JavaScript 实现模块化的一种方式，通过创建一个函数作用域来避免变量污染全局命名空间。在 ES6 模块化标准出现之前，JavaScript 并没有内置的模块系统，开发者面临着全局变量污染和命名冲突的问题。IIFE 作为一种解决方案应运而生，它利用函数作用域的特性创建隔离的代码环境。它的核心思想是创建一个函数作用域并立即执行该函数，这样函数内部的变量就不会污染全局命名空间，同时还可以通过返回对象的方式暴露公共 API。

```javascript
// IIFE 模块化示例
var moduleA = (function () {
  // 私有变量和方法
  var privateVar = 10;
  function privateMethod() {
    return privateVar;
  }

  // 暴露公共API
  return {
    publicVar: privateVar,
    publicMethod: function () {
      return privateMethod();
    },
  };
})();

// 使用模块
console.log(moduleA.publicVar); // 10
console.log(moduleA.publicMethod()); // 10
// console.log(moduleA.privateVar); // undefined，无法访问私有变量
```

IIFE 还可以接收参数，这在处理全局依赖时非常有用。例如可以将 jQuery、window 等对象作为参数传入，在内部使用局部变量引用它们，提高代码的可维护性和执行效率：

```javascript
var moduleB = (function ($, window, document, undefined) {
  function initialize() {
    $("body").addClass("initialized");
  }

  return {
    init: initialize,
  };
})(jQuery, window, document);

moduleB.init();
```

IIFE 的优点是简单易用且不需要额外的库或工具支持，可以有效避免全局变量污染和创建私有变量，兼容性好适用于所有 JavaScript 环境。但它也有明显的缺点：不能轻松管理模块之间的依赖关系，不支持异步加载，随着应用规模增长变得难以维护，无法动态导入模块。IIFE 主要应用于简单的脚本隔离、jQuery 插件开发、小型前端项目以及需要兼容老旧浏览器的项目。

## CommonJS (CJS)

CommonJS 是 Node.js 采用的模块规范，它的特点是同步加载模块，这在服务器环境中是可行的，因为文件都在本地，加载速度快。该规范最初是为了解决 JavaScript 在服务器端缺乏模块化标准而提出的。2009 年，CommonJS 项目启动，目标是为 JavaScript 创建一个标准库，使其能够在浏览器之外的环境中运行。Node.js 采用了 CommonJS 规范的变种作为其模块系统的基础。

CommonJS 使用`require()`函数导入模块，使用`module.exports`或`exports`对象导出模块。每个模块在第一次被`require`时会被执行一次，然后结果会被缓存，后续的`require`调用将返回缓存的结果。这种机制确保了模块代码只会被执行一次，即使它被多次引用。

```javascript
// 文件: math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract,
};

// 文件: app.js
const math = require("./math");
// 或者解构导入
const { add, subtract } = require("./math");

console.log(math.add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
```

当使用`require()`导入模块时，Node.js 按照一定的规则查找模块：如果是内置模块（如`fs`、`http`等）直接返回；如果路径以`./`、`../`或`/`开头，则尝试加载对应路径的文件或目录；如果是非路径且非内置模块，则从当前目录的 node_modules 开始，逐级向上查找父目录的 node_modules。

CommonJS 模块化方案的主要特点包括同步加载（模块加载是阻塞的，只有加载完成后才会执行后续代码）、单例模式（每个模块只会被加载一次，多次 require 同一模块会返回相同的对象引用）、值拷贝（导出的是值的拷贝而非引用，模块内部的变量变化不会影响已导出的值，除非导出的是对象，则属性可能会被修改）以及动态性（可以在条件语句中使用 require，甚至可以动态构建模块路径）。

```javascript
// 同步加载和动态导入示例
console.log("开始加载模块");
const fs = require("fs"); // 阻塞直到模块加载完成
console.log("模块加载完成");

// 条件加载
if (process.env.NODE_ENV === "development") {
  const devTools = require("./dev-tools");
  devTools.enableDebugging();
}

// 单例模式示例
// helper.js
let counter = 0;
module.exports = {
  increment() {
    counter++;
  },
  getCount() {
    return counter;
  },
};

// main.js
const helper1 = require("./helper");
const helper2 = require("./helper");
helper1.increment();
console.log(helper1.getCount()); // 1
console.log(helper2.getCount()); // 1（同一实例）
```

CommonJS 对循环依赖的处理也很独特。当模块相互引用时，一个模块可能会得到另一个模块未完成的导出对象。这可能导致某些属性暂时不可用，但整个系统仍然可以工作。在 CommonJS 中，`exports`是对`module.exports`的引用，最终导出的是`module.exports`。如果直接赋值给`exports`，会破坏引用关系，导致导出失效。

CommonJS 的优势在于语法简单、适合服务器端开发、良好的封装性以及广泛应用于 Node.js 生态系统；缺点是同步加载模式不适合浏览器环境、无法静态分析依赖关系、循环依赖处理机制有缺陷。它主要应用于 Node.js 服务器端开发、使用 webpack 等打包工具的前端项目、电子桌面应用以及需要在服务器和浏览器之间共享代码的项目。

## AMD (异步模块定义)

AMD(Asynchronous Module Definition)是为浏览器环境设计的模块规范，支持异步加载模块，最常用的实现库是 RequireJS。它出现于 2009 年，由 RequireJS 的作者 James Burke 提出，主要针对浏览器环境设计。由于浏览器环境下同步加载模块会阻塞页面渲染，AMD 提供了一种异步加载模块的机制，使模块可以并行加载而不影响页面的其他部分。

AMD 使用`define`函数定义模块，使用`require`函数加载模块。定义模块时，可以指定依赖项，这些依赖项会被异步加载，加载完成后才会执行模块的工厂函数。这种方式使得浏览器可以并行下载多个模块，提高了页面的加载性能。

```javascript
// 定义一个模块
define("myModule", ["jquery", "underscore"], function ($, _) {
  function showMessage(message) {
    $("body").append("<p>" + _.escape(message) + "</p>");
  }

  return {
    showMessage: showMessage,
  };
});

// 使用模块
require(["myModule"], function (myModule) {
  myModule.showMessage("Hello, AMD!");
});
```

RequireJS 提供了丰富的配置选项，用于设置模块路径、依赖关系等，这使得复杂项目中的模块管理变得更加灵活：

```javascript
requirejs.config({
  baseUrl: "js/lib",
  paths: {
    jquery: "jquery-3.6.0",
    underscore: "underscore.min",
    app: "../app",
  },
  shim: {
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone",
    },
  },
});

// 使用配置后的路径加载模块
require(["jquery", "app/main"], function ($, main) {
  main.initialize();
});
```

AMD 的主要优点是支持异步加载模块不阻塞页面渲染、适合浏览器环境、依赖关系明确、可按需加载模块提高页面性能。缺点包括语法较复杂、配置繁琐、回调嵌套可能导致"回调地狱"、模块定义格式冗长。随着 ES Modules 的出现和浏览器支持的提高，AMD 正逐渐被取代，但它在早期的大型前端项目、需要异步加载模块的浏览器应用以及需要兼容旧版浏览器的项目中仍有一定应用。

## CMD (通用模块定义)

CMD(Common Module Definition)是由国内阿里的玉伯提出并在 SeaJS 中实现的模块规范，类似于 AMD，但推崇依赖就近原则。它参考了 CommonJS 和 AMD 规范，试图结合两者的优点，创建一个更适合浏览器环境但写法更接近 CommonJS 的模块系统。

CMD 与 AMD 类似，也使用`define`定义模块，但与 AMD 不同，CMD 倡导依赖就近，在需要使用某个模块时才引入，而不是在定义模块时就声明所有依赖。这种方式使得代码组织更加自然，更接近于 CommonJS 的写法，降低了学习成本。

```javascript
// 定义模块
define(function (require, exports, module) {
  // 同步引入依赖
  var $ = require("jquery");

  // 异步引入依赖
  require.async("large-module", function (largeModule) {
    largeModule.doSomething();
  });

  // 就近引入依赖
  function showMessage(message) {
    var _ = require("underscore");
    $("body").append("<p>" + _.escape(message) + "</p>");
  }

  exports.showMessage = showMessage;
});

// 使用模块
seajs.use(["myModule"], function (myModule) {
  myModule.showMessage("Hello, CMD!");
});
```

AMD 与 CMD 的主要区别在于：AMD 推崇依赖前置，在定义模块时就声明所有依赖，而 CMD 推崇依赖就近，在需要用到某个模块时再 require；AMD 模块依赖加载完成后立即执行，而 CMD 模块在执行到 require 语句时才执行对应的模块；AMD 的风格更像是专为浏览器设计，而 CMD 的风格更接近 CommonJS，对于习惯了 Node.js 开发的程序员更友好。

CMD 的优点包括依赖就近使得代码更简洁自然、支持异步加载、写法接近 CommonJS、按需加载和延迟执行等。缺点是社区支持和生态不如 AMD 广泛、SeaJS 的维护已基本停止、同样被 ES Modules 逐渐取代。CMD 主要应用于国内早期的大型前端项目、使用 SeaJS 的项目以及需要 CommonJS 风格但又要在浏览器中运行的项目。

## UMD (通用模块定义)

UMD(Universal Module Definition)是一种通用的模块定义方式，它兼容 AMD、CommonJS 以及全局变量定义。随着不同模块规范的出现，开发者面临一个问题：如何编写一个模块，让它既能在 Node.js 环境(CommonJS)中使用，又能在浏览器环境(AMD 或全局变量)中使用？UMD 就是为了解决这个问题而诞生的。

UMD 通过检测当前环境，判断应该使用哪种模块系统。它首先检查是否支持 AMD(define 是否存在)，然后检查是否支持 CommonJS(module.exports 是否存在)，如果都不支持，则将模块暴露为全局变量。这种方式使得同一段代码可以在不同环境中正常工作。

```javascript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof module === "object" && module.exports) {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // 浏览器全局变量
    root.myModule = factory(root.jQuery);
  }
})(typeof self !== "undefined" ? self : this, function ($) {
  function showMessage(message) {
    $("body").append("<p>" + message + "</p>");
  }

  return {
    showMessage: showMessage,
  };
});
```

对于具有多个依赖的复杂模块，UMD 同样可以优雅地处理：

```javascript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery", "underscore"], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node
    module.exports = factory(require("jquery"), require("underscore"));
  } else {
    // 浏览器全局变量
    root.myModule = factory(root.jQuery, root._);
  }
})(typeof self !== "undefined" ? self : this, function ($, _) {
  var myModule = {};

  myModule.version = "1.0.0";
  myModule.doSomething = function () {
    return _.map([1, 2, 3], function (n) {
      return $("<div>").text(n);
    });
  };

  return myModule;
});
```

UMD 的优势在于兼容多种模块系统，使一次编写的代码可以在任何环境下运行，特别适合开发第三方库和插件、跨平台工具等场景；缺点是代码相对复杂、可读性较差、需要维护针对不同环境的适配代码，有时可能带来额外的性能开销。UMD 主要应用于需要跨平台的 JavaScript 库和框架、jQuery 插件和通用工具库等。

## ES Modules (ESM)

ESM 是 ECMAScript 6(ES2015)引入的官方模块系统，现代浏览器和 Node.js 均已支持。它是 JavaScript 语言级别的模块系统，在 ES6 之前 JavaScript 没有官方的模块系统，开发者不得不依赖社区解决方案。ESM 旨在提供一个标准化的、语言内置的模块系统，统一服务器和浏览器环境的模块化开发方式。

ESM 使用`import`和`export`关键字来导入和导出模块。与 CommonJS 不同，ESM 是静态的，这意味着 import 和 export 语句必须位于模块顶层，不能在条件语句或函数中使用。这种静态结构使得打包工具可以进行静态分析，实现诸如 tree-shaking 等优化，减小最终的包体积。

```javascript
// 文件: math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// 默认导出
export default function multiply(a, b) {
  return a * b;
}

// 文件: app.js
import multiply, { add, subtract, PI } from "./math.js";
// 或者全部导入
import * as math from "./math.js";

console.log(add(5, 3)); // 8
console.log(subtract(10, 4)); // 6
console.log(multiply(2, 3)); // 6
console.log(PI); // 3.14159
```

ES Modules 的加载过程分为三个阶段：构造(查找、下载并解析所有模块文件)、实例化(分配内存，创建模块实例，设置导出和导入的引用关系)和求值(执行模块代码，填充内存中的值)。这种机制使得 ESM 能够优雅地解决循环依赖问题，并确保每个模块只被执行一次。

ESM 具有许多重要特性，包括静态导入导出(必须位于模块顶层)、动态导入(使用 import()函数，可在条件语句中使用)、实时绑定(导出的是值的引用而非拷贝)、命名导出和默认导出、多种导入方式以及顶级 await 支持(在 ESM 模块中可以在顶层使用 await 而无需 async 函数包装)。

```javascript
// 静态导入
import { foo } from "./module.js";

// 动态导入
if (condition) {
  import("./module.js").then((module) => {
    module.foo();
  });
}

// 使用async/await进行动态导入
async function loadModule() {
  if (condition) {
    const module = await import("./module.js");
    module.foo();
  }
}

// 实时绑定示例
// counter.js
export let count = 0;
export function increment() {
  count++;
}

// app.js
import { count, increment } from "./counter.js";
console.log(count); // 0
increment();
console.log(count); // 1（值会更新，因为是引用）

// 顶级await
// data-loader.js
const response = await fetch("https://api.example.com/data");
const data = await response.json();
export { data };
```

在浏览器中使用 ESM 需要在 script 标签中添加`type="module"`属性，而在 Node.js 中使用 ESM 可以设置`"type": "module"`在 package.json 中、使用.mjs 扩展名或使用`--input-type=module`命令行参数。

```html
<!-- 浏览器中使用ESM -->
<script type="module" src="app.js"></script>
<script type="module">
  import { hello } from "./hello.js";
  hello();
</script>
```

ESM 的优势包括语言层面的标准支持、静态结构便于优化、支持循环依赖、实时绑定的导出、同时支持浏览器和 Node.js 环境、支持异步加载和 tree-shaking 等。缺点包括旧浏览器不支持需要转译、与 CommonJS 互操作有限制、某些动态使用场景受限。ESM 主要应用于现代前端开发(React、Vue、Angular 等框架项目)、支持 ESM 的 Node.js 应用、大型前端项目以及需要同时运行在浏览器和服务器的同构应用。

## CJS 与 ESM 的比较

CommonJS 和 ES Modules 是当今最流行的两种 JavaScript 模块系统，它们在许多方面存在差异。CJS 使用`require()`和`module.exports`进行同步加载和导出，而 ESM 使用`import`和`export`关键字，支持静态分析。CJS 导出的是值的拷贝，而 ESM 导出的是引用绑定，这意味着在 ESM 中模块内部的变量变化会反映到导入处。CJS 支持在条件语句中进行动态导入，而 ESM 只能通过`import()`函数实现动态导入。CJS 在 Node.js 环境中表现良好，而 ESM 同时支持浏览器和 Node.js 环境且是 ECMAScript 标准的一部分。

在两种系统的互操作方面，在 Node.js 中可以在 CommonJS 模块中使用动态导入 ESM 模块，而在 ESM 中导入 CJS 模块时，CJS 的`module.exports`会被视为默认导出。随着 JavaScript 生态系统的发展，ESM 正在成为推荐的模块化标准，但 CJS 在 Node.js 环境中仍然广泛使用，两种模块系统将在未来相当长的时间内共存。

| 特性         | CommonJS                                              | ES Modules                               |
| ------------ | ----------------------------------------------------- | ---------------------------------------- |
| 加载方式     | 同步加载                                              | 静态加载（可通过 import() 实现动态加载） |
| 导出值类型   | 值拷贝                                                | 引用绑定                                 |
| 导入语法     | require()                                             | import                                   |
| 导出语法     | module.exports, exports                               | export, export default                   |
| 条件加载     | 支持（可在条件语句中使用 require）                    | 仅动态导入支持                           |
| 文件扩展名   | 可选                                                  | 浏览器环境中必须（.js/.mjs）             |
| 循环依赖处理 | 返回未完成的导出                                      | 通过实时绑定解决                         |
| 顶层变量     | this, require, module, exports, **filename, **dirname | import.meta                              |
| 运行环境     | Node.js（主要）                                       | 浏览器和 Node.js                         |
| 是否为标准   | 否                                                    | 是                                       |
| 静态分析能力 | 弱                                                    | 强                                       |
| Tree-shaking | 不支持                                                | 支持                                     |
| 顶层 await   | 不支持                                                | 支持                                     |

## 模块化相关面试题

#### 1. 如何在 CommonJS 中导出和导入模块？

**参考答案**：
CommonJS 使用`module.exports`或`exports`导出，使用`require()`导入：

```javascript
// 导出方式1: 直接为module.exports赋值
// math.js
module.exports = {
  add: function (a, b) {
    return a + b;
  },
  subtract: function (a, b) {
    return a - b;
  },
};

// 导出方式2: 为exports添加属性(不能直接赋值给exports)
// utils.js
exports.formatDate = function (date) {
  return date.toISOString();
};
exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 导入
const math = require("./math");
const utils = require("./utils");

console.log(math.add(2, 3)); // 5
console.log(utils.capitalize("hello")); // Hello
```

需要注意的是，不能直接给`exports`赋值，因为它只是`module.exports`的引用：

```javascript
// 错误用法 - 不会生效
exports = {
  method: function () {},
};

// 正确用法
module.exports = {
  method: function () {},
};
```

#### 2. 如何在 ES Modules 中导出和导入模块？

**参考答案**：
ES Modules 使用`export`和`import`语句：

```javascript
// 命名导出
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159;

// 默认导出
// person.js
export default class Person {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return `Hello, my name is ${this.name}`;
  }
}

// 导入
// 导入命名导出
import { add, subtract, PI } from "./math.js";
// 导入并重命名
import { add as sum } from "./math.js";
// 导入所有导出并命名
import * as mathUtils from "./math.js";
// 导入默认导出
import Person from "./person.js";
// 混合导入
import Person, { add, subtract } from "./module.js";
```

ES Modules 还支持导出重命名和重新导出：

```javascript
// 导出重命名
export { add as sum, subtract as minus };

// 重新导出其他模块的导出
export { default as Person } from "./person.js";
export { add, subtract } from "./math.js";
export * from "./utils.js";
```

#### 3. CommonJS 模块和 ES Modules 在执行时有什么区别？

**参考答案**：

1. **加载时机**：

   - CommonJS 模块是运行时加载，整个模块都会被加载
   - ES Modules 是编译时加载（静态加载），可以只加载需要的部分（支持 tree shaking）

2. **执行顺序**：

   - CommonJS 模块在第一次 require 时立即执行整个模块
   - ES Modules 的执行分为三个阶段：构造(寻找文件)、实例化(分析导入导出)、求值(执行代码)

3. **缓存机制**：

   - CommonJS 模块执行后会被缓存，再次 require 时直接返回缓存的模块导出
   - ES Modules 模块也会被缓存，但导入的是绑定，源模块的变化会反映到导入处

4. **示例**：

```javascript
// CommonJS
// counter.js
let count = 0;
module.exports = {
  count,
  increment: function () {
    count++;
    return count;
  },
};

// main.js
const counter = require("./counter");
console.log(counter.count); // 0
counter.increment();
console.log(counter.count); // 0 (不变，因为导出的是值的拷贝)
console.log(counter.increment()); // 2 (内部状态改变了)

// ES Modules
// counter.js
export let count = 0;
export function increment() {
  count++;
  return count;
}

// main.js
import { count, increment } from "./counter";
console.log(count); // 0
increment();
console.log(count); // 1 (变了，因为导出的是引用绑定)
```

#### 4. 为什么在 Node.js 中不能直接在 package.json 中使用"type": "module"后混用 require 和 import?

**参考答案**：
当在 package.json 中设置`"type": "module"`后，Node.js 将所有`.js`文件视为 ES Modules，这时：

1. ES Modules 中不能使用`require()`, `module.exports`, `exports`, `__dirname`, `__filename`等 CommonJS 特性
2. CommonJS 模块是同步加载的，而 ES Modules 本质上是异步的
3. ES Modules 有自己的作用域规则和解析方式

如果需要在 ES Modules 项目中使用 CommonJS 模块，有以下解决方案：

- 使用动态 import: `const module = await import('commonjs-module')`
- 将需要用 CommonJS 模块的文件后缀改为`.cjs`
- 不设置`"type": "module"`，而是将 ES Modules 文件后缀改为`.mjs`

```javascript
// 在ES Module中导入CommonJS模块
// commonjs-module.js (CommonJS)
module.exports = {
  hello: function () {
    return "Hello from CommonJS";
  },
};

// esm-module.mjs (ESM)
import pkg from "./commonjs-module.js";
console.log(pkg.hello()); // 'Hello from CommonJS'
```

#### 5. 在浏览器中使用模块时，CommonJS 和 ES Modules 有什么区别？

**参考答案**：

1. **原生支持**：

   - 现代浏览器原生支持 ES Modules，只需使用`<script type="module">`
   - 浏览器不原生支持 CommonJS，需要通过工具如 Webpack、Browserify 等转换

2. **加载方式**：

   - ES Modules 在浏览器中默认是异步加载的，不会阻塞 HTML 解析
   - 通过打包工具处理的 CommonJS 模块通常是同步执行的

3. **使用示例**：

   ```html
   <!-- ES Modules在浏览器中的使用 -->
   <script type="module" src="app.js"></script>
   <script type="module">
     import { add } from "./math.js";
     console.log(add(1, 2)); // 3
   </script>
   ```

4. **特性区别**：
   - ES Modules 自动采用严格模式，不需要`'use strict'`
   - ES Modules 中顶层`this`是`undefined`，而非`window`
   - ES Modules 脚本会延迟执行，类似于添加了`defer`属性
   - ES Modules 受同源策略限制，开发时需要使用本地服务器

#### 6. 常见错误：为什么我的 ES Modules 导入路径必须包含扩展名？

**参考答案**：
在浏览器环境中，ES Modules 的导入路径必须是以下几种之一：

- 完整的 URL：`import data from 'https://example.com/data.js'`
- 以`/`开头的绝对路径：`import data from '/scripts/data.js'`
- 以`./`或`../`开头的相对路径：`import data from './data.js'`

并且，浏览器中的 ES Modules 导入**必须包含文件扩展名**（通常是`.js`），这与 Node.js 的 ES Modules 实现和大多数打包工具不同，后者允许省略扩展名。

```javascript
// 浏览器环境
// 正确
import { foo } from "./module.js";

// 错误 - 缺少扩展名
import { foo } from "./module";
```

这是因为浏览器没有 Node.js 那样的模块解析算法，它不会自动尝试添加扩展名。如果使用构建工具如 Webpack、Rollup 等，它们通常会处理这个问题。

#### 7. 如何在 Node.js 中让一个文件同时支持 CommonJS 和 ES Modules？

**参考答案**：
创建一个文件同时支持两种模块系统的常见方式是采用"通用模块定义"（UMD）模式或双模块模式：

1. **双模块模式**（更现代的方法）：

```javascript
// dual-module.js
// ES Modules 部分
export function hello() {
  return "Hello world";
}

// CommonJS 兼容部分
if (typeof module !== "undefined" && module.exports) {
  module.exports = { hello };
}
```

2. **导出助手模式**（适用于库作者）：
   创建两个文件，一个 ESM 格式，一个 CommonJS 格式，然后在 package.json 中指定：

```json
{
  "name": "my-library",
  "exports": {
    "import": "./index.mjs",
    "require": "./index.cjs"
  }
}
```

3. **使用构建工具**：
   使用 Rollup、webpack 等工具生成两种格式的输出，配置 package.json：

```json
{
  "name": "my-library",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js"
}
```

#### 8. 如何识别我正在使用的是哪种模块系统？

**参考答案**：
在代码中识别当前使用的模块系统：

```javascript
function detectModuleSystem() {
  // 检查是否为ES Modules
  const isESM = typeof import.meta !== "undefined";

  // 检查是否为CommonJS
  const isCJS =
    typeof module !== "undefined" && typeof module.exports !== "undefined";

  // 检查是否为AMD
  const isAMD = typeof define === "function" && define.amd;

  if (isESM) return "ES Modules";
  if (isCJS) return "CommonJS";
  if (isAMD) return "AMD";
  return "Global script or unknown";
}

// 在ES Modules中
console.log(detectModuleSystem()); // 'ES Modules'

// 在CommonJS中
console.log(detectModuleSystem()); // 'CommonJS'
```

在 Node.js 环境中，还可以使用以下方式：

```javascript
// 仅在Node.js环境中有效
if (require.main === module) {
  console.log("当前文件直接运行");
} else {
  console.log("当前文件被导入为模块");
}
```

#### 9. CommonJS 和 ES Modules 有什么区别？

**参考答案**：

- 加载方式：CommonJS 是同步加载，ESM 是静态加载（编译时确定依赖关系）
- 导出值类型：CommonJS 导出值的拷贝，ESM 导出值的引用
- 语法：CommonJS 使用 `require` 和 `module.exports`，ESM 使用 `import` 和 `export`
- 条件加载：CommonJS 可以在任何位置导入模块，ESM 的静态导入必须在顶层（但可以使用动态 import() 实现条件加载）
- 循环依赖处理：CommonJS 通过返回未完成的导出对象，ESM 通过实时绑定
- 标准：ESM 是 ECMAScript 标准，CommonJS 是社区规范
- 静态分析：ESM 支持 Tree-shaking，CommonJS 不支持

#### 10. 为什么 ESM 能支持 Tree-shaking 而 CommonJS 不能？

**参考答案**：
Tree-shaking 是一种优化技术，用于移除未使用的代码。ESM 支持 Tree-shaking 的根本原因是其静态的模块结构，即 import 和 export 语句必须位于模块顶层且不能在条件语句中使用，这使得打包工具可以在编译时（非运行时）分析出哪些模块被真正使用，哪些未使用。

而 CommonJS 是动态的，可以在条件语句中导入模块，或者基于变量构造导入路径，这使得静态分析变得困难或不可能。例如，在代码中 `const module = require(condition ? 'moduleA' : 'moduleB')` 这样的语句，只有在运行时才能确定导入的是哪个模块。

#### 11. 如何解决模块循环依赖问题？

**参考答案**：
模块循环依赖是指模块 A 依赖模块 B，同时模块 B 也依赖模块 A 的情况。不同模块系统有不同的解决方案：

**CommonJS 中**：

- Node.js 在遇到循环依赖时返回的是模块的"未完成副本"
- 第一个模块加载第二个模块时，第二个模块试图加载第一个模块，此时会得到第一个模块已导出的部分，而不是全部
- 这可能导致某些引用不可用或未定义

```javascript
// a.js
exports.done = false;
const b = require("./b.js");
console.log("b.done in a.js:", b.done); // 输出 true
exports.done = true;

// b.js
exports.done = false;
const a = require("./a.js");
console.log("a.done in b.js:", a.done); // 输出 false，因为 a.js 还未执行完
exports.done = true;

// main.js
const a = require("./a.js");
```

**ES Modules 中**：

- ESM 通过"实时绑定"和模块加载的三个阶段（构造、实例化、求值）来解决
- 所有导入导出引用在实例化阶段就建立好了，即使模块间相互引用
- 执行时顺序是确定的，保证每个模块只执行一次

**最佳实践**：

- 重构代码，避免循环依赖
- 提取共享依赖到第三个模块
- 使用依赖注入模式

#### 12. 如何在浏览器中使用原生 ES Modules？

**参考答案**：
现代浏览器已经原生支持 ES Modules，只需在 script 标签中添加`type="module"`属性：

```html
<!-- 外部模块脚本 -->
<script type="module" src="app.js"></script>

<!-- 内联模块脚本 -->
<script type="module">
  import { sum } from "./math.js";
  console.log(sum(1, 2)); // 3
</script>
```

使用原生 ESM 时需要注意：

- 默认启用严格模式
- 模块作用域隔离，顶层变量不是全局变量
- 自动延迟执行，相当于添加了 defer 属性
- 只加载一次，无论引入多少次
- 需要通过服务器访问（不能用 file:// 协议直接打开）
- 跨域请求遵循同源策略
- 旧浏览器需要回退方案

#### 13. 什么是 UMD 模块，为什么需要它？

**参考答案**：
UMD (Universal Module Definition) 是一种通用的模块定义方式，目的是让同一个模块可以在不同环境下使用。UMD 结合了 AMD、CommonJS 和全局变量定义三种模式，通过环境检测来确定使用哪种模式。

之所以需要 UMD，是因为不同的环境使用不同的模块系统：Node.js 使用 CommonJS，一些浏览器项目使用 AMD (如 RequireJS)，有些项目可能直接使用全局变量。通过 UMD，开发者可以编写一次代码，在所有环境中运行，特别适合开发第三方库和组件。

UMD 模式的典型实现：

```javascript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define(["jquery"], factory);
  } else if (typeof module === "object" && module.exports) {
    // CommonJS
    module.exports = factory(require("jquery"));
  } else {
    // 浏览器全局变量
    root.myModule = factory(root.jQuery);
  }
})(typeof self !== "undefined" ? self : this, function ($) {
  function showMessage(message) {
    $("body").append("<p>" + message + "</p>");
  }

  return {
    showMessage: showMessage,
  };
});
```

#### 14. 如何在 Node.js 中同时支持 CommonJS 和 ES Modules？

**参考答案**：
Node.js 支持同时使用 CommonJS 和 ES Modules，有几种方式：

1. **通过文件扩展名区分**：

   - `.js` 文件默认使用 CommonJS
   - `.mjs` 文件使用 ES Modules
   - `.cjs` 文件使用 CommonJS (即使项目默认使用 ESM)

2. **通过 package.json 中的 `type` 字段设置默认模块类型**：

   ```json
   {
     "type": "module"  // 所有 .js 文件默认使用 ESM
   }
   // 或
   {
     "type": "commonjs"  // 所有 .js 文件默认使用 CommonJS (默认值)
   }
   ```

3. **在 ESM 中导入 CommonJS 模块**：

   ```javascript
   // ESM 模块
   import pkg from "./commonjs-module.js"; // CommonJS 导出会被视为默认导出
   // 或者
   import * as pkg from "./commonjs-module.js";
   ```

4. **在 CommonJS 中动态导入 ESM 模块**：
   ```javascript
   // CommonJS 模块
   async function loadESM() {
     const esm = await import("./esm-module.mjs");
     esm.someFunction();
   }
   ```

需要注意的限制：

- ESM 中不能直接使用 `__dirname` 和 `__filename`，可使用 `import.meta.url` 代替
- CommonJS 中不支持顶级 await
- ESM 中使用 CommonJS 模块时，只能获取默认导出或整个模块对象

#### 15. 说说你对 JavaScript 动态导入的理解

**参考答案**：
动态导入 (Dynamic Import) 是 ES2020 引入的功能，允许在代码运行时按需导入模块，而不是在编译时静态导入。动态导入使用 `import()` 函数，它返回一个 Promise：

```javascript
// 静态导入（编译时）
import { someFunction } from "./module.js";

// 动态导入（运行时）
if (condition) {
  import("./module.js")
    .then((module) => {
      module.someFunction();
    })
    .catch((error) => {
      console.error("模块加载失败", error);
    });
}

// 使用 async/await
async function loadModule() {
  if (condition) {
    const module = await import("./module.js");
    module.someFunction();
  }
}
```

动态导入的主要优势：

- **按需加载**：只有在需要时才加载模块，可以减少初始加载时间
- **条件导入**：可以在条件语句中导入模块
- **路径构建**：可以基于变量构建导入路径
- **代码分割**：与打包工具结合实现高效的代码分割

应用场景：

- 路由级别代码分割
- 功能按需加载
- 根据不同环境加载不同模块
- 处理大型依赖

#### 16. Webpack 和 Rollup 对不同模块系统的处理有什么区别？

**参考答案**：
Webpack 和 Rollup 是两款流行的 JavaScript 打包工具，它们对模块系统的处理有几个关键区别：

**Webpack**：

- 支持所有模块格式（CommonJS、AMD、ESM）
- 默认会将所有模块转换为类似 CommonJS 的格式
- 生成的代码包含自己的模块系统实现
- 更擅长处理应用级别的打包，具有丰富的加载器和插件生态
- Tree-shaking 需要配置，且对 CommonJS 模块支持有限

**Rollup**：

- 主要针对 ES Modules
- 通过静态分析实现更高效的 Tree-shaking
- 可以直接生成 ES Modules、CommonJS、UMD 等多种格式
- 生成的代码更加干净，接近手写代码
- 更擅长打包库和框架
- 对 CommonJS 的支持需要插件

选择考虑因素：

- 打包库时通常选择 Rollup，代码更简洁
- 打包应用时通常选择 Webpack，功能更全面
- 如果项目大量使用 CommonJS 模块，Webpack 更容易配置
- 如果希望最小化代码体积且主要使用 ESM，Rollup 可能更适合

#### 17. 如何处理第三方库中的 CSS 模块化？

**参考答案**：
处理第三方库的 CSS 模块化有多种方法：

1. **CSS Modules**：将 CSS 类名限定在局部作用域

   ```javascript
   // 在 JS 中导入 CSS
   import styles from "./styles.module.css";

   // 在 React 组件中使用
   function Button() {
     return <button className={styles.button}>Click me</button>;
   }
   ```

2. **CSS-in-JS 库**：如 styled-components、emotion

   ```javascript
   // styled-components 示例
   import styled from "styled-components";

   const Button = styled.button`
     background: blue;
     color: white;
     padding: 10px 15px;
   `;

   function App() {
     return <Button>Click me</Button>;
   }
   ```

3. **使用打包工具处理**：

   - Webpack：使用 css-loader、style-loader、mini-css-extract-plugin
   - Rollup：使用 rollup-plugin-css-only 或 rollup-plugin-postcss

   ```javascript
   // webpack.config.js
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           use: [
             "style-loader",
             {
               loader: "css-loader",
               options: {
                 modules: true,
               },
             },
           ],
         },
       ],
     },
   };
   ```

4. **处理第三方库 CSS 的策略**：
   - 直接导入库的 CSS 文件（如 `import 'library/dist/style.css'`）
   - 使用 Webpack 的 ProvidePlugin 全局注入
   - 使用 CSS 命名空间避免冲突
   - 使用 PostCSS 插件如 autoprefixer 处理兼容性

#### 18. 在微前端架构中如何处理模块共享和冲突？

**参考答案**：
微前端架构中，多个独立应用共存，模块共享和冲突是常见挑战：

**模块共享方法**：

1. **Module Federation（Webpack 5 功能）**：

   ```javascript
   // webpack.config.js (host app)
   module.exports = {
     plugins: [
       new ModuleFederationPlugin({
         name: "host",
         remotes: {
           app1: "app1@http://localhost:3001/remoteEntry.js",
         },
         shared: ["react", "react-dom"],
       }),
     ],
   };

   // 使用远程模块
   import("app1/Button").then((module) => {
     const Button = module.default;
     // 使用 Button 组件
   });
   ```

2. **SystemJS**：运行时模块加载器，可加载不同格式的模块

   ```javascript
   // 配置 SystemJS
   System.config({
     map: {
       app1: "http://localhost:3001/app1.js",
     },
   });

   // 导入模块
   System.import("app1").then((module) => {
     // 使用模块
   });
   ```

3. **使用全局共享运行时**：如 single-spa 框架

4. **Web Components**：使用自定义元素封装功能

**处理模块冲突**：

1. **版本控制**：

   - 使用语义化版本控制
   - 明确指定共享模块的版本范围

2. **隔离策略**：

   - 使用 iframe 实现完全隔离
   - 使用 Shadow DOM 隔离 CSS
   - 命名空间隔离全局变量

3. **运行时协商**：

   - 模块联邦中的共享模块协商机制
   - 版本选择策略（如最高版本优先）

4. **构建时优化**：
   - 提取公共依赖到共享模块
   - 使用 externals 避免重复打包

实践建议：

- 制定统一的依赖管理策略
- 使用微前端框架如 single-spa、qiankun
- 共享状态管理使用观察者模式或发布订阅模式
- 设置明确的模块边界和通信契约
