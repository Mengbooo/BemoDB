# 代码质量

在这一章节，我们来讲讲怎么用最基础的方法来监测和保证代码质量。

## 在浏览器中调试

DevTools 相关，参考：

- [JavasciptInfo 在浏览器中调试](https://zh.javascript.info/debugging-chrome)
- [chorme 开发人员工具选项](https://developers.google.com/web/tools/chrome-devtools)

## 代码风格

良好的代码风格实际上是一种编程艺术 —— 以一种正确并且人们易读的方式编码来完成一个复杂的任务。
::: warning 没有什么规则是“必须”的
但是记住：没有什么规则是“刻在石头上”的。这些是风格偏好，而不是宗教教条。
:::

### 语法上：

#### 对于花括号：

在大多数的 JavaScript 项目中，花括号以 “Egyptian” 风格（代码段的开括号位于一行的末尾，而不是另起一行的风格）书写，左花括号与相应的关键词在同一行上 —— 而不是新起一行。左括号前还应该有一个空格。

对于单行构造，我们也推荐用上面的 “Egyptian”风格来实现，就像这样：

```javascript
if (n < 0) {
  alert(`Power ${n} Go!`);
}

// 当然像下面这样写也可以,前提是只有一行:
if (n < 0) alert(`Power ${n} is not supported`);
```

#### 不要全写在一行口牙!

没有人喜欢读一长串代码，最好将代码分割一下。例如：

```javascript
// 回勾引号 ` 允许将字符串拆分为多行
let str = `
  ECMA International's TC39 is a group of JavaScript developers,
  implementers, academics, and more, collaborating with the community
  to maintain and evolve the definition of JavaScript.
`;
// 对于if语句,for也差不多
if (id === 123 && moonPhase === "Waning Gibbous" && zodiacSign === "Libra") {
  letTheSorceryBegin();
}
```

#### 缩进

- 水平方向上的缩进：2 或 4 个空格。我自己的习惯是把 Tab 设置为两个空格的长度.
- 垂直方向上的缩进：用于将代码拆分成逻辑块的空行。
  代码如下:

```javascript
// 水平方向上:
show(parameters,
     aligned, // 左边有 5 个空格
     one,
     after,
     another
  ) {
  // ...
}

// 垂直方向上:
function pow(x, n) {
  let result = 1;
  //              <--
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  //              <--
  return result;
}

```

#### 关于分号

每一个语句后面都应该有一个分号。即使它可以被跳过。我们讲过了 JavaScript 的
ASI 机制,但是它并不是任何时候都有作用的,啊总之就是要多写分号,不要偷懒,不过也有不写分号的代码风格,如
[ StandardJS ](https://standardjs.com/)

#### 关于嵌套

避免代码嵌套层级过深，例如:

```javascript
// Do not
for (let i = 0; i < 10; i++) {
  if (cond) {
    ... // <- 又一层嵌套
  }
}

// YES!
for (let i = 0; i < 10; i++) {
  if (!cond) continue;
  ...  // <- 没有额外的嵌套
}
```

### 函数放哪

如果你正在写几个“辅助”函数和一些使用它们的代码，那么有三种方式来组织这些函数。

- 在调用这些函数的代码的 上方 声明这些函数
- 先写调用代码，再写函数
- 混合：在第一次使用一个函数时，对该函数进行声明

大多数情况下，第二种方式更好。

这是因为阅读代码时，我们首先想要知道的是“它做了什么”。如果代码先行，那么在整个程序的最开始就展示出了这些信息。之后，可能我们就不需要阅读这些函数了，尤其是它们的名字清晰地展示出了它们的功能的时候。

### 风格指南

风格指南包含了“如何编写”代码的通用规则，例如：使用哪个引号、用多少空格来缩进、一行代码最大长度等非常多的细节。

- Google JavaScript 风格指南
- Airbnb JavaScript 风格指南
- Idiomatic.JS
- StandardJS
  这些风格指南直接搜索就能搜索到,代码风格真的是提升你的代码的美观度最简单最直接的方法

### Linter

检查器（Linters）是可以自动检查代码样式，并提出改进建议的工具。

它们的妙处在于进行代码风格检查时，还可以发现一些代码错误，例如变量或函数名中的错别字。因此，即使你不想坚持某一种特定的代码风格，也建议你安装一个检查器。

下面是一些最出名的代码检查工具：

- JSLint —— 第一批检查器之一。
- JSHint —— 比 JSLint 多了更多设置。
- ESLint —— 应该是最新的一个。
  它们都能够做好代码检查。目前大家基本都在用 ESLint。

大多数检查器都可以与编辑器集成在一起：只需在编辑器中启用插件并配置代码风格即可。

例如，要使用 ESLint 你应该这样做：

- 安装 Node.JS。
- 使用 npm install -g eslint 命令（npm 是一个 JavaScript 包安装工具）安装 ESLint。
- 在你的 JavaScript 项目的根目录（包含该项目的所有文件的那个文件夹）创建一个名为 .eslintrc 的配置文件。
- 在集成了 ESLint 的编辑器中安装/启用插件。大多数编辑器都有这个选项。

下面是一个 .eslintrc 文件的例子：

```javascript
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
    "no-console": 0,
    "indent": 2
  }
}

// 这里的 "extends" 指令表示我们是基于 “eslint:recommended” 的设置项而进行设置的。之后，我们制定我们自己的规则。
```

## 关于注释

注释的目的是描述代码怎样工作和为什么这样工作。

关于注释有一个很棒的原则：“如果代码不够清晰以至于需要一个注释，那么或许它应该被重写。”

什么是好的注释：

- 描述架构：对组件进行高层次的整体概括，它们如何相互作用、各种情况下的控制流程是什么样的……简而言之 —— 代码的鸟瞰图。
- 记录函数的参数和用法，有一个专门用于记录函数的语法 `JSDoc` ：用法、参数和返回值, 这个在 leetcode 中很常见，belike：

```javascript
/**
 * 返回 x 的 n 次幂的值。
 *
 * @param {number} x 要改变的值。
 * @param {number} n 幂数，必须是一个自然数。
 * @return {number} x 的 n 次幂的值。
 */
function pow(x, n) {
  ...
}
```

- 重要的解决方案，特别是在不是很明显时。

代码有哪些巧妙的特性？它们被用在了什么地方？如果代码存在任何巧妙和不显而易见的方法，那绝对需要注释。

注释也被用于一些如 JSDoc3 等文档自动生成工具：它们读取注释然后生成 HTML 文档（或者其他格式的文档）。

## 如何成为代码忍者？

::: warning
你真的要成为代码忍者吗？
:::

- **简洁是智慧的灵魂**,把代码尽可能写得短。展示出你是多么的聪明啊,belike:

```javascript
i = i ? (i < 0 ? Math.max(0, len + i) : i) : 0;
```

- **使用一个字母的变量**，使用一个不寻常的变量多酷啊，尤其是在长达 1-2 页（如果可以的话，你可以写得更长）的循环体中使用的时候。如果某人要研究循环内部实现的时候，他就很难很快地找出变量 x 其实是循环计数器啦。
- **使用缩写**,如果团队规则中禁止使用一个字母和模糊的命名 — 那就缩短命名，使用缩写吧！像这样：
  - list → lst
  - erAgent → ua
  - browser → brsr
- **Soar high，抽象化**。大方无隅，大器晚成，大音希声，大象无形。当选择一个名字时，尽可能尝试使用最抽象的词语。例如 obj、data、value、item 和 elem 等。
- **注意力测试**，使用相似的变量名，像 date 和 data，尽你所能地将它们混合在一起。
- **智能同义词**，对 **同一个** 东西使用 类似 的命名，可以使生活更有趣，并且能够展现你的创造力。
- **重用名字**,仅在绝对必要时才添加新变量。否则，重用已经存在的名字。直接把新值写进变量即可。**这个方法的一个进阶方案是，在循环或函数中偷偷地替换掉它的值。**
- **下划线的乐趣**，在变量名前加上下划线 \_ 和 **。例如 \_name 和 **value。如果只有你知道它们的含义，那就非常棒了。或者，加这些下划线只是为了好玩儿，没有任何含义，那就更棒了！
- **show your love**，向大家展现一下你那丰富的情感！像 superElement、megaFrame 和 niceItem 这样的名字一定会启发读者。
- **重叠外部变量**，处明者不见暗中一物，处暗者能见明中区事。对函数内部和外部的变量，使用相同的名称。很简单，不用费劲想新的名称。
- **无处不在的副作用**！有些函数看起来它们不会改变任何东西。例如 isReady()，checkPermission()，findTags()……它们被假定用于执行计算、查找和返回数据，而不会更改任何它们自身之外的数据。这被称为“无副作用”。一个非常惊喜的技巧就是，除了主要任务之外，给它们添加一个“有用的”行为。

- **强大的函数**！大道泛兮，其左可右。不要让函数受限于名字中写的内容。拓宽一些。例如，函数 validateEmail(email) 可以（除了检查邮件的正确性之外）显示一个错误消息并要求重新输入邮件。将多个行为合并到一起，可以保护你的代码不被重用。

::: danger 忍者之道

- 遵从其中的一丢丢，你的代码就会变得`充满惊喜`。
- 遵从其中的一大部分，你的代码将真正成为你的代码，`没有人会想改变它`。
- 遵从所有，你的代码将成为寻求启发的年轻开发者的`宝贵案例`。
  :::
## Polyfill 与 转译器
相关链接：
- https://tc39.github.io/ecma262/  有关于JavaScript的提议和讨论
- https://compat-table.github.io/compat-table/es6/ 查看语言特性的支持状态

如何让我们现代的代码在还不支持最新特性的旧引擎上工作？有两个工作可以做到这一点：

- 转译器（Transpilers）。
- 垫片（Polyfills）。

### 转译器（Transpilers） 
转译器 是一种可以将源码转译成另一种源码的特殊的软件。它可以解析（“阅读和理解”）现代代码，并使用旧的语法结构对其进行重写，进而使其也可以在旧的引擎中工作。

例如，在 ES2020 之前没有“空值合并运算符” ??。所以，如果访问者使用过时了的浏览器访问我们的网页，那么该浏览器可能就不明白 height = height ?? 100 这段代码的含义。

转译器会分析我们的代码，并将 `height ?? 100` 重写为 `(height !== undefined && height !== null) ? height : 100`。

说到名字，Babel 是最著名的转译器之一。

现代项目构建系统，例如 webpack，提供了在每次代码更改时自动运行转译器的方法，因此很容易将代码转译集成到开发过程中。

### 垫片（Polyfills）
新的语言特性可能不仅包括语法结构和运算符，还可能包括内建函数。例如，Math.trunc(n) 是一个“截断”数字小数部分的函数，例如 Math.trunc(1.23) 返回 1。在一些（非常过时的）JavaScript 引擎中没有 Math.trunc 函数，所以这样的代码会执行失败。

这就需要我们去声明缺失的函数：**更新/添加新函数的脚本被称为“polyfill”。它“填补”了空白并添加了缺失的实现。**对于这种特殊情况，Math.trunc 的 polyfill 是一个实现它的脚本，如下所示：
``` javascript
if (!Math.trunc) { // 如果没有这个函数
  // 实现它
  Math.trunc = function(number) {
    // Math.ceil 和 Math.floor 甚至存在于上古年代的 JavaScript 引擎中
    // 在本教程的后续章节中会讲到它们
    return number < 0 ? Math.ceil(number) : Math.floor(number);
  };
}
```

现在的话，我们很少会需要我们去写 Polyfills ，不过这种的方法论还是需要知道的。

## 关于代码测试
::: tip TODO
- https://juejin.cn/post/6844904194600599560
- https://zh.javascript.info/testing-mocha
:::



## Task

### 下面的代码风格有什么问题？

```javascript
function pow(x, n) {
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  return result;
}

let x = prompt("x?", ""),
  n = prompt("n?", "");
if (n <= 0) {
  alert(
    `Power ${n} is not supported, please enter an integer number greater than zero`
  );
} else {
  alert(pow(x, n));
}
```

```javascript
function pow(x, n) {
  // <- 参数之间没有空格
  // <- 花括号独占了一行
  let result = 1; // <- = 号两边没有空格
  for (let i = 0; i < n; i++) {
    result *= x;
  } // <- 没有空格
  // { ... } 里面的内容应该在新的一行上
  return result;
}

let x = prompt("x?", ""),
  n = prompt("n?", ""); // <-- 从技术的角度来看是可以的，
// 但是拆分成 2 行会更好，并且这里也缺了空格和分号 ;
if (n <= 0) {
  // <- (n <= 0) 里面没有空格，并且应该在本行上面加一个空行
  // <- 花括号独占了一行
  // 下面的一行代码太长了，可以将其拆分成 2 行以提高可读性
  alert(
    `Power ${n} is not supported, please enter an integer number greater than zero`
  );
} // <- 可以像 "} else {" 这样写在一行上
else {
  alert(pow(x, n)); // 缺失了空格和分号 ;
}
```

```javascript
// 修改后:
function pow(x, n) {
  let result = 1;

  for (let i = 0; i < n; i++) {
    result *= x;
  }

  return result;
}

let x = prompt("x?", "");
let n = prompt("n?", "");

if (n <= 0) {
  alert(`Power ${n} is not supported,
    please enter an integer number greater than zero`);
} else {
  alert(pow(x, n));
}
```
