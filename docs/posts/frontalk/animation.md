---
title: 动画
date: '2025-06-07'
tags:
- frontalk
---

# 动画

简单了解CSS 和 JavaScript 动画的实现。

## 贝塞尔曲线

贝塞尔曲线用于计算机图形绘制形状，CSS 动画和许多其他地方。

它们其实非常简单，值得学习一次并且在矢量图形和高级动画的世界里非常受用。

https://zh.javascript.info/bezier-curve

## CSS 动画

CSS 动画可以在不借助 Javascript 的情况下做出一些简单的动画效果。

你也可以通过 Javascript 控制 CSS 动画，使用少量的代码，就能让动画表现更加出色。

### CSS 过渡（transition）

CSS 过渡的理念非常简单，我们只需要定义某一个属性以及如何动态地表现其变化。当属性变化时，浏览器将会绘制出相应的过渡动画。

也就是说：我们只需要改变某个属性，然后所有流畅的动画都由浏览器生成。

举个例子，以下 CSS 会为 backgroud-color 的变化生成一个 3 秒的过渡动画：

``` css
.animated {
  transition-property: background-color;
  transition-duration: 3s;
}
```

现在，只要一个元素拥有名为 .animated 的类，那么任何背景颜色的变化都会被渲染为 3 秒钟的动画。

``` html
<button id="color">Click me</button>

<style>
  #color {
    transition-property: background-color;
    transition-duration: 3s;
  }
</style>

<script>
  color.onclick = function() {
    this.style.backgroundColor = 'red';
  };
</script>
```

CSS 提供了四个属性来描述一个过渡：

- transition-property
- transition-duration
- transition-timing-function
- transition-delay

之后我们会详细介绍它们，目前我们需要知道，我们可以在 transition 中以 property duration timing-function delay 的顺序一次性定义它们，并且可以同时为多个属性设置过渡动画。

请看以下例子，点击按钮生成 color 和 font-size 的过渡动画：

``` html
<button id="growing">Click me</button>

<style>
#growing {
  transition: font-size 3s, color 2s;
}
</style>

<script>
growing.onclick = function() {
  this.style.fontSize = '36px';
  this.style.color = 'red';
};
</script>
```

现在让我们一个一个展开看这些属性。

### transition-property

在 transition-property 中我们可以列举要设置动画的所有属性，如：left、margin-left、height 和 color。

不是所有的 CSS 属性都可以使用过渡动画，但是它们中的大多数都是可以的。all 表示应用在所有属性上。

### transition-duration

transition-duration 允许我们指定动画持续的时间。时间的格式参照 CSS 时间格式：单位为秒 s 或者毫秒 ms。

### transition-delay

transition-delay 允许我们设定动画开始前的延迟时间。例如，对于 transition-delay: 1s，动画将会在属性变化发生 1 秒后开始渲染。

你也可以提供一个负值。那么动画将会从整个过渡的中间时刻开始渲染。例如，对于 transition-duration: 2s，同时把 delay 设置为 -1s，那么这个动画将会持续 1 秒钟，并且从正中间开始渲染。

### transition-timing-function

时间函数描述了动画进程在时间上的分布。它是先慢后快还是先快后慢？

乍一看，这可能是最复杂的属性了，但是稍微花点时间，你就会发现其实也很简单。

这个属性接受两种值：一个贝塞尔曲线（Bezier curve）或者阶跃函数（steps）。我们先从贝塞尔曲线开始，这也是较为常用的。

CSS 提供几条内建的曲线：linear、ease、ease-in、ease-out 和 ease-in-out。

linear 其实就是 cubic-bezier(0, 0, 1, 1) 的简写 —— 一条直线，刚刚我们已经看过了。

### transitionend 事件

CSS 动画完成后，会触发 transitionend 事件。

这被广泛用于在动画结束后执行某种操作。我们也可以用它来串联动画。

### 关键帧动画（Keyframes）

我们可以通过 CSS 提供的 @keyframes 规则整合多个简单的动画。

它会指定某个动画的名称以及相应的规则：哪个属性，何时以及何地渲染动画。然后使用 animation 属性把动画绑定到相应的元素上，并为其添加额外的参数。

## JavaScript 动画

JavaScript 动画可以处理 CSS 无法处理的事情。

例如，沿着具有与 Bezier 曲线不同的时序函数的复杂路径移动，或者实现画布上的动画。

### 使用 setInterval

从 HTML/CSS 的角度来看，动画是 style 属性的逐渐变化。例如，将 style.left 从 0px 变化到 100px 可以移动元素。

如果我们用 setInterval 每秒做 50 次小变化，看起来会更流畅。电影也是这样的原理：每秒 24 帧或更多帧足以使其看起来流畅。

伪代码如下：

``` js
let delay = 1000 / 50; // 每秒 50 帧
let timer = setInterval(function() {
  if (animation complete) clearInterval(timer);
  else increase style.left
}, delay)
```

更完整的动画示例：

``` js
let start = Date.now(); // 保存开始时间

let timer = setInterval(function() {
  // 距开始过了多长时间
  let timePassed = Date.now() - start;

  if (timePassed >= 2000) {
    clearInterval(timer); // 2 秒后结束动画
    return;
  }

  // 在 timePassed 时刻绘制动画
  draw(timePassed);

}, 20);

// 随着 timePassed 从 0 增加到 2000
// 将 left 的值从 0px 增加到 400px
function draw(timePassed) {
  train.style.left = timePassed / 5 + 'px';
}
```
### 使用 requestAnimationFrame

假设我们有几个同时运行的动画。

如果我们单独运行它们，每个都有自己的 setInterval(..., 20)，那么浏览器必须以比 20ms 更频繁的速度重绘。

每个 setInterval 每 20ms 触发一次，但它们相互独立，因此 20ms 内将有多个独立运行的重绘。

这几个独立的重绘应该组合在一起，以使浏览器更加容易处理。

换句话说，像下面这样：

``` js
setInterval(function() {
  animate1();
  animate2();
  animate3();
}, 20)
```
……比这样更好：

``` js
setInterval(animate1, 20);
setInterval(animate2, 20);
setInterval(animate3, 20);
```

还有一件事需要记住。有时当 CPU 过载时，或者有其他原因需要降低重绘频率。例如，如果浏览器选项卡被隐藏，那么绘图完全没有意义。

有一个标准动画时序提供了 `requestAnimationFrame` 函数。

它解决了所有这些问题，甚至更多其它的问题。

语法：

``` js
let requestId = requestAnimationFrame(callback);
```

这会让 callback 函数在浏览器每次重绘的最近时间运行。

如果我们对 callback 中的元素进行变化，这些变化将与其他 requestAnimationFrame 回调和 CSS 动画组合在一起。因此，只会有一次几何重新计算和重绘，而不是多次。

返回值 requestId 可用来取消回调：

``` js
// 取消回调的周期执行
cancelAnimationFrame(requestId);
```

callback 得到一个参数 —— 从页面加载开始经过的毫秒数。这个时间也可通过调用 performance.now() 得到。

通常 callback 很快就会运行，除非 CPU 过载或笔记本电量消耗殆尽，或者其他原因。

### 结构化动画

现在我们可以在 requestAnimationFrame 基础上创建一个更通用的动画函数：

``` js
function animate({timing, draw, duration}) {

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction 从 0 增加到 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // 计算当前动画状态
    let progress = timing(timeFraction);

    draw(progress); // 绘制

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

  });
}
```

animate 函数接受 3 个描述动画的基本参数：

- `duration`
动画总时间，比如 1000。

- `timing(timeFraction)`
时序函数，类似 CSS 属性 transition-timing-function，传入一个已过去的时间与总时间之比的小数（0 代表开始，1 代表结束），返回动画完成度（类似 Bezier 曲线中的 y）。

- `draw(progress)`
获取动画完成状态并绘制的函数。值 progress = 0 表示开始动画状态，progress = 1 表示结束状态。

与 CSS 动画不同，我们可以在这里设计任何时序函数和任何绘图函数。时序函数不受 Bezier 曲线的限制。并且 draw 不局限于操作 CSS 属性，还可以为类似烟花动画或其他动画创建新元素。






















































































































































