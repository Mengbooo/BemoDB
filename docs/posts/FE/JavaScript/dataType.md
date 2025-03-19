# 数据类型

在这篇文章中，我们将会讨论更多的数据结构和更深入的类型研究。

## 原始类型的方法

我们来看看原始类型和对象之间的关键区别。

- 一个原始值：
  - 是原始类型中的一种值。
  - 在 JavaScript 中有 7 种原始类型：string，number，bigint，boolean，symbol，null 和 undefined。
- 一个对象：
  - 能够存储多个值作为属性。
  - 可以使用大括号 {} 创建对象，例如：{name: "John", age: 30}。JavaScript 中还有其他种类的对象，例如函数就是对象。

关于对象的最好的事儿之一是，我们可以把一个函数作为对象的属性存储到对象中，但是：对象比原始类型“更重”。它们需要额外的资源来支持运作。

在设计 JavaScript 的时候会面临两个悖论：

- 人们可能想对诸如字符串或数字之类的原始类型执行很多操作。最好使用方法来访问它们。
- 原始类型必须尽可能的简单轻量。

解决办法是：

- 原始类型仍然是原始的。与预期相同，提供单个值
- JavaScript 允许访问字符串，数字，布尔值和 symbol 的方法和属性。
- 为了使它们起作用，创建了提供额外功能的特殊“对象包装器”，使用后即被销毁。

所以我们需要关注这个新产物：**“对象包装器”**

“对象包装器”对于每种原始类型都是不同的，它们被称为 String、Number、Boolean、Symbol 和 BigInt。因此，它们提供了不同的方法。我们举一个例子：

```javascript
let str = "Hello";

alert(str.toUpperCase()); // HELLO
```

字符串方法 str.toUpperCase() 返回一个大写化处理的字符串。我们看一下实际发生了啥：

1. 字符串 str 是一个原始值。因此，在访问其属性时，会创建一个包含字符串字面值的特殊对象，并且具有可用的方法，例如 toUpperCase()。
2. 该方法运行并返回一个新的字符串（由 alert 显示）
3. 特殊对象被销毁，只留下原始值 str

所以原始类型可以提供方法，但它们依然是轻量级的。

JavaScript 引擎高度优化了这个过程。它甚至可能跳过创建额外的对象。但是它仍然必须遵守规范，并且表现得好像它创建了一样。

::: warning 构造器 String/Number/Boolean 仅供内部使用
像 Java 这样的一些语言允许我们使用 new Number(1) 或 new Boolean(false) 等语法，明确地为原始类型创建“对象包装器”。

在 JavaScript 中，由于历史原因，这也是可以的，但不推荐。

另一方面，调用不带 new（关键字）的 String/Number/Boolean 函数是可以的且有效的。它们将一个值转换为相应的类型：转成字符串、数字或布尔值（原始类型）。
:::
::: warning null/undefined 没有任何方法
特殊的原始类型 null 和 undefined 是例外。它们没有对应的“对象包装器”，也没有提供任何方法。从某种意义上说，它们是“最原始的”。

尝试访问这种值的属性会导致错误：

```javascript
alert(null.test); // error
```

:::

总而言之，我们这里讲了一下除 null 和 undefined 以外的原始类型都提供了许多有用的方法。

- Q : 为什么能使用方法

通过临时对象工作，但 JavaScript 引擎可以很好地调整，以在内部对其进行优化，因此调用它们并不需要太高的成本。

- Q ：使用方法后发生了什么？

创建了临时对象，之后会被删除，所以并不能储存值。

## 数字类型

我们来深入了解一下 JavaScript 中的数字类型。

在现代 JavaScript 中，数字（number）有两种类型：

- JavaScript 中的常规数字以 64 位的格式 IEEE-754 存储，也被称为“双精度浮点数”。这是我们大多数时候所使用的数字，我们将在本章中学习它们。

- BigInt 用于表示任意长度的整数。有时会需要它们，因为正如我们在前面的章节 数据类型 中提到的，常规整数不能安全地超过 (253-1) 或小于 -(253-1)。由于仅在少数特殊领域才会用到 BigInt，因此我们在特殊的章节 BigInt 中对其进行了介绍。

所以，在这里我们将讨论常规数字类型。现在让我们开始学习吧。

### 数字的其它表示法

假如我们需要表示 10 亿，可以写作：

```javascript
let billion = 1000000000;
```

也可以使用下划线 _ 作为分隔符，它是一种语法糖使得该数字具有更强的可读性，JavaScript 引擎会直接忽略数字之间的 _ ：

```javascript
let billion = 1_000_000_000;
```

我们还可以用 `e` 来表示数字前面或者后面有几个零，比如：

```javascript
let billion = 1e9; // 10 亿，字面意思：数字 1 后面跟 9 个 0

1.23e6 === 1.23 * 1000000; // e6 表示 *1000000

let mcs = 1e-6; // 0.000001 ， 1 的左边有 6 个 0
```

上面我们说的都是十进制表示法，我们还可以用十六进制、二进制和八进制，例如：

- 十六进制 数字在 JavaScript 中被广泛用于表示颜色，编码字符以及其他许多东西。所以自然地，有一种较短的写方法：0x，然后是数字。

```javascript
alert(0xff); // 255
alert(0xff); // 255（一样，大小写没影响）
```

- 二进制和八进制数字系统很少使用，但也支持使用 0b 和 0o 前缀：

```javascript
let a = 0b11111111; // 二进制形式的 255
let b = 0o377; // 八进制形式的 255

alert(a == b); // true，两边是相同的数字，都是 255
```

只有这三种进制支持这种写法。对于其他进制，我们应该使用函数 `parseInt`，关于这个函数我们会在后文讲到

### toString(base)

方法 `num.toString(base)` 返回在给定 `base` 进制数字系统中 `num` 的字符串表示形式。比如：

```javascript
let num = 255;
// base 的范围可以从 2 到 36。默认情况下是 10
alert(num.toString(16)); // ff
alert(num.toString(2)); // 11111111
```

常见的用例如下：

- base=16 用于十六进制颜色，字符编码等，数字可以是 0..9 或 A..F。
- base=2 主要用于调试按位操作，数字可以是 0 或 1。
- base=36 是最大进制，数字可以是 0..9 或 A..Z。所有拉丁字母都被用于了表示数字。对于 36 进制来说，一个有趣且有用的例子是，当我们需要将一个较长的数字标识符转换成较短的时候，例如做一个短的 URL。可以简单地使用基数为 36 的数字系统表示：

::: tip 使用两个点来调用一个方法
请注意 123456..toString(36) 中的两个点不是打错了。如果我们想直接在一个数字上调用一个方法，比如上面例子中的 toString，那么我们需要在它后面放置两个点 ..。

如果我们放置一个点：123456.toString(36)，那么就会出现一个 error，因为 JavaScript 语法隐含了第一个点之后的部分为小数部分。如果我们再放一个点，那么 JavaScript 就知道小数部分为空，现在使用该方法。

也可以写成 (123456).toString(36)。
:::

### 舍入

因为 JavaScript 的数字是按照双精度浮点型来进行存储的，不像 C 语言那样有 int 类型，故而我们总是需要进行主动的取舍或者取入。

这里有几个对数字进行舍入的内建函数：

- `Math.floor` 向下舍入：3.1 变成 3，-1.1 变成 -2。
- `Math.ceil` 向上舍入：3.1 变成 4，-1.1 变成 -1。
- `Math.round `向最近的整数舍入：3.1 变成 3，3.6 变成 4，中间值 3.5 变成 4。
- `Math.trunc`（IE 浏览器不支持这个方法）移除小数点后的所有内容而没有舍入：3.1 变成 3，-1.1 变成 -1。

但是，如果我们想将数字舍入到小数点后 n 位，该怎么办？有两种方式可以实现这个需求：

1. 乘除法：例如，要将数字舍入到小数点后两位，我们可以将数字乘以 100，调用舍入函数，然后再将其除回。

```javascript
let num = 1.23456;
alert(Math.round(num * 100) / 100); // 1.23456 -> 123.456 -> 123 -> 1.23
```

2. 函数 `toFixed(n)` 将数字舍入到小数点后 n 位(这会向上或向下舍入到最接近的值，类似于 Math.round)，并以字符串形式返回结果：

```javascript
let num = 12.34;
alert(num.toFixed(1)); // "12.3"

// 请注意 toFixed 的结果是一个字符串。如果小数部分比所需要的短，则在结尾添加零：

let num = 12.34;
alert(num.toFixed(5)); // "12.34000"，在结尾添加了 0，以达到小数点后五位

// 复习一下：我们要把它转为数字，就可以尝试使用 Number()，或者在它前面加一个 +
```

### 不精确的计算

在内部，数字是以 64 位格式 IEEE-754 表示的，所以正好有 64 位可以存储一个数字：其中 52 位被用于存储这些数字，其中 11 位用于存储小数点的位置，而 1 位用于符号。

如果一个数字真的很大，则可能会溢出 64 位存储，变成一个特殊的数值 Infinity，比如 1e500

这可能不那么明显，但经常会发生的是：精度的损失。

比如：（啊这个应该算是一个经典的面试题了）

```javascript
alert(0.1 + 0.2 == 0.3); // false
```

左边得到的结果其实是：0.30000000000000004

嘻嘻，JavaScript 很神奇吧，接下来我们看看为什么会这样：

一个数字以其二进制的形式存储在内存中，一个 1 和 0 的序列。但是在十进制数字系统中看起来很简单的 0.1，0.2 这样的小数，实际上在二进制形式中是无限循环小数。

在十进制数字系统中，可以保证以 10 的整数次幂作为除数能够正常工作，但是以 3 作为除数则不能。也是同样的原因，在二进制数字系统中，可以保证以 2 的整数次幂作为除数时能够正常工作，但 1/10 就变成了一个无限循环的二进制小数。

使用二进制数字系统无法 精确 存储 0.1 或 0.2，就像没有办法将三分之一存储为十进制小数一样。

IEEE-754 数字格式通过将数字舍入到最接近的可能数字来解决此问题。这些舍入规则通常不允许我们看到“极小的精度损失”，但是它确实存在。

我们可以看到：

```javascript
alert((0.1).toFixed(20)); // 0.10000000000000000555
```

当我们对两个数字进行求和时，它们的“精度损失”会叠加起来。

这就是为什么 0.1 + 0.2 不等于 0.3。

那么我们怎么解决：

- 最可靠的方法是借助方法 toFixed(n) 对结果进行舍入
- 也可以采用乘除法，不过这种方法只能减少误差而不能完全消除误差

::: tip 有趣的事儿
尝试运行下面这段代码：

```javascript
// Hello！我是一个会自我增加的数字！
alert(9999999999999999); // 显示 10000000000000000
```

出现了同样的问题：精度损失。有 64 位来表示该数字，其中 52 位可用于存储数字，但这还不够。所以最不重要的数字就消失了。

JavaScript 不会在此类事件中触发 error。它会尽最大努力使数字符合所需的格式，但不幸的是，这种格式不够大到满足需求。

数字内部表示的另一个有趣结果是存在两个零：0 和 -0。

这是因为在存储时，使用一位来存储符号，因此对于包括零在内的任何数字，可以设置这一位或者不设置。

在大多数情况下，这种区别并不明显，因为运算符将它们视为相同的值。
:::

### isFinite 和 isNaN

在数字类型中我们有两个特殊的数值：

- Infinity（和 -Infinity）是一个特殊的数值，比任何数值都大（小）。
- NaN 代表一个 error。

它们属于 number 类型，但不是“普通”数字，因此，这里有用于检查它们的特殊函数：

1. `isNaN(value)` 将其参数转换为数字，然后测试它是否为 NaN：

```javascript
alert(isNaN(NaN)); // true
alert(isNaN("str")); // true
```

我们不能只使用 === NaN 比较吗？很不幸，这不行。值 “NaN” 是独一无二的，它不等于任何东西，包括它自身：

```javascript
alert(NaN === NaN); // false
```

2. `isFinite(value)` 将其参数转换为数字，如果是常规数字而不是 NaN/Infinity/-Infinity，则返回 true

```javascript
alert(isFinite("15")); // true
alert(isFinite("str")); // false，因为是一个特殊的值：NaN
alert(isFinite(Infinity)); // false，因为是一个特殊的值：Infinity
```

有时 isFinite 被用于验证字符串值是否为常规数字：

```javascript
let num = +prompt("Enter a number", "");

// 结果会是 true，除非你输入的是 Infinity、-Infinity 或不是数字
alert(isFinite(num));
```

::: tip 与 Object.is 进行比较
我们提到了 NaN 不等于它自身，但是有一个特殊的内建方法 Object.is，它类似于 === 一样对值进行比较，但它对于两种边缘情况更可靠：

- 它适用于 NaN：Object.is(NaN, NaN) === true，这是件好事。
- 值 0 和 -0 是不同的：Object.is(0, -0) === false，从技术上讲这是对的，因为在内部，数字的符号位可能会不同，即使其他所有位均为零。
  在所有其他情况下，Object.is(a, b) 与 a === b 相同。

这种比较方式经常被用在 JavaScript 规范中。当内部算法需要比较两个值是否完全相同时，它使用 Object.is（内部称为 SameValue）。
:::

### parseInt 和 parseFloat

使用加号 + 或 Number() 的数字转换是严格的。如果一个值不完全是一个数字，就会失败（唯一的例外是字符串开头或结尾的空格，因为它们会被忽略）：

```javascript
alert(+"100px"); // NaN
```

但在现实生活中，我们经常会有带有单位的值，例如 CSS 中的 "100px" 或 "12pt"。并且，在很多国家，货币符号是紧随金额之后的，所以我们有 "19€"，并希望从中提取出一个数值。

这就是 parseInt 和 parseFloat 的作用。

它们可以从字符串中“读取”数字，直到无法读取为止。如果发生 error，则返回收集到的数字。函数 parseInt 返回一个整数，而 parseFloat 返回一个浮点数：

```javascript
alert(parseInt("100px")); // 100
alert(parseFloat("12.5em")); // 12.5

alert(parseInt("12.3")); // 12，只有整数部分被返回了
alert(parseFloat("12.3.4")); // 12.3，在第二个点出停止了读取

alert(parseInt("a123")); // NaN，第一个符号停止了读取
```

::: tip parseInt(str, radix) 的第二个参数
`parseInt()` 函数具有可选的第二个参数。它指定了数字系统的基数，因此 parseInt 还可以解析十六进制数字、二进制数字等的字符串：

```javascript
alert(parseInt("0xff", 16)); // 255
alert(parseInt("ff", 16)); // 255，没有 0x 仍然有效

alert(parseInt("2n9c", 36)); // 123456
```

:::

### 其他数学函数

JavaScript 有一个内建的 `Math` 对象，它包含了一个小型的数学函数和常量库。可以参考： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math

我们这里举几个常用的例子：

```javascript
// Math.random()：返回一个从 0 到 1 的随机数（不包括 1）。
alert(Math.random()); // 0.1234567894322
alert(Math.random()); // 0.5435252343232
alert(Math.random()); // ... (任何随机数)

// Math.max(a, b, c...) 和 Math.min(a, b, c...)
// 从任意数量的参数中返回最大值和最小值。
alert(Math.max(3, 5, -10, 0, 1)); // 5
alert(Math.min(1, 2)); // 1

// Math.pow(n, power)
// 返回 n 的给定（power）次幂。
alert(Math.pow(2, 10)); // 2 的 10 次幂 = 1024
```

## 字符串

在 JavaScript 中，文本数据被以字符串形式存储，单个字符没有单独的类型。

字符串的内部格式始终是 UTF-16，它不依赖于页面编码。

### 引号（Quotes）

让我们回顾一下：

字符串可以包含在单引号、双引号或反引号中：

```javascript
let single = "single-quoted";
let double = "double-quoted";

let backticks = `backticks`;

// 反引号允许我们通过 ${…} 将任何表达式嵌入到字符串中：
alert(`1 + 2 = ${sum(1, 2)}.`); // 1 + 2 = 3.
// 反引号允许字符串跨行：
let guestList = `Guests:
 * John
 * Pete
 * Mary
`;
```

### 特殊字符

我们也有一些特殊字符：

- 特殊字符：比如 \n,\r 等等
- Unicode ，用于代表特殊符号、他国文字、emoji

所有的特殊字符都以反斜杠字符 \ 开始。它也被称为“转义字符”。

### 字符串长度

length `属性`表示字符串长度，它是一个属性：

```javascript
alert(`My\n`.length); // 3
```

### 访问字符

要获取在 pos 位置的一个字符，可以使用方括号 [pos] 或者调用 str.charAt(pos) 方法。第一个字符从零位置开始：

```javascript
let str = `Hello`;

// 第一个字符
alert(str[0]); // H
alert(str.charAt(0)); // H

// 最后一个字符
alert(str[str.length - 1]); // o
```

方括号是获取字符的一种现代化方法，而 charAt 是历史原因才存在的。

它们之间的唯一区别是，如果没有找到字符，[] 返回 undefined，而 charAt 返回一个空字符串。

我们也可以使用 for..of 遍历字符:

```javascript
for (let char of "Hello") {
  alert(char); // H,e,l,l,o（char 变为 "H"，然后是 "e"，然后是 "l" 等）
}
```

### 字符串是不可变的

在 JavaScript 中，字符串不可更改。改变字符是不可能的。

```javascript
let str = "Hi";

str[0] = "h"; // error
alert(str[0]); // TypeError: Cannot assign to read only property '0' of string 'Hi'
```

### 改变大小写

`toLowerCase()` 和 `toUpperCase()` 方法可以改变大小写：

```javascript
alert("Interface".toUpperCase()); // INTERFACE
alert("Interface".toLowerCase()); // interface

// 或者我们想要使一个字符变成小写：
alert("Interface"[0].toLowerCase()); // 'i'
```

### 查找子字符串

在字符串中查找子字符串有很多种方法。

#### str.indexOf

第一个方法是 `str.indexOf(substr, pos)`。

它从给定位置 pos 开始，在 str 中查找 substr，如果没有找到，则返回 -1，否则返回匹配成功的位置，比如：

```javascript
let str = "Widget with id";

alert(str.indexOf("Widget")); // 0，因为 'Widget' 一开始就被找到
alert(str.indexOf("widget")); // -1，没有找到，检索是大小写敏感的

alert(str.indexOf("id")); // 1，"id" 在位置 1 处（w - 0 | i - 1）

// 从位置 2 开始检索
alert(str.indexOf("id", 2)); // 12
```

如果我们对所有存在位置都感兴趣，可以在一个循环中使用 indexOf。每一次新的调用都发生在上一匹配位置之后：

```javascript
let str = "As sly as a fox, as strong as an ox";

let target = "as"; // 这是我们要查找的目标

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert(`Found at ${foundPos}`);
  pos = foundPos + 1; // 继续从下一个位置查找
}
```

::: tip `str.lastIndexOf(substr, pos)`
还有一个类似的方法 `str.lastIndexOf(substr, position)`，它从字符串的末尾开始搜索到开头。

它会以相反的顺序列出这些事件。
:::

#### 按位（bitwise）NOT 技巧

这里使用的一个老技巧是 bitwise NOT ~ 运算符。它将数字转换为 32-bit 整数（如果存在小数部分，则删除小数部分），然后对其二进制表示形式中的所有位均取反。

实际上，这意味着一件很简单的事儿：对于 32-bit 整数，~n 等于 -(n+1),例如：

```javascript
alert(~2); // -3，和 -(2+1) 相同
alert(~1); // -2，和 -(1+1) 相同
alert(~0); // -1，和 -(0+1) 相同
alert(~-1); // 0，和 -(-1+1) 相同
```

因此，仅当 indexOf 的结果不是 -1 时，检查 if ( ~str.indexOf("...") ) 才为真。换句话说，当有匹配时。

人们用它来简写 indexOf 检查：

```javascript
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert("Found it!"); // 正常运行
}
```

::: danger
通常不建议以非显而易见的方式使用语言特性，但这种特殊技巧在旧代码中仍被广泛使用，所以我们应该理解它。

只要记住：if (~str.indexOf(...)) 读作 “if found”。

现在我们只会在旧的代码中看到这个技巧，因为现代 JavaScript 提供了 .includes 方法（见下文）。
:::

#### includes，startsWith，endsWith

更现代的方法 `str.includes(substr, pos)` 根据 str 中是否包含 substr 来返回 true/false。第二个可选参数是开始搜索的起始位置：

```javascript
alert("Widget with id".includes("Widget")); // true
alert("Hello".includes("Bye")); // false

alert("Widget".includes("id")); // true
alert("Widget".includes("id", 3)); // false, 从位置 3 开始没有 "id"
```

方法 `str.startsWith` 和 `str.endsWith` 的功能与其名称所表示的意思相同：

```javascript
alert("Widget".startsWith("Wid")); // true，"Widget" 以 "Wid" 开始
alert("Widget".endsWith("get")); // true，"Widget" 以 "get" 结束
```

### 获取子字符串

JavaScript 中有三种获取字符串的方法：substring、substr 和 slice。我们分别来讲一下：

`str.slice(start [, end])`

返回字符串从 start 到（但不包括）end 的部分。例如：

```javascript
let str = "stringify";
alert(str.slice(0, 5)); // 'strin'，从 0 到 5 的子字符串（不包括 5）
alert(str.slice(0, 1));
// 's'，从 0 到 1，但不包括 1，所以只有在 0 处的字符
```

如果没有第二个参数，slice 会一直运行到字符串末尾：

```javascript
let str = "stringify";
alert(str.slice(2)); // 从第二个位置直到结束
```

start/end 也有可能是负值。它们的意思是起始位置从字符串结尾计算：

```javascript
let str = "stringify";

// 从右边的第四个位置开始，在右边的第一个位置结束
alert(str.slice(-4, -1)); // 'gif'
```

`str.substring(start [, end])`

返回字符串从 start 到（但不包括）end 的部分，这与 slice 几乎相同，但是：

- 它允许 start 大于 end
- 不支持负参数（不像 slice），它们被视为 0

例如：

```javascript
let str = "stringify";

// 这些对于 substring 是相同的
alert(str.substring(2, 6)); // "ring"
alert(str.substring(6, 2)); // "ring"

// ……但对 slice 是不同的：
alert(str.slice(2, 6)); // "ring"（一样）
alert(str.slice(6, 2)); // ""（空字符串）
```

`str.substr(start [, length])`

返回字符串从 start 开始的给定 length 的部分。与以前的方法相比，这个允许我们指定 length 而不是结束位置：

```javascript
let str = "stringify";
alert(str.substr(2, 4)); // 'ring'，从位置 2 开始，获取 4 个字符
```

第一个参数可能是负数，从结尾算起：

```javascript
let str = "stringify";
alert(str.substr(-4, 2)); // 'gi'，从第 4 位获取 2 个字符
```

::: tip 它们都这么像，我该用哪个？
正式一点来讲，substr 有一个小缺点：它不是在 JavaScript 核心规范中描述的，而是在附录 B 中。附录 B 的内容主要是描述因历史原因而遗留下来的仅浏览器特性。因此，理论上非浏览器环境可能无法支持 substr，但实际上它在别的地方也都能用。

相较于其他两个变体，slice 稍微灵活一些，它允许以负值作为参数并且写法更简短。因此仅仅记住这三种方法中的 slice 就足够了。
:::

### 比较字符串

正如我们从 `值的比较` 一章中了解到的，字符串按字母顺序逐字比较。

但是我们需要注意到：

1. 小写字母总是大于大写字母
2. 带变音符号的字母存在“乱序”的情况

所有的字符串都使用 UTF-16 编码。即：每个字符都有对应的数字代码。有特殊的方法可以获取代码表示的字符，以及字符对应的代码。

`str.codePointAt(pos)`

返回在 pos 位置的字符代码 :

```javascript
// 不同的字母有不同的代码
alert("z".codePointAt(0)); // 122
alert("Z".codePointAt(0)); // 90
```

`String.fromCodePoint(code)`

通过数字 code 创建字符:

```javascript
alert(String.fromCodePoint(90)); // Z
```

还可以用 \u 后跟十六进制代码，通过这些代码添加 Unicode 字符：

```javascript
// 在十六进制系统中 90 为 5a
alert("\u005a"); // Z
```

现在我们看一下代码为 65..220 的字符（拉丁字母和一些额外的字符），方法是创建一个字符串：

```javascript
let str = "";

for (let i = 65; i <= 220; i++) {
  str += String.fromCodePoint(i);
}
alert(str);
// ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
// ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜ
```

字符通过数字代码进行比较。越大的代码意味着字符越大。a（97）的代码大于 Z（90）的代码：

- 所有小写字母追随在大写字母之后，因为它们的代码更大。
- 一些像 `Ö` 的字母与主要字母表不同。这里，它的代码比任何从 a 到 z 的代码都要大。

调用 `str.localeCompare(str2)` 会根据语言规则返回一个整数，这个整数能指示字符串 `str` 在排序顺序中排在字符串 `str2` 前面、后面、还是相同：

- 如果 str 排在 str2 前面，则返回负数。
- 如果 str 排在 str2 后面，则返回正数。
- 如果它们在相同位置，则返回 0

### 内部，Unicode

::: tip
这部分会深入字符串内部。如果你计划处理 emoji、罕见的数学或象形文字或其他罕见的符号，这些知识会对你有用。
:::

可以参考：

- https://zh.javascript.info/string#nei-bu-unicode
- https://www.unicode.org/reports/tr15/

### 总而言之：

字符串有非常多的方法，可以参考：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String

## 数组

当我们需要 `有序集合` 的时候，比如用户、商品以及 HTML 元素的列表，这个时候对象不是很方便，它虽然允许存储键值集合，但是它不能提供能够管理元素顺序的方法。

这时一个特殊的数据结构数组（Array）就派上用场了，它能存储有序的集合。

::: tip 细分一下，Object 包含以下常见类型：

- 普通对象（Object Literal）
- 数组（Array）
- 日期对象（Date）
- 正则表达式对象（RegExp）
- 函数对象（Function）
- 集合对象（Set、Map）
- 错误对象（Error、SyntaxError 等）
  :::

### 声明

创建一个空数组有两种语法：

```javascript
let arr = new Array();
let arr = [];
```

绝大多数情况下使用的都是第二种语法。我们可以在方括号中添加初始元素：

```javascript
let fruits = ["Apple", "Orange", "Plum"];
```

数组元素从 0 开始编号。

我们可以通过方括号中的数字获取元素：

```javascript
let fruits = ["Apple", "Orange", "Plum"];

alert(fruits[0]); // Apple
alert(fruits[1]); // Orange
alert(fruits[2]); // Plum
```

可以替换元素：

```javascript
fruits[2] = "Pear"; // 现在变成了 ["Apple", "Orange", "Pear"]
```

或者向数组新加一个元素：

```javascript
fruits[3] = "Lemon"; // 现在变成 ["Apple", "Orange", "Pear", "Lemon"]
```

length 属性的值是数组中元素的总个数：

```javascript
let fruits = ["Apple", "Orange", "Plum"];
alert(fruits.length); // 3
```

也可以用 alert 来显示整个数组

```javascript
let fruits = ["Apple", "Orange", "Plum"];
alert(fruits); // Apple,Orange,Plum
```

数组可以存储任何类型的元素，例如:

```javascript
// 混合值
let arr = [
  "Apple",
  { name: "John" },
  true,
  function () {
    alert("hello");
  },
];

// 获取索引为 1 的对象然后显示它的 name
alert(arr[1].name); // John

// 获取索引为 3 的函数并执行
arr[3](); // hello
```

数组就像对象一样，可以以逗号结尾

### 使用 “at” 获取最后一个元素

::: tip
旧式浏览器可能需要 polyfills
:::
假设我们想要数组的最后一个元素。

一些编程语言允许我们使用负数索引来实现这一点，例如 fruits[-1]。

但在 JavaScript 中这行不通。结果将是 undefined，因为方括号中的索引是被按照其字面意思处理的。

我们可以显式地计算最后一个元素的索引，然后访问它：fruits[fruits.length - 1]。

```javascript
let fruits = ["Apple", "Orange", "Plum"];

alert(fruits[fruits.length - 1]); // Plum
```

我们可以用 at 来使其简短一些：

```javascript
let fruits = ["Apple", "Orange", "Plum"];

// 与 fruits[fruits.length-1] 相同
alert(fruits.at(-1)); // Plum
```

也就是，对于`arr.at(i)`：

- 如果 i >= 0，则与 arr[i] 完全相同。
- 对于 i 为负数的情况，它则从数组的尾部向前数。

### pop/push, shift/unshift 方法

我们在使用数组时离不开 队列和栈，因此我们有对应的方法：

- `push` 在末端添加一个元素.
- `pop` 从末端取出一个元素.
- `shift` 取出队列首端的一个元素，整个队列往前移，这样原先排第二的元素现在排在了第一。
- `unshift` 在数组的首端添加元素.

示例：

```JavaScript
let fruits = ["Apple", "Orange", "Pear"];
alert( fruits.pop() ); // 移除 "Pear" 然后 alert 显示出来
alert( fruits ); // Apple, Orange

let fruits = ["Apple", "Orange"];
fruits.push("Pear");
alert( fruits ); // Apple, Orange, Pear

let fruits = ["Apple", "Orange", "Pear"];
alert( fruits.shift() ); // 移除 Apple 然后 alert 显示出来
alert( fruits ); // Orange, Pear

let fruits = ["Orange", "Pear"];
fruits.unshift('Apple');
alert( fruits ); // Apple, Orange, Pear

// push 和 unshift 方法都可以一次添加多个元素
let fruits = ["Apple"];
fruits.push("Orange", "Peach");
fruits.unshift("Pineapple", "Lemon");
// ["Pineapple", "Lemon", "Apple", "Orange", "Peach"]
alert( fruits );
```

### 内部实现

数组是一种特殊的对象。使用方括号来访问属性 arr[0] 实际上是来自于对象的语法。它其实与 obj[key] 相同，其中 arr 是对象，而数字用作键（key）。

它们扩展了对象，提供了特殊的方法来处理有序的数据集合以及 length 属性。但从本质上讲，它仍然是一个对象，因此其行为也像一个对象。比如它也是通过引用来复制的。

但是数组真正特殊的是它们的内部实现。JavaScript 引擎尝试把这些元素一个接一个地存储在连续的内存区域，而且还有一些其它的优化，以使数组运行得非常快。

Javascript 引擎会发现，如果我们在像使用常规对象一样使用数组，那么针对数组的优化就不再适用了，然后对应的优化就会被关闭，这些优化所带来的优势也就荡然无存了。

### 性能

push/pop 方法运行的比较快，而 shift/unshift 比较慢。

显而易见的是，前两者不需要移动元素，而后两种方法需要我们去移动每一个元素的位置。

### 循环

当我们需要去遍历一个数组时就需要循环，我们来看看有哪些方法：

`for`

遍历数组最古老的方式就是 for 循环：

```JavaScript
let arr = ["Apple", "Orange", "Pear"];

for (let i = 0; i < arr.length; i++) {
  alert( arr[i] );
}
```

`for..of`

```JavaScript
let fruits = ["Apple", "Orange", "Plum"];

// 遍历数组元素
for (let fruit of fruits) {
  alert( fruit );
}
```

for..of 不能获取当前元素的索引，只是获取元素值，但大多数情况是够用的。而且这样写更短。

::: tip 数组是对象，我能不能用 `for in` 呢？
技术上来讲，因为数组也是对象，所以使用 for..in 也是可以的：

```JavaScript
let arr = ["Apple", "Orange", "Pear"];

for (let key in arr) {
  alert( arr[key] ); // Apple, Orange, Pear
}
```

但这其实是一个很不好的想法。会有一些潜在问题存在：

1. for..in 循环会遍历 所有属性，不仅仅是这些数字属性。

在浏览器和其它环境中有一种称为“类数组”的对象，它们 看似是数组。也就是说，它们有 length 和索引属性，但是也可能有其它的非数字的属性和方法，这通常是我们不需要的。for..in 循环会把它们都列出来。所以如果我们需要处理类数组对象，这些“额外”的属性就会存在问题。

2. for..in 循环适用于普通对象，并且做了对应的优化。但是不适用于数组，因此速度要慢 `10-100` 倍。当然即使是这样也依然非常快。只有在遇到瓶颈时可能会有问题。但是我们仍然应该了解这其中的不同。

总之不要使用 for in 来遍历数组，这是三流程序员才会干的事
:::

### 关于 “length”

当我们修改数组的时候，length 属性会自动更新。准确来说，它实际上不是数组里元素的个数，而是最大的数字索引值加一。

例如，一个数组只有一个元素，但是这个元素的索引值很大，那么这个数组的 length 也会很大：

```JavaScript
let fruits = [];
fruits[123] = "Apple";

alert( fruits.length ); // 124
```

length 属性的另一个有意思的点是它是可写的。

如果我们手动增加它，则不会发生任何有趣的事儿。但是如果我们减少它，数组就会被截断。该过程是不可逆的，下面是例子：

```JavaScript
let arr = [1, 2, 3, 4, 5];

arr.length = 2; // 截断到只剩 2 个元素
alert( arr ); // [1, 2]

arr.length = 5; // 又把 length 加回来
alert( arr[3] ); // undefined：被截断的那些数值并没有回来
```

**所以，清空数组最简单的方法就是：arr.length = 0;。**

### new Array()

这是创建数组的另一种语法：

```JavaScript
let arr = new Array("Apple", "Pear", "etc");
```

如果使用单个参数（即数字）调用 new Array，那么它会创建一个 指定了长度，却没有任何项 的数组：

```JavaScript
let arr = new Array(2); // 会创建一个 [2] 的数组吗？
alert( arr[0] ); // undefined！没有元素。
alert( arr.length ); // 2
```

我们只是在这里介绍一下这种创建数组的语法，平时我们基本上都使用方括号，它更简洁，也不会造成上面说的这些问题。

### 多维数组

数组里的项也可以是数组。我们可以将其用于多维数组，例如存储矩阵：

```JavaScript
let matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

alert( matrix[1][1] ); // 最中间的那个数
```

### 数组的 `toString` 方法

数组有自己的 toString 方法的实现，会返回以逗号隔开的元素列表：

```JavaScript
let arr = [1, 2, 3];

alert( arr ); // 1,2,3
alert( String(arr) === '1,2,3' ); // true
```

我们看一下数组的 `hint` ：

```JavaScript
alert( [] + 1 ); // "1"
alert( [1] + 1 ); // "11"
alert( [1,2] + 1 ); // "1,21"
```

数组没有 `Symbol.toPrimitive`，也没有 `valueOf`，它们只能执行 `toString` 进行转换，所以这里 [] 就变成了一个空字符串，`[1]` 变成了 "1"，`[1,2]` 变成了 "1,2"。

所以就变成了字符串的拼接。

### 不要使用 == 比较数组

该运算符不会对数组进行特殊处理，它会像处理任意对象那样处理数组。

如果我们使用 == 来比较数组，除非我们比较的是两个引用同一数组的变量，否则它们永远不相等。

与原始类型的比较也可能会产生看似很奇怪的结果，我们可以参考 `原始值转换` 中 object 的 hint，这里给出两个示例：

```JavaScript
alert( 0 == [] ); // true
alert('0' == [] ); // false

// 数组 [] 被转换为原始类型以进行比较，被转换成了一个空字符串 ''
```

## 数组方法

数组提供的方法有很多。为了方便起见，在本章中，我们将按组讲解。

### 添加/移除数组元素

我们在上一个部分已经知道了从数组的首端或尾端添加和删除元素的方法：

- `arr.push(...items)` —— 从尾端添加元素，
- `arr.pop()` —— 从尾端提取元素，
- `arr.shift()` —— 从首端提取元素，
- `arr.unshift(...items)` —— 从首端添加元素。

我们还有：

#### splice

`arr.splice` 方法可以说是处理数组的瑞士军刀。它可以做所有事情：添加，删除和插入元素。

语法为：

```javascript
arr.splice(start[, deleteCount, elem1, ..., elemN])
```

它从索引 start 开始修改 arr：删除 deleteCount 个元素并在当前位置插入 elem1, ..., elemN。最后返回被删除的元素所组成的数组。

举几个例子：

删除了 3 个元素，并用另外两个元素替换它们：

```javascript
let arr = ["I", "study", "JavaScript", "right", "now"];

// 删除数组的前三项，并使用其他内容代替它们
arr.splice(0, 3, "Let's", "dance");

alert(arr); // 现在 ["Let's", "dance", "right", "now"]
```

将 deleteCount 设置为 0，splice 方法就能够插入元素而不用删除任何元素：

```javascript
let arr = ["I", "study", "JavaScript"];

// 从索引 2 开始
// 删除 0 个元素
// 然后插入 "complex" 和 "language"
arr.splice(2, 0, "complex", "language");

alert(arr); // "I", "study", "complex", "language", "JavaScript"
```

::: tip 允许负向索引
在这里和其他数组方法中，负向索引都是被允许的。它们从数组末尾计算位置，如下所示：

```javascript
let arr = [1, 2, 5];

// 从索引 -1（尾端前一位）
// 删除 0 个元素，
// 然后插入 3 和 4
arr.splice(-1, 0, 3, 4);

alert(arr); // 1,2,3,4,5
```

:::
::: tip 不要使用 delete
数组是对象，所以我们可以尝试使用 delete：

```javascript
let arr = ["I", "go", "home"];

delete arr[1]; // remove "go"

alert(arr[1]); // undefined

// now arr = ["I",  , "home"];
alert(arr.length); // 3
```

元素被删除了，但数组仍然有 3 个元素，我们可以看到 arr.length == 3。

这很正常，因为 delete obj.key 是通过 key 来移除对应的值。对于对象来说是可以的。但是对于数组来说，我们通常希望剩下的元素能够移动并占据被释放的位置。我们希望得到一个更短的数组。

所以不要使用 delete。
:::

#### slice

```javascript
arr.slice([start], [end]);
```

它会返回一个新数组，将所有从索引 start 到 end（不包括 end）的数组项复制到一个新的数组。start 和 end 都可以是负数，在这种情况下，从末尾计算索引。

它和字符串的 str.slice 方法有点像，就是把子字符串替换成子数组。

代码示例：

```javascript
let arr = ["t", "e", "s", "t"];

alert(arr.slice(1, 3)); // e,s（复制从位置 1 到位置 3 的元素）

alert(arr.slice(-2)); // s,t（复制从位置 -2 到尾端的元素）
```

我们也可以不带参数地调用它：arr.slice() 会创建一个 arr 的副本。其通常用于获取副本，以进行不影响原始数组的进一步转换。

#### concat

`arr.concat` 创建一个新数组，其中包含来自于其他数组和其他项的值。

```javascript
arr.concat(arg1, arg2...)
```

它接受任意数量的参数 —— 数组或值都可以。

结果是一个包含来自于 arr，然后是 arg1，arg2 的元素的新数组。

如果参数 argN 是一个数组，那么其中的所有元素都会被复制。否则，将复制参数本身。

例如：

```javascript
let arr = [1, 2];

// 从 arr 和 [3,4] 创建一个新数组
alert(arr.concat([3, 4])); // 1,2,3,4

// 从 arr、[3,4] 和 [5,6] 创建一个新数组
alert(arr.concat([3, 4], [5, 6])); // 1,2,3,4,5,6

// 从 arr、[3,4]、5 和 6 创建一个新数组
alert(arr.concat([3, 4], 5, 6)); // 1,2,3,4,5,6
```

通常，它只复制数组中的元素。其他对象，即使它们看起来像数组一样，但仍然会被作为一个整体添加：

```javascript
let arr = [1, 2];

let arrayLike = {
  0: "something",
  length: 1,
};

alert(arr.concat(arrayLike)); // 1,2,[object Object]
```

……但是，如果类数组对象具有 `Symbol.isConcatSpreadable` 属性，那么它就会被 concat 当作一个数组来处理：此对象中的元素将被添加：

```javascript
let arr = [1, 2];

let arrayLike = {
  0: "something",
  1: "else",
  [Symbol.isConcatSpreadable]: true,
  length: 2,
};

alert(arr.concat(arrayLike)); // 1,2,something,else
```

### 遍历 forEach

`arr.forEach` 方法允许为数组的每个元素都运行一个函数。

```javascript
arr.forEach(function (item, index, array) {
  // ... do something with item
});
```

比如：

```javascript
["Bilbo", "Gandalf", "Nazgul"].forEach((item, index, array) => {
  alert(`${item} is at index ${index} in ${array}`);
});
```

该函数的结果（如果它有返回）会被抛弃和忽略。

### 在数组中搜索

我们介绍在数组中进行搜索的方法。

#### indexOf/lastIndexOf 和 includes

arr.indexOf 和 arr.includes 方法语法相似，并且作用基本上也与字符串的方法相同，只不过这里是对数组元素而不是字符进行操作：

- `arr.indexOf(item, from)` —— 从索引 from 开始搜索 item，如果找到则返回索引，否则返回 -1。
- `arr.includes(item, from)` —— 从索引 from 开始搜索 item，如果找到则返回 true（译注：如果没找到，则返回 false）。

通常使用这些方法时只会传入一个参数：传入 item 开始搜索。默认情况下，搜索是从头开始的，例如：

```javascript
let arr = [1, 0, false];

alert(arr.indexOf(0)); // 1
alert(arr.indexOf(false)); // 2
alert(arr.indexOf(null)); // -1

alert(arr.includes(1)); // true
```

方法 arr.lastIndexOf 与 indexOf 相同，但从右向左查找：

```javascript
let fruits = ["Apple", "Orange", "Apple"];

alert(fruits.indexOf("Apple")); // 0（第一个 Apple）
alert(fruits.lastIndexOf("Apple")); // 2（最后一个 Apple）
```

::: tip includes 可以正确的处理 NaN
方法 includes 的一个次要但值得注意的特性是，它可以正确处理 NaN，这与 indexOf 不同：

```javascript
const arr = [NaN];
alert(arr.indexOf(NaN)); // -1（错，应该为 0）
alert(arr.includes(NaN)); // true（正确）
```

:::

#### find 和 findIndex/findLastIndex

想象一下，我们有一个对象数组。我们如何找到具有特定条件的对象？

这时可以用 arr.find 方法。

语法如下：

```javascript
let result = arr.find(function (item, index, array) {
  // 如果返回 true，则返回 item 并停止迭代
  // 对于假值（falsy）的情况，则返回 undefined
});

// item 是元素。
// index 是它的索引。
// array 是数组本身。
```

例如，我们有一个存储用户的数组，每个用户都有 id 和 name 字段。让我们找到 id == 1 的那个用户：

```javascript
let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Pete" },
  { id: 3, name: "Mary" },
];

let user = users.find((item) => item.id == 1);

alert(user.name); // John
```

在现实生活中，对象数组是很常见的，所以 find 方法非常有用。

`arr.findIndex` 方法（与 arr.find）具有相同的语法，但它返回找到的元素的索引，而不是元素本身。如果没找到，则返回 -1。

`arr.findLastIndex `方法类似于 findIndex，但从右向左搜索，类似于 lastIndexOf。

#### filter

find 方法搜索的是使函数返回 true 的第一个（单个）元素。

如果需要匹配的有很多，我们可以使用 arr.filter(fn)。

语法与 find 大致相同，但是 filter 返回的是所有匹配元素组成的数组：

```javascript
let results = arr.filter(function (item, index, array) {
  // 如果 true item 被 push 到 results，迭代继续
  // 如果什么都没找到，则返回空数组
});
```

例如：

```javascript
let users = [
  { id: 1, name: "John" },
  { id: 2, name: "Pete" },
  { id: 3, name: "Mary" },
];

// 返回前两个用户的数组
let someUsers = users.filter((item) => item.id < 3);

alert(someUsers.length); // 2
```

### 转换数组

让我们继续学习进行数组转换和重新排序的方法：

#### map

arr.map 方法是最有用和经常使用的方法之一。

它对数组的每个元素都调用函数，并返回结果数组：

```javascript
let result = arr.map(function (item, index, array) {
  // 返回新值而不是当前元素
});
```

一个具体的例子：

```javascript
// 将每个元素转换为它的字符串长度

let lengths = ["Bilbo", "Gandalf", "Nazgul"].map((item) => item.length);
alert(lengths); // 5,7,6
```

#### sort(fn)

arr.sort 方法对数组进行 原位（in-place） 排序，更改元素的顺序。(译注：原位是指在此数组内，而非生成一个新数组。)

它还返回排序后的数组，但是返回值通常会被忽略，因为修改了 arr 本身：

```javascript
let arr = [1, 2, 15];

// 该方法重新排列 arr 的内容
arr.sort();

alert(arr); // 1, 15, 2
```

为什么变成了 1, 15, 2 ？

这些元素默认情况下被按字符串进行排序。

从字面上看，所有元素都被转换为字符串，然后进行比较。对于字符串，按照词典顺序进行排序，实际上应该是 "2" > "15"。

要使用我们自己的排序顺序，我们需要提供一个函数作为 arr.sort() 的参数。

例如，按数字进行排序：

```javascript
function compareNumeric(a, b) {
  if (a > b) return 1;
  if (a == b) return 0;
  if (a < b) return -1;
}

let arr = [1, 2, 15];

arr.sort(compareNumeric);

alert(arr); // 1, 2, 15
```

我们思考一下这儿发生了什么。arr 可以是由任何内容组成的数组，对吗？它可能包含数字、字符串、对象或其他任何内容。我们有一组 一些元素。要对其进行排序，我们需要一个 **排序函数** 来确认如何比较这些元素。默认是按字符串进行排序的。

`arr.sort(fn)` 方法实现了通用的排序算法。我们不需要关心它的内部工作原理（大多数情况下都是经过 快速排序 或 Timsort 算法优化的）。它将遍历数组，使用提供的函数比较其元素并对其重新排序，我们所需要的就是提供执行比较的函数 fn。

顺便说一句，如果我们想知道要比较哪些元素 —— 那么什么都不会阻止 alert 它们：

```javascript
[1, -2, 15, 2, 0, 8].sort(function (a, b) {
  alert(a + " <> " + b);
  return a - b;
});
```

#### reverse

arr.reverse 方法用于颠倒 arr 中元素的顺序，返回颠倒后的数组

#### split 和 join

举一个现实生活场景的例子。我们正在编写一个消息应用程序，并且该人员输入以逗号分隔的接收者列表：`John, Pete, Mary`。但对我们来说，名字数组比单个字符串舒适得多。怎么做才能获得这样的数组呢？

`str.split(delim)` 方法可以做到。它通过给定的分隔符 delim 将字符串分割成一个数组。

在下面的例子中，我们用“逗号后跟着一个空格”作为分隔符：

```javascript
let names = "Bilbo, Gandalf, Nazgul";

let arr = names.split(", ");

for (let name of arr) {
  alert(`A message to ${name}.`); // A message to Bilbo（和其他名字）
}
```

split 方法有一个可选的第二个数字参数 —— 对数组长度的限制。如果提供了，那么额外的元素会被忽略。但实际上它很少使用：

```javascript
let arr = "Bilbo, Gandalf, Nazgul, Saruman".split(", ", 2);

alert(arr); // Bilbo, Gandalf
```

拆分为字母，调用带有空参数 s 的 split(s)，会将字符串拆分为字母数组：

```javascript
let str = "test";

alert(str.split("")); // t,e,s,t
```

`arr.join(glue)` 与 split 相反。它会在它们之间创建一串由 glue 粘合的 arr 项，例如：

```javascript
let arr = ['Bilbo', 'Gandalf', 'Nazgul'];

let str = arr.join(';'); // 使用分号 ; 将数组粘合成字符串

alert( str ); // Bilbo;Gandalf;Nazgul
```
#### reduce/reduceRight
当我们需要遍历一个数组时 —— 我们可以使用 forEach，for 或 for..of。

当我们需要遍历并返回每个元素的数据时 —— 我们可以使用 map。

`arr.reduce` 方法和 `arr.reduceRight` 方法和上面的种类差不多，但稍微复杂一点。它们用于根据数组计算单个值，语法为：

```javascript
let arr = ['Bilbo', 'Gandalf', 'Nazgul'];

let str = arr.join(';'); // 使用分号 ; 将数组粘合成字符串

alert( str ); // Bilbo;Gandalf;Nazgul
```
该函数一个接一个地应用于所有数组元素，并将其结果“搬运（carry on）”到下一个调用。

- `accumulator` —— 是上一个函数调用的结果，第一次等于 initial（如果提供了 initial 的话）。
- `item` —— 当前的数组元素。
- `index` —— 当前索引。
- `arr` —— 数组本身。

应用函数时，上一个函数调用的结果将作为第一个参数传递给下一个函数。

因此，第一个参数本质上是累加器，用于存储所有先前执行的组合结果。最后，它成为 reduce 的结果。

给一个例子：

```javascript
let arr = [1, 2, 3, 4, 5];

let result = arr.reduce((sum, current) => sum + current, 0);

alert(result); // 15
```
传递给 reduce 的函数仅使用了 2 个参数，通常这就足够了。

让我们看看细节，到底发生了什么。

1. 在第一次运行时，sum 的值为初始值 initial（reduce 的最后一个参数），等于 0，current 是第一个数组元素，等于 1。所以函数运行的结果是 1。
2. 在第二次运行时，sum = 1，我们将第二个数组元素（2）与其相加并返回。
3. 在第三次运行中，sum = 3，我们继续把下一个元素与其相加，以此类推……

**如果没有初始值，那么 reduce 会将数组的第一个元素作为初始值，并从第二个元素开始迭代。但是这种使用需要非常小心。如果数组为空，那么在没有初始值的情况下调用 reduce 会导致错误。**

arr.reduceRight 和 arr.reduce 方法的功能一样，只是遍历为从右到左。

### Array.isArray
数组是基于对象的，不构成单独的语言类型。

所以 typeof 不能帮助从数组中区分出普通对象：

```javascript
alert(typeof {}); // object
alert(typeof []); // object（相同）
```
因此有一种特殊的方法用于判断：Array.isArray(value)。如果 value 是一个数组，则返回 true；否则返回 false。

```javascript
alert(Array.isArray({})); // false

alert(Array.isArray([])); // true
```
### 大多数方法都支持 “thisArg”
几乎所有调用函数的数组方法 —— 比如 find，filter，map，除了 sort 是一个特例，都接受一个可选的附加参数 thisArg。

上面的部分中没有解释该参数，因为该参数很少使用。但是为了完整性，我们需要讲讲它。
```javascript
arr.find(func, thisArg);
arr.filter(func, thisArg);
arr.map(func, thisArg);
// ...
// thisArg 是可选的最后一个参数
```
thisArg 参数的值在 func 中变为 this。

例如，在这里我们使用 army 对象方法作为过滤器，thisArg 用于传递上下文（passes the context）：

```javascript
let army = {
  minAge: 18,
  maxAge: 27,
  canJoin(user) {
    return user.age >= this.minAge && user.age < this.maxAge;
  }
};

let users = [
  {age: 16},
  {age: 20},
  {age: 23},
  {age: 30}
];

// 找到 army.canJoin 返回 true 的 user
let soldiers = users.filter(army.canJoin, army);

alert(soldiers.length); // 2
alert(soldiers[0].age); // 20
alert(soldiers[1].age); // 23
```

可以用 users.filter(user => army.canJoin(user)) 替换对 users.filter(army.canJoin, army) 的调用。前者的使用频率更高，因为对于大多数人来说，它更容易理解。

### 参考

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array

## Iterable object（可迭代对象）









































































































































































































































































