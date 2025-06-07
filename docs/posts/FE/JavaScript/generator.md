---
title: Generator，高级 iteration
date: '2025-06-07'
tags:
- FE
---

# Generator，高级 iteration

## generator

常规函数只会返回一个单一值（或者不返回任何值）。

而 generator 可以按需一个接一个地返回（“yield”）多个值。它们可与 iterable 完美配合使用，从而可以轻松地创建数据流。

### generator 函数
要创建一个 generator，我们需要一个特殊的语法结构：function*，即所谓的 “generator function”。

它看起来像这样：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}
```
generator 函数与常规函数的行为不同。在此类函数被调用时，它不会运行其代码。而是返回一个被称为 “generator object” 的特殊对象，来管理执行流程。

我们来看一个例子：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

// "generator function" 创建了一个 "generator object"
let generator = generateSequence();
alert(generator); // [object Generator]
```
到目前为止，上面这段代码中的 `函数体` 代码还没有开始执行：

一个 generator 的主要方法就是 `next()`。当被调用时，它会恢复上图所示的运行，执行直到最近的 `yield <value>` 语句（value 可以被省略，默认为 undefined）。然后函数执行暂停，并将产出的（yielded）值返回到外部代码。

`next()` 的结果始终是一个具有两个属性的对象：

- `value`: 产出的（yielded）的值。
- `done`: 如果 generator 函数已执行完成则为 true，否则为 false。

例如，我们可以创建一个 generator 并获取其第一个产出的（yielded）值：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

let one = generator.next();

alert(JSON.stringify(one)); // {value: 1, done: false}
```
截至目前，我们只获得了第一个值，现在函数执行处在第二行：

让我们再次调用 generator.next()。代码恢复执行并返回下一个 yield 的值：

``` javascript
let two = generator.next();

alert(JSON.stringify(two)); // {value: 2, done: false}
```
如果我们第三次调用 generator.next()，代码将会执行到 return 语句，此时就完成这个函数的执行：

``` javascript
let three = generator.next();

alert(JSON.stringify(three)); // {value: 3, done: true}
```

现在 generator 执行完成。我们通过 done:true 可以看出来这一点，并且将 value:3 处理为最终结果。

再对 generator.next() 进行新的调用不再有任何意义。如果我们这样做，它将返回相同的对象：`{done: true}`。

::: tip `function* f(…)` 或 `function *f(…)`？
这两种语法都是对的。

但是通常更倾向于第一种语法，因为星号 * 表示它是一个 generator 函数，它描述的是函数种类而不是名称，因此 * 应该和 function 关键字紧贴一起。
:::

### generator 是可迭代的

当你看到 next() 方法，或许你已经猜到了 generator 是 可迭代（iterable）的。

我们可以使用 for..of 循环遍历它所有的值：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1，然后是 2
}
```

for..of 写法是不是看起来比 .next().value 优雅多了？

……但是请注意：上面这个例子会先显示 1，然后是 2，然后就没了。它不会显示 3！

这是因为当 done: true 时，for..of 循环会忽略最后一个 value。因此，如果我们想要通过 for..of 循环显示所有的结果，我们必须使用 yield 返回它们：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = generateSequence();

for(let value of generator) {
  alert(value); // 1，然后是 2，然后是 3
}
```

因为 generator 是可迭代的，我们可以使用 iterator 的所有相关功能，例如：spread 语法 ...：

``` javascript
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}

let sequence = [0, ...generateSequence()];

alert(sequence); // 0, 1, 2, 3
```
在上面这段代码中，...generateSequence() 将可迭代的 generator 对象转换为了一个数组（关于 spread 语法的更多细节请见 Rest 参数与 Spread 语法）。

### 使用 generator 进行迭代
在前面的 Iterable object（可迭代对象） 一章中，我们创建了一个可迭代的 range 对象，它返回 from..to 的值。

现在，我们回忆一下代码：

``` javascript
let range = {
  from: 1,
  to: 5,

  // for..of range 在一开始就调用一次这个方法
  [Symbol.iterator]() {
    // ...它返回 iterator object：
    // 后续的操作中，for..of 将只针对这个对象，并使用 next() 向它请求下一个值
    return {
      current: this.from,
      last: this.to,

      // for..of 循环在每次迭代时都会调用 next()
      next() {
        // 它应该以对象 {done:.., value :...} 的形式返回值
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

// 迭代整个 range 对象，返回从 `range.from` 到 `range.to` 范围的所有数字
alert([...range]); // 1,2,3,4,5
```
我们可以通过提供一个 generator 函数作为 Symbol.iterator，来使用 generator 进行迭代：

下面是一个相同的 range，但紧凑得多：

``` javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的简写形式
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

alert( [...range] ); // 1,2,3,4,5
```

之所以代码正常工作，是因为 `range[Symbol.iterator]()` 现在返回一个 generator，而 generator 方法正是 for..of 所期望的：

- 它具有 `.next()` 方法
- 它以 `{value: ..., done: true/false}` 的形式返回值

当然，这不是巧合。generator 被添加到 JavaScript 语言中是有对 iterator 的考量的，以便更容易地实现 iterator。

带有 generator 的变体比原来的 range 迭代代码简洁得多，并且保持了相同的功能。

::: tip generator 可以永远产出（yield）值
在上面的示例中，我们生成了有限序列，但是我们也可以创建一个生成无限序列的 generator，它可以一直产出（yield）值。例如，无序的伪随机数序列。

这种情况下肯定需要在 generator 的 for..of 循环中添加一个 break（或者 return）。否则循环将永远重复下去并挂起。
:::

### generator 组合

generator 组合（composition）是 generator 的一个特殊功能，它允许透明地（transparently）将 generator 彼此“嵌入（embed）”到一起。

例如，我们有一个生成数字序列的函数：

``` javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
```
现在，我们想重用它来生成一个更复杂的序列：

- 首先是数字 0..9（字符代码为 48…57），
- 接下来是大写字母 A..Z（字符代码为 65…90）
- 接下来是小写字母 a...z（字符代码为 97…122）

我们可以对这个序列进行应用，例如，我们可以从这个序列中选择字符来创建密码（也可以添加语法字符），但让我们先生成它。

在常规函数中，要合并其他多个函数的结果，我们需要调用它们，存储它们的结果，最后再将它们合并到一起。

对于 generator 而言，我们可以使用 `yield*` 这个特殊的语法来将一个 generator “嵌入”（组合）到另一个 generator 中：

组合的 generator 的例子：

``` javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generatePasswordCodes() {

  // 0..9
  yield* generateSequence(48, 57);

  // A..Z
  yield* generateSequence(65, 90);

  // a..z
  yield* generateSequence(97, 122);

}

let str = '';

for(let code of generatePasswordCodes()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```
yield* 指令将执行 `委托` 给另一个 generator。这个术语意味着 `yield* gen` 在 `generator gen` 上进行迭代，并将其产出（yield）的值透明地（transparently）转发到外部。就好像这些值就是由外部的 generator yield 的一样。

执行结果与我们内联嵌套 generator 中的代码获得的结果相同：

``` javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) yield i;
}

function* generateAlphaNum() {

  // yield* generateSequence(48, 57);
  for (let i = 48; i <= 57; i++) yield i;

  // yield* generateSequence(65, 90);
  for (let i = 65; i <= 90; i++) yield i;

  // yield* generateSequence(97, 122);
  for (let i = 97; i <= 122; i++) yield i;

}

let str = '';

for(let code of generateAlphaNum()) {
  str += String.fromCharCode(code);
}

alert(str); // 0..9A..Za..z
```
generator 组合（composition）是将一个 generator 流插入到另一个 generator 流的自然的方式。它不需要使用额外的内存来存储中间结果。

### “yield” 是一条双向路

目前看来，generator 和可迭代对象类似，都具有用来生成值的特殊语法。但实际上，generator 更加强大且灵活。

这是因为 yield 是一条`双向路（two-way street）`：**它不仅可以向外返回结果，而且还可以将外部的值传递到 generator 内**。

调用 generator.next(arg)，我们就能将参数 arg 传递到 generator 内部。这个 arg 参数会变成 yield 的结果。

我们来看一个例子：

``` javascript
function* gen() {
  // 向外部代码传递一个问题并等待答案
  let result = yield "2 + 2 = ?"; // (*)

  alert(result);
}

let generator = gen();

let question = generator.next().value; // <-- yield 返回的 value

generator.next(4); // --> 将结果传递到 generator 中
```
1. 第一次调用 `generator.next()` 应该是不带参数的（如果带参数，那么该参数会被忽略）。它开始执行并返回第一个 yield "2 + 2 = ?" 的结果。此时，generator 执行暂停，而停留在 (*) 行上。
2. 然后，正如上面图片中显示的那样，yield 的结果进入调用代码中的 question 变量。
3. 在 `generator.next(4)`，generator 恢复执行，并获得了 4 作为结果：let result = 4。

请注意，外部代码不必立即调用 `next(4)`。外部代码可能需要一些时间。这没问题：generator 将等待它。

例如：

``` javascript
// 一段时间后恢复 generator
setTimeout(() => generator.next(4), 1000);
```

我们可以看到，与常规函数不同，generator 和调用 generator 的代码可以通过在 next/yield 中传递值来交换结果。

为了讲得更浅显易懂，我们来看另一个例子，其中包含了许多调用：

``` javascript
function* gen() {
  let ask1 = yield "2 + 2 = ?";

  alert(ask1); // 4

  let ask2 = yield "3 * 3 = ?"

  alert(ask2); // 9
}

let generator = gen();

alert( generator.next().value ); // "2 + 2 = ?"

alert( generator.next(4).value ); // "3 * 3 = ?"

alert( generator.next(9).done ); // true
```

执行图：

![genYield](https://zh.javascript.info/article/generators/genYield2-2.svg)

1. 第一个 .next() 启动了 generator 的执行……执行到达第一个 yield。
2. 结果被返回到外部代码中。
3. 第二个 .next(4) 将 4 作为第一个 yield 的结果传递回 generator 并恢复 generator 的执行。
4. ……执行到达第二个 yield，它变成了 generator 调用的结果。
5. 第三个 next(9) 将 9 作为第二个 yield 的结果传入 generator 并恢复 generator 的执行，执行现在到达了函数的最底部，所以返回 done: true。

这个过程就像“乒乓球”游戏。每个 next(value)（除了第一个）传递一个值到 generator 中，该值变成了当前 yield 的结果，然后获取下一个 yield 的结果。

### generator.throw

正如我们在上面的例子中观察到的那样，外部代码可能会将一个值传递到 generator，作为 yield 的结果。

……但是它也可以在那里发起（抛出）一个 error。这很自然，因为 error 本身也是一种结果。

要向 yield 传递一个 error，我们应该调用 `generator.throw(err)`。在这种情况下，err 将被抛到对应的 yield 所在的那一行。

例如，"2 + 2?" 的 yield 导致了一个 error：

``` javascript
function* gen() {
  try {
    let result = yield "2 + 2 = ?"; // (1)

    alert("The execution does not reach here, because the exception is thrown above");
  } catch(e) {
    alert(e); // 显示这个 error
  }
}

let generator = gen();

let question = generator.next().value;

generator.throw(new Error("The answer is not found in my database")); // (2)
```

在 (2) 行引入到 generator 的 error 导致了在 (1) 行中的 yield 出现了一个异常。在上面这个例子中，try..catch 捕获并显示了这个 error。

如果我们没有捕获它，那么就会像其他的异常一样，它将从 generator “掉出”到调用代码中。

调用代码的当前行是 generator.throw 所在的那一行，标记为 (2)。所以我们可以在这里捕获它，就像这样：

``` javascript
function* generate() {
  let result = yield "2 + 2 = ?"; // 这行出现 error
}

let generator = generate();

let question = generator.next().value;

try {
  generator.throw(new Error("The answer is not found in my database"));
} catch(e) {
  alert(e); // 显示这个 error
}
```

如果我们没有在那里捕获这个 error，那么，通常，它会掉入外部调用代码（如果有），如果在外部也没有被捕获，则会杀死脚本。

### generator.return

`generator.return(value)` 完成 generator 的执行并返回给定的 value。

``` javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen();

g.next();        // { value: 1, done: false }
g.return('foo'); // { value: "foo", done: true }
g.next();        // { value: undefined, done: true }
```

如果我们在已完成的 generator 上再次使用 `generator.return()`，它将再次返回该值（[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator/return)）。

通常我们不使用它，因为大多数时候我们想要获取所有的返回值，但是当我们想要`在特定条件下停止 generator 时`它会很有用。

## 异步迭代和 generator
异步迭代允许我们对按需通过异步请求而得到的数据进行迭代。例如，我们通过网络分段（chunk-by-chunk）下载数据时。异步生成器（generator）使这一步骤更加方便。

首先，让我们来看一个简单的示例以掌握语法，然后再看一个实际用例。

### 回顾可迭代对象
让我们回顾一下可迭代对象的相关内容。

假设我们有一个对象，例如下面的 range：

``` javascript
let range = {
  from: 1,
  to: 5
};
```

我们想对它使用 `for..of` 循环，例如 `for(value of range)`，来获取从 1 到 5 的值。

换句话说，我们想向对象 `range` 添加 `迭代能力`。

这可以通过使用一个名为 `Symbol.iterator` 的特殊方法来实现：

- 当循环开始时，该方法被 `for..of` 结构调用，并且它应该返回一个带有 `next` 方法的对象。
- 对于每次迭代，都会为下一个值调用 `next()` 方法。
- `next()`方法应该以 `{done: true/false, value:<loop value>}` 的格式返回一个值，其中 done:true 表示循环结束。

这是可迭代的 `range` 的一个实现：

``` javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() { // 在 for..of 循环开始时被调用一次
    return {
      current: this.from,
      last: this.to,

      next() { // 每次迭代时都会被调用，来获取下一个值
        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

for(let value of range) {
  alert(value); // 1，然后 2，然后 3，然后 4，然后 5
}
```

### 异步可迭代对象

当值是以异步的形式出现时，例如在 setTimeout 或者另一种延迟之后，就需要异步迭代。

最常见的场景是，对象需要发送一个网络请求以传递下一个值，稍后我们将看到一个它的真实示例。

`要使对象异步迭代`：

- 使用 `Symbol.asyncIterator` 取代 `Symbol.iterator`。
- `next()` 方法应该返回一个 `promise`（带有下一个值，并且状态为 `fulfilled`）。
  - 关键字 `async` 可以实现这一点，我们可以简单地使用 `async next()`。
- 我们应该使用 `for await (let item of iterable)` 循环来迭代这样的对象。
  - 注意关键字 `await`。

作为开始的示例，让我们创建一个可迭代的 `range` 对象，与前面的那个类似，不过现在它将异步地每秒返回一个值。

我们需要做的就是对上面代码中的部分代码进行替换：

``` javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() { // (1)
    return {
      current: this.from,
      last: this.to,

      async next() { // (2)

        // 注意：我们可以在 async next 内部使用 "await"
        await new Promise(resolve => setTimeout(resolve, 1000)); // (3)

        if (this.current <= this.last) {
          return { done: false, value: this.current++ };
        } else {
          return { done: true };
        }
      }
    };
  }
};

(async () => {

  for await (let value of range) { // (4)
    alert(value); // 1,2,3,4,5
  }

})()
```

正如我们所看到的，其结构与常规的 iterator 类似:

1. 为了使一个对象可以异步迭代，它必须具有方法 `Symbol.asyncIterator` `(1)`。
2. 这个方法必须返回一个带有 `next()` 方法的对象，`next()` 方法会返回一个 `promise` `(2)`。
3. 这个 `next()` 方法可以不是 `async` 的，它可以是一个返回值是一个 `promise` 的常规的方法，但是使用 `async` 关键字可以允许我们在方法内部使用 `await`，所以会更加方便。这里我们只是用于延迟 1 秒的操作 `(3)`。
4. 我们使用 `for await(let value of range)` `(4)` 来进行迭代，也就是在 for 后面添加 `await`。它会调用一次 range[Symbol.asyncIterator]() 方法一次，然后调用它的 `next()` 方法获取值。

::: warning Spread 语法 ... 无法异步工作
需要常规的同步 iterator 的功能，无法与异步 iterator 一起使用。

例如，spread 语法无法工作：

``` javascript
alert( [...range] ); // Error, no Symbol.iterator
```
这很正常，因为它期望找到 `Symbol.iterator`，而不是 `Symbol.asyncIterator`。

`for..of` 的情况和这个一样：没有 `await` 关键字时，则期望找到的是 `Symbol.iterator`。
:::
### 回顾 generator

现在，让我们回顾一下 generator，它使我们能够写出更短的迭代代码。在大多数时候，当我们想要创建一个可迭代对象时，我们会使用 generator。

简单起见，这里省略了一些解释，即 generator 是“生成（yield）值的函数”。关于此的详细说明请见 generator 一章。

Generator 是标有 function*（注意星号）的函数，它使用 yield 来生成值，并且我们可以使用 for..of 循环来遍历它们。

下面这例子生成了从 start 到 end 的一系列值：

``` javascript
function* generateSequence(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for(let value of generateSequence(1, 5)) {
  alert(value); // 1，然后 2，然后 3，然后 4，然后 5
}
```

正如我们所知道的，要使一个对象可迭代，我们需要给它添加 `Symbol.iterator`。

``` javascript
let range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    return `<带有 next 方法的对象，以使对象 range 可迭代>`
  }
}
```

对于 `Symbol.iterator` 来说，一个通常的做法是返回一个 generator，这样可以使代码更短，如下所示：

``` javascript
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的一种简写
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

for(let value of range) {
  alert(value); // 1，然后 2，然后 3，然后 4，然后 5
}
```

如果你想了解更多详细内容，请阅读 generator 一章。

在常规的 generator 中，我们无法使用 await。所有的值都必须按照 for..of 构造的要求同步地出现。

如果我们想要异步地生成值该怎么办？例如，对于来自网络请求的值。

让我们再回到异步 generator，来使这个需求成为可能。

### 异步 generator (finally)

对于大多数的实际应用程序，当我们想创建一个异步生成一系列值的对象时，我们都可以使用异步 generator。

语法很简单：在 `function*` 前面加上 `async`。这即可使 generator 变为异步的。

然后使用 `for await (...)` 来遍历它，像这样：

``` javascript
async function* generateSequence(start, end) {

  for (let i = start; i <= end; i++) {

    // 哇，可以使用 await 了！
    await new Promise(resolve => setTimeout(resolve, 1000));

    yield i;
  }

}

(async () => {

  let generator = generateSequence(1, 5);
  for await (let value of generator) {
    alert(value); // 1，然后 2，然后 3，然后 4，然后 5（在每个 alert 之间有延迟）
  }

})();
```

因为此 generator 是异步的，所以我们可以在其内部使用 await，依赖于 promise，执行网络请求等任务。

::: tip 引擎盖下的差异
如果你还记得我们在前面章节中所讲的关于 generator 的细节知识，那你应该知道，从技术上讲，异步 generator 和常规的 generator 在内部是有区别的。

对于异步 generator，`generator.next()` 方法是异步的，它返回 promise。

在一个常规的 generator 中，我们使用 `result = generator.next()` 来获得值。但在一个异步 generator 中，我们应该添加 `await` 关键字，像这样：

``` javascript
result = await generator.next(); // result = {value: ..., done: true/false}
```
这就是为什么异步 generator 可以与 for await...of 一起工作。
:::

#### 异步的可迭代对象 range
常规的 generator 可用作 `Symbol.iterator` 以使迭代代码更短。

与之类似，异步 generator 可用作 `Symbol.asyncIterator` 来实现异步迭代。

例如，我们可以通过将同步的 Symbol.iterator 替换为异步的 Symbol.asyncIterator，来使对象 range 异步地生成值，每秒生成一个：

``` javascript
let range = {
  from: 1,
  to: 5,

  // 这一行等价于 [Symbol.asyncIterator]: async function*() {
  async *[Symbol.asyncIterator]() {
    for(let value = this.from; value <= this.to; value++) {

      // 在 value 之间暂停一会儿，等待一些东西
      await new Promise(resolve => setTimeout(resolve, 1000));

      yield value;
    }
  }
};

(async () => {

  for await (let value of range) {
    alert(value); // 1，然后 2，然后 3，然后 4，然后 5
  }

})();
```

现在，value 之间的延迟为 1 秒。

### 实际的例子：分页的数据 

到目前为止，我们已经了解了一些基本示例，以加深理解。现在，我们来看一个实际的用例。

目前，有很多在线服务都是发送的分页的数据（paginated data）。例如，当我们需要一个用户列表时，一个请求只返回一个预设数量的用户（例如 100 个用户）—— “一页”，并提供了指向下一页的 URL。

这种模式非常常见。不仅可用于获取用户列表，这种模式还可以用于任意东西。

例如，GitHub 允许使用相同的分页提交（paginated fashion）的方式找回 commit：

- 我们应该以 `https://api.github.com/repos/<repo>/commits` 格式创建进行 fetch 的网络请求。
- 它返回一个包含 30 条 commit 的 JSON，并在返回的 Link header 中提供了指向下一页的链接。
- 然后我们可以将该链接用于下一个请求，以获取更多 commit，以此类推。

对于我们的代码，我们希望有一种更简单的获取 commit 的方式。

让我们创建一个函数 `fetchCommits(repo)`，用来在任何我们有需要的时候发出请求，来为我们获取 commit。并且，该函数能够关注到所有分页内容。对于我们来说，它将是一个简单的 `for await..of` 异步迭代。

因此，其用法将如下所示：

``` javascript
for await (let commit of fetchCommits("username/repository")) {
  // 处理 commit
}
```

通过异步 generator，我们可以轻松实现上面所描述的函数，如下所示：

``` javascript
async function* fetchCommits(repo) {
  let url = `https://api.github.com/repos/${repo}/commits`;

  while (url) {
    const response = await fetch(url, { // (1)
      headers: {'User-Agent': 'Our script'}, // github 需要任意的 user-agent header
    });

    const body = await response.json(); // (2) 响应的是 JSON（array of commits）

    // (3) 前往下一页的 URL 在 header 中，提取它
    let nextPage = response.headers.get('Link').match(/<(.*?)>; rel="next"/);
    nextPage = nextPage?.[1];

    url = nextPage;

    for(let commit of body) { // (4) 一个接一个地 yield commit，直到最后一页
      yield commit;
    }
  }
}
```

关于其工作原理的进一步解释：

1. 我们使用浏览器的 fetch 方法来下载 commit。

   - 初始 URL 是 `https://api.github.com/repos/<repo>/commits`，并且下一页的 URL 将在响应的 Link header 中。
   - fetch 方法允许我们提供授权和其他 header，如果需要 —— 这里 GitHub 需要的是 User-Agent。
2. commit 被以 JSON 的格式返回。

3. 我们应该从响应（response）的 Link header 中获取前往下一页的 URL。它有一个特殊的格式，所以我们对它使用正则表达式（我们将在 正则表达式 一章中学习它）。

   - 前往下一页的 URL 看起来可能就像这样 `https://api.github.com/repositories/93253246/commits?page=2`。这是由 GitHub 自己生成的。
4. 然后，我们将接收到的所有 commit 一个一个地 yield 出来，当所有 commit 都 yield 完成时，将触发下一个 while(url) 迭代，并发出下一个请求。

这是一个使用示例（在控制台中显示 commit 的作者）

``` javascript
(async () => {

  let count = 0;

  for await (const commit of fetchCommits('javascript-tutorial/en.javascript.info')) {

    console.log(commit.author.login);

    if (++count == 100) { // 让我们在获取了 100 个 commit 时停止
      break;
    }
  }

})();

// 注意：如果你在外部沙箱中运行它，你需要把上面的 fetchCommits 函数粘贴到这儿。
```
这就是我们想要的。

从外部看不到分页请求（paginated requests）的内部机制。对我们来说，它只是一个返回 commit 的异步 generator。









































































































































































































































































































































































































































































































































































































































































































































































