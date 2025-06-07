---
title: Sushi JavaScript
date: '2025-06-07'
tags:
- problems
---

# Sushi JavaScript

::: details 碎碎念

手撕题经常在面筋中出现，寿司|面筋还蛮搭配，虽然说现在面试造火箭的行为还是很多，不过写一些 Javascript 的手撕题还是蛮有帮助的：

- 它能让你更熟悉 Javascript
- 面试
- 产生疑惑，比如：为什么存在这种方法，它是为了解决什么问题
- 更全面的考虑问题，需要考虑一些特殊情况边界情况

这儿就放一些手撕题吧，希望能多多更新多多回顾，多多深究"Why"的问题而不是"How"的问题。
:::

## call/apply/bind

这三个函数都是用来改变 `this` 指向性的，故而在我们知道怎么实现这三个函数之前需要了解 `this` 指向性的问题。

::: tip this

- [MDN This](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [稀土掘金 this](https://juejin.cn/post/7186991200023838776?searchId=202504272050440F9FEF30048C61518FFB)
  :::

### Call

call 接收一个对象和参数列表，调用它的则是一个需要把 this 指向到 thisArg 的函数。需要注意的是 call 会立即调用一次

`fn.call(thisArg, arg1, arg2, ...)`

所以我们需要做的就是：

1. 获取需要执行的函数（就是 this，因为 call 的调用都是 fn.call()，fn 是一个函数）
2. 对 thisArg 进行转换成对象类型（防止传入的是一个非对象类型），这个 thisArg 就是需要绑定的 this
3. 调用需要被执行的函数（通过给 thisArg 增加方法属性）
4. 删除添加到对象上的函数
5. 返回函数的执行结果

```js
// 在 Function 原型上设置 myCall 方法，这样所有函数都可以调用该方法
Function.prototype.myCall = function (thisArg, ...args) {
  // 这里的 this 指向调用 myCall 方法的函数，将其赋值给变量 fn 以便后续使用
  let fn = this;
  // 对传入的 thisArg 进行处理
  // 如果 thisArg 为 null 或 undefined，将其设置为全局对象 window（在浏览器环境中）
  // 否则，使用 Object() 函数将其转换为对象，确保 thisArg 是一个对象
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  // 将调用 myCall 的函数添加到 thisArg 对象上，属性名为 fn
  // 这样在调用 thisArg.fn 时，函数内部的 this 就会指向 thisArg
  thisArg.fn = fn;
  // 调用添加到 thisArg 上的函数，并将参数 args 传递给它
  // 使用扩展运算符 ... 将参数展开
  const result = thisArg.fn(...args);
  // 调用完函数后，删除之前添加到 thisArg 上的临时属性 fn
  // 避免污染 thisArg 对象
  delete thisArg.fn;
  // 返回函数的执行结果
  return result;
};

// 测试代码

function greet(message) {
  console.log(`${message}, ${this.name}`);
}

const person = { name: "Alice" };
greet.myCall(person, "Hello"); // 输出: Hello, Alice
```

我们还可以使用 Symbol 来使得这个函数更简洁一些：

```js
Function.prototype.customCall = function (context = window, ...args) {
  // 这里的 this 指向调用 customCall 的函数
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  const result = context[fnSymbol](...args);
  delete context[fnSymbol];
  return result;
};

// 测试代码
function greet(message) {
  console.log(`${message}, ${this.name}`);
}

const person = { name: "Alice" };
greet.customCall(person, "Hello");
```

### apply

apply 和 call 功能完全一致，**唯一的区别就是 call 接收的是参数列表，而 apply 接受的是含有参数的一个数组**

所以相较于 call 的操作，我们只需要多做一步操作：对传入的参数数组进行处理即可：

```js
Function.prototype.customApply = function (context = window, args = []) {
  // 这里的 this 指向调用 customApply 的函数
  const fnSymbol = Symbol("fn");
  context[fnSymbol] = this;
  let result;
  if (args.length === 0) {
    result = context[fnSymbol]();
  } else {
    result = context[fnSymbol](...args);
  }
  delete context[fnSymbol];
  return result;
};

// 测试代码
function greet(message) {
  console.log(`${message}, ${this.name}`);
}

const person = { name: "Bob" };
greet.customApply(person, ["Hi"]);
```

::: tip 为什么要进行条件判断
有些函数可能会根据传入参数的数量来执行不同的逻辑，也就是函数重载。如果直接使用扩展运算符展开一个空数组，函数可能会接收到一个空参数列表，这可能会导致函数执行不符合预期的逻辑。

```js
function exampleFunction() {
  if (arguments.length === 0) {
    console.log("No arguments were passed.");
  } else {
    console.log("Arguments were passed.");
  }
}

// 直接展开空数组
exampleFunction(...[]); // 输出 'Arguments were passed.'，不符合预期

// 使用判断
if (arguments.length === 0) {
  exampleFunction(); // 输出 'No arguments were passed.'，符合预期
} else {
  exampleFunction(...arguments);
}
```

例如上面的例子，不过这是一种特殊情况了。
:::

### bind

`fn.bind(thisArg,arg1,arg2...)`

bind 方法会`创建一个新的函数`，在调用时 this 值会被绑定到指定的对象上，并且可以`预设`参数

::: tip 何时 bind

- 固定函数的 this 指向，防止丢失（例如在 setTimeOut 中调用某个对象方法）
- 预设函数参数，从而创建一个新的函数。
  :::

```js
Function.prototype.customBind = function (context, ...args) {
  // 这里的 this 指向调用 customBind 的函数
  const self = this;
  return function (...newArgs) {
    // 合并预设参数和新传入的参数
    const allArgs = [...args, ...newArgs];
    // 使用 call 方法调用原函数，并绑定 this 值
    return self.call(context, ...allArgs);
  };
};

// 测试代码
function greet(message) {
  console.log(`${message}, ${this.name}`);
}

const person = { name: "Charlie" };
const greetPerson = greet.customBind(person, "Hey");
greetPerson();
```

## Curry(柯里化)

::: tip Why Curry?
函数柯里化是把一个多参数函数转换为一系列单参数函数的技术，不受语言限制。为什么要用函数柯里化:

1. 参数复用
2. 允许你分步传入参数，在需要结果时再进行计算
3. 柯里化后的函数可以根据不同的需求灵活组合参数，并且代码结构更加清晰，便于维护

给出两个代码例子：

```js
function multiply(a, b) {
  return a * b;
}

const double = curry(multiply)(2);
console.log(double(5));
console.log(double(10));
```

```js
const curriedAdd = curry(add);
const step1 = curriedAdd(1);
const step2 = step1(2);
console.log(step2(3));
```

:::

```js
function curry(func) {
  // 返回一个名为 curried 的函数，该函数用于处理参数并决定是否调用原函数
  return function curried(...args) {
    // 检查当前传入的参数数量是否大于或等于原函数所需的参数数量
    if (args.length >= func.length) {
      // 如果满足条件，则使用 apply 方法调用原函数，并将当前的 this 值和参数传递给它
      // 这里的 this 会保持调用时的上下文
      return func.apply(this, args);
    } else {
      // 如果传入的参数数量不足，返回一个新的函数
      return function (...newArgs) {
        // 这个新函数会将之前传入的参数和新传入的参数合并
        // 然后递归调用 curried 函数，继续处理参数
        return curried.apply(this, [...args, ...newArgs]);
      };
    }
  };
}

// 测试代码
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));
console.log(curriedAdd(1, 2)(3));
console.log(curriedAdd(1)(2, 3));
```

## 防抖与节流

### 防抖（Debounce）

防抖是指在一定时间内，只有最后一次触发事件才会执行相应的处理函数。如果在这个时间内又触发了事件，那么计时将重新开始。

1. 减少不必要的计算和请求：在一些高频触发的场景中，如搜索框输入提示、窗口大小改变等，如果每次触发事件都执行相应的处理函数，会导致大量的计算和请求，影响性能。使用防抖可以确保只有在用户停止操作一段时间后才执行处理函数，减少不必要的计算和请求。
2. 提高用户体验：避免因为用户的频繁操作而导致页面卡顿或出现异常，提高用户体验。

所以我们要做的就是：

1. 定义一个函数，这个函数会传入一个会被执行的方法，和防抖的时长
2. 返回一个函数，这个函数就是处理好的防抖函数，可以传入被执行的函数所需要的参数
3. 这边可以通过闭包的技术，在外部先定义一个 timer，然后执行防抖函数时先判断 timer 函数存在不存在，存在就清除定时器。
4. 然后创建一个定时器，并赋值给 timer 变量，这是为了避免 this 指向被改变，所以我们需要使用 apply 来制定 this

```js
function debounce(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// 测试
function search() {
  console.log("执行搜索操作");
}

const debouncedSearch = debounce(search, 300);

// 模拟多次触发搜索事件
for (let i = 0; i < 5; i++) {
  debouncedSearch();
}
```

#### 立即执行一次防抖

我们可以传入一个 Boolean 参数来表示是否开启立即执行：

```js
function debounce(func, delay, immediate = false) {
  let timer = null;
  return function (...args) {
    const callNow = immediate && !timer;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        func.apply(this, args);
      }
    }, delay);
    if (callNow) {
      func.apply(this, args);
    }
  };
}

// 省略测试函数
```

### 节流（Throttle）

节流是指在一定时间内，只执行一次处理函数。如果在这个时间内多次触发事件，只有第一次会执行处理函数，后续的触发会被忽略，直到时间间隔结束后，再次触发事件才会执行处理函数。

1. 控制函数执行频率：在一些需要频繁触发的场景中，如滚动加载、按钮点击等，如果不加以控制，会导致函数执行过于频繁，影响性能。使用节流可以限制函数的执行频率，确保在一定时间内只执行一次处理函数，提高性能。
2. 保护服务器：在一些需要向服务器发送请求的场景中，如滚动加载数据，如果不加以控制，会导致服务器压力过大。使用节流可以限制请求的频率，保护服务器。

```js
function throttle(func, delay) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

// 测试节流函数
function scrollHandler() {
  console.log("处理滚动事件");
}

const throttledScroll = throttle(scrollHandler, 500);

// 模拟多次触发滚动事件
window.addEventListener("scroll", throttledScroll);
```

## 深拷贝

深拷贝是创建一个新对象，新对象的属性值和原对象相同，但它们在内存中是独立的，修改新对象不会影响原对象。

浅拷贝创建一个新对象，但只复制原始对象`第一层属性`的值。如果属性是基本类型，则复制其值；如果属性是引用类型，则复制其引用（地址）。

::: tip 实现浅拷贝

- 遍历属性
- Object.assign()
- Spread Operator (`...`)
  :::
  ::: danger 浅拷贝陷阱
  对于嵌套对象或数组，修改副本中的嵌套结构会影响原始对象。这是因为嵌套对象的引用在原始对象和副本之间是共享的。
  :::

### 实现深拷贝

深拷贝创建一个新对象，并递归地复制原始对象的所有嵌套对象，确保副本与原始对象完全独立。

#### JSON 序列化/反序列化

最简单（但有局限）的深拷贝方法，这是通过将对象转换成字符串，然后再转换成对象实现的深拷贝：

```js
const original = { name: "John", details: { age: 30 } };
const deepCopy = JSON.parse(JSON.stringify(original));

deepCopy.details.age = 25;
console.log(original.details.age); // 输出: 30，原对象不受影响
```

但我们有必要说明它的缺陷，这也是我们提出更好的方法时需要考虑的问题:

::: warning

1. 无法处理函数和正则表达式
   - `JSON.stringify()` 会忽略对象中的`函数和正则表达式属性`，因为 JSON 格式不支持这两种数据类型。
2. 无法处理 `Symbol` 类型的属性
   - `JSON.stringify()` 会忽略对象中键为 `Symbol` 类型的属性。
3. 无法处理循环引用
   - 如果对象存在循环引用，`JSON.stringify()` 会抛出错误。
4. 丢失 `Date` 对象的时间信息
   - `JSON.stringify()` 会把 `Date` 对象转换为字符串，在使用 `JSON.parse()` 进行反序列化时，这些字符串不会再转换回 `Date` 对象，而是以字符串形式存在。
5. 丢失对象的原型链
   - 使用 `JSON.stringify()` 和 `JSON.parse()` 进行深拷贝时，会丢失对象的原型链信息。
     :::

#### 递归

1. 首先需要判断传入的对象是否是一个对象类型，如果不是对象类型直接返回即可。
2. 如果是对象类型，那么就需要去递归调用 deepCopy 函数。
3. 如果他的 key 是一个 Symbol, 就需要 Object.getOwnPropertySymbols 获取到 symbol 的 key，然后去递归调用。
4. 然后对传入的数据进行一系列的判断，进行对应的处理。
5. 如果是循环引用，就需要用到他的第二个参数 map，初始化是一个 WeakMap 数据，我们每次遍历的时候都会在 map 中将当前这个对象作为 WeakMap 的 key 值存起来，如果发现有一样的存在，那就说明存在递归调用，直接 return 对应的值。

```js
// 判断传入的值是否为对象或函数
function isObject(value) {
  return (
    value !== null && (typeof value === "object" || typeof value === "function")
  );
}

// 实现深拷贝的函数
function deepCopy(value, map = new WeakMap()) {
  // 若不是对象或函数，直接返回该值
  if (!isObject(value)) return value;

  // 处理循环引用，若已存在于map中则直接返回对应拷贝对象
  if (map.has(value)) return map.get(value);

  let clone;
  // 处理Set类型
  if (value instanceof Set) {
    clone = new Set([...value]);
  }
  // 处理Map类型
  else if (value instanceof Map) {
    clone = new Map([...value]);
  }
  // 处理Symbol类型
  else if (typeof value === "symbol") {
    clone = Symbol(value.description);
  }
  // 处理函数类型
  else if (typeof value === "function") {
    clone = value;
  }
  // 处理数组和普通对象
  else {
    clone = Array.isArray(value) ? [] : {};
  }

  // 记录已拷贝对象，避免循环引用
  map.set(value, clone);

  // 遍历可枚举属性
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      clone[key] = deepCopy(value[key], map);
    }
  }

  // 处理以Symbol为键的属性
  const symbolKeys = Object.getOwnPropertySymbols(value);
  for (const symbolKey of symbolKeys) {
    clone[symbolKey] = deepCopy(value[symbolKey], map);
  }

  return clone;
}
```

#### 结构化克隆算法

structuredClone() 是一个相对较新的全局方法，它实现了结构化克隆算法，可以创建深层次的副本.

::: tip 优缺点
`优点`

- 原生 API，无需依赖外部库
- 可以处理大多数 JavaScript 内置类型
- 支持循环引用
- 性能通常较好

`缺点`

- 不能克隆函数
- 不能克隆 DOM 节点
- 不会保留对象的原型链
  :::

```js
// 定义一个包含复杂数据结构的对象
const original = {
  num: 123,
  str: "hello",
  arr: [1, 2, 3],
  obj: { key: "value" },
  date: new Date(),
  reg: /abc/g,
};

// 使用 structuredClone 方法进行深拷贝
const cloned = structuredClone(original);

// 修改克隆对象的属性
cloned.arr.push(4);
cloned.obj.newKey = "newValue";

// 验证原对象未受影响
console.log(original.arr); // 输出: [1, 2, 3]
console.log(original.obj); // 输出: { key: 'value' }
```

::: tip 实际上
在实际场景中，我们常常做的是混合克隆：浅克隆不能保证源对象不会被更改；深克隆常常会克隆出我们不需要的深层数据。啊有时间写一篇关于克隆的应用吧
:::

## Promise

Promise 是 JavaScript 中用于处理异步操作的一种对象，它是异步编程的一种解决方案，能避免回调地狱，让异步代码的编写和维护更加容易。

### Why Promise

::: tip 什么是回调
回调是一种常见的编程机制，它允许函数将另一个函数作为参数传递，并在特定的事件发生或特定的条件满足时调用这个传入的函数。

回调函数就是作为参数传递给其他函数的函数，这个被传递的函数会在外部函数的特定位置被调用，以实现某种特定的逻辑。

回调的作用有二：

- 解耦代码：通过回调，我们可以将不同的功能模块解耦。比如，一个数据获取模块和一个数据处理模块，数据获取模块获取到数据后，通过回调通知数据处理模块来处理数据，这样两个模块可以独立开发和维护，提高了代码的可维护性和可扩展性。

- 实现异步操作：在异步编程中，回调函数非常重要。例如，在进行网络请求、文件读取等耗时操作时，程序不会阻塞等待操作完成，而是继续执行后续代码。当这些异步操作完成后，通过回调函数来通知程序执行相应的处理逻辑。
  :::

我们知道 JavaScript 是单线程的，一次只能执行一个任务，会阻塞其他任务。因此，所有的网络任务、游览器事件等都是异步的，我们可以使用异步回调函数来进行异步操作。由于回调很多，函数作为参数层层嵌套，就陷入了回调地狱。这种情况下，就像是金字塔一样的代码非常不利于阅读。

Promise 对象的主要⽤途是通过链式调⽤的结构，将原本回调嵌套的异步处理流程，转化成`“对象.then().then()...”`的链式结构，这样虽然仍离不开回调函数，但是将原本的回调嵌套结构，转化成了连续调⽤的结构，这样就可以在阅读上编程上下左右结构的异步执⾏流程了。

### 剖析 Promise

Promise 有 3 个状态：

- `pending` 待定，初始状态
- `fulfilled` 兑现，已完成，通常代表成功执行了某一任务。初始化函数中的 resolve()执行时，状态就会变味 fulfilled，而且.then 函数注册的回调会开始执行，resolve 中传递的参数会进入回调函数成为形参。
- `rejected` 拒绝，通常代表执行一次任务失败，调用 reject()时，catch 注册的函数就会触发，并且 reject 中传递的内容会变成回调函数的形参。

三种状态之间的关系：

当对象创建之后同⼀个 Promise 对象只能从 pending 状态变更为 fulfilled 或 rejected 中的其中⼀种，并且状态⼀旦变更就不会再改变，此时 Promise 对象的流程执⾏完成并且 finally 函数执⾏。

#### catch/then/finally

```js
new Promise(function (resolve, reject) {
  resolve();
  reject();
})
  .then(function () {
    console.log("then执⾏");
  })
  .catch(function () {
    console.log("catch执⾏");
  })
  .finally(function () {
    console.log("finally执⾏");
  });
```

执行后依次打印 `then执行 -> finally执行`，发现.catch 的回调没有执行。

再看如下代码：

```js
new Promise(function (resolve, reject) {
  reject();
  resolve();
})
  .then(function () {
    console.log("then执⾏");
  })
  .catch(function () {
    console.log("catch执⾏");
  })
  .finally(function () {
    console.log("finally执⾏");
  });
```

这个串代码和之前的代码唯一的不同 在于 Promise 中的回调先执行了`resolve()`还是先执行了`reject()`，打印结果是`catch执行 -> finally执行`，发现`.then`的回调没有执行。

::: tip 注意：
`Promise.prototype.catch()`其实是一个语法糖，相当于是调用 `Promise.prototype.then(null, onRejected)`。`.then`中其实是可以传入 2 个回调函数，第一个回调函数是`resolve()`后执行，第二个回调函数是`reject()`后执行，2 个是互斥的。
:::

这是因为 Promise 的异步回调部分如何执行，取决于我们在初始化函数中的操作，并且初始化函数中⼀旦调⽤了 resolve 后⾯再执⾏ reject 也不会影响 then 执⾏，catch 也不会执⾏，反之同理。
⽽在初始化回调函数中，如果不执⾏任何操作，那么 promise 的状态就仍然是 pending，所有注册的回调函数都不会执⾏。

是不是可以把 resolve 或者 reject 的调用设定在异步函数内去调用，这样是不是就能解决回调地狱的问题了？

```js
new Promise(function (resolve, reject) {
  setTimeout(() => {
    console.log(111);
    resolve();
  }, 2000);
})
  .then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log(222);
        resolve();
      }, 2000);
    });
  })
  .then(function () {
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        console.log(333);
        resolve();
      }, 2000);
    });
  })
  .catch(function () {
    console.log("catch执⾏");
  })
  .finally(function () {
    console.log("finally执⾏");
  });
```

上面代码每隔 2s 依次打印`111 -> 222 -> 333 finally执行`。333 执行后立马执行 finally。

#### 中断链式调用的方式

中断的⽅式可以使⽤抛出⼀个异常或返回⼀个 rejected 状态的 Promise 对象

#### 链式调用的基本形式

1. 只要有 then()并且触发了 resolve，整个链条就会执⾏到结尾，这个过程中的第⼀个回调函数的参数是 resolve 传⼊的值

2. 后续每个函数都可以使⽤ return 返回⼀个结果，如果没有返回结果的话下⼀个 then 中回调函数的参数就是 undefined

3. 返回结果如果是普通变量，那么这个值就是下⼀个 then 中回调函数的参数

4. 如果返回的是⼀个 Promise 对象，那么这个 Promise 对象 resolve 的结果会变成下⼀次 then 中回调的函数的参数

5. 如果 then 中传⼊的不是函数或者未传值，Promise 链条并不会中断 then 的链式调⽤，并且在这之前最后⼀次的返回结果，会直接进⼊离它最近的正确的 then 中的回调函数作为参数

```js
// tip 5
const p2 = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
});
p2.then(() => {
  console.log(2);
  return 123;
})
  .then()
  .then("456")
  .then((res) => {
    console.log(res);
  });

// 1
// 2
// 123
```

#### resolve 和 reject

至于 resolve 和 reject，我们通过上面已经知道了 resolve 和 reject 能够更改 Promise 的状态，而 Promise 的状态是不可逆的，且是私有的。所以我们必须在 Promise 内部调用 resolve 或者 reject。

当然，resolve 和 reject 也能够传入参数，而传入的参数，会变为.then 或.catch 的回调函数中的参数。

### Promise 常用 API

#### all()

假如我们有一个需求，一个页面需要请求 3 个接口才能渲染，并且要求 3 个接口必须全部返回。如果我们通过链式调用的方式，接口 1 请求了再去请求接口 2 然后去请求接口 3，全都成功了再去渲染页面。这种就很耗时，所以就有了一个 all 的方法来解决。

`Promise.all([promise对象,promise对象,...]).then(回调函数)`

Promise.all()的参数是一个 Promise 数组，只有数组中所有的 Promise 的状态变成了 fulfilled 之后才会执行.then 回调的第一个回调函数，并且将每个 Promise 结果的数组变为回调函数的参数。如果 Promise 中有一个 rejected,那么就会触发.catch()的回调。

#### race()

race()方法与 all()方法的使用格式相同，不同的是，回调函数的参数是 promise 数组中最快执行完毕的 promise 的返回值，它的状态可能是 fulfilled 也有可能是 rejected,但是是最快返回的。
根据 race 这个单词就能理解，相当于一群 promise 进行比赛

#### allSettled()

该方法需要传入所有不在 pendding 状态的 promise 数组，然后通过该方法可以知道数组中的 promise 的当前状态。

当有多个彼此不依赖的异步任务成功完成时，或者总是想知道每个 promise 的结果时，通常使用它。

#### any()

接受一个 promise 数组，只要有一个 promise 的状态变成了 fulfilled，那么这个方法就会返回这个 promise;

如果所有的 promise 的状态都是 rejected，那么就返回失败的 promise，并且把单一的错误集合在一起。

### Sushi Promise

手写一个 Promise 已经是一个常见的手写功能了，虽然实际工作上可能并不会用到。但是在面试时还是会经常被提起的。

#### 总体实现

首先我们可以按照 Promise 的特点来实现一个简单的总体结构。

1. 它是一个构造函数，每个创建的 promise 都有各自状态和值，且初始状态为 pending，初始值为 undefined。
2. 创建实例的时候需要传入一个函数，而这个函数可以接受 2 个函数作为参数，这 2 个函数都有一个参数，且都可以更改实例的状态和值。
3. 根据 Promise 的结构，我们可以发现 then()、catch()方法在它的原型上。

```js
function MyPromise(fn) {
  this.PromiseState = "pending";
  this.PromiseResult = undefined;
  function resolve(data) {}
  function reject(error) {}
}
MyPromise.prototype.then = function (thenCallback) {};
MyPromise.prototype.catch = function (catchCallback) {};
```

上述代码很简单，就定义了一个 Promise 的构造函数，有 2 个属性（PromiseState、PromiseResult）和 2 个方法（resolve、reject）。

原型上增加了 then 方法和 catch 方法，且这 2 个方法都接收一个函数。

而每次通过 new 来创建 Promise 的函数时，传入的函数会执行，因此我们直接调用 fn 函数，并传入 resolve 和 reject 这 2 个函数。

#### 初步实现 resolve/reject

resolve 的调用会更改 promise 的状态和值，且状态是不可逆的。也就是说，只能从 pending 变成 fulfilled 或者 rejected。而 resolve 函数的参数值会变成 promise 实例的值，reject 同理。

```js
function MyPromise(fn) {
  this.PromiseState = "pending";
  this.PromiseResult = undefined;
  // 保存实例对象的this的值
  const self = this;
  function resolve(data) {
    // 如果不使用self，这里内部的this会指向window
    // 如果当前的promise实例不是pending的状态就退出了，否则就更改当前的promise实例的状态和值
    if (self.PromiseState !== "pending") {
      return;
    }
    // 1.修改对象的状态（[[promiseState]]）
    // 2.设置对象结果值（[[promiseResult]]）
    self.PromiseState = "fulfilled";
    self.PromiseResult = data;
  }
  function reject(error) {
    if (self.PromiseState !== "pending") {
      return;
    }
    self.PromiseState = "rejected";
    self.PromiseResult = error;
  }
  fn(resolve, reject);
}
```

#### then 的实现

then 方法中我们知道它有 2 个参数，且这 2 个参数都是函数，第一个参数会在 promise 执行 resolve 时调用，第二个参数会在 promise 执行 reject 时调用。而.catch 只不过是调用.then 第二个参数的语法糖而已。

.then 的执行会返回一个新的 Promise 实例。而决定调用.then 的第几个参数，则是根据调用 then 的那个 promise 实例的状态决定。

```js
MyPromise.prototype.then = function (thenCallback, catchCallback) {
  return new Promise((resolve, reject) => {
    // 调用回调函数，要根据当前的promise实例来调用
    if (this.PromiseState === "fulfilled") {
      const result = thenCallback(this.PromiseResult);
      resolve(result);
    }
    if (this.PromiseState === "rejected") {
      const result = catchCallback(this.PromiseResult);
      resolve(result);
    }
  });
};
```

## 异步控制并发数

前端异步控制请求并发数是一种优化技术，它能限制在同一时间发起的异步请求数量，避免因过多请求同时进行而对服务器和网络造成过大压力，防止请求超时或失败，保证页面性能和流畅度，适用于批量文件上传、图片懒加载、数据批量拉取等多种场景。 

为了实现它，我们的设想是：

1. 首先我们定义一个函数，这个函数会有 2 个参数，分别是请求的数组，以及最大并发数
2. 这个函数会返回一个 Promise
3. 我们会定义一个 len,len 就是请求 url 数组的长度；还有 1 个 count 变量，初始值为 0；如果后续 len 的长度和 count 的值一样就表示请求完了
4. 然后我们需要定义一个 start 函数，用来去执行请求。
5. 这个函数会从数组中拿出第一个 url 去请求，然后无论成功失败，都会进行一次判断 count 是不是和长度-1 相同，因为 count 是从 0 开始加的，如果相同就表示数组中的请求都请求完了，然后 promise 变成 fullfiled 的状态，否则 count 自增，继续执行 start 去取 url 请求。
6. 这时我们需要使用 while 启动 limit 数量的任务，每个任务内部会自调用 start 函数

```js
function limitRequest(urls = [], limit = 3) {
  return new Promise((resolve, reject) => {
    const len = urls.length;
    let count = 0;

    // 同时启动limit个任务
    while (limit > 0) {
      start();
      limit -= 1;
    }

    function start() {
      const url = urls.shift(); // 从数组中拿取第一个任务
      if (url) {
        axios
          .post(url)
          .then((res) => {
            // todo
          })
          .catch((err) => {
            // todo
          })
          .finally(() => {
            if (count == len - 1) {
              // 最后一个任务完成
              resolve();
            } else {
              // 完成之后，启动下一个任务
              count++;
              start();
            }
          });
      }
    }
  });
}
```

AI写的：

```js
function asyncControl(tasks, concurrency) {
    let index = 0;
    let running = 0;
    const results = [];

    return new Promise((resolve, reject) => {
        function runNext() {
            // 当所有任务都完成且没有正在运行的任务时，返回结果
            if (index === tasks.length && running === 0) {
                resolve(results);
                return;
            }

            // 在并发数限制内，持续取出任务执行
            while (running < concurrency && index < tasks.length) {
                const currentIndex = index++;
                running++;
                const task = tasks[currentIndex];

                task()
                   .then((result) => {
                        results[currentIndex] = result;
                    })
                   .catch((error) => {
                        results[currentIndex] = error;
                    })
                   .finally(() => {
                        running--;
                        runNext();
                    });
            }
        }

        runNext();
    });
}

// 示例使用
// 模拟异步请求
function createAsyncTask(id) {
    return () =>
        new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Task ${id} completed`);
                resolve(id);
            }, Math.random() * 1000);
        });
}

const tasks = Array.from({ length: 10 }, (_, i) => createAsyncTask(i + 1));
const concurrency = 3;

asyncControl(tasks, concurrency).then((results) => {
    console.log('All tasks completed:', results);
});
```

## instanceof

## 数组扁平化

## 数组去重

::: tip 相关链接

- https://zhuanlan.zhihu.com/p/258068663
- https://juejin.cn/post/7339470312663171098
- https://juejin.cn/post/7356072512444465178
- https://juejin.cn/post/7104153970918031396
- https://juejin.cn/post/7112371657133522974
  :::
