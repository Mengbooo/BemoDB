---
title: Web Components
date: '2025-06-07'
tags:
- frontalk
---

# Web Components

Web components 是用于创建独立组件的一组标准：自定义 HTML 元素，它们具有自己的属性和方法，封装好的 DOM 和样式。

## 组件化

这一部分我们将会讲述关于「Web Components」的一系列现代标准。

到目前为止，这些标准仍然在制定中。其中一些特性已经被很好地支持并集成到了现代 HTML/DOM 标准中，但是还有部分特性仍然处在草案阶段。你可以在任何浏览器中尝试一些例子，Google Chrome 可能是对这些新特性支持得最好的浏览器。猜测可能是因为 Google 公司的人本身就是很多相关标准的支持者。

### 组件化架构

众所周知，开发复杂软件的原则是：不要让软件复杂。

如果某个部分变得复杂了 —— 将其拆分成更简单的部分，再以最简明的方式组合起来。

只有让复杂的事情简单化的架构才是好架构。

我们可以把用户界面拆分为若干可视化组件：每个组件都在页面上占有一块位置，可以执行一个明确的任务，并且可以和其他组件区分开。

接下来看一个实际的网站的例子，比如 Twitter。

非常自然地，可以拆分为几个组件

1. 顶部导航栏。
2. 用户信息。
3. 关注推荐。
4. 提交表格。
5. （6，7也是） —— 消息。

组件也可以包含子组件，比如消息组件可能是更高阶组件「消息列表」的子组件。可点击的用户头像可能也是一个组件，这样的例子还有很多。

我们如何划分一个组件呢？直觉、经验和常识可以帮助我们完成这件事。通常情况下，如果一个独立可视化实体，我们可以描述其可以做什么和如何在页面上交互，那么就可以将其划分为一个组件。在上面的例子中，这个页面存在几个模块，`每个模块都有自己的角色`，所以把它们划分为组件是合理的。

一个组件有：

- 自己的 JavaScript 类。
- DOM 结构，并且只由自己的类管理，无法被外部代码操作。（「封装」原则）。
- CSS 样式，作用在这个组件上。
- API：事件，类方法等等，让组件可以与其他组件交互。

现在已经有了很多框架和开发方法论可以实现组件化，它们各个都有自己的卖点。通常情况下，采用特殊的 CSS 类命名和一些规范，已经可以带来「组件化的感觉」 —— 即 CSS 作用域和 DOM 封装。

而现在浏览器已经原生支持了「Web Components」，我们就可以不用再自己去模拟组件化的结构了。

- `Custom elements` —— 用于自定义 HTML 元素.
- `Shadow DOM` —— 为组件创建内部 DOM，它对外部是不可见的。
- `CSS Scoping` —— 申明仅应用于组件的 Shadow DOM 内的样式。
- `Event retargeting` 以及更多的小东西，让自定义组件更适用于开发工作。

## Custom elements

我们可以通过描述带有自己的方法、属性和事件等的类来创建自定义 HTML 元素。

在 custom elements （自定义标签）定义完成之后，我们可以将其和 HTML 的内建标签一同使用。

这是一件好事，因为虽然 HTML 有非常多的标签，但仍然是有穷尽的。如果我们需要像 `<easy-tabs>、<sliding-carousel>、<beautiful-upload>`…… 这样的标签，内建标签并不能满足我们。

我们可以把上述的标签定义为特殊的类，然后使用它们，就好像它们本来就是 HTML 的一部分一样。

Custom elements 有两种：

- `Autonomous custom elements` （自主自定义标签） —— “全新的” 元素, 继承自 HTMLElement 抽象类.
- `Customized built-in elements` （自定义内建元素） —— 继承内建的 HTML 元素，比如自定义 HTMLButtonElement 等。

我们将会先创建 autonomous 元素，然后再创建 customized built-in 元素。

在创建 custom elements 的时候，我们需要告诉浏览器一些细节，包括：如何展示它，以及在添加元素到页面和将其从页面移除的时候需要做什么，等等。

通过创建一个带有几个特殊方法的类，我们可以完成这件事。这非常容易实现，我们只需要添加几个方法就行了，同时这些方法都不是必须的。

下面列出了这几个方法的概述：

``` js
class MyElement extends HTMLElement {
  constructor() {
    super();
    // 元素在这里创建
  }

  connectedCallback() {
    // 在元素被添加到文档之后，浏览器会调用这个方法
    //（如果一个元素被反复添加到文档／移除文档，那么这个方法会被多次调用）
  }

  disconnectedCallback() {
    // 在元素从文档移除的时候，浏览器会调用这个方法
    // （如果一个元素被反复添加到文档／移除文档，那么这个方法会被多次调用）
  }

  static get observedAttributes() {
    return [/* 属性数组，这些属性的变化会被监视 */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // 当上面数组中的属性发生变化的时候，这个方法会被调用
  }

  adoptedCallback() {
    // 在元素被移动到新的文档的时候，这个方法会被调用
    // （document.adoptNode 会用到, 非常少见）
  }

  // 还可以添加更多的元素方法和属性
}
```

在申明了上面几个方法之后，我们需要注册元素：

``` js
// 让浏览器知道我们新定义的类是为 <my-element> 服务的
customElements.define("my-element", MyElement);
```

现在当任何带有 `<my-element>` 标签的元素被创建的时候，一个 MyElement 的实例也会被创建，并且前面提到的方法也会被调用。我们同样可以使用 `document.createElement('my-element')` 在 JavaScript 里创建元素。

::: tip Custom element 名称必须包括一个短横线 `-`
Custom element 名称必须包括一个短横线 -, 比如 my-element 和 super-button 都是有效的元素名，但 myelement 并不是。

这是为了确保 custom element 和内建 HTML 元素之间不会发生命名冲突。
:::

### 例子: “time-formatted”

举个例子，HTML 里面已经有 `<time>` 元素了，用于显示日期／时间。但是这个标签本身并不会对时间进行任何格式化处理。

让我们来创建一个可以展示适用于当前浏览器语言的时间格式的 `<time-formatted>` 元素：

``` html
<script>
class TimeFormatted extends HTMLElement { // (1)

  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

}

customElements.define("time-formatted", TimeFormatted); // (2)
</script>

<!-- (3) -->
<time-formatted datetime="2019-12-01"
  year="numeric" month="long" day="numeric"
  hour="numeric" minute="numeric" second="numeric"
  time-zone-name="short"
></time-formatted>
```

- 这个类只有一个方法 connectedCallback() —— 在 `<time-formatted>` 元素被添加到页面的时候，浏览器会调用这个方法（或者当 HTML 解析器检测到它的时候），它使用了内建的时间格式化工具 Intl.DateTimeFormat，这个工具可以非常好地展示格式化之后的时间，在各浏览器中兼容性都非常好。

- 我们需要通过 customElements.define(tag, class) 来注册这个新元素。

- 接下来在任何地方我们都可以使用这个新元素了。

### 监视属性

我们目前的 `<time-formatted>` 实现中，在元素渲染以后，后续的属性变化并不会带来任何影响。这对于 HTML 元素来说有点奇怪。通常当我们改变一个属性的时候，比如 `a.href`，我们会预期立即看到变化。我们将会在下面修正这一点。

为了监视这些属性，我们可以在 `observedAttributes() static getter` 中提供属性列表。当这些属性发生变化的时候，`attributeChangedCallback` 会被调用。出于性能优化的考虑，其他属性变化的时候并不会触发这个回调方法。

以下是 `<time-formatted>` 的新版本，它会在属性变化的时候自动更新：

``` html
<script>
class TimeFormatted extends HTMLElement {

  render() { // (1)
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}

customElements.define("time-formatted", TimeFormatted);
</script>

<time-formatted id="elem" hour="numeric" minute="numeric" second="numeric"></time-formatted>

<script>
setInterval(() => elem.setAttribute('datetime', new Date()), 1000); // (5)
</script>
```

- 渲染逻辑被移动到了 render() 这个辅助方法里面。
- 这个方法在元素被插入到页面的时候调用。
- attributeChangedCallback 在 observedAttributes() 里的属性改变的时候被调用。
- …… 然后重渲染元素。
- 最终，一个计时器就这样被我们轻松地实现了。

### 渲染顺序

在 HTML 解析器构建 DOM 的时候，会按照先后顺序处理元素，先处理父级元素再处理子元素。例如，如果我们有 `<outer><inner></inner></outer>`，那么 `<outer>` 元素会首先被创建并接入到 DOM，然后才是 `<inner>`。

这对 custom elements 产生了重要影响。

比如，如果一个 custom element 想要在 connectedCallback 内访问 innerHTML，它什么也拿不到:

``` html
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
    alert(this.innerHTML); // empty (*)
  }

});
</script>

<user-info>John</user-info>
```

如果你运行上面的代码，alert 出来的内容是空的。

这正是因为在那个阶段，子元素还不存在，DOM 还没有完成构建。HTML 解析器先连接 custom element `<user-info>`，然后再处理子元素，但是那时候子元素还并没有加载上。

如果我们要给 custom element 传入信息，我们可以使用元素属性。它们是即时生效的。

或者，如果我们需要子元素，我们可以使用延迟时间为零的 setTimeout 来推迟访问子元素。

这样是可行的：

``` html
<script>
customElements.define('user-info', class extends HTMLElement {

  connectedCallback() {
    setTimeout(() => alert(this.innerHTML)); // John (*)
  }

});
</script>

<user-info>John</user-info>
```

现在 alert 在 (*) 行展示了 「John」，因为我们是在 HTML 解析完成之后，才异步执行了这段程序。我们在这个时候处理必要的子元素并且结束初始化过程。

另一方面，这个方案并不是完美的。如果嵌套的 custom element 同样使用了 setTimeout 来初始化自身，那么它们会按照先后顺序执行：外层的 setTimeout 首先触发，然后才是内层的。

这样外层元素还是早于内层元素结束初始化。

让我们用一个例子来说明：

``` html
<script>
customElements.define('user-info', class extends HTMLElement {
  connectedCallback() {
    alert(`${this.id} 已连接。`);
    setTimeout(() => alert(`${this.id} 初始化完成。`));
  }
});
</script>

<user-info id="outer">
  <user-info id="inner"></user-info>
</user-info>
```

输出顺序：

- `outer` 已连接。
- `inner` 已连接。
- `outer` 初始化完成。
- `inner` 初始化完成。

我们可以很明显地看到外层元素并没有等待内层元素。

并没有任何内建的回调方法可以在嵌套元素渲染好之后通知我们。但我们可以自己实现这样的回调。比如，内层元素可以分派像 initialized 这样的事件，同时外层的元素监听这样的事件并做出响应。

### Customized built-in elements

我们创建的 `<time-formatted>` 这些新元素，并没有任何相关的语义。搜索引擎并不知晓它们的存在，同时无障碍设备也无法处理它们。

但上述两点同样是非常重要的。比如，搜索引擎会对这些事情感兴趣，比如我们真的展示了时间。或者如果我们创建了一个特别的按钮，为什么不复用已有的 `<button>` 功能呢？

我们可以通过继承内建元素的类来扩展和定制它们。

比如，按钮是 HTMLButtonElement 的实例，让我们在这个基础上创建元素。

1. 我们的类继承自 HTMLButtonElement：

``` js
class HelloButton extends HTMLButtonElement { /* custom element 方法 */ }
```

2. 给 customElements.define 提供定义标签的第三个参数：

``` js
customElements.define('hello-button', HelloButton, {extends: 'button'});
```

这一步是必要的，因为不同的标签会共享同一个类。

3. 最后，插入一个普通的 `<button>` 标签，但添加 is="hello-button" 到这个元素，这样就可以使用我们的 custom element：

``` html
<button is="hello-button">...</button>
```

## Shadow DOM

Shadow DOM 为封装而生。它可以让一个组件拥有自己的「影子」DOM 树，这个 DOM 树不能在主文档中被任意访问，可能拥有局部样式规则，还有其他特性。

### 内建 shadow DOM

你是否曾经思考过复杂的浏览器控件是如何被创建和添加样式的？

比如 `<input type="range">`

浏览器在内部使用 DOM/CSS 来绘制它们。这个 DOM 结构一般来说对我们是隐藏的，但我们可以在开发者工具里面看见它。比如，在 Chrome 里，我们需要打开「Show user agent shadow DOM」选项。

你在 `#shadow-root` 下看到的就是被称为「shadow DOM」的东西。

我们不能使用一般的 JavaScript 调用或者选择器来获取内建 shadow DOM 元素。它们不是常规的子元素，而是一个强大的封装手段。

在上面的例子中，我们可以看到一个有用的属性 `pseudo`。这是一个因为历史原因而存在的属性，并不在标准中。我们可以使用它来给子元素加上 CSS 样式，像这样：

``` html
<style>
/* 让滑块轨道变红 */
input::-webkit-slider-runnable-track {
  background: red;
}
</style>

<input type="range">
```

重申一次，`pseudo` 是一个非标准的属性。按照时间顺序来说，浏览器首先实验了使用内部 DOM 结构来实现控件，然后，在一段时间之后，shadow DOM 才被标准化来让我们，开发者们，做类似的事。

接下来，我们将要使用现代 shadow DOM 标准，它在 [DOM spec](https://dom.spec.whatwg.org/#shadow-trees) 和其他相关标准中可以被找到。

### Shadow tree

一个 DOM 元素可以有以下两类 DOM 子树：

- `Light tree（光明树）` —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在之前章节看到的所有子树都是「光明的」。
- `Shadow tree（影子树）` —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。

如果一个元素同时有以上两种子树，那么浏览器只渲染 shadow tree。但是我们同样可以设置两种树的组合。我们将会在后面的章节 Shadow DOM 插槽，组成 中看到更多细节。

影子树可以在自定义元素中被使用，其作用是隐藏组件内部结构和添加只在组件内有效的样式。

比如，这个 `<show-hello>` 元素将它的内部 DOM 隐藏在了影子里面：

``` html
<script>
customElements.define('show-hello', class extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `<p>
      Hello, ${this.getAttribute('name')}
    </p>`;
  }
});
</script>

<show-hello name="John"></show-hello>
```

所有的内容都在「#shadow-root」下.

首先，调用 `elem.attachShadow({mode: …})` 可以创建一个 shadow tree。

这里有两个限制：

1. 在每个元素中，我们只能创建一个 shadow root。
2. elem 必须是自定义元素，或者是以下元素的其中一个：「article」、「aside」、「blockquote」、「body」、「div」、「footer」、「h1…h6」、「header」、「main」、「nav」、「p」、「section」或者「span」。其他元素，比如 `<img>`，不能容纳 shadow tree。

`mode` 选项可以设定封装层级。他必须是以下两个值之一：

- `「open」` —— shadow root 可以通过 `elem.shadowRoot` 访问。

任何代码都可以访问 elem 的 shadow tree。

- `「closed」` —— `elem.shadowRoot` 永远是 null。

我们只能通过 `attachShadow` 返回的指针来访问 shadow DOM（并且可能隐藏在一个 class 中）。浏览器原生的 shadow tree，比如 `<input type="range">`，是封闭的。没有任何方法可以访问它们。

attachShadow 返回的 shadow root，和任何元素一样：我们可以使用 innerHTML 或者 DOM 方法，比如 append 来扩展它。

我们称有 shadow root 的元素叫做`「shadow tree host」`，可以通过 shadow root 的 host 属性访问：

``` js
// 假设 {mode: "open"}，否则 elem.shadowRoot 是 null
alert(elem.shadowRoot.host === elem); // true
```

### 封装

Shadow DOM 被非常明显地和主文档分开：

- Shadow DOM 元素对于 light DOM 中的 querySelector 不可见。实际上，Shadow DOM 中的元素可能与 light DOM 中某些元素的 id 冲突。这些元素必须在 shadow tree 中独一无二。
- Shadow DOM 有自己的样式。外部样式规则在 shadow DOM 中不产生作用。

比如：

``` html
<style>
  /* 文档样式对 #elem 内的 shadow tree 无作用 (1) */
  p { color: red; }
</style>

<div id="elem"></div>

<script>
  elem.attachShadow({mode: 'open'});
    // shadow tree 有自己的样式 (2)
  elem.shadowRoot.innerHTML = `
    <style> p { font-weight: bold; } </style>
    <p>Hello, John!</p>
  `;

  // <p> 只对 shadow tree 里面的查询可见 (3)
  alert(document.querySelectorAll('p').length); // 0
  alert(elem.shadowRoot.querySelectorAll('p').length); // 1
</script>
```

- 文档里面的样式对 shadow tree 没有任何效果。
- ……但是内部的样式是有效的。
- 为了获取 shadow tree 内部的元素，我们可以从树的内部查询。

## 模板元素

内建的 `<template>` 元素用来存储 HTML 模板。浏览器将忽略它的内容，仅检查语法的有效性，但是我们可以在 JavaScript 中访问和使用它来创建其他元素。

从理论上讲，我们可以在 HTML 中的任何位置创建不可见元素来储存 HTML 模板。那 `<template>` 元素有什么优势？

首先，其内容可以是任何有效的HTML，即使它通常需要特定的封闭标签。

例如，我们可以在其中放置一行表格 `<tr>` ：

``` html
<template>
  <tr>
    <td>Contents</td>
  </tr>
</template>
```

通常，如果我们在 `<tr>` 内放置类似 `<div>` 的元素，浏览器会检测到无效的 DOM 结构并对其进行“修复”，然后用 `<table>` 封闭 `<tr>` ，那不是我们想要的。而 `<template>` 则完全保留我们储存的内容。

我们也可以将样式和脚本放入 `<template>` 元素中：

``` html
<template>
  <style>
    p { font-weight: bold; }
  </style>
  <script>
    alert("Hello");
  </script>
</template>
```

浏览器认为 `<template>` 的内容“不在文档中”：样式不会被应用，脚本也不会被执行， `<video autoplay>` 也不会运行，等。

当我们将内容插入文档时，该内容将变为活动状态（应用样式，运行脚本等）。

### 插入模板

模板的 content 属性可看作DocumentFragment —— 一种特殊的 DOM 节点。

我们可以将其视为普通的DOM节点，除了它有一个特殊属性：将其插入某个位置时，会被插入的则是其子节点。

例如：

``` html
<template id="tmpl">
  <script>
    alert("Hello");
  </script>
  <div class="message">Hello, world!</div>
</template>

<script>
  let elem = document.createElement('div');

  // Clone the template content to reuse it multiple times
  elem.append(tmpl.content.cloneNode(true));

  document.body.append(elem);
  // Now the script from <template> runs
</script>
```

让我们用 `<template>` 重写上一章的 Shadow DOM 示例：

``` html
<template id="tmpl">
  <style> p { font-weight: bold; } </style>
  <p id="message"></p>
</template>

<div id="elem">Click me</div>

<script>
  elem.onclick = function() {
    elem.attachShadow({mode: 'open'});

    elem.shadowRoot.append(tmpl.content.cloneNode(true)); // (*)

    elem.shadowRoot.getElementById('message').innerHTML = "Hello from the shadows!";
  };
</script>
```

在 (*) 行，我们将 tmpl.content 作为 DocumentFragment 克隆和插入，它的子节点`（<style>，<p>）`将代为插入。

它们会变成一个 Shadow DOM：

``` html
<div id="elem">
  #shadow-root
    <style> p { font-weight: bold; } </style>
    <p id="message"></p>
</div>
```

## Shadow DOM 插槽，组成

许多类型的组件，例如标签、菜单、照片库等等，需要内容去渲染。

就像浏览器内建的 `<select>` 需要 `<option>` 子项，我们的 `<custom-tabs>` 可能需要实际的标签内容来起作用。并且一个 `<custom-menu>` 可能需要菜单子项。

使用了 `<custom-menu>` 的代码如下所示：

``` html
<custom-menu>
  <title>Candy menu</title>
  <item>Lollipop</item>
  <item>Fruit Toast</item>
  <item>Cup Cake</item>
</custom-menu>
```

……之后，我们的组件应该正确地渲染成具有给定标题和项目、处理菜单事件等的漂亮菜单。

如何实现呢？

我们可以尝试分析元素内容并动态复制重新排列 DOM 节点。这是可能的，但是如果我们要将元素移动到 Shadow DOM，那么文档的 CSS 样式不能在那里应用，因此文档的视觉样式可能会丢失。看起来还需要做一些事情。

幸运的是我们不需要去做。Shadow DOM 支持 `<slot>` 元素，由 light DOM 中的内容自动填充。

### 具名插槽

让我们通过一个简单的例子看下插槽是如何工作的。

在这里 `<user-card>` shadow DOM 提供两个插槽, 从 light DOM 填充：

``` html
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <div>Name:
        <slot name="username"></slot>
      </div>
      <div>Birthday:
        <slot name="birthday"></slot>
      </div>
    `;
  }
});
</script>

<user-card>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
```

在 shadow DOM 中，`<slot name="X">` 定义了一个“插入点”，一个带有 `slot="X"` 的元素被渲染的地方。

然后浏览器执行”组合“：它从 light DOM 中获取元素并且渲染到 shadow DOM 中的对应插槽中。最后，正是我们想要的 —— 一个能被填充数据的通用组件。

这是编译后，不考虑组合的 DOM 结构：

``` html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username"></slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
```

我们创建了 shadow DOM，所以它当然就存在了，位于 #shadow-root 之下。现在元素同时拥有 light DOM 和 shadow DOM。

为了渲染 shadow DOM 中的每一个 `<slot name="...">` 元素，浏览器在 light DOM 中寻找相同名字的 slot="..."。这些元素在插槽内被渲染：

![shadow-dom-user-card](https://zh.javascript.info/article/slots-composition/shadow-dom-user-card.svg)

结果被叫做扁平化（flattened）DOM：

``` html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <!-- slotted element is inserted into the slot -->
        <span slot="username">John Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
</user-card>
```

……但是 “flattened” DOM 仅仅被创建用来渲染和事件处理，是“虚拟”的。虽然是渲染出来了，但文档中的节点事实上并没有到处移动！

如果我们调用 querySelectorAll 那就很容易验证：节点仍在它们的位置。

``` js
// light DOM <span> 节点位置依然不变，在 `<user-card>` 里
alert( document.querySelectorAll('user-card span').length ); // 2
```

因此，扁平化 DOM 是通过插入插槽从 shadow DOM 派生出来的。浏览器渲染它并且用于样式继承、事件传播。但是 JavaScript 在扁平前仍按原样看到文档。

::: warning 仅顶层子元素可以设置 slot=“…” 特性
`slot="..."` 属性仅仅对 shadow host 的直接子代 (在我们的例子中的 `<user-card>` 元素) 有效。对于嵌套元素它将被忽略。

例如，这里的第二个 `<span>` 被忽略了(因为它不是 `<user-card>` 的顶层子元素)：

``` html
<user-card>
  <span slot="username">John Smith</span>
  <div>
    <!-- invalid slot, must be direct child of user-card -->
    <span slot="birthday">01.01.2001</span>
  </div>
</user-card>
```
:::

如果在 light DOM 里有多个相同插槽名的元素，那么它们会被一个接一个地添加到插槽中。

例如这样：

``` html
<user-card>
  <span slot="username">John</span>
  <span slot="username">Smith</span>
</user-card>
```

给这个扁平化 DOM 两个元素，插入到 `<slot name="username">` 里：

``` html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <span slot="username">John</span>
        <span slot="username">Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
</user-card>
```

### 插槽后备内容

如果我们在一个 `<slot>` 内部放点什么，它将成为后备内容。如果 light DOM 中没有相应填充物的话浏览器就展示它。

例如，在这里的 shadow DOM 中，如果 light DOM 中没有 slot="username" 的话 Anonymous 就被渲染。

``` html
<div>Name:
  <slot name="username">Anonymous</slot>
</div>
```

### 默认插槽：第一个不具名的插槽

shadow DOM 中第一个没有名字的 `<slot>` 是一个默认插槽。它从 light DOM 中获取没有放置在其他位置的所有节点。

例如，让我们把默认插槽添加到 `<user-card>`，该位置可以收集有关用户的所有未开槽（unslotted）的信息：

``` html
<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
    <div>Name:
      <slot name="username"></slot>
    </div>
    <div>Birthday:
      <slot name="birthday"></slot>
    </div>
    <fieldset>
      <legend>Other information</legend>
      <slot></slot>
    </fieldset>
    `;
  }
});
</script>

<user-card>
  <div>I like to swim.</div>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
  <div>...And play volleyball too!</div>
</user-card>
```

所有未被插入的 light DOM 内容进入 “其他信息” 字段集。

元素一个接一个的附加到插槽中，因此这两个未插入插槽的信息都在默认插槽中。

扁平化的 DOM 看起来像这样：

``` html
<user-card>
  #shadow-root
    <div>Name:
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
    <div>Birthday:
      <slot name="birthday">
        <span slot="birthday">01.01.2001</span>
      </slot>
    </div>
    <fieldset>
      <legend>About me</legend>
      <slot>
        <div>Hello</div>
        <div>I am John!</div>
      </slot>
    </fieldset>
</user-card>
```

### Menu example

现在让我们回到在本章开头提到的 `<custom-menu>` 。

我们可以使用插槽来分配元素。

这是 `<custom-menu>`：

``` html
<custom-menu>
  <span slot="title">Candy menu</span>
  <li slot="item">Lollipop</li>
  <li slot="item">Fruit Toast</li>
  <li slot="item">Cup Cake</li>
</custom-menu>
```

带有适当插槽的 shadow DOM 模版：

``` html
<template id="tmpl">
  <style> /* menu styles */ </style>
  <div class="menu">
    <slot name="title"></slot>
    <ul><slot name="item"></slot></ul>
  </div>
</template>
```

1. `<span slot="title">` 进入 `<slot name="title">`。
2. 模版中有许多 `<li slot="item">`，但是只有一个 `<slot name="item">`。因此所有带有 slot="item" 的元素都一个接一个地附加到 `<slot name="item">` 上，从而形成列表。

扁平化的 DOM 变为：

``` html
<custom-menu>
  #shadow-root
    <style> /* menu styles */ </style>
    <div class="menu">
      <slot name="title">
        <span slot="title">Candy menu</span>
      </slot>
      <ul>
        <slot name="item">
          <li slot="item">Lollipop</li>
          <li slot="item">Fruit Toast</li>
          <li slot="item">Cup Cake</li>
        </slot>
      </ul>
    </div>
</custom-menu>
```

可能会注意到，在有效的 DOM 中，`<li>` 必须是 `<ul>` 的直接子代。但这是扁平化的 DOM，它描述了组件的渲染方式，这样的事情在这里自然发生。

我们只需要添加一个 click 事件处理程序来打开/关闭列表，并且 `<custom-menu>` 准备好了：

```js
customElements.define('custom-menu', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});

    // tmpl is the shadow DOM template (above)
    this.shadowRoot.append( tmpl.content.cloneNode(true) );

    // we can't select light DOM nodes, so let's handle clicks on the slot
    this.shadowRoot.querySelector('slot[name="title"]').onclick = () => {
      // open/close the menu
      this.shadowRoot.querySelector('.menu').classList.toggle('closed');
    };
  }
});
```

当然我们可以为它添加更多的功能：事件、方法等。

### 更新插槽

如果外部代码想动态 添加/移除 菜单项怎么办？

如果 添加/删除 了插槽元素，浏览器将监视插槽并更新渲染。

另外，由于不复制 light DOM 节点，而是仅在插槽中进行渲染，所以内部的变化是立即可见的。

因此我们无需执行任何操作即可更新渲染。但是如果组件想知道插槽的更改，那么可以用 slotchange 事件。

例如，这里的菜单项在 1 秒后动态插入，而且标题在 2 秒后改变。

``` html
<custom-menu id="menu">
  <span slot="title">Candy menu</span>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // shadowRoot can't have event handlers, so using the first child
    this.shadowRoot.firstElementChild.addEventListener('slotchange',
      e => alert("slotchange: " + e.target.name)
    );
  }
});

setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Lollipop</li>')
}, 1000);

setTimeout(() => {
  menu.querySelector('[slot="title"]').innerHTML = "New menu";
}, 2000);
</script>
```

菜单每次都会更新渲染而无需我们干预。

这里有两个 `slotchange` 事件：

1. 在初始化时:

`slotchange`: title 立即触发, 因为来自 light DOM 的 slot="title" 进入了相应的插槽。

2. 1 秒后:

`slotchange`: item 触发, 当一个新的 `<li slot="item">` 被添加。

请注意：2 秒后，如果修改了 slot="title" 的内容，则不会发生 slotchange 事件。因为没有插槽更改。我们修改了 slotted 元素的内容，这是另一回事。

如果我们想通过 JavaScript 跟踪 light DOM 的内部修改，也可以使用更通用的机制: [MutationObserver](https://zh.javascript.info/mutation-observer)。

### 插槽 API

最后让我们来谈谈与插槽相关的 JavaScript 方法。

正如我们之前所见，JavaScript 会查看真实的 DOM，不展开。但是如果 shadow 树有 `{mode: 'open'}` ，那么我们可以找出哪个元素被放进一个插槽，反之亦然，哪个插槽分配了给这个元素：

- `node.assignedSlot` – 返回 node 分配给的 `<slot>` 元素。
- `slot.assignedNodes({flatten: true/false})` – 分配给插槽的 DOM 节点。默认情况下，flatten 选项为 false。如果显式地设置为 true，则它将更深入地查看扁平化 DOM ，如果嵌套了组件，则返回嵌套的插槽，如果未分配节点，则返回备用内容。
- `slot.assignedElements({flatten: true/false})` – 分配给插槽的 DOM 元素（与上面相同，但仅元素节点）。

当我们不仅需要显示已插入内容的内容，还需要在 JavaScript 中对其进行跟踪时，这些方法非常有用。

例如，如果 `<custom-menu>` 组件想知道它所显示的内容，那么它可以跟踪 `slotchange` 并从 `slot.assignedElements` 获取：

``` html
<custom-menu id="menu">
  <span slot="title">Candy menu</span>
  <li slot="item">Lollipop</li>
  <li slot="item">Fruit Toast</li>
</custom-menu>

<script>
customElements.define('custom-menu', class extends HTMLElement {
  items = []

  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div class="menu">
      <slot name="title"></slot>
      <ul><slot name="item"></slot></ul>
    </div>`;

    // 插槽能被添加/删除/代替
    this.shadowRoot.firstElementChild.addEventListener('slotchange', e => {
      let slot = e.target;
      if (slot.name == 'item') {
        this.items = slot.assignedElements().map(elem => elem.textContent);
        alert("Items: " + this.items);
      }
    });
  }
});

// items 在 1 秒后更新
setTimeout(() => {
  menu.insertAdjacentHTML('beforeEnd', '<li slot="item">Cup Cake</li>')
}, 1000);
</script>
```

## 给 Shadow DOM 添加样式

shadow DOM 可以包含 `<style>` 和 `<link rel="stylesheet" href="…">` 标签。在后一种情况下，样式表是 HTTP 缓存的，因此不会为使用同一模板的多个组件重新下载样式表。

一般来说，局部样式只在 shadow 树内起作用，文档样式在 shadow 树外起作用。但也有少数例外。

### :host

:host 选择器允许选择 shadow 宿主（包含 shadow 树的元素）。

例如，我们正在创建 `<custom-dialog>` 元素，并且想使它居中。为此，我们需要对 `<custom-dialog>` 元素本身设置样式。

这正是 :host 所能做的：

``` html
<template id="tmpl">
  <style>
    /* 这些样式将从内部应用到 custom-dialog 元素上 */
    :host {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>

<custom-dialog>
  Hello!
</custom-dialog>
```

### 级联

shadow 宿主（ `<custom-dialog>` 本身）驻留在 light DOM 中，因此它受到文档 CSS 规则的影响。

如果在局部的 :host 和文档中都给一个属性设置样式，那么文档样式优先。

例如，如果在文档中我们有如下样式：

``` html
<style>
custom-dialog {
  padding: 0;
}
</style>
```

那么 `<custom-dialog>` 将没有 padding。

这是非常有利的，因为我们可以在其 `:host` 规则中设置 “默认” 组件样式，然后在文档中轻松地覆盖它们。

唯一的例外是当局部属性被标记 `!important` 时，对于这样的属性，局部样式优先。

### :host(selector)

与 :host 相同，但仅在 shadow 宿主与 selector 匹配时才应用样式。

例如，我们希望仅当 `<custom-dialog>` 具有 centered 属性时才将其居中:

``` html
<template id="tmpl">
  <style>
    :host([centered]) {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-color: blue;
    }

    :host {
      display: inline-block;
      border: 1px solid red;
      padding: 10px;
    }
  </style>
  <slot></slot>
</template>

<script>
customElements.define('custom-dialog', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
});
</script>


<custom-dialog centered>
  Centered!
</custom-dialog>

<custom-dialog>
  Not centered.
</custom-dialog>
```

现在附加的居中样式只应用于第一个对话框：`<custom-dialog centered>`。

### :host-context(selector)

与 `:host` 相同，但仅当外部文档中的 shadow 宿主或它的任何祖先节点与 selector 匹配时才应用样式。

例如，`:host-context(.dark-theme)` 只有在 `<custom-dialog>` 或者 `<custom-dialog>` 的任何祖先节点上有 dark-theme 类时才匹配：

``` html

<body class="dark-theme">
  <!--
    :host-context(.dark-theme) 只应用于 .dark-theme 内部的 custom-dialog
  -->
  <custom-dialog>...</custom-dialog>
</body>

```

总之，我们可以使用 `:host-family` 系列的选择器来对组件的主元素进行样式设置，具体取决于上下文。这些样式（除 `!important` 外）可以被文档样式覆盖。

### 给占槽（ slotted ）内容添加样式

现在让我们考虑有插槽的情况。

占槽元素来自 light DOM，所以它们使用文档样式。局部样式不会影响占槽内容。

在下面的例子中，按照文档样式，占槽的 `<span>` 是粗体，但是它不从局部样式中获取 background：

``` html
<style>
  span { font-weight: bold }
</style>

<user-card>
  <div slot="username"><span>John Smith</span></div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      span { background: red; }
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

结果是粗体，但不是红色。

如果我们想要在我们的组件中设置占槽元素的样式，有两种选择。

首先，我们可以对 `<slot>` 本身进行样式化，并借助 CSS 继承：

``` html
<user-card>
  <div slot="username"><span>John Smith</span></div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      slot[name="username"] { font-weight: bold; }
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

这里 `<p>John Smith</p>` 变成粗体，因为 CSS 继承在 `<slot>` 和它的内容之间有效。但是在 CSS 中，并不是所有的属性都是继承的。

另一个选项是使用 `::slotted(selector)` 伪类。它根据两个条件来匹配元素：

1. 这是一个占槽元素，来自于 light DOM。插槽名并不重要，任何占槽元素都可以，但只能是元素本身，而不是它的子元素 。
2. 该元素与 `selector` 匹配。

在我们的例子中，`::slotted(div)` 正好选择了 `<div slot="username">` ，但是没有选择它的子元素：

``` html
<user-card>
  <div slot="username">
    <div>John Smith</div>
  </div>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
      ::slotted(div) { border: 1px solid red; }
      </style>
      Name: <slot name="username"></slot>
    `;
  }
});
</script>
```

请注意，`::slotted` 选择器不能用于任何插槽中更深层的内容。下面这些选择器是无效的：

``` css
::slotted(div span) {
  /* 我们插入的 <div> 不会匹配这个选择器 */
}

::slotted(div) p {
  /* 不能进入 light DOM 中选择元素 */
}
```

此外，`::sloated` 只能在 CSS 中使用，不能在 `querySelector` 中使用。

### 用自定义 CSS 属性作为勾子

如何在主文档中设置组件的内建元素的样式?

像 `:host` 这样的选择器应用规则到 `<custom-dialog>` 元素或 `<user-card>`，但是如何设置在它们内部的 shadow DOM 元素的样式呢？

没有选择器可以从文档中直接影响 shadow DOM 样式。但是，正如我们暴露用来与组件交互的方法那样，我们也可以暴露 CSS 变量（自定义 CSS 属性）来对其进行样式设置。

**自定义 CSS 属性存在于所有层次，包括 light DOM 和 shadow DOM。**

例如，在 shadow DOM 中，我们可以使用 `--user-card-field-color` CSS 变量来设置字段的样式，而外部文档可以设置它的值：

``` html
<style>
  .field {
    color: var(--user-card-field-color, black);
    /* 如果 --user-card-field-color 没有被声明过，则取值为 black */
  }
</style>
<div class="field">Name: <slot name="username"></slot></div>
<div class="field">Birthday: <slot name="birthday"></slot></div>
</style>
```

然后，我们可以在外部文档中为 `<user-card>` 声明此属性：

``` css
user-card {
  --user-card-field-color: green;
}
```

自定义 CSS 属性穿透 shadow DOM，它们在任何地方都可见，因此内部的 `.field` 规则将使用它。

以下是完整的示例：

``` html
<style>
  user-card {
    --user-card-field-color: green;
  }
</style>

<template id="tmpl">
  <style>
    .field {
      color: var(--user-card-field-color, black);
    }
  </style>
  <div class="field">Name: <slot name="username"></slot></div>
  <div class="field">Birthday: <slot name="birthday"></slot></div>
</template>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.append(document.getElementById('tmpl').content.cloneNode(true));
  }
});
</script>

<user-card>
  <span slot="username">John Smith</span>
  <span slot="birthday">01.01.2001</span>
</user-card>
```

## Shadow DOM 和事件（events）

Shadow tree 背后的思想是封装组件的内部实现细节。

假设，在 `<user-card>` 组件的 shadow DOM 内触发一个点击事件。但是主文档内部的脚本并不了解 shadow DOM 内部，尤其是当组件来自于第三方库。

所以，为了保持细节简单，浏览器会重新定位（retarget）事件。

**当事件在组件外部捕获时，shadow DOM 中发生的事件将会以 host 元素作为目标。**

这里有个简单的例子：

``` html
<user-card></user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>
```

如果你点击了 button，就会出现以下信息：

1. Inner target: `BUTTON` —— 内部事件处理程序获取了正确的目标，即 shadow DOM 中的元素。
2. Outer target: `USER-CARD` —— 文档事件处理程序以 shadow host 作为目标。

事件重定向是一件很棒的事情，因为外部文档并不需要知道组件的内部情况。从它的角度来看，事件是发生在 `<user-card>`。

如果事件发生在 slotted 元素上，实际存在于 light DOM 上，则不会发生重定向。

例如，在下面的例子中，如果用户点击了 `<span slot="username">`，那么对于 shadow 和 light 处理程序来说，事件目标就是当前这个 span 元素。

``` html
<user-card id="userCard">
  <span slot="username">John Smith</span>
</user-card>

<script>
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<div>
      <b>Name:</b> <slot name="username"></slot>
    </div>`;

    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

userCard.onclick = e => alert(`Outer target: ${e.target.tagName}`);
</script>

```

如果单击事件发生在 "John Smith" 上，则对于内部和外部处理程序来说，其目标是 `<span slot="username">`。这是 light DOM 中的元素，所以没有重定向。

另一方面，如果单击事件发生在源自 shadow DOM 的元素上，例如，在 `<b>Name</b>` 上，然后当它冒泡出 shadow DOM 后，其 event.target 将重置为 `<user-card>`。

### 冒泡（bubbling）, event.composedPath()

出于事件冒泡的目的，使用扁平 DOM（flattened DOM）。

所以，如果我们有一个 slot 元素，并且事件发生在它的内部某个地方，那么它就会冒泡到 `<slot>` 并继续向上。

使用 event.composedPath() 获得原始事件目标的完整路径以及所有 shadow 元素。正如我们从方法名称中看到的那样，该路径是在组合（composition）之后获取的。

在上面的例子中，扁平 DOM 是：

``` html
<user-card id="userCard">
  #shadow-root
    <div>
      <b>Name:</b>
      <slot name="username">
        <span slot="username">John Smith</span>
      </slot>
    </div>
</user-card>
```

因此，对于 `<span slot="username">` 上的点击事件，会调用 event.composedPath() 并返回一个数组：`[span, slot, div, shadow-root, user-card, body, html, document, window]`。在组合之后，这正是扁平 DOM 中目标元素的父链。

### event.composed

大多数事件能成功冒泡到 shadow DOM 边界。很少有事件不能冒泡到 shadow DOM 边界。

这由 composed 事件对象属性控制。如果 composed 是 true，那么事件就能穿过边界。否则它仅能在 shadow DOM 内部捕获。

如果你浏览一下 [UI 事件规范](https://www.w3.org/TR/uievents) 就知道，大部分事件都是 composed: true

所有触摸事件（touch events）及指针事件（pointer events）都是 composed: true。

但也有些事件是 composed: false 的.

### 自定义事件（Custom events）

当我们发送（dispatch）自定义事件，我们需要设置 bubbles 和 composed 属性都为 true 以使其冒泡并从组件中冒泡出来。

例如，我们在 div#outer shadow DOM 内部创建 div#inner 并在其上触发两个事件。只有 composed: true 的那个自定义事件才会让该事件本身冒泡到文档外面：

``` html
<div id="outer"></div>

<script>
outer.attachShadow({mode: 'open'});

let inner = document.createElement('div');
outer.shadowRoot.append(inner);

/*
div(id=outer)
  #shadow-dom
    div(id=inner)
*/

document.addEventListener('test', event => alert(event.detail));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: true,
  detail: "composed"
}));

inner.dispatchEvent(new CustomEvent('test', {
  bubbles: true,
  composed: false,
  detail: "not composed"
}));
</script>
```



























































































