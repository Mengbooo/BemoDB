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
    thisArg = thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
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

const person = { name: 'Alice' };
greet.myCall(person, 'Hello'); // 输出: Hello, Alice
```

我们还可以使用 Symbol 来使得这个函数更简洁一些：

```js
Function.prototype.customCall = function (context = window, ...args) {
    // 这里的 this 指向调用 customCall 的函数
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;
    const result = context[fnSymbol](...args);
    delete context[fnSymbol];
    return result;
};

// 测试代码
function greet(message) {
    console.log(`${message}, ${this.name}`);
}

const person = { name: 'Alice' };
greet.customCall(person, 'Hello');
```

### apply

apply 和 call 功能完全一致，**唯一的区别就是call接收的是参数列表，而apply接受的是含有参数的一个数组**

所以相较于 call 的操作，我们只需要多做一步操作：对传入的参数数组进行处理即可：

```js
Function.prototype.customApply = function (context = window, args = []) {
    // 这里的 this 指向调用 customApply 的函数
    const fnSymbol = Symbol('fn');
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

const person = { name: 'Bob' };
greet.customApply(person, ['Hi']);
```

::: tip 为什么要进行条件判断
有些函数可能会根据传入参数的数量来执行不同的逻辑，也就是函数重载。如果直接使用扩展运算符展开一个空数组，函数可能会接收到一个空参数列表，这可能会导致函数执行不符合预期的逻辑。

```js
function exampleFunction() {
    if (arguments.length === 0) {
        console.log('No arguments were passed.');
    } else {
        console.log('Arguments were passed.');
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
- 固定函数的 this 指向，防止丢失（例如在setTimeOut中调用某个对象方法）
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

const person = { name: 'Charlie' };
const greetPerson = greet.customBind(person, 'Hey');
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
    console.log('执行搜索操作');
}

const debouncedSearch = debounce(search, 300);

// 模拟多次触发搜索事件
for (let i = 0; i < 5; i++) {
    debouncedSearch();
}    
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
    console.log('处理滚动事件');
}

const throttledScroll = throttle(scrollHandler, 500);

// 模拟多次触发滚动事件
window.addEventListener('scroll', throttledScroll);    
```

## 深拷贝

## Promise

## 异步控制并发数

## instanceof

## 数组扁平化

## 数组去重


::: tip 相关链接
- https://zhuanlan.zhihu.com/p/258068663
- https://juejin.cn/post/7339470312663171098
- https://juejin.cn/post/7356072512444465178
:::































































































































