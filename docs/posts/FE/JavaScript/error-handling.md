# 错误处理

不管你多么精通编程，有时我们的脚本总还是会出现错误。可能是因为我们的编写出错，或是与预期不同的用户输入，或是错误的服务端响应以及其他数千种原因。

通常，如果发生错误，脚本就会“死亡”（立即停止），并在控制台将错误打印出来。

但是有一种语法结构 try...catch，它使我们可以“捕获（catch）”错误，因此脚本可以执行更合理的操作，而不是死掉。

## "try...catch"
try...catch 结构由两部分组成：try 和 catch：

``` javascript
try {

  // 代码...

} catch (err) {

  // 错误捕获

}
```
它按照以下步骤执行：

1. 首先，执行 try {...} 中的代码。
2. 如果这里没有错误，则忽略 catch (err)：执行到 try 的末尾并跳过 catch 继续执行。
3. 如果这里出现错误，则 try 执行停止，控制流转向 catch (err) 的开头。变量 err（我们可以使用任何名称）将包含一个 error 对象，该对象包含了所发生事件的详细信息。

![try-catch-flow](https://zh.javascript.info/article/try-catch/try-catch-flow.svg)

所以，try {...} 块内的 error 不会杀死脚本 —— 我们有机会在 catch 中处理它。

让我们来看一些例子。

- 没有 error 的例子：显示 alert (1) 和 (2)：

``` javascript
try {

  alert('开始执行 try 中的内容');  // (1) <--

  // ...这里没有 error

  alert('try 中的内容执行完毕');   // (2) <--

} catch (err) {

  alert('catch 被忽略，因为没有 error'); // (3)

}
```

- 包含 error 的例子：显示 (1) 和 (3) 行的 alert 中的内容：

``` javascript
try {

  alert('开始执行 try 中的内容');  // (1) <--

  lalala; // error，变量未定义！

  alert('try 的末尾（未执行到此处）');  // (2)

} catch (err) {

  alert(`出现了 error！`); // (3) <--

}
```
::: warning try...catch 仅对运行时的 error 有效
要使得 try...catch 能工作，代码必须是可执行的。换句话说，它必须是有效的 JavaScript 代码。

如果代码包含语法错误，那么 try..catch 将无法正常工作，例如含有不匹配的花括号：
``` javascript
try {
  {{{{{{{{{{{{
} catch (err) {
  alert("引擎无法理解这段代码，它是无效的");
}
```
JavaScript 引擎首先会读取代码，然后运行它。在读取阶段发生的错误被称为“解析时间（parse-time）”错误，并且无法恢复（从该代码内部）。这是因为引擎无法理解该代码。

所以，try...catch 只能处理有效代码中出现的错误。这类错误被称为“运行时的错误（runtime errors）”，有时被称为“异常（exceptions）”。
:::
::: tip try...catch 同步执行
如果在“计划的（scheduled）”代码中发生异常，例如在 setTimeout 中，则 try...catch 不会捕获到异常：
``` javascript
try {
  setTimeout(function() {
    noSuchVariable; // 脚本将在这里停止运行
  }, 1000);
} catch (err) {
  alert( "不工作" );
}
```
因为 try...catch 包裹了计划要执行的函数，该函数本身要稍后才执行，这时引擎已经离开了 try...catch 结构。

为了捕获到计划的（scheduled）函数中的异常，那么 try...catch 必须在这个函数内：
``` javascript
setTimeout(function() {
  try {
    noSuchVariable; // try...catch 处理 error 了！
  } catch {
    alert( "error 被在这里捕获了！" );
  }
}, 1000);
```
:::
### Error 对象
发生错误时，JavaScript 会生成一个包含有关此 error 详细信息的对象。然后将该对象作为参数传递给 catch：
``` javascript
try {
  // ...
} catch (err) { // <-- “error 对象”，也可以用其他参数名代替 err
  // ...
}
```
对于所有内建的 error，error 对象具有两个主要属性：

- name

Error 名称。例如，对于一个未定义的变量，名称是 "ReferenceError"。

- message

关于 error 的详细文字描述。

还有其他非标准的属性在大多数环境中可用。其中被最广泛使用和支持的是：

- stack
当前的调用栈：用于调试目的的一个字符串，其中包含有关导致 error 的嵌套调用序列的信息。

例如：
``` javascript
try {
  lalala; // error, variable is not defined!
} catch (err) {
  alert(err.name); // ReferenceError
  alert(err.message); // lalala is not defined
  alert(err.stack); // ReferenceError: lalala is not defined at (...call stack)

  // 也可以将一个 error 作为整体显示出来
  // error 信息被转换为像 "name: message" 这样的字符串
  alert(err); // ReferenceError: lalala is not defined
}
```
### 可选的 “catch” 绑定

如果我们不需要 error 的详细信息，catch 也可以忽略它：
``` javascript
try {
  // ...
} catch { // <-- 没有 (err)
  // ...
}
```
### 使用 “try…catch”
让我们一起探究一下真实场景中 try...catch 的用例。

正如我们所知道的，JavaScript 支持 JSON.parse(str) 方法来解析 JSON 编码的值。

通常，它被用来解析从网络、服务器或是其他来源接收到的数据。

我们收到数据后，然后像下面这样调用 JSON.parse：

``` javascript
let json = '{"name":"John", "age": 30}'; // 来自服务器的数据

let user = JSON.parse(json); // 将文本表示转换成 JavaScript 对象

// 现在 user 是一个解析自 json 字符串的有自己属性的对象
alert( user.name ); // John
alert( user.age );  // 30
```

你可以在 JSON 方法，toJSON 一章中找到更多关于 JSON 的详细内容。

如果 json 格式错误，JSON.parse 就会生成一个 error，因此脚本就会“死亡”。

我们对此满意吗？当然不！

如果这样做，当拿到的数据出了问题，那么访问者永远都不会知道原因（除非他们打开开发者控制台）。代码执行失败却没有提示信息，这真的是很糟糕的用户体验。

让我们用 try...catch 来处理这个 error：
``` javascript
let json = "{ bad json }";

try {

  let user = JSON.parse(json); // <-- 当出现 error 时...
  alert( user.name ); // 不工作

} catch (err) {
  // ...执行会跳转到这里并继续执行
  alert( "很抱歉，数据有错误，我们会尝试再请求一次。" );
  alert( err.name );
  alert( err.message );
}
```
在这儿，我们将 catch 块仅仅用于显示信息，但我们可以做更多的事：发送一个新的网络请求，向访问者建议一个替代方案，将有关错误的信息发送给记录日志的设备，……。所有这些都比代码“死掉”好得多。
### 抛出我们自定义的 error

如果这个 json 在语法上是正确的，但是没有所必须的 name 属性该怎么办？

像这样：

``` javascript
let json = '{ "age": 30 }'; // 不完整的数据

try {

  let user = JSON.parse(json); // <-- 没有 error
  alert( user.name ); // 没有 name！

} catch (err) {
  alert( "doesn't execute" );
}
```

这里 JSON.parse 正常执行，但缺少 name 属性对我们来说确实是个 error。

为了统一进行 error 处理，我们将使用 throw 操作符。

### “throw” 操作符

throw 操作符会生成一个 error 对象。

语法如下：

``` javascript
throw <error object>
```

技术上讲，我们可以将任何东西用作 error 对象。甚至可以是一个原始类型数据，例如数字或字符串，但最好使用对象，最好使用具有 name 和 message 属性的对象（某种程度上保持与内建 error 的兼容性）。

JavaScript 中有很多内建的标准 error 的构造器：Error，SyntaxError，ReferenceError，TypeError 等。我们也可以使用它们来创建 error 对象。

它们的语法是：

``` javascript
let error = new Error(message);
// 或
let error = new SyntaxError(message);
let error = new ReferenceError(message);
// ...
```

对于内建的 error（不是对于其他任何对象，仅仅是对于 error），name 属性刚好就是构造器的名字。message 则来自于参数（argument）。

例如：

``` javascript
let error = new Error("Things happen o_O");

alert(error.name); // Error
alert(error.message); // Things happen o_O
```
让我们来看看 JSON.parse 会生成什么样的 error：

``` javascript
try {
  JSON.parse("{ bad json o_O }");
} catch(err) {
  alert(err.name); // SyntaxError
  alert(err.message); // Unexpected token b in JSON at position 2
}
```
正如我们所看到的， 那是一个 SyntaxError。

在我们的示例中，缺少 name 属性就是一个 error，因为用户必须有一个 name。

所以，让我们抛出这个 error。

``` javascript
let json = '{ "age": 30 }'; // 不完整的数据

try {

  let user = JSON.parse(json); // <-- 没有 error

  if (!user.name) {
    throw new SyntaxError("数据不全：没有 name"); // (*)
  }

  alert( user.name );

} catch(err) {
  alert( "JSON Error: " + err.message ); // JSON Error: 数据不全：没有 name
}
```
在 (*) 标记的这一行，throw 操作符生成了包含着我们所给定的 message 的 SyntaxError，与 JavaScript 自己生成的方式相同。try 的执行立即停止，控制流转向 catch 块。

现在，catch 成为了所有 error 处理的唯一场所：对于 JSON.parse 和其他情况都适用。

### 再次抛出（Rethrowing）

在上面的例子中，我们使用 try...catch 来处理不正确的数据。但是在 try {...} 块中是否可能发生 另一个预料之外的 error？例如编程错误（未定义变量）或其他错误，而不仅仅是这种“不正确的数据”。

例如：

``` javascript
let json = '{ "age": 30 }'; // 不完整的数据

try {
  user = JSON.parse(json); // <-- 忘记在 user 前放置 "let"

  // ...
} catch (err) {
  alert("JSON Error: " + err); // JSON Error: ReferenceError: user is not defined
  // (实际上并没有 JSON Error)
}
```
在我们的例子中，try...catch 旨在捕获“数据不正确”的 error。但实际上，catch 会捕获到 所有 来自于 try 的 error。在这儿，它捕获到了一个预料之外的 error，但仍然抛出的是同样的 "JSON Error" 信息。这是不正确的，并且也会使代码变得更难以调试。

为了避免此类问题，我们可以采用“重新抛出”技术。规则很简单：

**catch 应该只处理它知道的 error，并“抛出”所有其他 error。**

“再次抛出（rethrowing）”技术可以被更详细地解释为：

1. Catch 捕获所有 error。
2. 在 `catch (err) {...}` 块中，我们对 error 对象 err 进行分析。
3. 如果我们不知道如何处理它，那我们就 throw err。

通常，我们可以使用 instanceof 操作符判断错误类型：

``` javascript
try {
  user = { /*...*/ };
} catch (err) {
  if (err instanceof ReferenceError) {
    alert('ReferenceError'); // 访问一个未定义（undefined）的变量产生了 "ReferenceError"
  }
}
```
我们还可以从 err.name 属性中获取错误的类名。所有原生的错误都有这个属性。另一种方式是读取 err.constructor.name。

在下面的代码中，我们使用“再次抛出”，以达到在 catch 中只处理 SyntaxError 的目的：

``` javascript
let json = '{ "age": 30 }'; // 不完整的数据
try {

  let user = JSON.parse(json);

  if (!user.name) {
    throw new SyntaxError("数据不全：没有 name");
  }

  blabla(); // 预料之外的 error

  alert( user.name );

} catch (err) {

  if (err instanceof SyntaxError) {
    alert( "JSON Error: " + err.message );
  } else {
    throw err; // 再次抛出 (*)
  }

}
```
如果 (*) 标记的这行 catch 块中的 error 从 try...catch 中“掉了出来”，那么它也可以被外部的 try...catch 结构（如果存在）捕获到，如果外部不存在这种结构，那么脚本就会被杀死。

所以，catch 块实际上只处理它知道该如何处理的 error，并“跳过”所有其他的 error。

下面这个示例演示了这种类型的 error 是如何被另外一级 try...catch 捕获的：

``` javascript
function readData() {
  let json = '{ "age": 30 }';

  try {
    // ...
    blabla(); // error!
  } catch (err) {
    // ...
    if (!(err instanceof SyntaxError)) {
      throw err; // 再次抛出（不知道如何处理它）
    }
  }
}

try {
  readData();
} catch (err) {
  alert( "External catch got: " + err ); // 捕获了它！
}
```
上面这个例子中的 readData 只知道如何处理 SyntaxError，而外部的 try...catch 知道如何处理任意的 error。

### try…catch…finally

等一下，以上并不是所有内容。

try...catch 结构可能还有一个代码子句（clause）：finally。

如果它存在，它在所有情况下都会被执行：

- try 之后，如果没有 error，
- catch 之后，如果有 error。

该扩展语法如下所示：

``` javascript
try {
   ... 尝试执行的代码 ...
} catch (err) {
   ... 处理 error ...
} finally {
   ... 总是会执行的代码 ...
}
```

试试运行这段代码：

``` javascript
try {
  alert( 'try' );
  if (confirm('Make an error?')) BAD_CODE();
} catch (err) {
  alert( 'catch' );
} finally {
  alert( 'finally' );
}
```

这段代码有两种执行方式：

1. 如果你对于 “Make an error?” 的回答是 “Yes”，那么执行 try -> catch -> finally。
2. 如果你的回答是 “No”，那么执行 try -> finally。

finally 子句（clause）通常用在：**当我们开始做某事的时候，希望无论出现什么情况都要完成某个任务。**

例如，我们想要测量一个斐波那契数字函数 fib(n) 执行所需要花费的时间。通常，我们可以在运行它之前开始测量，并在运行完成时结束测量。但是，如果在该函数调用期间出现 error 该怎么办？特别是，下面这段 fib(n) 的实现代码在遇到负数或非整数数字时会返回一个 error。

无论如何，finally 子句都是一个结束测量的好地方。

在这儿，finally 能够保证在两种情况下都能正确地测量时间 —— 成功执行 fib 以及 fib 中出现 error 时：

``` javascript
let num = +prompt("输入一个正整数？", 35)

let diff, result;

function fib(n) {
  if (n < 0 || Math.trunc(n) != n) {
    throw new Error("不能是负数，并且必须是整数。");
  }
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

let start = Date.now();

try {
  result = fib(num);
} catch (err) {
  result = 0;
} finally {
  diff = Date.now() - start;
}

alert(result || "出现了 error");

alert( `执行花费了 ${diff}ms` );
```

你可以通过运行上面这段代码并在 prompt 弹窗中输入 35 来进行检查 —— 代码运行正常，先执行 try 然后是 finally。如果你输入的是 -1 —— 将立即出现 error，执行将只花费 0ms。以上两种情况下的时间测量都正确地完成了。

换句话说，函数 fib 以 return 还是 throw 完成都无关紧要。在这两种情况下都会执行 finally 子句。

::: tip 变量和 try...catch...finally 中的局部变量
请注意，上面代码中的 result 和 diff 变量都是在 try...catch 之前 声明的。

否则，如果我们使用 let 在 try 块中声明变量，那么该变量将只在 try 块中可见。
::: 

::: tip finally 和 return
finally 子句适用于 try...catch 的 任何 出口。这包括显式的 return。

在下面这个例子中，在 try 中有一个 return。在这种情况下，finally 会在控制转向外部代码前被执行。

``` javascript
function func() {

  try {
    return 1;

  } catch (err) {
    /* ... */
  } finally {
    alert( 'finally' );
  }
}

alert( func() ); // 先执行 finally 中的 alert，然后执行这个 alert
```
::: 

::: tip try...finally
没有 catch 子句的 try...finally 结构也很有用。当我们不想在原地处理 error（让它们掉出去吧），但是需要确保我们启动的处理需要被完成时，我们应当使用它。

``` javascript
function func() {
  // 开始执行需要被完成的操作（比如测量）
  try {
    // ...
  } finally {
    // 完成前面我们需要完成的那件事，即使 try 中的执行失败了
  }
}
```

上面的代码中，由于没有 catch，所以 try 中的 error 总是会使代码执行跳转至函数 func() 外。但是，在跳出之前需要执行 finally 中的代码。
::: 

### 全局 catch
::: warning 环境特定
这个部分的内容并不是 JavaScript 核心的一部分。
::: 

设想一下，在 try...catch 结构外有一个致命的 error，然后脚本死亡了。这个 error 就像编程错误或其他可怕的事儿那样。

有什么办法可以用来应对这种情况吗？我们可能想要记录这个 error，并向用户显示某些内容（通常用户看不到错误信息）等。

规范中没有相关内容，但是代码的执行环境一般会提供这种机制，因为它确实很有用。例如，Node.JS 有 process.on("uncaughtException")。在浏览器中，我们可以将一个函数赋值给特殊的 window.onerror 属性，该函数将在发生未捕获的 error 时执行。

语法如下：

``` javascript
window.onerror = function(message, url, line, col, error) {
  // ...
};
```
- `message` error 信息。
- `url` 发生 error 的脚本的 URL。
- `line，col` 发生 error 处的代码的行号和列号。
- `error` error 对象。

例如：

``` javascript
<script>
  window.onerror = function(message, url, line, col, error) {
    alert(`${message}\n At ${line}:${col} of ${url}`);
  };

  function readData() {
    badFunc(); // 啊，出问题了！
  }

  readData();
</script>
```

全局错误处理程序 window.onerror 的作用通常不是恢复脚本的执行 —— 如果发生编程错误，恢复脚本的执行几乎是不可能的，它的作用是将错误信息发送给开发者。

也有针对这种情况提供 error 日志的 Web 服务，例如 https://errorception.com 或 http://www.muscula.com。

它们会像这样运行：

- 我们注册该服务，并拿到一段 JavaScript 代码（或脚本的 URL），然后插入到页面中。
- 该 JavaScript 脚本设置了自定义的 window.onerror 函数。
- 当发生 error 时，它会发送一个此 error 相关的网络请求到服务提供方。
- 我们可以登录到服务方的 Web 界面来查看这些 error。

## 自定义 Error，扩展 Error

当我们在开发某些东西时，经常会需要我们自己的 error 类来反映在我们的任务中可能出错的特定任务。对于网络操作中的 error，我们需要 HttpError，对于数据库操作中的 error，我们需要 DbError，对于搜索操作中的 error，我们需要 NotFoundError，等等。

我们自定义的 error 应该支持基本的 error 的属性，例如 message，name，并且最好还有 stack。但是它们也可能会有其他属于它们自己的属性，例如，HttpError 对象可能会有一个 statusCode 属性，属性值可能为 404、403 或 500 等。

JavaScript 允许将 throw 与任何参数一起使用，所以从技术上讲，我们自定义的 error 不需要从 Error 中继承。但是，如果我们继承，那么就可以使用 obj instanceof Error 来识别 error 对象。因此，最好继承它。

随着开发的应用程序的增长，我们自己的 error 自然会形成形成一个层次结构（hierarchy）。例如，HttpTimeoutError 可能继承自 HttpError，等等。

### 扩展 Error
例如，让我们考虑一个函数 readUser(json)，该函数应该读取带有用户数据的 JSON。

这里是一个可用的 json 的例子：

``` javascript
let json = `{ "name": "John", "age": 30 }`;
```
在函数内部，我们将使用 JSON.parse。如果它接收到格式不正确的 json，就会抛出 SyntaxError。但是，即使 json 在语法上是正确的，也不意味着该数据是有效的用户数据，对吧？因为它可能丢失了某些必要的数据。例如，对用户来说，必不可少的是 name 和 age 属性。

我们的函数 readUser(json) 不仅会读取 JSON，还会检查（“验证”）数据。如果没有所必须的字段，或者（字段的）格式错误，那么就会出现一个 error。并且这些并不是 SyntaxError，因为这些数据在语法上是正确的，这些是另一种错误。我们称之为 ValidationError，并为之创建一个类。这种类型的错误也应该包含有关违规字段的信息。

我们的 ValidationError 类应该继承自 Error 类。

Error 类是内建的，但我们可以通过下面这段近似代码理解我们要扩展的内容：

``` javascript
// JavaScript 自身定义的内建的 Error 类的“伪代码”

class Error {
  constructor(message) {
    this.message = message;
    this.name = "Error"; // (不同的内建 error 类有不同的名字)
    this.stack = <call stack>; // 非标准的，但大多数环境都支持它
  }
}
```
现在让我们从其中继承 ValidationError 试一试：

``` javascript
class ValidationError extends Error {
  constructor(message) {
    super(message); // (1)
    this.name = "ValidationError"; // (2)
  }
}

function test() {
  throw new ValidationError("Whoops!");
}

try {
  test();
} catch(err) {
  alert(err.message); // Whoops!
  alert(err.name); // ValidationError
  alert(err.stack); // 一个嵌套调用的列表，每个调用都有对应的行号
}
```
请注意：在 (1) 行中我们调用了父类的 constructor。JavaScript 要求我们在子类的 constructor 中调用 super，所以这是必须的。父类的 constructor 设置了 message 属性。

父类的 constructor 还将 name 属性的值设置为了 "Error"，所以在 (2) 行中，我们将其重置为了右边的值。

让我们尝试在 readUser(json) 中使用它吧：
``` javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

// 用法
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new ValidationError("No field: age");
  }
  if (!user.name) {
    throw new ValidationError("No field: name");
  }

  return user;
}

// try..catch 的工作示例

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
    alert("Invalid data: " + err.message); // Invalid data: No field: name
  } else if (err instanceof SyntaxError) { // (*)
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 未知的 error，再次抛出 (**)
  }
}
```
上面代码中的 try..catch 块既处理我们的 ValidationError 又处理来自 JSON.parse 的内建 SyntaxError。

请看一下我们是如何使用 instanceof 来检查 (*) 行中的特定错误类型的。

我们也可以看看 err.name，像这样：

``` javascript
// ...
// instead of (err instanceof SyntaxError)
} else if (err.name == "SyntaxError") { // (*)
// ...
```
使用 instanceof 的版本要好得多，因为将来我们会对 ValidationError 进行扩展，创建它的子类型，例如 PropertyRequiredError。而 instanceof 检查对于新的继承类也适用。所以这是面向未来的做法。

还有一点很重要，在 catch 遇到了未知的错误，它会在 (**) 行将该错误再次抛出。catch 块只知道如何处理 validation 错误和语法错误，而其他错误（由代码中的拼写错误或其他未知原因导致的）应该被扔出（fall through）。

### 深入继承
ValidationError 类是非常通用的。很多东西都可能出错。对象的属性可能缺失或者属性可能有格式错误（例如 age 属性的值为一个字符串而不是数字）。让我们针对缺少属性的错误来制作一个更具体的 PropertyRequiredError 类。它将携带有关缺少的属性的相关信息。

``` javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}

// 用法
function readUser(json) {
  let user = JSON.parse(json);

  if (!user.age) {
    throw new PropertyRequiredError("age");
  }
  if (!user.name) {
    throw new PropertyRequiredError("name");
  }

  return user;
}

// try..catch 的工作示例

try {
  let user = readUser('{ "age": 25 }');
} catch (err) {
  if (err instanceof ValidationError) {
    alert("Invalid data: " + err.message); // Invalid data: No property: name
    alert(err.name); // PropertyRequiredError
    alert(err.property); // name
  } else if (err instanceof SyntaxError) {
    alert("JSON Syntax Error: " + err.message);
  } else {
    throw err; // 未知 error，将其再次抛出
  }
}
```
这个新的类 PropertyRequiredError 使用起来很简单：我们只需要传递属性名：new `PropertyRequiredError(property)`。人类可读的 message 是由 constructor 生成的。

请注意，在 `PropertyRequiredError constructor` 中的 `this.name` 是通过手动重新赋值的。这可能会变得有些乏味 —— 在每个自定义 error 类中都要进行 `this.name = <class name>` 赋值操作。我们可以通过创建自己的“基础错误（basic error）”类来避免这种情况，该类进行了 `this.name = this.constructor.name` 赋值。然后让所有我们自定义的 error 都从这个“基础错误”类进行继承。

让我们称之为 MyError。

这是带有 MyError 以及其他自定义的 error 类的代码，已进行简化：

``` javascript
class MyError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ValidationError extends MyError { }

class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super("No property: " + property);
    this.property = property;
  }
}

// name 是对的
alert( new PropertyRequiredError("field").name ); // PropertyRequiredError
```
现在自定义的 error 短了很多，特别是 ValidationError，因为我们摆脱了 constructor 中的 `"this.name = ..."` 这一行。
### 包装异常
在上面代码中的函数 readUser 的目的就是“读取用户数据”。在这个过程中可能会出现不同类型的 error。目前我们有了 SyntaxError 和 ValidationError，但是将来，函数 readUser 可能会不断壮大，并可能会产生其他类型的 error。

调用 readUser 的代码应该处理这些 error。现在它在 catch 块中使用了多个 if 语句来检查 error 类，处理已知的 error，并再次抛出未知的 error。

该方案是这样的：
``` javascript
try {
  ...
  readUser()  // 潜在的 error 源
  ...
} catch (err) {
  if (err instanceof ValidationError) {
    // 处理 validation error
  } else if (err instanceof SyntaxError) {
    // 处理 syntax error
  } else {
    throw err; // 未知 error，再次抛出它
  }
}
```
在上面的代码中，我们可以看到两种类型的 error，但是可以有更多。

如果 readUser 函数会产生多种 error，那么我们应该问问自己：我们是否真的想每次都一一检查所有的 error 类型？

通常答案是 “No”：我们希望能够“比它高一个级别”。我们只想知道这里是否是“数据读取异常” —— 为什么发生了这样的 error 通常是无关紧要的（error 信息描述了它）。或者，如果我们有一种方式能够获取 error 的详细信息那就更好了，但前提是我们需要。

我们所描述的这项技术被称为“包装异常”。

1. 我们将创建一个新的类 ReadError 来表示一般的“数据读取” error。
2. 函数readUser 将捕获内部发生的数据读取 error，例如 ValidationError 和 SyntaxError，并生成一个 ReadError 来进行替代。
3. 对象 ReadError 会把对原始 error 的引用保存在其 cause 属性中。

之后，调用 readUser 的代码只需要检查 ReadError，而不必检查每种数据读取 error。并且，如果需要更多 error 细节，那么可以检查 readUser 的 cause 属性。

下面的代码定义了 ReadError，并在 readUser 和 try..catch 中演示了其用法：

``` javascript
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error { /*...*/ }
class PropertyRequiredError extends ValidationError { /* ... */ }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
  }

  try {
    validateUser(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
    alert(e);
    // Original error: SyntaxError: Unexpected token b in JSON at position 1
    alert("Original error: " + e.cause);
  } else {
    throw e;
  }
}
```
在上面的代码中，readUser 正如所描述的那样正常工作 —— 捕获语法和验证（validation）错误，并抛出 ReadError（对于未知错误将照常再次抛出）。

所以外部代码检查 instanceof ReadError，并且它的确是。不必列出所有可能的 error 类型。

这种方法被称为“包装异常（wrapping exceptions）”，因为我们将“低级别”的异常“包装”到了更抽象的 ReadError 中。它被广泛应用于面向对象的编程中。











































































































































































































































































































































































































































