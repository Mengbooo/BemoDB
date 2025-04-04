# 异步

这一章节，我们来讲讲异步相关。

## 回调
::: tip 我们在这里的示例中使用了浏览器方法
为了演示回调、promise 和其他抽象概念的使用，我们将使用一些浏览器方法：具体地说，是加载脚本和执行简单的文档操作的方法。

如果你不熟悉这些方法，并且对它们在这些示例中的用法感到疑惑，那么你可能需要阅读本教程 下一部分 中的几章。

但是，我们会尽全力使讲解变得更加清晰。在这儿不会有浏览器方面的真正复杂的东西。
:::
JavaScript 主机（host）环境提供了许多函数，这些函数允许我们计划 异步 行为（action）—— 也就是在我们执行一段时间后才自行完成的行为。

例如，setTimeout 函数就是一个这样的函数。

这儿有一些实际中的异步行为的示例，例如加载脚本和模块（我们将在后面的章节中介绍）。

让我们看一下函数 loadScript(src)，该函数使用给定的 src 加载脚本：

``` javascript
function loadScript(src) {
  // 创建一个 <script> 标签，并将其附加到页面
  // 这将使得具有给定 src 的脚本开始加载，并在加载完成后运行
  let script = document.createElement('script');
  script.src = src;
  document.head.append(script);
}
```

它将一个新的、带有给定 src 的、动态创建的标签 `<script src="…">` 插入到文档中。浏览器将自动开始加载它，并在加载完成后执行它。

我们可以像这样使用这个函数：

``` javascript
// 在给定路径下加载并执行脚本
loadScript('/my/script.js');
```
脚本是“异步”调用的，因为它从现在开始加载，但是在这个加载函数执行完成后才运行。

如果在 loadScript(…) 下面有任何其他代码，它们不会等到脚本加载完成才执行。
``` javascript
loadScript('/my/script.js');
// loadScript 下面的代码
// 不会等到脚本加载完成才执行
// ...
```

假设我们需要在新脚本加载后立即使用它。它声明了新函数，我们想运行它们。

但如果我们在 loadScript(…) 调用后立即执行此操作，这将不会有效。

``` javascript
loadScript('/my/script.js'); // 这个脚本有 "function newFunction() {…}"

newFunction(); // 没有这个函数！
```

自然情况下，浏览器可能没有时间加载脚本。到目前为止，loadScript 函数并没有提供跟踪加载完成的方法。脚本加载并最终运行，仅此而已。但我们希望了解脚本何时加载完成，以使用其中的新函数和变量。

让我们添加一个 callback 函数作为 loadScript 的第二个参数，该函数应在脚本加载完成时执行：

``` javascript
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(script);

  document.head.append(script);
}
```
onload 事件在 资源加载：onload，onerror 一文中有描述，它通常会在脚本加载和执行完成后执行一个函数。

现在，如果我们想调用该脚本中的新函数，我们应该将其写在回调函数中：
``` javascript
loadScript('/my/script.js', function() {
  // 在脚本加载完成后，回调函数才会执行
  newFunction(); // 现在它工作了
  ...
});
```

这是我们的想法：第二个参数是一个函数（通常是匿名函数），该函数会在行为（action）完成时运行。

这是一个带有真实脚本的可运行的示例：

``` javascript
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script);
  document.head.append(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`酷，脚本 ${script.src} 加载完成`);
  alert( _ ); // _ 是所加载的脚本中声明的一个函数
});
```
这被称为“基于回调”的异步编程风格。异步执行某项功能的函数应该提供一个 callback 参数用于在相应事件完成时调用。（上面这个例子中的相应事件是指脚本加载）

这里我们在 loadScript 中就是这么做的，但当然这是一种通用方法。

### 在回调中回调

我们如何依次加载两个脚本：第一个，然后是第二个？

自然的解决方案是将第二个 loadScript 调用放入回调中，如下所示：

``` javascript
loadScript('/my/script.js', function(script) {

  alert(`酷，脚本 ${script.src} 加载完成，让我们继续加载另一个吧`);

  loadScript('/my/script2.js', function(script) {
    alert(`酷，第二个脚本加载完成`);
  });

});
```

在外部 loadScript 执行完成时，回调就会发起内部的 loadScript。

如果我们还想要一个脚本呢？

``` javascript
loadScript('/my/script.js', function(script) {

  loadScript('/my/script2.js', function(script) {

    loadScript('/my/script3.js', function(script) {
      // ...加载完所有脚本后继续
    });

  });

});
```

因此，每一个新行为（action）都在回调内部。这对于几个行为来说还好，但对于许多行为来说就不好了，所以我们很快就会看到其他变体。

### 处理 Error
在上述示例中，我们并没有考虑出现 error 的情况。如果脚本加载失败怎么办？我们的回调应该能够对此作出反应。

这是 loadScript 的改进版本，可以跟踪加载错误：

``` javascript
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}

```
加载成功时，它会调用 callback(null, script)，否则调用 callback(error)。

用法：

``` javascript
loadScript('/my/script.js', function(error, script) {
  if (error) {
    // 处理 error
  } else {
    // 脚本加载成功
  }
});
```

再次强调，我们在 loadScript 中所使用的方案其实很普遍。它被称为“Error 优先回调（error-first callback）”风格。

约定是：

1. callback 的第一个参数是为 error 而保留的。一旦出现 error，callback(err) 就会被调用。
2. 第二个参数（和下一个参数，如果需要的话）用于成功的结果。此时 callback(null, result1, result2…) 就会被调用。

因此，单一的 callback 函数可以同时具有报告 error 和传递返回结果的作用。

### 回调地狱

乍一看，它像是一种可行的异步编程方式。的确如此，对于一个或两个嵌套的调用看起来还不错。

但对于一个接一个的多个异步行为，代码将会变成这样：
``` javascript
loadScript('1.js', function(error, script) {

  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', function(error, script) {
      if (error) {
        handleError(error);
      } else {
        // ...
        loadScript('3.js', function(error, script) {
          if (error) {
            handleError(error);
          } else {
            // ...加载完所有脚本后继续 (*)
          }
        });

      }
    });
  }
});
```

在上面这段代码中：

- 我们加载 1.js，如果没有发生错误。
- 我们加载 2.js，如果没有发生错误……
- 我们加载 3.js，如果没有发生错误 —— 做其他操作 (*)。

随着调用嵌套的增加，代码层次变得更深，维护难度也随之增加，尤其是我们使用的是可能包含了很多循环和条件语句的真实代码，而不是例子中的 ...。

有时这些被称为“回调地狱”或“厄运金字塔”。

![callback-hell](https://zh.javascript.info/article/callbacks/callback-hell.svg)

嵌套调用的“金字塔”随着每个异步行为会向右增长。很快它就失控了。

所以这种编码方式不是很好。

我们可以通过使每个行为都成为一个独立的函数来尝试减轻这种问题，如下所示：

``` javascript
loadScript('1.js', step1);

function step1(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('2.js', step2);
  }
}

function step2(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...
    loadScript('3.js', step3);
  }
}

function step3(error, script) {
  if (error) {
    handleError(error);
  } else {
    // ...加载完所有脚本后继续 (*)
  }
}
```
看到了吗？它的作用相同，但是没有深层的嵌套了，因为我们将每个行为都编写成了一个独立的顶层函数。

它可以工作，但是代码看起来就像是一个被撕裂的表格。你可能已经注意到了，它的可读性很差，在阅读时你需要在各个代码块之间跳转。这很不方便，特别是如果读者对代码不熟悉，他们甚至不知道应该跳转到什么地方。

此外，名为 step* 的函数都是一次性使用的，创建它们就是为了避免“厄运金字塔”。没有人会在行为链之外重用它们。因此，这里的命名空间有点混乱。

我们希望还有更好的方法。

幸运的是，有其他方法可以避免此类金字塔。最好的方法之一就是 “promise”，我们将在下一章中介绍它。

## Promise
想象一下，你是一位顶尖歌手，粉丝没日没夜地询问你下首歌什么时候发。

为了从中解放，你承诺（promise）会在单曲发布的第一时间发给他们。你给了粉丝们一个列表。他们可以在上面填写他们的电子邮件地址，以便当歌曲发布后，让所有订阅了的人能够立即收到。即便遇到不测，例如录音室发生了火灾，以致你无法发布新歌，他们也能及时收到相关通知。

每个人都很开心：你不会被任何人催促，粉丝们也不用担心错过歌曲发行。

这是我们在编程中经常遇到的事儿与真实生活的类比：

1. “生产者代码（producing code）”会做一些事儿，并且会需要一些时间。例如，通过网络加载数据的代码。它就像一位“歌手”。

2. “消费者代码（consuming code）”想要在“生产者代码”完成工作的第一时间就能获得其工作成果。许多函数可能都需要这个结果。这些就是“粉丝”。

3. `Promise` 是将“生产者代码”和“消费者代码”连接在一起的一个特殊的 JavaScript 对象。用我们的类比来说：这就是就像是“订阅列表”。“生产者代码”花费它所需的任意长度时间来产出所承诺的结果，而 “promise” 将在它（译注：指的是“生产者代码”，也就是下文所说的 executor）准备好时，将结果向所有订阅了的代码开放。

这种类比并不十分准确，因为 JavaScript 的 promise 比简单的订阅列表更加复杂：它们还拥有其他的功能和局限性。但以此开始挺好的。

Promise 对象的构造器（constructor）语法如下：

``` javascript
let promise = new Promise(function(resolve, reject) {
  // executor（生产者代码，“歌手”）
});
```
传递给 new Promise 的函数被称为 `executor`。当 new Promise 被创建，executor 会自动运行。它包含最终应产出结果的生产者代码。按照上面的类比：executor 就是“歌手”。

它的参数 resolve 和 reject 是由 JavaScript 自身提供的回调。我们的代码仅在 executor 的内部。

当 executor 获得了结果，无论是早还是晚都没关系，它应该调用以下回调之一：

- `resolve(value)` —— 如果任务成功完成并带有结果 value。
- `reject(error)` —— 如果出现了 error，error 即为 error 对象。

所以总结一下就是：executor 会自动运行并尝试执行一项工作。尝试结束后，如果成功则调用 resolve，如果出现 error 则调用 reject。

由 new Promise 构造器返回的 promise 对象具有以下内部属性：

- `state` —— 最初是 "pending"，然后在 resolve 被调用时变为 "fulfilled"，或者在 reject 被调用时变为 "rejected"。
- `result` —— 最初是 undefined，然后在 resolve(value) 被调用时变为 value，或者在 reject(error) 被调用时变为 error。

所以，executor 最终将 promise 移至以下状态之一：

![promise-resolve-reject](https://zh.javascript.info/article/promise-basics/promise-resolve-reject.svg)

稍后我们将看到“粉丝”如何订阅这些更改。

下面是一个 promise 构造器和一个简单的 executor 函数，该 executor 函数具有包含时间（即 setTimeout）的“生产者代码”：

``` javascript
let promise = new Promise(function(resolve, reject) {
  // 当 promise 被构造完成时，自动执行此函数

  // 1 秒后发出工作已经被完成的信号，并带有结果 "done"
  setTimeout(() => resolve("done"), 1000);
});
```
通过运行上面的代码，我们可以看到两件事儿：

1. executor 被自动且立即调用（通过 new Promise）。

2. executor 接受两个参数：resolve 和 reject。这些函数由 JavaScript 引擎预先定义，因此我们不需要创建它们。我们只需要在准备好（译注：指的是 executor 准备好）时调用其中之一即可。

经过 1 秒的“处理”后，executor 调用 resolve("done") 来产生结果。这将改变 promise 对象的状态.

这是一个成功完成任务的例子，一个“成功实现了的诺言”。

下面则是一个 executor 以 error 拒绝 promise 的示例：

``` javascript
let promise = new Promise(function(resolve, reject) {
  // 1 秒后发出工作已经被完成的信号，并带有 error
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});
```
对 reject(...) 的调用将 promise 对象的状态移至 "rejected"

总而言之，executor 应该执行一项工作（通常是需要花费一些时间的事儿），然后调用 resolve 或 reject 来改变对应的 promise 对象的状态。

与最初的 “pending” promise 相反，一个 resolved 或 rejected 的 promise 都会被称为 “settled”。

::: tip 只有一个结果或一个 error
executor 只能调用一个 resolve 或一个 reject。任何状态的更改都是最终的。

所有其他的再对 resolve 和 reject 的调用都会被忽略：

``` javascript
let promise = new Promise(function(resolve, reject) {
  resolve("done");

  reject(new Error("…")); // 被忽略
  setTimeout(() => resolve("…")); // 被忽略
});
```
关键就在于，一个由 executor 完成的工作只能有一个结果或一个 error。

并且，resolve/reject 只需要一个参数（或不包含任何参数），并且将忽略额外的参数。
:::

::: tip 以 Error 对象 reject
如果什么东西出了问题，executor 应该调用 reject。这可以使用任何类型的参数来完成（就像 resolve 一样）。但建议使用 Error 对象（或继承自 Error 的对象）。这样做的理由很快就会显而易见。
:::

::: tip resolve/reject 可以立即进行
实际上，executor 通常是异步执行某些操作，并在一段时间后调用 resolve/reject，但这不是必须的。我们还可以立即调用 resolve 或 reject，就像这样：
``` javascript
let promise = new Promise(function(resolve, reject) {
  // 不花时间去做这项工作
  resolve(123); // 立即给出结果：123
});
```
例如，当我们开始做一个任务，随后发现一切都已经完成并已被缓存时，可能就会发生这种情况。

这挺好。我们立即就有了一个 resolved 的 promise。
:::

::: tip state 和 result 都是内部的
Promise 对象的 state 和 result 属性都是内部的。我们无法直接访问它们。但我们可以对它们使用 .then/.catch/.finally 方法。我们在下面对这些方法进行了描述。
:::

### 消费者：then，catch
Promise 对象充当的是 executor（“生产者代码”或“歌手”）和消费函数（“粉丝”）之间的连接，后者将接收结果或 error。可以通过使用 .then 和 .catch 方法注册消费函数。
#### then
最重要最基础的一个就是 .then。

语法如下：
``` javascript
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);
```
.then 的第一个参数是一个函数，该函数将在 promise resolved 且接收到结果后执行。

.then 的第二个参数也是一个函数，该函数将在 promise rejected 且接收到 error 信息后执行。

例如，以下是对成功 resolved 的 promise 做出的反应：

``` javascript
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve 运行 .then 中的第一个函数
promise.then(
  result => alert(result), // 1 秒后显示 "done!"
  error => alert(error) // 不运行
);
```
第一个函数被运行了。

在 reject 的情况下，运行第二个：
``` javascript
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// reject 运行 .then 中的第二个函数
promise.then(
  result => alert(result), // 不运行
  error => alert(error) // 1 秒后显示 "Error: Whoops!"
);
```
如果我们只对成功完成的情况感兴趣，那么我们可以只为 .then 提供一个函数参数：

``` javascript
let promise = new Promise(resolve => {
  setTimeout(() => resolve("done!"), 1000);
});

promise.then(alert); // 1 秒后显示 "done!"
```
#### catch

如果我们只对 error 感兴趣，那么我们可以使用 null 作为第一个参数：`.then(null, errorHandlingFunction)`。或者我们也可以使用 `.catch(errorHandlingFunction)`，其实是一样的：
``` javascript
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// .catch(f) 与 promise.then(null, f) 一样
promise.catch(alert); // 1 秒后显示 "Error: Whoops!"
```
### 清理：finally
就像常规 `try {...} catch {...}` 中的 finally 子句一样，promise 中也有 finally。

调用 .finally(f) 类似于 .then(f, f)，因为当 promise settled 时 f 就会执行：无论 promise 被 resolve 还是 reject。

finally 的功能是**设置一个处理程序在前面的操作完成后，执行清理/终结**。

例如，停止加载指示器，关闭不再需要的连接等。

把它想象成派对的终结者。无论派对是好是坏，有多少朋友参加，我们都需要（或者至少应该）在它之后进行清理。

代码可能看起来像这样：

``` javascript
new Promise((resolve, reject) => {
  /* 做一些需要时间的事，之后调用可能会 resolve 也可能会 reject */
})
  // 在 promise 为 settled 时运行，无论成功与否
  .finally(() => stop loading indicator)
  // 所以，加载指示器（loading indicator）始终会在我们继续之前停止
  .then(result => show result, err => show error)
```
请注意，finally(f) 并不完全是 then(f,f) 的别名。

它们之间有重要的区别：

1. finally 处理程序（handler）没有参数。在 finally 中，我们不知道 promise 是否成功。没关系，因为我们的任务通常是执行“常规”的完成程序（finalizing procedures）。

请看上面的例子：如你所见，finally 处理程序没有参数，promise 的结果由下一个处理程序处理。

2. finally 处理程序将结果或 error “传递”给下一个合适的处理程序。

例如，在这结果被从 finally 传递给了 then：

``` javascript
new Promise((resolve, reject) => {
  setTimeout(() => resolve("value"), 2000)
})
  .finally(() => alert("Promise ready")) // 先触发
  .then(result => alert(result)); // <-- .then 显示 "value"
```

正如我们所看到的，第一个 promise 返回的 value 通过 finally 被传递给了下一个 then。

这非常方便，因为 finally 并不意味着处理一个 promise 的结果。如前所述，无论结果是什么，它都是进行常规清理的地方。

下面是一个 promise 返回结果为 error 的示例，让我们看看它是如何通过 finally 被传递给 catch 的：

``` javascript
new Promise((resolve, reject) => {
  throw new Error("error");
})
  .finally(() => alert("Promise ready")) // 先触发
  .catch(err => alert(err));  // <-- .catch 显示这个 error
```
3. finally 处理程序也不应该返回任何内容。如果它返回了，返回的值会默认被忽略。

此规则的唯一例外是当 finally 处理程序抛出 error 时。此时这个 error（而不是任何之前的结果）会被转到下一个处理程序。

**总结：**

- finally 处理程序没有得到前一个处理程序的结果（它没有参数）。而这个结果被传递给了下一个合适的处理程序。
- 如果 finally 处理程序返回了一些内容，那么这些内容会被忽略。
- 当 finally 抛出 error 时，执行将转到最近的 error 的处理程序。

::: tip 我们可以对 settled 的 promise 附加处理程序
如果 promise 为 pending 状态，.then/catch/finally 处理程序（handler）将等待它的结果。

有时候，当我们向一个 promise 添加处理程序时，它可能已经 settled 了。

在这种情况下，这些处理程序会立即执行：
``` javascript
// 下面这 promise 在被创建后立即变为 resolved 状态
let promise = new Promise(resolve => resolve("done!"));

promise.then(alert); // done!（立刻显示）
```
:::

请注意这使得 promise 比现实生活中的“订阅列表”方案强大得多。如果歌手已经发布了他们的单曲，然后某个人在订阅列表上进行了注册，则他们很可能不会收到该单曲。实际生活中的订阅必须在活动开始之前进行。

Promise 则更加灵活。我们可以随时添加处理程序（handler）：如果结果已经在了，它们就会执行。

### 示例：loadScript
接下来，让我们看一下关于 promise 如何帮助我们编写异步代码的更多实际示例。

我们从上一章获得了用于加载脚本的 loadScript 函数。

这是基于回调函数的变体，记住它：

``` javascript
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;

  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}
```
让我们用 promise 重写它。

新函数 loadScript 将不需要回调。取而代之的是，它将创建并返回一个在加载完成时 resolve 的 promise 对象。外部代码可以使用 .then 向其添加处理程序（订阅函数）：

``` javascript
function loadScript(src) {
  return new Promise(function(resolve, reject) {
    let script = document.createElement('script');
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${src}`));

    document.head.append(script);
  });
}
```

用法：

``` javascript
let promise = loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.js");

promise.then(
  script => alert(`${script.src} is loaded!`),
  error => alert(`Error: ${error.message}`)
);

promise.then(script => alert('Another handler...'));
```
## Promise 链

我们回顾一下 简介：回调 一章中提到的问题：我们有一系列的异步任务要一个接一个地执行 —— 例如，加载脚本。我们如何写出更好的代码呢？

Promise 提供了一些方案来做到这一点。

在本章中，我们将一起学习 promise 链。

它看起来就像这样：

``` javascript
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000); // (*)

}).then(function(result) { // (**)

  alert(result); // 1
  return result * 2;

}).then(function(result) { // (***)

  alert(result); // 2
  return result * 2;

}).then(function(result) {

  alert(result); // 4
  return result * 2;

});
```

它的想法是通过 .then 处理程序（handler）链进行传递 result。

运行流程如下：

1. 初始 promise 在 1 秒后 resolve (*)，
2. 然后 .then 处理程序被调用 (**)，它又创建了一个新的 promise（以 2 作为值 resolve）。
3. 下一个 then (***) 得到了前一个 then 的值，对该值进行处理（*2）并将其传递给下一个处理程序。
4. ……依此类推。

随着 result 在处理程序链中传递，我们可以看到一系列的 alert 调用：1 → 2 → 4。

这样之所以是可行的，是因为**每个对 .then 的调用都会返回了一个新的 promise，因此我们可以在其之上调用下一个 .then**。

当处理程序返回一个值时，它将成为该 promise 的 result，所以将使用它调用下一个 .then。

新手常犯的一个经典错误：从技术上讲，我们也可以将多个 .then 添加到一个 promise 上。但这并不是 promise 链（chaining）。

例如：

``` javascript
let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});

promise.then(function(result) {
  alert(result); // 1
  return result * 2;
});
```
我们在这里所做的只是一个 promise 的几个处理程序。它们不会相互传递 result；相反，它们之间彼此独立运行处理任务。

在同一个 promise 上的所有 .then 获得的结果都相同 —— 该 promise 的结果。所以，在上面的代码中，所有 alert 都显示相同的内容：1。

实际上我们极少遇到一个 promise 需要多个处理程序的情况。使用链式调用的频率更高。

### 返回 promise
`.then(handler)` 中所使用的处理程序（handler）可以创建并返回一个 promise。

在这种情况下，其他的处理程序将等待它 settled 后再获得其结果。

例如：
``` javascript
new Promise(function(resolve, reject) {

  setTimeout(() => resolve(1), 1000);

}).then(function(result) {

  alert(result); // 1

  return new Promise((resolve, reject) => { // (*)
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) { // (**)

  alert(result); // 2

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(result * 2), 1000);
  });

}).then(function(result) {

  alert(result); // 4

});
```
这里第一个 .then 显示 1 并在 (*) 行返回 new Promise(…)。1 秒后它会进行 resolve，然后 result（resolve 的参数，在这里它是 result*2）被传递给第二个 .then 的处理程序。这个处理程序位于 (**) 行，它显示 2，并执行相同的行为。

所以输出与前面的示例相同：1 → 2 → 4，但是现在在每次 alert 调用之间会有 1 秒钟的延迟。

返回 promise 使我们能够构建异步行为链。

### 示例：loadScript
让我们将本章所讲的这个特性与在 上一章 中定义的 promise 化的 loadScript 结合使用，按顺序依次加载脚本：
``` javascript
loadScript("/article/promise-chaining/one.js")
  .then(function(script) {
    return loadScript("/article/promise-chaining/two.js");
  })
  .then(function(script) {
    return loadScript("/article/promise-chaining/three.js");
  })
  .then(function(script) {
    // 使用在脚本中声明的函数
    // 以证明脚本确实被加载完成了
    one();
    two();
    three();
  });
```

我们可以用箭头函数来重写代码，让其变得简短一些：

``` javascript
loadScript("/article/promise-chaining/one.js")
  .then(script => loadScript("/article/promise-chaining/two.js"))
  .then(script => loadScript("/article/promise-chaining/three.js"))
  .then(script => {
    // 脚本加载完成，我们可以在这儿使用脚本中声明的函数
    one();
    two();
    three();
  });
```

在这儿，每个 loadScript 调用都返回一个 promise，并且在它 resolve 时下一个 .then 开始运行。然后，它启动下一个脚本的加载。所以，脚本是一个接一个地加载的。

我们可以向链中添加更多的异步行为。请注意，代码仍然是“扁平”的 —— 它向下增长，而不是向右。这里没有“厄运金字塔”的迹象。

从技术上讲，我们可以向每个 loadScript 直接添加 .then，就像这样：

``` javascript
loadScript("/article/promise-chaining/one.js").then(script1 => {
  loadScript("/article/promise-chaining/two.js").then(script2 => {
    loadScript("/article/promise-chaining/three.js").then(script3 => {
      // 此函数可以访问变量 script1，script2 和 script3
      one();
      two();
      three();
    });
  });
});
```
刚开始使用 promise 的人可能不知道 promise 链，所以他们就这样写了。通常，链式是首选。

有时候直接写 .then 也是可以的，因为嵌套的函数可以访问外部作用域。在上面的例子中，嵌套在最深层的那个回调（callback）可以访问所有变量 script1，script2 和 script3。**但这是一个例外，而不是一条规则**。

::: tip Thenables
确切地说，处理程序返回的不完全是一个 promise，而是返回的被称为 “thenable” 对象 —— 一个具有方法 .then 的任意对象。它会被当做一个 promise 来对待。

这个想法是，第三方库可以实现自己的“promise 兼容（promise-compatible）”对象。它们可以具有扩展的方法集，但也与原生的 promise 兼容，因为它们实现了 .then 方法。

这是一个 thenable 对象的示例：
``` javascript
class Thenable {
  constructor(num) {
    this.num = num;
  }
  then(resolve, reject) {
    alert(resolve); // function() { native code }
    // 1 秒后使用 this.num*2 进行 resolve
    setTimeout(() => resolve(this.num * 2), 1000); // (**)
  }
}

new Promise(resolve => resolve(1))
  .then(result => {
    return new Thenable(result); // (*)
  })
  .then(alert); // 1000ms 后显示 2
```
JavaScript 检查在 (*) 行中由 .then 处理程序返回的对象：如果它具有名为 then 的可调用方法，那么它将调用该方法并提供原生的函数 resolve 和 reject 作为参数（类似于 executor），并等待直到其中一个函数被调用。在上面的示例中，resolve(2) 在 1 秒后被调用 (**)。然后，result 会被进一步沿着链向下传递。

这个特性允许我们将自定义的对象与 promise 链集成在一起，而不必继承自 Promise。
:::

### 更复杂的示例：fetch

在前端编程中，promise 通常被用于网络请求。那么，让我们一起来看一个相关的扩展示例吧。

我们将使用 fetch 方法从远程服务器加载用户信息。它有很多可选的参数，我们在 单独的一章 中对其进行了详细介绍，但基本语法很简单：

``` javascript
let promise = fetch(url);
```
执行这条语句，向 url 发出网络请求并返回一个 promise。当远程服务器返回 header（是在 **全部响应加载完成前**）时，该 promise 使用一个 response 对象来进行 resolve。

为了读取完整的响应，我们应该调用 response.text() 方法：当全部文字内容从远程服务器下载完成后，它会返回一个 promise，该 promise 以刚刚下载完成的这个文本作为 result 进行 resolve。

下面这段代码向 user.json 发送请求，并从服务器加载该文本：

``` javascript
fetch('/article/promise-chaining/user.json')
  // 当远程服务器响应时，下面的 .then 开始执行
  .then(function(response) {
    // 当 user.json 加载完成时，response.text() 会返回一个新的 promise
    // 该 promise 以加载的 user.json 为 result 进行 resolve
    return response.text();
  })
  .then(function(text) {
    // ……这是远程文件的内容
    alert(text); // {"name": "iliakan", "isAdmin": true}
  });
```
从 fetch 返回的 response 对象还包含 response.json() 方法，该方法可以读取远程数据并将其解析为 JSON。在我们的例子中，这更加方便，所以我们用这个方法吧。

为了简洁，我们还将使用箭头函数：
``` javascript
// 同上，但使用 response.json() 将远程内容解析为 JSON
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => alert(user.name)); // iliakan，获取到了用户名
```

现在，让我们用加载好的用户信息搞点事情。

例如，我们可以再向 GitHub 发送一个请求，加载用户个人资料并显示头像：

``` javascript
// 发送一个对 user.json 的请求
fetch('/article/promise-chaining/user.json')
  // 将其加载为 JSON
  .then(response => response.json())
  // 发送一个到 GitHub 的请求
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  // 将响应加载为 JSON
  .then(response => response.json())
  // 显示头像图片（githubUser.avatar_url）3 秒（也可以加上动画效果）
  .then(githubUser => {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => img.remove(), 3000); // (*)
  });
```
这段代码可以工作，具体细节请看注释。但是，这有一个潜在的问题，一个新手使用 promise 时的典型问题。

请看 (*) 行：我们如何能在头像显示结束并被移除 之后 做点什么？例如，我们想显示一个用于编辑该用户或者其他内容的表单。就目前而言，是做不到的。

为了使链可扩展，我们需要返回一个在头像显示结束时进行 resolve 的 promise。

就像这样：
``` javascript
fetch('/article/promise-chaining/user.json')
  .then(response => response.json())
  .then(user => fetch(`https://api.github.com/users/${user.name}`))
  .then(response => response.json())
  .then(githubUser => new Promise(function(resolve, reject) { // (*)
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser); // (**)
    }, 3000);
  }))
  // 3 秒后触发
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
```
也就是说，第 (*) 行的 .then 处理程序现在返回一个 new Promise，只有在 setTimeout 中的 resolve(githubUser) (**) 被调用后才会变为 settled。链中的下一个 .then 将一直等待这一时刻的到来。

作为一个好的做法，异步行为应该始终返回一个 promise。这样就可以使得之后我们计划后续的行为成为可能。即使我们现在不打算对链进行扩展，但我们之后可能会需要。

最后，我们可以将代码拆分为可重用的函数：

``` javascript
function loadJson(url) {
  return fetch(url)
    .then(response => response.json());
}

function loadGithubUser(name) {
  return loadJson(`https://api.github.com/users/${name}`);
}

function showAvatar(githubUser) {
  return new Promise(function(resolve, reject) {
    let img = document.createElement('img');
    img.src = githubUser.avatar_url;
    img.className = "promise-avatar-example";
    document.body.append(img);

    setTimeout(() => {
      img.remove();
      resolve(githubUser);
    }, 3000);
  });
}

// 使用它们：
loadJson('/article/promise-chaining/user.json')
  .then(user => loadGithubUser(user.name))
  .then(showAvatar)
  .then(githubUser => alert(`Finished showing ${githubUser.name}`));
  // ...
```

## 使用 promise 进行错误处理



















































































































































































































































































































































































































