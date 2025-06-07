---
title: 事件简介
date: '2025-04-16'
tags:
- FE
---

# 事件简介

浏览器事件、事件属性和处理模式简介。

## 浏览器事件简介

`事件` 是某事发生的信号。所有的 DOM 节点都生成这样的信号（但事件不仅限于 DOM）。

这是最有用的 DOM 事件的列表，你可以浏览一下：

鼠标事件：

- click —— 当鼠标点击一个元素时（触摸屏设备会在点击时生成）。
- contextmenu —— 当鼠标右键点击一个元素时。
- mouseover / mouseout —— 当鼠标指针移入/离开一个元素时。
- mousedown / mouseup —— 当在元素上按下/释放鼠标按钮时。
- mousemove —— 当鼠标移动时。

键盘事件：

- keydown 和 keyup —— 当按下和松开一个按键时。

表单（form）元素事件：

- submit —— 当访问者提交了一个 `<form>` 时。
- focus —— 当访问者聚焦于一个元素时，例如聚焦于一个 `<input>`。

Document 事件：

- DOMContentLoaded —— 当 HTML 的加载和处理均完成，DOM 被完全构建完成时。

CSS 事件：

- transitionend —— 当一个 CSS 动画完成时。

还有很多其他事件。

### 事件处理程序

为了对事件作出响应，我们可以分配一个 `处理程序（handler）`—— 一个在事件发生时运行的函数。

处理程序是在发生`用户行为（action）`时运行 JavaScript 代码的一种方式。

有几种分配处理程序的方法。让我们来看看，从最简单的开始。

#### HTML 特性

处理程序可以设置在 HTML 中名为 `on<event>` 的特性（attribute）中。

例如，要为一个 `input` 分配一个 `click` 处理程序，我们可以使用 `onclick`，像这样；

``` html
<input value="Click me" onclick="alert('Click!')" type="button">
```

在鼠标点击时，`onclick` 中的代码就会运行。

请注意，在 `onclick` 中，我们使用单引号，因为特性本身使用的是双引号。如果我们忘记了代码是在特性中的，而使用了双引号，像这样：`onclick="alert("Click!")"`，那么它就无法正确运行。

HTML 特性不是编写大量代码的好位置，因此我们最好创建一个 JavaScript 函数，然后在 HTML 特性中调用这个函数。

`countRabbits()`：

``` html
<script>
  function countRabbits() {
    for(let i=1; i<=3; i++) {
      alert("Rabbit number " + i);
    }
  }
</script>

<input type="button" onclick="countRabbits()" value="Count rabbits!">
```

我们知道，HTML 特性名是大小写不敏感的，所以 ONCLICK 和 onClick 以及 onCLICK 都一样可以运行。但是特性通常是小写的：onclick。

#### DOM 属性

我们可以使用 DOM 属性（property）`on<event>` 来分配处理程序。

例如 elem.onclick：

``` html
<input id="elem" type="button" value="Click me">
<script>
  elem.onclick = function() {
    alert('Thank you');
  };
</script>
```

如果一个处理程序是通过 HTML 特性（attribute）分配的，那么随后浏览器读取它，并从特性的内容创建一个新函数，并将这个函数写入 DOM 属性（property）。

因此，这种方法实际上与前一种方法相同。

因为这里只有一个 onclick 属性，所以我们无法分配更多事件处理程序。

在下面这个示例中，我们使用 JavaScript 添加了一个处理程序，覆盖了现有的处理程序：

``` html
<input type="button" id="elem" onclick="alert('Before')" value="Click me">
<script>
  elem.onclick = function() { // 覆盖了现有的处理程序
    alert('After'); // 只会显示此内容
  };
</script>
```

要移除一个处理程序 —— 赋值 `elem.onclick = null`。

### 访问元素：this

处理程序中的 `this` 的值是对应的元素。就是处理程序所在的那个元素。

下面这行代码中的 `button` 使用 `this.innerHTML` 来显示它的内容：

``` html
<button onclick="alert(this.innerHTML)">Click me</button>
```

### 可能出现的错误

如果你刚开始写事件 —— 请注意一些细微之处。

我们可以将一个现存的函数用作处理程序：

``` js
function sayThanks() {
  alert('Thanks!');
}

elem.onclick = sayThanks;
```

但要注意：函数应该是以 `sayThanks` 的形式进行赋值，而不是 `sayThanks()`。

``` js
// 正确
button.onclick = sayThanks;

// 错误
button.onclick = sayThanks();
```

如果我们添加了括号，那么 `sayThanks()` 就变成了一个函数调用。所以，最后一行代码实际上获得的是函数执行的 `结果`，即 undefined（因为这个函数没有返回值）。此代码不会工作。

……但在标记（markup）中，我们确实需要括号：

``` html
<input type="button" id="button" onclick="sayThanks()">
```

这个区别很容易解释。当浏览器读取 HTML 特性（attribute）时，浏览器将会使用 特性中的内容 创建一个处理程序。

所以，标记（markup）会生成下面这个属性：

``` js
button.onclick = function() {
  sayThanks(); // <-- 特性（attribute）中的内容变到了这里
};
```

不要对处理程序使用 `setAttribute`。

这样的调用会失效：

``` js
// 点击 <body> 将产生 error，
// 因为特性总是字符串的，函数变成了一个字符串
document.body.setAttribute('onclick', function() { alert(1) });
```

**DOM 属性是大小写敏感的。**

将处理程序分配给 elem.onclick，而不是 elem.ONCLICK，因为 DOM 属性是大小写敏感的。

### addEventListener

上述分配处理程序的方式的根本问题是 —— 我们不能为一个事件分配多个处理程序。

假设，在我们点击了一个按钮时，我们代码中的一部分想要高亮显示这个按钮，另一部分则想要显示一条消息。

我们想为此事件分配两个处理程序。但是，新的 DOM 属性将覆盖现有的 DOM 属性：

``` js
input.onclick = function() { alert(1); }
// ...
input.onclick = function() { alert(2); } // 替换了前一个处理程序
```

Web 标准的开发者很早就了解到了这一点，并提出了一种使用特殊方法 addEventListener 和 removeEventListener 来管理处理程序的替代方法。它们没有这样的问题。

添加处理程序的语法：

``` js
element.addEventListener(event, handler[, options]);
```

- `event` 事件名，例如："click"。
- `handler` 处理程序。
- `options` 具有以下属性的附加可选对象：
  - `once`：如果为 true，那么会在被触发后自动删除监听器。
  - `capture`：事件处理的阶段，我们稍后将在 冒泡和捕获 一章中介绍。由于历史原因，options 也可以是 false/true，它与 {capture: false/true} 相同。
  - `passive`：如果为 true，那么处理程序将不会调用 preventDefault()，我们稍后将在 浏览器默认行为 一章中介绍。

要移除处理程序，可以使用 `removeEventListener`：

``` js
element.removeEventListener(event, handler[, options]);
```

::: warning 移除需要相同的函数
要移除处理程序，我们需要传入与分配的函数完全相同的函数。

这不起作用：

``` js
elem.addEventListener( "click" , () => alert('Thanks!'));
// ....
elem.removeEventListener( "click", () => alert('Thanks!'));
```

处理程序不会被移除，因为 removeEventListener 获取了另一个函数 —— 使用相同的代码，但这并不起作用，因为它是一个不同的函数对象。

下面是正确方法：

``` js
function handler() {
  alert( 'Thanks!' );
}

input.addEventListener("click", handler);
// ....
input.removeEventListener("click", handler);
```
请注意 —— 如果我们不将函数存储在一个变量中，那么我们就无法移除它。由 addEventListener 分配的处理程序将无法被“读回”。
:::

多次调用 `addEventListener` 允许添加多个处理程序，如下所示：

``` html
<input id="elem" type="button" value="Click me"/>

<script>
  function handler1() {
    alert('Thanks!');
  };

  function handler2() {
    alert('Thanks again!');
  }

  elem.onclick = () => alert("Hello");
  elem.addEventListener("click", handler1); // Thanks!
  elem.addEventListener("click", handler2); // Thanks again!
</script>
```

正如我们在上面这个例子中所看到的，我们可以 同时 使用 DOM 属性和 addEventListener 来设置处理程序。但通常我们只使用其中一种方式。

::: warning 对于某些事件，只能通过 addEventListener 设置处理程序
有些事件无法通过 DOM 属性进行分配。只能使用 addEventListener。

例如，DOMContentLoaded 事件，该事件在文档加载完成并且 DOM 构建完成时触发。所以 addEventListener 更通用。虽然这样的事件是特例而不是规则。
:::

### 事件对象

为了正确处理事件，我们需要更深入地了解发生了什么。不仅仅是 “click” 或 “keydown”，还包括鼠标指针的坐标是什么？按下了哪个键？等等。

当事件发生时，浏览器会创建一个 `event` 对象，将详细信息放入其中，并将其作为参数传递给处理程序。

下面是一个从 `event` 对象获取鼠标指针的坐标的示例：

``` html
<input type="button" value="Click me" id="elem">

<script>
  elem.onclick = function(event) {
    // 显示事件类型、元素和点击的坐标
    alert(event.type + " at " + event.currentTarget);
    alert("Coordinates: " + event.clientX + ":" + event.clientY);
  };
</script>
```

`event` 对象的一些属性：

- `event.type` 事件类型，这里是 `"click"`。
- `event.currentTarget` 处理事件的元素。这与 this 相同，除非处理程序是一个箭头函数，或者它的 this 被绑定到了其他东西上，之后我们就可以从 event.currentTarget 获取元素了。
- `event.clientX / event.clientY` 指针事件（pointer event）的指针的窗口相对坐标。

还有很多属性。其中很多都取决于事件类型：键盘事件具有一组属性，指针事件具有另一组属性，稍后我们将详细讨论不同事件，那时我们再对其进行详细研究。

### 对象处理程序：handleEvent

我们不仅可以分配函数，还可以使用 `addEventListener` 将一个对象分配为事件处理程序。当事件发生时，就会调用该对象的 `handleEvent` 方法。

例如：

``` html
<button id="elem">Click me</button>

<script>
  let obj = {
    handleEvent(event) {
      alert(event.type + " at " + event.currentTarget);
    }
  };

  elem.addEventListener('click', obj);
</script>
```

正如我们所看到的，当 `addEventListener` 接收一个对象作为处理程序时，在事件发生时，它就会调用 `obj.handleEvent(event)` 来处理事件。

我们也可以对此使用一个类：

``` html
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
          elem.innerHTML = "Mouse button pressed";
          break;
        case 'mouseup':
          elem.innerHTML += "...and released.";
          break;
      }
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

这里，同一个对象处理两个事件。请注意，我们需要使用 addEventListener 来显式设置事件，以指明要监听的事件。这里的 menu 对象只监听 mousedown 和 mouseup，而没有任何其他类型的事件。

handleEvent 方法不必通过自身完成所有的工作。它可以调用其他特定于事件的方法，例如：

``` html
<button id="elem">Click me</button>

<script>
  class Menu {
    handleEvent(event) {
      // mousedown -> onMousedown
      let method = 'on' + event.type[0].toUpperCase() + event.type.slice(1);
      this[method](event);
    }

    onMousedown() {
      elem.innerHTML = "Mouse button pressed";
    }

    onMouseup() {
      elem.innerHTML += "...and released.";
    }
  }

  let menu = new Menu();
  elem.addEventListener('mousedown', menu);
  elem.addEventListener('mouseup', menu);
</script>
```

现在事件处理程序已经明确地分离了出来，这样更容易进行代码编写和后续维护。

## 冒泡和捕获

让我们从一个示例开始。

处理程序（handler）被分配给了 `<div>`，但是如果你点击任何嵌套的标签（例如 `<em>` 或 `<code>`），该处理程序也会运行：

``` html
<div onclick="alert('The handler!')">
  <em>If you click on <code>EM</code>, the handler on <code>DIV</code> runs.</em>
</div>
```

这是不是有点奇怪？如果实际上点击的是 `<em>`，为什么在 `<div>` 上的处理程序会运行？

### 冒泡

冒泡（bubbling）原理很简单。

**当一个事件发生在一个元素上，它会首先运行在该元素上的处理程序，然后运行其父元素上的处理程序，然后一直向上到其他祖先上的处理程序。**

假设我们有 3 层嵌套 FORM > DIV > P，它们各自拥有一个处理程序：

``` html
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form onclick="alert('form')">FORM
  <div onclick="alert('div')">DIV
    <p onclick="alert('p')">P</p>
  </div>
</form>
```

点击内部的 `<p>` 会首先运行 onclick：

- 在该 `<p>` 上的。
- 然后是外部 `<div>` 上的。
- 然后是外部 `<form>` 上的。
- 以此类推，直到最后的 document 对象。

因此，如果我们点击 `<p>`，那么我们将看到 3 个 alert：`p → div → form`。

这个过程被称为“冒泡（bubbling）”，因为事件从内部元素“冒泡”到所有父级，就像在水里的气泡一样。

::: warning 几乎所有事件都会冒泡。
这句话中的关键词是“几乎”。

例如，`focus` 事件不会冒泡。同样，我们以后还会遇到其他例子。但这仍然是例外，而不是规则，大多数事件的确都是冒泡的。
::: 

### event.target

父元素上的处理程序始终可以获取事件实际发生位置的详细信息。

引发事件的那个`嵌套层级最深的元素`被称为目标元素,可以通过 `event.target` 访问。

注意与 `this`（=event.currentTarget）之间的区别：

- `event.target` —— 是引发事件的“目标”元素，它在冒泡过程中不会发生变化。
- `this` —— 是“当前”元素，其中有一个当前正在运行的处理程序。

例如，如果我们有一个处理程序 `form.onclick`，那么它可以“捕获”表单内的所有点击。无论点击发生在哪里，它都会冒泡到 `<form>` 并运行处理程序。

在 `form.onclick` 处理程序中：

- `this`（=event.currentTarget）是 `<form>` 元素，因为处理程序在它上面运行。
- `event.target` 是表单中实际被点击的元素。

### 停止冒泡

冒泡事件从目标元素开始向上冒泡。通常，它会一直上升到 `<html>`，然后再到 document 对象，有些事件甚至会到达 window，它们会调用路径上所有的处理程序。

但是任意处理程序都可以决定事件已经被完全处理，并停止冒泡。

用于停止冒泡的方法是 `event.stopPropagation()`。

例如，如果你点击 `<button>`，这里的 body.onclick 不会工作：

``` html
<body onclick="alert(`the bubbling doesn't reach here`)">
  <button onclick="event.stopPropagation()">Click me</button>
</body>
```

::: tip event.stopImmediatePropagation()
如果一个元素在一个事件上有多个处理程序，即使其中一个停止冒泡，其他处理程序仍会执行。

换句话说，event.stopPropagation() 停止向上移动，但是当前元素上的其他处理程序都会继续运行。

有一个 event.stopImmediatePropagation() 方法，可以用于停止冒泡，并阻止当前元素上的处理程序运行。使用该方法之后，其他处理程序就不会被执行。
:::

### 捕获

事件处理的另一个阶段被称为“捕获（capturing）”。它很少被用在实际开发中，但有时是有用的。

DOM 事件标准描述了事件传播的 3 个阶段：

- 捕获阶段（Capturing phase）—— 事件（从 Window）向下走近元素。
- 目标阶段（Target phase）—— 事件到达目标元素。
- 冒泡阶段（Bubbling phase）—— 事件从元素上开始冒泡。

下面是在表格中点击 `<td>` 的图片，摘自规范：

![eventflow](https://zh.javascript.info/article/bubbling-and-capturing/eventflow.svg)

也就是说：点击 `<td>`，事件首先通过祖先链向下到达元素（捕获阶段），然后到达目标（目标阶段），最后上升（冒泡阶段），在途中调用处理程序。

之前，我们只讨论了冒泡，因为捕获阶段很少被使用。通常我们看不到它。

使用 `on<event>` 属性或使用 HTML 特性（attribute）或使用两个参数的 addEventListener(event, handler) 添加的处理程序，对捕获一无所知，它们仅在第二阶段和第三阶段运行。

为了在捕获阶段捕获事件，我们需要将处理程序的 `capture` 选项设置为 true：

``` js
elem.addEventListener(..., {capture: true})
// 或者，用 {capture: true} 的别名 "true"
elem.addEventListener(..., true)
```

`capture` 选项有两个可能的值：

- 如果为 false（默认值），则在冒泡阶段设置处理程序。
- 如果为 true，则在捕获阶段设置处理程序。

请注意，虽然形式上有 3 个阶段，但第 2 阶段（“目标阶段”：事件到达元素）没有被单独处理：捕获阶段和冒泡阶段的处理程序都在该阶段被触发。

让我们来看看捕获和冒泡：

``` html
<style>
  body * {
    margin: 10px;
    border: 1px solid blue;
  }
</style>

<form>FORM
  <div>DIV
    <p>P</p>
  </div>
</form>

<script>
  for(let elem of document.querySelectorAll('*')) {
    elem.addEventListener("click", e => alert(`Capturing: ${elem.tagName}`), true);
    elem.addEventListener("click", e => alert(`Bubbling: ${elem.tagName}`));
  }
</script>
```

上面这段代码为文档中的 每个 元素都设置了点击处理程序，以查看哪些元素上的点击事件处理程序生效了。

如果你点击了 `<p>`，那么顺序是：

1. HTML → BODY → FORM → DIV（捕获阶段第一个监听器）：
2. P（目标阶段，触发两次，因为我们设置了两个监听器：捕获和冒泡）
3. DIV → FORM → BODY → HTML（冒泡阶段，第二个监听器）。

有一个属性 `event.eventPhase`，它告诉我们捕获事件的阶段数。但它很少被使用，因为我们通常是从处理程序中了解到它。

::: tip 要移除处理程序，removeEventListener 需要同一阶段
如果我们 `addEventListener(..., true)`，那么我们应该在 `removeEventListener(..., true)` 中提到同一阶段，以正确删除处理程序。
:::

::: tip 同一元素的同一阶段的监听器按其设置顺序运行
如果我们在同一阶段有多个事件处理程序，并通过 addEventListener 分配给了相同的元素，则它们的运行顺序与创建顺序相同：
```js
elem.addEventListener("click", e => alert(1)); // 会先被触发
elem.addEventListener("click", e => alert(2));
```
:::

## 事件委托

捕获和冒泡允许我们实现最强大的事件处理模式之一，即 事件委托 模式。

这个想法是，如果我们有许多以类似方式处理的元素，那么就不必为每个元素分配一个处理程序 —— 而是将单个处理程序放在它们的共同祖先上。

在处理程序中，我们获取 event.target 以查看事件实际发生的位置并进行处理。

让我们看一个示例 —— 反映中国古代哲学的 `八卦图`。其 HTML 如下所示：

``` html
<table>
  <tr>
    <th colspan="3"><em>Bagua</em> Chart: Direction, Element, Color, Meaning</th>
  </tr>
  <tr>
    <td class="nw"><strong>Northwest</strong><br>Metal<br>Silver<br>Elders</td>
    <td class="n">...</td>
    <td class="ne">...</td>
  </tr>
  <tr>...2 more lines of this kind...</tr>
  <tr>...2 more lines of this kind...</tr>
</table>
```

该表格有 9 个单元格（cell），但可以有 99 个或 9999 个单元格，这都不重要。

我们的任务是在点击时高亮显示被点击的单元格 `<td>`。

与其为每个 `<td>`（可能有很多）分配一个 onclick 处理程序 —— 我们可以在 `<table>` 元素上设置一个“捕获所有”的处理程序。

它将使用 `event.target` 来获取点击的元素并高亮显示它。

代码如下：

``` js
let selectedTd;

table.onclick = function(event) {
  let target = event.target; // 在哪里点击的？

  if (target.tagName != 'TD') return; // 不在 TD 上？那么我们就不会在意

  highlight(target); // 高亮显示它
};

function highlight(td) {
  if (selectedTd) { // 移除现有的高亮显示，如果有的话
    selectedTd.classList.remove('highlight');
  }
  selectedTd = td;
  selectedTd.classList.add('highlight'); // 高亮显示新的 td
}
```

此代码不会关心在表格中有多少个单元格。我们可以随时动态添加/移除 `<td>`，高亮显示仍然有效。

尽管如此，但还是存在缺陷。

点击可能不是发生在 `<td>` 上，而是发生在其内部。

在我们的例子中，如果我们看一下 HTML 内部，我们可以看到 `<td>` 内还有嵌套的标签，例如 `<strong>`：

``` html
<td>
  <strong>Northwest</strong>
  ...
</td>
```

自然地，如果在该 `<strong>` 上点击，那么它将成为 event.target 的值。

在处理程序 table.onclick 中，我们应该接受这样的 event.target，并确定该点击是否在 `<td>` 内。

下面是改进后的代码：

``` js
table.onclick = function(event) {
  let td = event.target.closest('td'); // (1)

  if (!td) return; // (2)

  if (!table.contains(td)) return; // (3)

  highlight(td); // (4)
};
```

最终，我们得到了一个快速、高效的用于高亮显示的代码，该代码与表格中的 `<td>` 的数量无关。

### 委托示例：标记中的行为

事件委托还有其他用途。（本节标题中的“标记中的行为”即 action in markup）

例如，我们想要编写一个有“保存”、“加载”和“搜索”等按钮的菜单。并且，这里有一个具有 save、load 和 search 等方法的对象。如何匹配它们？

第一个想法可能是为每个按钮分配一个单独的处理程序。但是有一个更优雅的解决方案。我们可以为整个菜单添加一个处理程序，并为具有方法调用的按钮添加 `data-action` 特性（attribute）：

``` html
<button data-action="save">Click to Save</button>
```

处理程序读取特性（attribute）并执行该方法。工作示例如下：

``` html
<div id="menu">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="search">Search</button>
</div>

<script>
  class Menu {
    constructor(elem) {
      this._elem = elem;
      elem.onclick = this.onClick.bind(this); // (*)
    }

    save() {
      alert('saving');
    }

    load() {
      alert('loading');
    }

    search() {
      alert('searching');
    }

    onClick(event) {
      let action = event.target.dataset.action;
      if (action) {
        this[action]();
      }
    };
  }

  new Menu(menu);
</script>
```

请注意，`this.onClick` 在 (*) 行中被绑定到了 this。这很重要，因为否则内部的 `this` 将引用 `DOM 元素`（elem），而不是 `Menu` 对象，那样的话，`this[action]` 将不是我们所需要的。

那么，这里的委托给我们带来了什么好处？

- 我们不需要编写代码来为每个按钮分配一个处理程序。只需要创建一个方法并将其放入标记（markup）中即可。
- HTML 结构非常灵活，我们可以随时添加/移除按钮。

我们也可以使用 .action-save，.action-load 类，但 data-action 特性（attribute）在语义上更好。我们也可以在 CSS 规则中使用它。

### “行为”模式

我们还可以使用事件委托将“行为（behavior）”以 声明方式 添加到具有特殊特性（attribute）和类的元素中。

行为模式分为两个部分：

1. 我们将自定义特性添加到描述其行为的元素。
2. 用文档范围级的处理程序追踪事件，如果事件发生在具有特定特性的元素上 —— 则执行行为（action）。

#### 行为：计数器

例如，这里的特性 data-counter 给按钮添加了一个“点击增加”的行为。

```html
Counter: <input type="button" value="1" data-counter>
One more counter: <input type="button" value="2" data-counter>

<script>
  document.addEventListener('click', function(event) {

    if (event.target.dataset.counter != undefined) { // 如果这个特性存在...
      event.target.value++;
    }

  });
</script>
```

如果我们点击按钮 —— 它的值就会增加。但不仅仅是按钮，一般的方法在这里也很重要。

我们可以根据需要使用 data-counter 特性，多少都可以。我们可以随时向 HTML 添加新的特性。使用事件委托，我们属于对 HTML 进行了“扩展”，添加了描述新行为的特性。

#### 行为：切换器

再举一个例子。点击一个具有 data-toggle-id 特性的元素将显示/隐藏具有给定 id 的元素：

``` html
<button data-toggle-id="subscribe-mail">
  Show the subscription form
</button>

<form id="subscribe-mail" hidden>
  Your mail: <input type="email">
</form>

<script>
  document.addEventListener('click', function(event) {
    let id = event.target.dataset.toggleId;
    if (!id) return;

    let elem = document.getElementById(id);

    elem.hidden = !elem.hidden;
  });
</script>
```

让我们再次注意我们做了什么。现在，要向元素添加切换功能 —— 无需了解 JavaScript，只需要使用特性 data-toggle-id 即可。

这可能变得非常方便 —— 无需为每个这样的元素编写 JavaScript。只需要使用行为。文档级处理程序使其适用于页面的任意元素。

我们也可以组合单个元素上的多个行为。

“行为”模式可以替代 JavaScript 的小片段。

## 浏览器默认行为

许多事件会自动触发浏览器执行某些行为。

例如：

- 点击一个链接 —— 触发导航（navigation）到该 URL。
- 点击表单的提交按钮 —— 触发提交到服务器的行为。
- 在文本上按下鼠标按钮并移动 —— 选中文本。

如果我们使用 JavaScript 处理一个事件，那么我们通常不希望发生相应的浏览器行为。而是想要实现其他行为进行替代。

### 阻止浏览器行为

有两种方式来告诉浏览器我们不希望它执行默认行为：

- 主流的方式是使用 event 对象。有一个 `event.preventDefault()` 方法。
- 如果处理程序是使用 `on<event>`（而不是 addEventListener）分配的，那返回 false 也同样有效。

在下面这个示例中，点击链接不会触发导航（navigation），浏览器不会执行任何操作：

``` html
<a href="/" onclick="return false">Click here</a>
or
<a href="/" onclick="event.preventDefault()">here</a>
```

在下一个示例中，我们将使用此技术来创建 JavaScript 驱动的菜单。

::: warning 从处理程序返回 false 是一个例外
事件处理程序返回的值通常会被忽略。

唯一的例外是从使用 `on<event>` 分配的处理程序中返回的 `return false`。

在所有其他情况下，return 值都会被忽略。并且，返回 true 没有意义。
:::

#### 示例：菜单

考虑一个网站菜单，如下所示：

``` html
<ul id="menu" class="menu">
  <li><a href="/html">HTML</a></li>
  <li><a href="/javascript">JavaScript</a></li>
  <li><a href="/css">CSS</a></li>
</ul>
```

菜单项是通过使用 HTML 链接 `<a>` 实现的，而不是使用按钮 `<button>`。这样做有几个原因，例如：

- 许多人喜欢使用“右键单击” —— “在一个新窗口打开链接”。如果我们使用 `<button>` 或 `<span>`，这个效果就无法实现。
- 搜索引擎在建立索引时遵循 `<a href="...">` 链接。

所以我们在标记（markup）中使用了 ·。但通常我们打算处理 JavaScript 中的点击。因此，我们应该阻止浏览器默认行为。

像这样：

``` js
menu.onclick = function(event) {
  if (event.target.nodeName != 'A') return;

  let href = event.target.getAttribute('href');
  alert( href ); // ...可以从服务器加载，UI 生成等

  return false; // 阻止浏览器行为（不前往访问 URL）
};
```

如果我们省略 return false，那么在我们的代码执行完毕后，浏览器将执行它的“默认行为” —— 导航至在 href 中的 URL。

顺便说一句，这里使用事件委托会使我们的菜单更灵活。我们可以添加嵌套列表并使用 CSS 对其进行样式设置来实现 “slide down” 的效果。

::: tip 后续事件
某些事件会相互转化。如果我们阻止了第一个事件，那就没有第二个事件了。

例如，在 `<input>` 字段上的 mousedown 会导致在其中获得焦点，以及 focus 事件。如果我们阻止 mousedown 事件，在这就没有焦点了。

尝试点击下面的第一个 `<input>` —— 会发生 focus 事件。但是如果你点击第二个，则没有聚焦。
``` html
<input value="Focus works" onfocus="this.value=''">
<input onmousedown="return false" onfocus="this.value=''" value="Click me">
```
这是因为浏览器行为在 mousedown 上被取消。如果我们用另一种方式进行输入，则仍然可以进行聚焦。例如，可以使用 Tab 键从第一个输入切换到第二个输入。但鼠标点击则不行。
:::

### 处理程序选项 “passive”

addEventListener 的可选项 passive: true 向浏览器发出信号，表明处理程序将不会调用 preventDefault()。

为什么需要这样做？

移动设备上会发生一些事件，例如 touchmove（当用户在屏幕上移动手指时），默认情况下会导致滚动，但是可以使用处理程序的 preventDefault() 来阻止滚动。

因此，当浏览器检测到此类事件时，它必须首先处理所有处理程序，然后如果没有任何地方调用 preventDefault，则页面可以继续滚动。但这可能会导致 UI 中不必要的延迟和“抖动”。

passive: true 选项告诉浏览器，处理程序不会取消滚动。然后浏览器立即滚动页面以提供最大程度的流畅体验，并通过某种方式处理事件。

对于某些浏览器（Firefox，Chrome），默认情况下，touchstart 和 touchmove 事件的 passive 为 true。

### event.defaultPrevented

如果默认行为被阻止，那么 event.defaultPrevented 属性为 true，否则为 false。

这儿有一个有趣的用例。

你还记得我们在 冒泡和捕获 一章中讨论过的 event.stopPropagation()，以及为什么停止冒泡是不好的吗？

有时我们可以使用 event.defaultPrevented 来代替，来通知其他事件处理程序，该事件已经被处理。

我们来看一个实际的例子。

默认情况下，浏览器在 contextmenu 事件（单击鼠标右键）时，显示带有标准选项的上下文菜单。我们可以阻止它并显示我们自定义的菜单，就像这样：

``` html
<button>Right-click shows browser context menu</button>

<button oncontextmenu="alert('Draw our menu'); return false">
  Right-click shows our context menu
</button>
```

现在，除了该上下文菜单外，我们还想实现文档范围的上下文菜单。

右键单击时，应该显示最近的上下文菜单：

``` html
<p>Right-click here for the document context menu</p>
<button id="elem">Right-click here for the button context menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

问题是，当我们点击 elem 时，我们会得到两个菜单：按钮级和文档级（事件冒泡）的菜单。

如何修复呢？其中一个解决方案是：“当我们在按钮处理程序中处理鼠标右键单击事件时，我们阻止其冒泡”，使用 event.stopPropagation()：

``` html
<p>Right-click for the document menu</p>
<button id="elem">Right-click for the button menu (fixed with event.stopPropagation)</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

现在按钮级菜单如期工作。但是代价太大，我们拒绝了任何外部代码对右键点击信息的访问，包括收集统计信息的计数器等。这是非常不明智的。

另一个替代方案是，检查 document 处理程序是否阻止了浏览器的默认行为？如果阻止了，那么该事件已经得到了处理，我们无需再对此事件做出反应。

``` html
<p>Right-click for the document menu (added a check for event.defaultPrevented)</p>
<button id="elem">Right-click for the button menu</button>

<script>
  elem.oncontextmenu = function(event) {
    event.preventDefault();
    alert("Button context menu");
  };

  document.oncontextmenu = function(event) {
    if (event.defaultPrevented) return;

    event.preventDefault();
    alert("Document context menu");
  };
</script>
```

现在一切都可以正常工作了。如果我们有嵌套的元素，并且每个元素都有自己的上下文菜单，那么这也是可以运行的。只需确保检查每个 contextmenu 处理程序中的 event.defaultPrevented。

## 创建自定义事件

我们不仅可以分配事件处理程序，还可以从 JavaScript 生成事件。

自定义事件可用于创建“图形组件”。例如，我们自己的基于 JavaScript 的菜单的根元素可能会触发 open（打开菜单），select（有一项被选中）等事件来告诉菜单发生了什么。另一个代码可能会监听事件，并观察菜单发生了什么。

我们不仅可以生成出于自身目的而创建的全新事件，还可以生成例如 click 和 mousedown 等内建事件。这可能会有助于自动化测试。

### 事件构造器

内建事件类形成一个层次结构（hierarchy），类似于 DOM 元素类。根是内建的 Event 类。

我们可以像这样创建 Event 对象：

``` js
let event = new Event(type[, options]);
```

参数：

- type —— 事件类型，可以是像这样 "click" 的字符串，或者我们自己的像这样 "my-event" 的参数。

- options —— 具有两个可选属性的对象：

  - bubbles: true/false —— 如果为 true，那么事件会冒泡。
  - cancelable: true/false —— 如果为 true，那么“默认行为”就会被阻止。稍后我们会看到对于自定义事件，它意味着什么。

默认情况下，以上两者都为 false：{bubbles: false, cancelable: false}。

### dispatchEvent

事件对象被创建后，我们应该使用 elem.dispatchEvent(event) 调用在元素上“运行”它。

然后，处理程序会对它做出反应，就好像它是一个常规的浏览器事件一样。如果事件是用 bubbles 标志创建的，那么它会冒泡。

在下面这个示例中，click 事件是用 JavaScript 初始化创建的。处理程序工作方式和点击按钮的方式相同：

``` html
<button id="elem" onclick="alert('Click!');">Autoclick</button>

<script>
  let event = new Event("click");
  elem.dispatchEvent(event);
</script>
```

### 冒泡示例

我们可以创建一个名为 "hello" 的冒泡事件，并在 document 上捕获它。

我们需要做的就是将 bubbles 设置为 true：

``` html
<h1 id="elem">Hello from the script!</h1>

<script>
  // 在 document 上捕获...
  document.addEventListener("hello", function(event) { // (1)
    alert("Hello from " + event.target.tagName); // Hello from H1
  });

  // ...在 elem 上 dispatch！
  let event = new Event("hello", {bubbles: true}); // (2)
  elem.dispatchEvent(event);

  // 在 document 上的处理程序将被激活，并显示消息。

</script>
```

注意：

- 我们应该对我们的自定义事件使用 addEventListener，因为 `on<event>` 仅存在于内建事件中，document.onhello 则无法运行。
- 必须设置 bubbles:true，否则事件不会向上冒泡。

内建事件（click）和自定义事件（hello）的冒泡机制相同。自定义事件也有捕获阶段和冒泡阶段。

### MouseEvent，KeyboardEvent 及其他

如果我们想要创建这样的事件，我们应该使用它们而不是 new Event。例如，new MouseEvent("click")。

正确的构造器允许为该类型的事件指定标准属性。

就像鼠标事件的 clientX/clientY 一样：

``` js
let event = new MouseEvent("click", {
  bubbles: true,
  cancelable: true,
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // 100
```

请注意：通用的 Event 构造器不允许这样做。

让我们试试：

``` js
let event = new Event("click", {
  bubbles: true, // 构造器 Event 中只有 bubbles 和 cancelable 可以工作
  cancelable: true,
  clientX: 100,
  clientY: 100
});

alert(event.clientX); // undefined，未知的属性被忽略了！
```

从技术上讲，我们可以通过在创建后直接分配 event.clientX=100 来解决这个问题。所以，这是一个方便和遵守规则的问题。浏览器生成的事件始终具有正确的类型。

规范中提供了不同 UI 事件的属性的完整列表，例如 MouseEvent。

### 自定义事件

对于我们自己的全新事件类型，例如 "hello"，我们应该使用 new CustomEvent。从技术上讲，CustomEvent 和 Event 一样。除了一点不同。

在第二个参数（对象）中，我们可以为我们想要与事件一起传递的任何自定义信息添加一个附加的属性 detail。

例如：

``` html
<h1 id="elem">Hello for John!</h1>

<script>
  // 事件附带给处理程序的其他详细信息
  elem.addEventListener("hello", function(event) {
    alert(event.detail.name);
  });

  elem.dispatchEvent(new CustomEvent("hello", {
    detail: { name: "John" }
  }));
</script>
```

detail 属性可以有任何数据。从技术上讲，我们可以不用，因为我们可以在创建后将任何属性分配给常规的 new Event 对象中。但是 CustomEvent 提供了特殊的 detail 字段，以避免与其他事件属性的冲突。

此外，事件类描述了它是“什么类型的事件”，如果事件是自定义的，那么我们应该使用 CustomEvent 来明确它是什么。

### event.preventDefault()

许多浏览器事件都有“默认行为”，例如，导航到链接，开始一个选择，等。

对于新的，自定义的事件，绝对没有默认的浏览器行为，但是分派（dispatch）此类事件的代码可能有自己的计划，触发该事件之后应该做什么。

通过调用 event.preventDefault()，事件处理程序可以发出一个信号，指出这些行为应该被取消。

在这种情况下，elem.dispatchEvent(event) 的调用会返回 false。那么分派（dispatch）该事件的代码就会知道不应该再继续。

让我们看一个实际的例子 —— 一只隐藏的兔子（可以是关闭菜单或者其他）。

在下面，你可以看到一个在其上分派了 "hide" 事件的 #rabbit 和 hide() 函数，以使所有感兴趣的各方面都知道这只兔子要隐藏起来。

任何处理程序都可以使用 rabbit.addEventListener('hide',...) 来监听该事件，并在需要时使用 event.preventDefault() 来取消该行为。然后兔子就不会藏起来了：

``` html
<pre id="rabbit">
  |\   /|
   \|_|/
   /. .\
  =\_Y_/=
   {>o<}
</pre>
<button onclick="hide()">Hide()</button>

<script>
  function hide() {
    let event = new CustomEvent("hide", {
      cancelable: true // 没有这个标志，preventDefault 将不起作用
    });
    if (!rabbit.dispatchEvent(event)) {
      alert('The action was prevented by a handler');
    } else {
      rabbit.hidden = true;
    }
  }

  rabbit.addEventListener('hide', function(event) {
    if (confirm("Call preventDefault?")) {
      event.preventDefault();
    }
  });
</script>
```

请注意：该事件必须具有 cancelable: true 标志，否则 event.preventDefault() 调用将会被忽略。

### 事件中的事件是同步的

通常事件是在队列中处理的。也就是说：如果浏览器正在处理 onclick，这时发生了一个新的事件，例如鼠标移动了，那么它的处理程序会被排入队列，相应的 mousemove 处理程序将在 onclick 事件处理完成后被调用。

值得注意的例外情况就是，一个事件是在另一个事件中发起的。例如使用 dispatchEvent。这类事件将会被立即处理，即在新的事件处理程序被调用之后，恢复到当前的事件处理程序。

例如，在下面的代码中，menu-open 事件是在 onclick 事件执行过程中被调用的。

它会被立即执行，而不必等待 onclick 处理程序结束：

``` html
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    }));

    alert(2);
  };

  // 在 1 和 2 之间触发
  document.addEventListener('menu-open', () => alert('nested'));
</script>
```

输出顺序为：1 → nested → 2。

请注意，嵌套事件 menu-open 会在 document 上被捕获。嵌套事件的传播（propagation）和处理先被完成，然后处理过程才会返回到外部代码（onclick）。

这不只是与 dispatchEvent 有关，还有其他情况。如果一个事件处理程序调用了触发其他事件的方法 —— 它们同样也会被以嵌套的方式同步处理。

不过有时候，这并不是我们期望的结果。我们想让 onclick 不受 menu-open 或者其它嵌套事件的影响，优先被处理完毕。

那么，我们就可以将 dispatchEvent（或另一个触发事件的调用）放在 onclick 末尾，或者最好将其包装到零延迟的 setTimeout 中：

``` html
<button id="menu">Menu (click me)</button>

<script>
  menu.onclick = function() {
    alert(1);

    setTimeout(() => menu.dispatchEvent(new CustomEvent("menu-open", {
      bubbles: true
    })));

    alert(2);
  };

  document.addEventListener('menu-open', () => alert('nested'));
</script>
```

现在，dispatchEvent 在当前代码执行完成之后异步运行，包括 menu.onclick，因此，事件处理程序是完全独立的。

输出顺序变成：1 → 2 → nested。















































































































