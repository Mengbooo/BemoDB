---
title: Frame 和 window
date: '2025-06-07'
tags:
- frontalk
---

# Frame 和 window

## 弹窗和 window 的方法

弹窗（popup）是向用户显示其他文档的最古老的方法之一。

基本上，你只需要运行：

``` js
window.open('https://javascript.info/')
```

它将打开一个具有给定 URL 的新窗口。大多数现代浏览器都配置为在新选项卡中打开 url，而不是单独的窗口。

弹窗自古以来就存在。最初的想法是，在不关闭主窗口的情况下显示其他内容。目前为止，还有其他方式可以实现这一点：我们可以使用 fetch 动态加载内容，并将其显示在动态生成的 `<div>` 中。弹窗并不是我们每天都会使用的东西。

并且，弹窗在移动设备上非常棘手，因为移动设备无法同时显示多个窗口。

但仍然有一些任务在使用弹窗，例如`进行 OAuth 授权`（使用 Google/Facebook/… 登陆），因为：

1. 弹窗是一个独立的窗口，具有自己的独立 JavaScript 环境。因此，使用弹窗打开一个不信任的第三方网站是安全的。
2. 打开弹窗非常容易。
3. 弹窗可以导航（修改 URL），并将消息发送到 opener 窗口（即打开弹窗的窗口）。

### 阻止弹窗

在过去，很多恶意网站经常滥用弹窗。一个不好的页面可能会打开大量带有广告的弹窗。因此，现在大多数浏览器都会通过阻止弹窗来保护用户。

如果弹窗是在用户触发的事件处理程序（如 onclick）之外调用的，大多数浏览器都会阻止此类弹窗。

例如：

``` js
// 弹窗被阻止
window.open('https://javascript.info');

// 弹窗被允许
button.onclick = () => {
  window.open('https://javascript.info');
};
```

这种方式可以在某种程度上保护用户免受非必要的弹窗的影响，但是并没有完全阻止该功能。

如果弹窗是从 onclick 打开的，但是在 setTimeout 之后，该怎么办？这有点棘手。

试试运行一下这段代码：

``` js
// 3 秒后打开弹窗
setTimeout(() => window.open('http://google.com'), 3000);
```

这个弹窗在 Chrome 中会被打开，但是在 Firefox 中会被阻止。

……如果我们减少延迟，则弹窗在 Firefox 中也会被打开：

``` js
// 3 秒后打开弹窗
setTimeout(() => window.open('http://google.com'), 1000);
```

区别在于 Firefox 可以接受 2000ms 或更短的延迟，但是超过这个时间 —— 则移除“信任”。所以，第一个弹窗被阻止，而第二个却没有。

### window.open

打开一个弹窗的语法是 `window.open(url, name, params)`：

- url 要在新窗口中加载的 URL。
- name 新窗口的名称。每个窗口都有一个 window.name，在这里我们可以指定哪个窗口用于弹窗。如果已经有一个这样名字的窗口 —— 将在该窗口打开给定的 URL，否则会打开一个新窗口。
- params 新窗口的配置字符串。它包括设置，用逗号分隔。参数之间不能有空格，例如：`width=200,height=100`。

::: tip `params` 的设置项：
- 位置:
  - `left/top`（数字）—— 屏幕上窗口的左上角的坐标。这有一个限制：不能将新窗口置于屏幕外（offscreen）。
  - `width/height`（数字）—— 新窗口的宽度和高度。宽度/高度的最小值是有限制的，因此不可能创建一个不可见的窗口。
- 窗口功能：
  - `menubar`（yes/no）—— 显示或隐藏新窗口的浏览器菜单。
  - `toolbar`（yes/no）—— 显示或隐藏新窗口的浏览器导航栏（后退，前进，重新加载等）。
  - `location`（yes/no）—— 显示或隐藏新窗口的 URL 字段。Firefox 和 IE 浏览器不允许默认隐藏它。
  - `status`（yes/no）—— 显示或隐藏状态栏。同样，大多数浏览器都强制显示它。
  - `resizable`（yes/no）—— 允许禁用新窗口大小调整。不建议使用。
  - `scrollbars`（yes/no）—— 允许禁用新窗口的滚动条。不建议使用。
:::

还有一些不太受支持的特定于浏览器的功能，通常不使用。通常不使用这些功能。更多示例请见 [MDN 中的 window.open](https://developer.mozilla.org/en/DOM/window.open)。

### 示例：一个最简窗口

让我们打开一个包含最小功能集的新窗口，来看看哪些功能是浏览器允许禁用的：

``` js
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;

open('/', 'test', params);
```

在这里，大多数“窗口功能”都被禁用了，并且窗口位于屏幕外。运行它，看看会发生什么。大多数浏览器都会“修复”奇怪的东西，例如 width/height 为零以及脱离屏幕（offscreen）的 left/top 设置。例如，Chrome 打开了一个全 width/height 的窗口，使其占满整个屏幕。

让我们添加正常的定位选项和合理的 width、height、left 和 top 坐标：

``` js
let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=600,height=300,left=100,top=100`;

open('/', 'test', params);
```

大多数浏览器会根据要求显示上面的示例。

设置中的省略规则：

- 如果 open 调用中没有第三个参数，或者它是空的，则使用默认的窗口参数。
- 如果这里有一个参数字符串，但是某些 yes/no 功能被省略了，那么被省略的功能则被默认值为 no。因此，如果你指定参数，请确保将所有必需的功能明确设置为 yes。
- 如果参数中没有 left/top，那么浏览器会尝试在最后打开的窗口附近打开一个新窗口。
- 如果没有 width/height，那么新窗口的大小将与上次打开的窗口大小相同。

### 从窗口访问弹窗

open 调用会返回对新窗口的引用。它可以用来操纵弹窗的属性，更改位置，甚至更多操作。

在下面这个示例中，我们从 JavaScript 中生成弹窗：

``` js
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write("Hello, world!");
```

这里，我们在其加载完成后，修改其中的内容：

``` js
let newWindow = open('/', 'example', 'width=300,height=300')
newWindow.focus();

alert(newWindow.location.href); // (*) about:blank，加载尚未开始

newWindow.onload = function() {
  let html = `<div style="font-size:30px">Welcome!</div>`;
  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
};
```

请注意：在刚刚进行了 window.open 的时候，新窗口还没有加载完成。我们可以通过 (*) 行中的 alert 证实这一点。因此，我们需要等待 onload 以对新窗口进行更改。我们也可以对 newWin.document 使用 DOMContentLoaded 处理程序。

### 从弹窗访问窗口

弹窗也可以使用 window.opener 来访问 opener 窗口。除了弹窗之外，对其他所有窗口来说，window.opener 均为 null。

如果你运行下面这段代码，它将用 “Test” 替换 opener（也就是当前的）窗口的内容：

``` js
let newWin = window.open("about:blank", "hello", "width=200,height=200");

newWin.document.write(
  "<script>window.opener.document.body.innerHTML = 'Test'<\/script>"
);
```

所以，窗口之间的连接是双向的：主窗口和弹窗之间相互引用。

### 关闭弹窗

关闭一个窗口：win.close()。

检查一个窗口是否被关闭：win.closed。

从技术上讲，close() 方法可用于任何 window，但是如果 window 不是通过 window.open() 创建的，那么大多数浏览器都会忽略 window.close()。因此，close() 只对弹窗起作用。

如果窗口被关闭了，那么 closed 属性则为 true。这对于检查弹窗（或主窗口）是否仍处于打开状态很有用。用户可以随时关闭它，我们的代码应该考虑到这种可能性。

这段代码加载并关闭了窗口：

``` js
let newWindow = open('/', 'example', 'width=300,height=300');

newWindow.onload = function() {
  newWindow.close();
  alert(newWindow.closed); // true
};
```

### 移动和调整大小

有一些方法可以移动一个窗口，或者调整一个窗口的大小：

- `win.moveBy(x,y)`
将窗口相对于当前位置向右移动 x 像素，并向下移动 y 像素。允许负值（向上/向左移动）。
- `win.moveTo(x,y)`
将窗口移动到屏幕上的坐标 (x,y) 处。
- `win.resizeBy(width,height)`
根据给定的相对于当前大小的 width/height 调整窗口大小。允许负值。
- `win.resizeTo(width,height)`
将窗口调整为给定的大小。

还有 `window.onresize` 事件。

::: warning 仅对于弹窗
为了防止滥用，浏览器通常会阻止这些方法。它们仅在我们打开的，没有其他选项卡的弹窗中能够可靠地工作。
:::

::: warning 没有最小化/最大化
JavaScript 无法最小化或者最大化一个窗口。这些操作系统级别的功能对于前端开发者而言是隐藏的。

移动或者调整大小的方法不适用于最小化/最大化的窗口。
:::

### 滚动窗口

我们已经在 `Window 大小和滚动` 一章中讨论过了滚动窗口。

- `win.scrollBy(x,y)`
相对于当前位置，将窗口向右滚动 x 像素，并向下滚动 y 像素。允许负值。
- `win.scrollTo(x,y)`
将窗口滚动到给定坐标 (x,y)。
- `elem.scrollIntoView(top = true)`
滚动窗口，使 elem 显示在 elem.scrollIntoView(false) 的顶部（默认）或底部。

这里也有 `window.onscroll` 事件。

### 弹窗的聚焦/失焦

从理论上讲，使用 window.focus() 和 window.blur() 方法可以使窗口获得或失去焦点。此外，这里还有 focus/blur 事件，可以捕获到访问者聚焦到一个窗口和切换到其他地方的时刻。

尽管，在实际中它们被进行了严格地限制，因为在过去，恶意网站滥用这些方法。

例如，看下面这段代码:

``` js
window.onblur = () => window.focus();
```

当用户尝试从窗口切换出去（window.onblur）时，这段代码又让窗口重新获得了焦点。目的是将用户“锁定”在 window 中。

因此，浏览器必须引入很多限制，以禁用此类代码并保护用户免受广告和恶意页面的侵害。具体则取决于浏览器。

例如，移动端浏览器通常会完全忽略 window.focus()。并且，当弹窗是在单独的选项卡而不是新窗口中打开时，也无法进行聚焦。

尽管如此，在某些情况下，此类调用确实有效且很有用。

例如：

- 当我们打开一个弹窗时，在它上面执行 newWindow.focus() 是个好主意。以防万一，对于某些操作系统/浏览器组合（combination），它可以确保用户现在位于新窗口中。

- 如果我们想要跟踪访问者何时在实际使用我们的 Web 应用程序，我们可以跟踪 window.onfocus/onblur。这使我们可以暂停/恢复页面活动和动画等。但是请注意，blur 事件意味着访问者从窗口切换了出来，但他们仍然可以观察到它。窗口处在背景中，但可能仍然是可见的。

然而，弹窗很少使用，因为有其他选择：在页面内或在 iframe 中加载和显示信息。

## 跨窗口通信

“同源（Same Origin）”策略限制了窗口（window）和 frame 之间的相互访问。

这个想法出于这样的考虑，如果一个用户有两个打开的页面：一个来自 john-smith.com，另一个是 gmail.com，那么用户将不希望 john-smith.com 的脚本可以读取 gmail.com 中的邮件。所以，“同源”策略的目的是保护用户免遭信息盗窃。

### 同源

如果两个 URL 具有相同的协议，域和端口，则称它们是“同源”的。

以下的几个 URL 都是同源的：

- http://site.com
- http://site.com/
- http://site.com/my/page.html

但是下面这几个不是：

- http://www.site.com（另一个域：www. 影响）
- http://site.org（另一个域：.org 影响）
- https://site.com（另一个协议：https）
- http://site.com:8080（另一个端口：8080）

“同源”策略规定：

- 如果我们有对另外一个窗口（例如，一个使用 `window.open` 创建的弹窗，或者一个窗口中的 iframe）的引用，并且该窗口是同源的，那么我们就具有对该窗口的全部访问权限。

- 否则，如果该窗口不是同源的，那么我们就无法访问该窗口中的内容：变量，文档，任何东西。唯一的例外是 location：我们可以修改它（进而重定向用户）。但是我们无法读取 location（因此，我们无法看到用户当前所处的位置，也就不会泄漏任何信息）。

#### 实例：iframe

一个 `<iframe>` 标签承载了一个单独的嵌入的窗口，它具有自己的 `document` 和 `window`。

我们可以使用以下属性访问它们：

- `iframe.contentWindow` 来获取 `<iframe>` 中的 window。
- `iframe.contentDocument` 来获取 `<iframe>` 中的 document，是 `iframe.contentWindow.document` 的简写形式。

当我们访问嵌入的窗口中的东西时，浏览器会检查 iframe 是否具有相同的源。如果不是，则会拒绝访问（对 location 进行写入是一个例外，它是会被允许的）。

例如，让我们尝试对来自另一个源的 `<iframe>` 进行读取和写入：

``` html
<iframe src="https://example.com" id="iframe"></iframe>

<script>
  iframe.onload = function() {
    // 我们可以获取对内部 window 的引用
    let iframeWindow = iframe.contentWindow; // OK
    try {
      // ...但是无法获取其中的文档
      let doc = iframe.contentDocument; // ERROR
    } catch(e) {
      alert(e); // Security Error（另一个源）
    }

    // 并且，我们也无法读取 iframe 中页面的 URL
    try {
      // 无法从 location 对象中读取 URL
      let href = iframe.contentWindow.location.href; // ERROR
    } catch(e) {
      alert(e); // Security Error
    }

    // ...我们可以写入 location（所以，在 iframe 中加载了其他内容）！
    iframe.contentWindow.location = '/'; // OK

    iframe.onload = null; // 清空处理程序，在 location 更改后不要再运行它
  };
</script>
```

上述代码除了以下操作都会报错：

- 通过 `iframe.contentWindow` 获取对内部 `window` 的引用 —— 这是被允许的。
- 对 `location` 进行写入

与此相反，如果 `<iframe>` 具有相同的源，我们可以使用它做任何事情：

``` html
<!-- 来自同一个网站的 iframe -->
<iframe src="/" id="iframe"></iframe>

<script>
  iframe.onload = function() {
    // 可以做任何事儿
    iframe.contentDocument.body.prepend("Hello, world!");
  };
</script>
```

### 子域上的 window：document.domain

根据定义，两个具有不同域的 URL 具有不同的源。

但是，如果窗口的二级域相同，例如 john.site.com，peter.site.com 和 site.com（它们共同的二级域是 site.com），我们可以使浏览器忽略该差异，使得它们可以被作为“同源”的来对待，以便进行跨窗口通信。

为了做到这一点，每个这样的窗口都应该执行下面这行代码：

``` js
document.domain = 'site.com';
```

::: warning 已弃用，但仍有效
document.domain 属性正在被从 [规范](https://html.spec.whatwg.org/multipage/origin.html#relaxing-the-same-origin-restriction) 中删除。跨窗口通信（下面将很快解释到）是建议的替代方案。

也就是说，到目前为止，所有浏览器都支持它。并且未来也将继续支持它，而不会导致使用了 document.domain 的旧代码出现问题。
::: 

### Iframe：错误文档陷阱

当一个 iframe 来自同一个源时，我们可能会访问其 document，但是这里有一个陷阱。它与跨源无关，但你一定要知道。

在创建 iframe 后，iframe 会立即就拥有了一个文档。但是该文档不同于加载到其中的文档！

因此，如果我们要立即对文档进行操作，就可能出问题。

看一下下面这段代码：

``` html
<iframe src="/" id="iframe"></iframe>

<script>
  let oldDoc = iframe.contentDocument;
  iframe.onload = function() {
    let newDoc = iframe.contentDocument;
    // 加载的文档与初始的文档不同！
    alert(oldDoc == newDoc); // false
  };
</script>
```

我们不应该对尚未加载完成的 iframe 的文档进行处理，因为那是 `错误的文档`。如果我们在其上设置了任何事件处理程序，它们将会被忽略。

如何检测文档就位（加载完成）的时刻呢？

正确的文档在 iframe.onload 触发时肯定就位了。但是，只有在整个 iframe 和它所有资源都加载完成时，iframe.onload 才会触发。

我们可以尝试通过在 setInterval 中进行检查，以更早地捕获该时刻：

``` html
<iframe src="/" id="iframe"></iframe>

<script>
  let oldDoc = iframe.contentDocument;

  // 每 100ms 检查一次文档是否为新文档
  let timer = setInterval(() => {
    let newDoc = iframe.contentDocument;
    if (newDoc == oldDoc) return;

    alert("New document is here!");

    clearInterval(timer); // 取消 setInterval，不再需要它做任何事儿
  }, 100);
</script>
```

### 集合：window.frames

获取 `<iframe>` 的 window 对象的另一个方式是从命名集合 window.frames 中获取：

- 通过索引获取：`window.frames[0]` —— 文档中的第一个 iframe 的 window 对象。
- 通过名称获取：`window.frames.iframeName` —— 获取 name="iframeName" 的 iframe 的 window 对象。

例如：

``` html
<iframe src="/" style="height:80px" name="win" id="iframe"></iframe>

<script>
  alert(iframe.contentWindow == frames[0]); // true
  alert(iframe.contentWindow == frames.win); // true
</script>
```

一个 iframe 内可能嵌套了其他的 iframe。相应的 window 对象会形成一个层次结构（hierarchy）。

可以通过以下方式获取：

- `window.frames` —— “子”窗口的集合（用于嵌套的 iframe）。
- `window.parent` —— 对“父”（外部）窗口的引用。
- `window.top` —— 对最顶级父窗口的引用。

例如：

``` js
window.frames[0].parent === window; // true
```

我们可以使用 top 属性来检查当前的文档是否是在 iframe 内打开的：

``` js
if (window == top) { // 当前 window == window.top?
  alert('The script is in the topmost window, not in a frame');
} else {
  alert('The script runs in a frame!');
}
```

### “sandbox” iframe 特性

sandbox 特性（attribute）允许在 `<iframe>` 中禁止某些特定行为，以防止其执行不被信任的代码。它通过将 iframe 视为非同源的，或者应用其他限制来实现 iframe 的`“沙盒化”`。

对于 `<iframe sandbox src="...">`，有一个应用于其上的默认的限制集。但是，我们可以通过提供一个以空格分隔的限制列表作为特性的值，来放宽这些限制，该列表中的各项为不应该应用于这个 iframe 的限制，例如：`<iframe sandbox="allow-forms allow-popups">`。

**换句话说，一个空的 "sandbox" 特性会施加最严格的限制，但是我们用一个以空格分隔的列表，列出要移除的限制。**

以下是限制的列表：

- `allow-same-origin`
默认情况下，"sandbox" 会为 iframe 强制实施“不同来源”的策略。换句话说，它使浏览器将 iframe 视为来自另一个源，即使其 src 指向的是同一个网站也是如此。具有所有隐含的脚本限制。此选项会移除这些限制。
- `allow-top-navigation`
允许 iframe 更改 parent.location。
- `allow-forms`
允许在 iframe 中提交表单。
- `allow-scripts`
允许在 iframe 中运行脚本。
- `allow-popups`
允许在 iframe 中使用 window.open 打开弹窗。

查看 https://developer.mozilla.org/zh/docs/Web/HTML/Element/iframe 获取更多内容。

::: tip 请注意：
"sandbox" 特性的目的仅是 添加更多 限制。它无法移除这些限制。尤其是，如果 iframe 来自其他源，则无法放宽同源策略。
:::

### 跨窗口通信

postMessage 接口允许窗口之间相互通信，无论它们来自什么源。

因此，这是解决“同源”策略的方式之一。它允许来自于 john-smith.com 的窗口与来自于 gmail.com 的窗口进行通信，并交换信息，但**前提是它们双方必须均同意并调用相应的 JavaScript 函数**。这可以保护用户的安全。

这个接口有两个部分。

#### postMessage

想要发送消息的窗口需要调用接收窗口的 postMessage 方法。换句话说，如果我们想把消息发送给 win，我们应该调用 `win.postMessage(data, targetOrigin)`。

参数：

- `data`
要发送的数据。可以是任何对象，数据会被通过使用“结构化序列化算法（structured serialization algorithm）”进行克隆。IE 浏览器只支持字符串，因此我们需要对复杂的对象调用 JSON.stringify 方法进行处理，以支持该浏览器。
- `targetOrigin`
指定目标窗口的源，以便只有来自给定的源的窗口才能获得该消息。

`targetOrigin` 是一种安全措施。请记住，如果目标窗口是非同源的，我们无法在发送方窗口读取它的 location。因此，我们无法确定当前在预期的窗口中打开的是哪个网站：用户随时可以导航离开，并且发送方窗口对此一无所知。

指定 `targetOrigin` 可以确保窗口仅在当前仍处于正确的网站时接收数据。在有敏感数据时，这非常重要。

例如，这里的 win 仅在它拥有来自 `http://example.com` 这个源的文档时，才会接收消息：

``` html
<iframe src="http://example.com" name="example">

<script>
  let win = window.frames.example;

  win.postMessage("message", "http://example.com");
</script>
```

如果我们不希望做这个检查，可以将 `targetOrigin` 设置为 `*`。

#### onmessage

为了接收消息，目标窗口应该在 message 事件上有一个处理程序。当 postMessage 被调用时触发该事件（并且 targetOrigin 检查成功）。

event 对象具有特殊属性：

- `data`
从 postMessage 传递来的数据。
- `origin`
发送方的源，例如 http://javascript.info。
- `source`
对发送方窗口的引用。如果我们想，我们可以立即 source.postMessage(...) 回去。

要为 message 事件分配处理程序，我们应该使用 addEventListener，简短的语法 window.onmessage 不起作用。

这里有一个例子：

``` js
window.addEventListener("message", function(event) {
  if (event.origin != 'http://javascript.info') {
    // 来自未知的源的内容，我们忽略它
    return;
  }

  alert( "received: " + event.data );

  // 可以使用 event.source.postMessage(...) 向回发送消息
});
```

## 点击劫持攻击

“点击劫持”攻击允许恶意页面 以用户的名义 点击“受害网站”。

许多网站都被黑客以这种方式攻击过，包括 Twitter、Facebook 和 Paypal 等许多网站。当然，它们都已经被修复了。

### 原理

原理十分简单。

我们以 Facebook 为例，解释点击劫持是如何完成的：

1. 访问者被恶意页面吸引。怎样吸引的不重要。
2. 页面上有一个看起来无害的链接（例如：“变得富有”或者“点我，超好玩！”）。
3. 恶意页面在该链接上方放置了一个透明的 `<iframe>`，其 src 来自于 facebook.com，这使得“点赞”按钮恰好位于该链接上面。这通常是通过 z-index 实现的。
4. 用户尝试点击该链接时，实际上点击的是“点赞”按钮。

我们进行攻击所需要做的 —— 就是将 `<iframe>` 放置在恶意页面中，使得按钮恰好位于链接的正上方。这样当用户点击链接时，他们实际上点击的是按钮。这通常可以通过 CSS 实现。就像这样：

``` css
    iframe {
      width: 400px;
      height: 100px;
      position: absolute;
      top: 5px;
      left: -14px;
      opacity: 0;
      z-index: 1;
    }
```

::: tip 点击劫持是对点击事件，而非键盘事件
此攻击仅影响鼠标行为（或者类似的行为，例如在手机上的点击）。

键盘输入很难重定向。从技术上讲，我们可以用 iframe 的文本区域覆盖原有的文本区域实现攻击。因此，当访问者试图聚焦页面中的输入时，实际上聚焦的是 iframe 中的输入。

但是这里有个问题。访问者键入的所有内容都会被隐藏，因为该 iframe 是不可见的。

当用户无法在屏幕上看到自己输入的字符时，通常会停止打字。
:::

### 传统防御

最古老的防御措施是一段用于禁止在 frame 中打开页面的 JavaScript 代码（所谓的 “framebusting”）。

它看起来像这样：

``` js
if (top != window) {
  top.location = window.location;
}
```

意思是说：如果 window 发现它不在顶部，那么它将自动使其自身位于顶部。

这个方法并不可靠，因为有许多方式可以绕过这个限制。例如阻止顶级导航、利用Sandbox 特性等

### X-Frame-Options

服务器端 header `X-Frame-Options` 可以允许或禁止在 frame 中显示页面。

它必须被完全作为 HTTP-header 发送：如果浏览器在 HTML `<meta>` 标签中找到它，则会忽略它。因此，`<meta http-equiv="X-Frame-Options"...>` 没有任何作用。

这个 header 可能包含 3 个值：

- `DENY`
始终禁止在 frame 中显示此页面。
- `SAMEORIGIN`
允许在和父文档同源的 frame 中显示此页面。
- `ALLOW-FROM domain`
允许在来自给定域的父文档的 frame 中显示此页面。

例如，Twitter 使用的是 `X-Frame-Options: SAMEORIGIN`。

结果如下：

``` html
<iframe src="https://twitter.com"></iframe>
```

上面这个 iframe 可能为空，或者通过 alert 告知你浏览器不允许以这种方式导航至该页面，这取决于你的浏览器。

### 显示禁用的功能

X-Frame-Options 有一个副作用。其他的网站即使有充分的理由也无法在 frame 中显示我们的页面。

因此，还有其他解决方案……例如，我们可以用一个样式为 height: 100%; width: 100%; 的 `<div>` “覆盖”页面，这样它就能拦截所有点击。如果 window == top 或者我们确定不需要保护时，再将该 `<div>` 移除。

像这样：

``` html
<style>
  #protector {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99999999;
  }
</style>

<div id="protector">
  <a href="/" target="_blank">前往网站</a>
</div>

<script>
  // 如果顶级窗口来自其他源，这里则会出现一个 error
  // 但是在本例中没有问题
  if (top.document.domain == document.domain) {
    protector.remove();
  }
</script>
```

### Samesite cookie 特性

samesite cookie 特性也可以阻止点击劫持攻击。

具有 samesite 特性的 cookie 仅在网站是通过直接方式打开（而不是通过 frame 或其他方式）的情况下才发送到网站。更多细节请见 Cookie，document.cookie。

如果网站，例如 Facebook，在其身份验证 cookie 中具有 samesite 特性，像这样：

``` txt
Set-Cookie: authorization=secret; samesite
```

……那么，当在另一个网站中的 iframe 中打开 Facebook 时，此类 cookie 将不会被发送。因此，攻击将失败。

当不使用 cookie 时，samesite cookie 特性将不会有任何影响。这可以使其他网站能够轻松地在 iframe 中显示我们公开的、未进行身份验证的页面。

然而，这也可能会使得劫持攻击在少数情况下起作用。例如，通过检查 IP 地址来防止重复投票的匿名投票网站仍然会受到点击劫持的攻击，因为它不使用 cookie 对用户身份进行验证。



















































































































































































































































