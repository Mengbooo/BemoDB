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
let arr = ["Bilbo", "Gandalf", "Nazgul"];

let str = arr.join(";"); // 使用分号 ; 将数组粘合成字符串

alert(str); // Bilbo;Gandalf;Nazgul
```

#### reduce/reduceRight

当我们需要遍历一个数组时 —— 我们可以使用 forEach，for 或 for..of。

当我们需要遍历并返回每个元素的数据时 —— 我们可以使用 map。

`arr.reduce` 方法和 `arr.reduceRight` 方法和上面的种类差不多，但稍微复杂一点。它们用于根据数组计算单个值，语法为：

```javascript
let value = arr.reduce(function(accumulator, item, index, array) {
  // ...
}, [initial]);
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
  },
};

let users = [{ age: 16 }, { age: 20 }, { age: 23 }, { age: 30 }];

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

可迭代（Iterable） 对象是说任何对象都可以被定制为可在 for..of 循环中使用的对象,像数组、字符串、Set、Map 等。

如果从严格意义上讲，对象不是数组，而是表示某物的集合（列表，集合），for..of 是一个能够遍历它的很好的语法，因此，让我们来看看如何使其发挥作用。

### Symbol.iterator

通过自己创建一个对象，我们就可以轻松地掌握可迭代的概念。

例如，我们有一个对象，它并不是数组，但是看上去很适合使用 for..of 循环。

比如一个 range 对象，它代表了一个数字区间：

```javascript
let range = {
  from: 1,
  to: 5,
};

// 我们希望 for..of 这样运行：
// for(let num of range) ... num=1,2,3,4,5
```

为了让 range 对象可迭代（也就让 for..of 可以运行）我们需要为对象添加一个名为 Symbol.iterator 的方法（一个专门用于使对象可迭代的内建 symbol，数组具有内置的这个方法）

- 当 `for..of `循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法必须返回一个 迭代器（iterator） —— 一个有 `next` 方法的对象。
- 从此开始，`for..of` 仅适用于这个被返回的对象。
- 当 `for..of` 循环希望取得下一个数值，它就调用这个对象的 `next()` 方法。
- `next()` 方法返回的结果的格式必须是 `{done: Boolean, value: any}`，当 `done=true` 时，表示循环结束，否则 `value` 是下一个值。

把代码展开，完整实现：

```javascript
let range = {
  from: 1,
  to: 5,
};

// 1. for..of 调用首先会调用这个：
range[Symbol.iterator] = function () {
  // ……它返回迭代器对象（iterator object）：
  // 2. 接下来，for..of 仅与下面的迭代器对象一起工作，要求它提供下一个值
  return {
    current: this.from,
    last: this.to,

    // 3. next() 在 for..of 的每一轮循环迭代中被调用
    next() {
      // 4. 它将会返回 {done:.., value :...} 格式的对象
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    },
  };
};

// 现在它可以运行了！
for (let num of range) {
  alert(num); // 1, 然后是 2, 3, 4, 5
}
```

请注意可迭代对象的核心功能：关注点分离：

- `range` 自身没有 next() 方法。
- 相反，是通过调用 `range[Symbol.iterator]() `创建了另一个对象，即所谓的“迭代器”对象，并且它的 `next` 会为迭代生成值。

因此，迭代器对象和与其进行迭代的对象是分开的。

从技术上说，我们可以将它们合并，并使用 range 自身作为迭代器来简化代码。

```javascript
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },

  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  },
};

for (let num of range) {
  alert(num); // 1, 然后是 2, 3, 4, 5
}
```

但缺点是，现在不可能同时在对象上运行两个 for..of 循环了：它们将共享迭代状态，因为只有一个迭代器，即对象本身。但是两个并行的 for..of 是很罕见的，即使在异步情况下。

::: tip 无穷迭代器（iterator）
无穷迭代器也是可能的。例如，将 `range` 设置为 `range.to = Infinity`，这时 `range` 则成为了无穷迭代器。或者我们可以创建一个可迭代对象，它生成一个无穷伪随机数序列。也是可能的。

next 没有什么限制，它可以返回越来越多的值，这是正常的。

当然，迭代这种对象的 `for..of` 循环将不会停止。但是我们可以通过使用 break 来停止它
:::

### 关于字符串的迭代

数组和字符串是使用最广泛的内建可迭代对象。

对于一个字符串，for..of 遍历它的每个字符：

```javascript
for (let char of "test") {
  // 触发 4 次，每个字符一次
  alert(char); // t,e,s,t
}
```

对于代理对（surrogate pairs），它也能正常工作！（译注：这里的代理对也就指的是 UTF-16 的扩展字符）

```javascript
let str = "𝒳😂";
for (let char of str) {
  alert(char); // 𝒳，然后是 😂
}
```

### 显式调用迭代器

让我们来看看如何显式地使用迭代器。

我们将会采用与 for..of 完全相同的方式遍历字符串，但使用的是直接调用。这段代码创建了一个字符串迭代器，并“手动”从中获取值。

```javascript
let str = "Hello";

// 和 for..of 做相同的事
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // 一个接一个地输出字符
}
```

next 函数：

```javascript
  next: function () {
            if (index < str.length) {
                return { value: str[index++], done: false };
            } else {
                return { value: undefined, done: true };
            }
        }
```

很少需要我们这样做，但是比 for..of 给了我们更多的控制权。例如，我们可以拆分迭代过程：迭代一部分，然后停止，做一些其他处理，然后再恢复迭代。

### 可迭代（iterable）和类数组（array-like）

这两个官方术语看起来差不多，但其实大不相同。请确保你能够充分理解它们的含义，以免造成混淆。

- `Iterable` 如上所述，是实现了 `Symbol.iterator` 方法的对象。
- `Array-like` 是有索引和 `length` 属性的对象，所以它们看起来很像数组。

例如，字符串即是可迭代的（for..of 对它们有效），又是类数组的（它们有数值索引和 length 属性）。但是一个可迭代对象也许不是类数组对象。反之亦然，类数组对象可能不可迭代。

可迭代的，但并非类数组对象的：

```javascript
let range = {
  from: 1,
  to: 5,
};
```

下面这个对象则是类数组的，但是不可迭代：

```javascript
let arrayLike = {
  // 有索引和 length 属性 => 类数组对象
  0: "Hello",
  1: "World",
  length: 2,
};

// Error (no Symbol.iterator)
for (let item of arrayLike) {
}
```

可迭代对象和类数组对象通常都 不是数组，它们没有 push 和 pop 等方法。如果我们有一个这样的对象，并想像数组那样操作它，那就非常不方便。**例如，我们想使用数组方法操作 range，应该如何实现呢？**

### Array.from

有一个全局方法 `Array.from` 可以接受一个可迭代或类数组的值，并从中获取一个“真正的”数组。然后我们就可以对其调用数组方法了。

例如：

```javascript
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2,
};

let arr = Array.from(arrayLike); // (*)
alert(arr.pop()); // World（pop 方法有效）
```

在 `(*)` 行的` Array.from` 方法接受对象，检查它是一个可迭代对象或类数组对象，然后创建一个新数组，并将该对象的所有元素复制到这个新数组。

如果是可迭代对象，也是同样：

```javascript
// 假设 range 来自上文的例子中
let arr = Array.from(range);
alert(arr); // 1,2,3,4,5 （数组的 toString 转化方法生效）
```

`Array.from` 的完整语法允许我们提供一个可选的`“映射（mapping）”`函数：

```javascript
Array.from(obj[, mapFn, thisArg])
```

可选的第二个参数 mapFn 可以是一个函数，该函数会在对象中的元素被添加到数组前，被应用于每个元素，此外 thisArg 允许我们为该函数设置 this。

```javascript
// 假设 range 来自上文例子中

// 求每个数的平方
let arr = Array.from(range, (num) => num * num);

alert(arr); // 1,4,9,16,25
```

现在我们用 Array.from 将一个字符串转换为单个字符的数组：

```javascript
let str = "𝒳😂";

// 将 str 拆分为字符数组
let chars = Array.from(str);

alert(chars[0]); // 𝒳
alert(chars[1]); // 😂
alert(chars.length); // 2

// 技术上来讲，它和下面这段代码做的是相同的事：
let str = "𝒳😂";

let chars = []; // Array.from 内部执行相同的循环
for (let char of str) {
  chars.push(char);
}

alert(chars);
```

## Map and Set（映射和集合）

学到现在，我们已经了解了以下复杂的数据结构：

- 常规对象，存储带有键的数据的集合。
- 数组，存储有序集合

但这还不足以应对现实情况。这就是为什么存在 `Map 和 Set`。

### Map

Map 是一个带键的数据项的集合，就像一个 常规 Object 一样。 但是它们最大的差别是 Map 允许任何类型的键（key）。

它的方法和属性如下：

- `new Map()` —— 创建 map。
- `map.set(key, value)` —— 根据键存储值。
- `map.get(key)` —— 根据键来返回值，如果 map 中不存在对应的 key，则返回 undefined。
- `map.has(key)` —— 如果 key 存在则返回 true，否则返回 false。
- `map.delete(key)` —— 删除指定键的值。
- `map.clear()` —— 清空 map。
- `map.size` —— 返回当前元素个数。

示例：

```javascript
let map = new Map();

map.set("1", "str1"); // 字符串键
map.set(1, "num1"); // 数字键
map.set(true, "bool1"); // 布尔值键

// 还记得普通的 Object 吗? 它会将键转化为字符串
// Map 则会保留键的类型，所以下面这两个结果不同：
alert(map.get(1)); // 'num1'
alert(map.get("1")); // 'str1'

alert(map.size); // 3
```

如我们所见，与对象不同，键不会被转换成字符串。键可以是任何类型。

::: warning `map[key]` 不是使用 Map 的正确方式
虽然 `map[key]` 也有效，例如我们可以设置 `map[key] = 2`，这样会将 map 视为 JavaScript 的 **常规 object**，因此它暗含了所有相应的限制（仅支持 string/symbol 键等）。

所以我们应该使用 map 方法：set 和 get 等。
:::

**Map 还可以使用对象作为键**。例如：

```javascript
let john = { name: "John" };

// 存储每个用户的来访次数
let visitsCountMap = new Map();

// john 是 Map 中的键
visitsCountMap.set(john, 123);

alert(visitsCountMap.get(john)); // 123
```

**使用对象作为键是 Map 最值得注意和重要的功能之一**。在 Object 中，我们则无法使用对象作为键。在 Object 中使用字符串作为键是可以的，但我们无法使用另一个 Object 作为 Object 中的键。

如果我在常规对象中使用对象作为键：

```javascript
let john = { name: "John" };
let ben = { name: "Ben" };

let visitsCountObj = {}; // 尝试使用对象

visitsCountObj[ben] = 234; // 尝试将对象 ben 用作键
visitsCountObj[john] = 123;
// 尝试将对象 john 用作键，但我们会发现使用对象 ben 作为键存下的值会被替换掉

// 变成这样了！
alert(visitsCountObj["[object Object]"]); // 123
```

因为 visitsCountObj 是一个对象，它会将所有 Object 键例如上面的 john 和 ben 转换为字符串 "[object Object]"。这显然不是我们想要的结果。

::: tip Map 是怎么比较键的？
Map 使用 SameValueZero 算法来比较键是否相等。它和严格等于 === 差不多，但区别是 NaN 被看成是等于 NaN。所以 NaN 也可以被用作键。

这个算法不能被改变或者自定义。
:::
::: tip 链式调用
每一次 map.set 调用都会返回 map 本身，所以我们可以进行“链式”调用：

```javascript
map.set("1", "str1").set(1, "num1").set(true, "bool1");
```

:::

### Map 的迭代

如果要在 map 里使用循环，可以使用以下三个方法：

- `map.keys()` —— 遍历并返回一个包含所有键的可迭代对象，
- `map.values()` —— 遍历并返回一个包含所有值的可迭代对象，
- `map.entries()`（和 map 相同） —— 遍历并返回一个包含所有实体 `[key, value]` 的可迭代对象，`for..of` 在默认情况下使用的就是这个。

例如：

```javascript
let recipeMap = new Map([
  ["cucumber", 500],
  ["tomatoes", 350],
  ["onion", 50],
]);

// 遍历所有的键（vegetables）
for (let vegetable of recipeMap.keys()) {
  alert(vegetable); // cucumber, tomatoes, onion
}

// 遍历所有的值（amounts）
for (let amount of recipeMap.values()) {
  alert(amount); // 500, 350, 50
}

// 遍历所有的实体 [key, value]
for (let entry of recipeMap) {
  // 与 recipeMap.entries() 相同
  alert(entry); // cucumber,500 (and so on)
}
```

::: tip 关于顺序
迭代的顺序与插入值的顺序相同。与普通的 Object 不同，Map 保留了此顺序。
:::

除此之外，Map 有内建的 forEach 方法，与 Array 类似：

```javascript
// 对每个键值对 (key, value) 运行 forEach 函数
recipeMap.forEach((value, key, map) => {
  alert(`${key}: ${value}`); // cucumber: 500 etc
});
```

### 从对象创建 Map 与 从 Map 创建对象

`Object.entries`

当创建一个 Map 后，我们可以传入一个带有键值对的数组（或其它可迭代对象）来进行初始化，如下所示：

```javascript
// 键值对 [key, value] 数组
let map = new Map([
  ["1", "str1"],
  [1, "num1"],
  [true, "bool1"],
]);

alert(map.get("1")); // str1
```

如果我们想从一个已有的普通对象（plain object）来创建一个 Map，那么我们可以使用内建方法 `Object.entries(obj)`，该方法返回对象的键/值对数组，该数组格式完全按照 Map 所需的格式。

例如：

```javascript
let obj = {
  name: "John",
  age: 30,
};

let map = new Map(Object.entries(obj));

alert(map.get("name")); // John
```

这里，Object.entries 返回键/值对数组：`[ ["name","John"], ["age", 30] ]`。这就是 Map 所需要的格式。

`Object.fromEntries`

Object.fromEntries 方法的作用是相反的：给定一个具有 [key, value] 键值对的数组，它会根据给定数组创建一个对象：

```javascript
let prices = Object.fromEntries([
  ["banana", 1],
  ["orange", 2],
  ["meat", 4],
]);

// 现在 prices = { banana: 1, orange: 2, meat: 4 }

alert(prices.orange); // 2

// 又比如：

let map = new Map();
map.set("banana", 1);
map.set("orange", 2);
map.set("meat", 4);

// 创建一个普通对象（plain object）(*)
let obj = Object.fromEntries(map.entries()); // 这里也可以省掉 .entries()
```

### Set

Set 是一个特殊的类型集合 —— “值的集合”（没有键），它的每一个值只能出现一次。

它的主要方法如下：

- `new Set(iterable)` —— 创建一个 set，如果提供了一个 iterable 对象（通常是数组），将会从数组里面复制值到 set 中。
- `set.add(value)` —— 添加一个值，返回 set 本身
- `set.delete(value)` —— 删除值，如果 value 在这个方法调用的时候存在则返回 true ，否则返回 false。
- `set.has(value)` —— 如果 value 在 set 中，返回 true，否则返回 false。
- `set.clear()` —— 清空 set。
- `set.size` —— 返回元素个数。

它的主要特点是，**重复使用同一个值调用 set.add(value) 并不会发生什么改变。这就是 Set 里面的每一个值只出现一次的原因。**

例如，我们有客人来访，我们想记住他们每一个人。但是已经来访过的客人再次来访，不应造成重复记录。每个访客必须只被“计数”一次。

Set 可以帮助我们解决这个问题：

```javascript
let set = new Set();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

// visits，一些访客来访好几次
set.add(john);
set.add(pete);
set.add(mary);
set.add(john);
set.add(mary);

// set 只保留不重复的值
alert(set.size); // 3

for (let user of set) {
  alert(user.name); // John（然后 Pete 和 Mary）
}
```

Set 的替代方法可以是一个用户数组，用 arr.find 在每次插入值时检查是否重复。但是这样性能会很差，因为这个方法会遍历整个数组来检查每个元素。Set 内部对唯一性检查进行了更好的优化。

### Set 的迭代

我们可以使用 for..of 或 forEach 来遍历 Set：

```javascript
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// 与 forEach 相同：
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```
::: tip
注意一件有趣的事儿。forEach 的回调函数有三个参数：一个 value，然后是 同一个值 valueAgain，最后是目标对象。没错，同一个值在参数里出现了两次。

forEach 的回调函数有三个参数，是为了与 Map 兼容。当然，这看起来确实有些奇怪。但是这对在特定情况下轻松地用 Set 代替 Map 很有帮助，反之亦然。
:::

Map 中用于迭代的方法在 Set 中也同样支持：

- `set.keys()` —— 遍历并返回一个包含所有值的可迭代对象，
- `set.values()` —— 与 set.keys() 作用相同，这是为了兼容 Map，
- `set.entries()` —— 遍历并返回一个包含所有的实体 [value, value] 的可迭代对象，它的存在也是为了兼容 Map。

## WeakMap and WeakSet（弱映射和弱集合）

我们从前面的 垃圾回收 章节中知道，JavaScript 引擎在值“可达”和可能被使用时会将其保持在内存中。

例如：

```javascript
let john = { name: "John" };

// 该对象能被访问，john 是它的引用

// 覆盖引用
john = null;

// 该对象将会被从内存中清除
```
通常，当对象、数组之类的数据结构在内存中时，它们的子元素，如对象的属性、数组的元素都被认为是可达的。

例如，如果把一个对象放入到数组中，那么只要这个数组存在，那么这个对象也就存在，即使没有其他对该对象的引用。

就像这样:

```javascript
let john = { name: "John" };

let array = [ john ];

john = null; // 覆盖引用

// 前面由 john 所引用的那个对象被存储在了 array 中
// 所以它不会被垃圾回收机制回收
// 我们可以通过 array[0] 获取到它
```
类似的，如果我们使用对象作为常规 Map 的键，那么当 Map 存在时，该对象也将存在。它会占用内存，并且不会被（垃圾回收机制）回收。

例如：
```javascript
let john = { name: "John" };

let map = new Map();
map.set(john, "...");

john = null; // 覆盖引用

// john 被存储在了 map 中，
// 我们可以使用 map.keys() 来获取它
```
WeakMap 在这方面有着根本上的不同。**它不会阻止垃圾回收机制对作为键的对象（key object）的回收**。

让我们通过例子来看看这指的到底是什么。

### WeakMap
WeakMap 和 Map 的第一个不同点就是，**WeakMap 的键必须是对象，不能是原始值**：

```javascript
let weakMap = new WeakMap();

let obj = {};

weakMap.set(obj, "ok"); // 正常工作（以对象作为键）

// 不能使用字符串作为键
weakMap.set("test", "Whoops"); // Error，因为 "test" 不是一个对象
```
现在，如果我们在 weakMap 中使用一个对象作为键，并且没有其他对这个对象的引用 —— 该对象将会被从内存（和map）中自动清除。
```javascript
let john = { name: "John" };

let weakMap = new WeakMap();
weakMap.set(john, "...");

john = null; // 覆盖引用

// john 被从内存中删除了！
```
与上面常规的 Map 的例子相比，现在如果 john 仅仅是作为 WeakMap 的键而存在 —— 它将会被从 map（和内存）中自动删除。

WeakMap 不支持迭代以及 `keys()，values() 和 entries()` 方法。所以没有办法获取 WeakMap 的所有键或值。

WeakMap 只有以下的方法：

- `weakMap.get(key)`
- `weakMap.set(key, value)`
- `weakMap.delete(key)`
- `weakMap.has(key)`

为什么会有这种限制呢？这是技术的原因。如果一个对象丢失了其它所有引用（就像上面示例中的 john），那么它就会被垃圾回收机制自动回收。但是在从技术的角度并不能准确知道 何时会被回收。

这些都是由 JavaScript 引擎决定的。JavaScript 引擎可能会选择立即执行内存清理，如果现在正在发生很多删除操作，那么 JavaScript 引擎可能就会选择等一等，稍后再进行内存清理。因此，从技术上讲，WeakMap 的当前元素的数量是未知的。JavaScript 引擎可能清理了其中的垃圾，可能没清理，也可能清理了一部分。因此，暂不支持访问 WeakMap 的所有键/值的方法。

### WeakMap 的使用场景
#### 额外数据的存储
假如我们正在处理一个“属于”另一个代码的一个对象，也可能是第三方库，并想存储一些与之相关的数据，那么这些数据就应该与这个对象共存亡 —— 这时候 WeakMap 正是我们所需要的利器。

我们将这些数据放到 WeakMap 中，并使用该对象作为这些数据的键，那么当该对象被垃圾回收机制回收后，这些数据也会被自动清除。

```javascript
weakMap.set(john, "secret documents");
// 如果 john 消失，secret documents 将会被自动清除
```
让我们来看一个例子。

例如，我们有用于处理用户访问计数的代码。收集到的信息被存储在 map 中：一个用户对象作为键，其访问次数为值。当一个用户离开时（该用户对象将被垃圾回收机制回收），这时我们就不再需要他的访问次数了。

下面是一个使用 Map 的计数函数的例子

```javascript
// 📁 visitsCount.js
let visitsCountMap = new Map(); // map: user => visits count

// 递增用户来访次数
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```
下面是其他部分的代码，可能是使用它的其它代码：
```javascript
// 📁 main.js
let john = { name: "John" };

countUser(john); // count his visits

// 不久之后，john 离开了
john = null;
```
现在，john 这个对象应该被垃圾回收，但它仍在内存中，因为它是 visitsCountMap 中的一个键。

当我们移除用户时，我们需要清理 visitsCountMap，否则它将在内存中无限增大。在复杂的架构中，这种清理会成为一项繁重的任务。

我们可以通过使用 WeakMap 来避免这样的问题：
```javascript
// 📁 visitsCount.js
let visitsCountMap = new WeakMap(); // weakmap: user => visits count

// 递增用户来访次数
function countUser(user) {
  let count = visitsCountMap.get(user) || 0;
  visitsCountMap.set(user, count + 1);
}
```
现在我们不需要去清理 visitsCountMap 了。当 john 对象变成不可达时，即便它是 WeakMap 里的一个键，它也会连同它作为 WeakMap 里的键所对应的信息一同被从内存中删除。
#### 缓存
另外一个常见的例子是缓存。我们可以存储（“缓存”）函数的结果，以便将来对同一个对象的调用可以重用这个结果。

为了实现这一点，我们可以使用 Map（非最佳方案）：

```javascript
// 📁 cache.js
let cache = new Map();

// 计算并记住结果
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculations of the result for */ obj;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

// 现在我们在其它文件中使用 process()

// 📁 main.js
let obj = {/* 假设我们有个对象 */};

let result1 = process(obj); // 计算完成

// ……稍后，来自代码的另外一个地方……
let result2 = process(obj); // 取自缓存的被记忆的结果

// ……稍后，我们不再需要这个对象时：
obj = null;

alert(cache.size); // 1（啊！该对象依然在 cache 中，并占据着内存！）
```
对于多次调用同一个对象，它只需在第一次调用时计算出结果，之后的调用可以直接从 cache 中获取。这样做的缺点是，当我们不再需要这个对象的时候需要清理 cache。

如果我们用 WeakMap 替代 Map，便不会存在这个问题。当对象被垃圾回收时，对应缓存的结果也会被自动从内存中清除。

```javascript
// 📁 cache.js
let cache = new WeakMap();

// 计算并记结果
function process(obj) {
  if (!cache.has(obj)) {
    let result = /* calculate the result for */ obj;

    cache.set(obj, result);
  }

  return cache.get(obj);
}

// 📁 main.js
let obj = {/* some object */};

let result1 = process(obj);
let result2 = process(obj);

// ……稍后，我们不再需要这个对象时：
obj = null;

// 无法获取 cache.size，因为它是一个 WeakMap，
// 要么是 0，或即将变为 0
// 当 obj 被垃圾回收，缓存的数据也会被清除
```
### WeakSet
WeakSet 的表现类似：

- 与 Set 类似，但是我们只能向 WeakSet 添加对象（而不能是原始值）。
- 对象只有在其它某个（些）地方能被访问的时候，才能留在 WeakSet 中。
- 跟 Set 一样，WeakSet 支持 add，has 和 delete 方法，但不支持 size 和 keys()，并且不可迭代。

变“弱（weak）”的同时，它也可以作为额外的存储空间。但并非针对任意数据，而是针对“是/否”的事实。WeakSet 的元素可能代表着有关该对象的某些信息。

例如，我们可以将用户添加到 WeakSet 中，以追踪访问过我们网站的用户：
```javascript
let visitedSet = new WeakSet();

let john = { name: "John" };
let pete = { name: "Pete" };
let mary = { name: "Mary" };

visitedSet.add(john); // John 访问了我们
visitedSet.add(pete); // 然后是 Pete
visitedSet.add(john); // John 再次访问

// visitedSet 现在有两个用户了

// 检查 John 是否来访过？
alert(visitedSet.has(john)); // true

// 检查 Mary 是否来访过？
alert(visitedSet.has(mary)); // false

john = null;

// visitedSet 将被自动清理(即自动清除其中已失效的值 john)
```
WeakMap 和 WeakSet 最明显的局限性就是不能迭代，并且无法获取所有当前内容。那样可能会造成不便，但是并不会阻止 WeakMap/WeakSet 完成其主要工作 —— **为在其它地方存储/管理的对象数据提供“额外”存储**。

## Object.keys，values，entries
对各个数据结构的学习至此告一段落，下面让我们讨论一下如何迭代它们。

在前面的章节中，我们认识了 map.keys()，map.values() 和 map.entries() 方法。

这些方法是通用的，有一个共同的约定来将它们用于各种数据结构。如果我们创建一个我们自己的数据结构，我们也应该实现这些方法。

它们支持：

- Map
- Set
- Array

普通对象也支持类似的方法，但是语法上有一些不同。

### 普通对象的 Object.keys，values，entries
对于普通对象，下列这些方法是可用的：

- `Object.keys(obj)` —— 返回一个包含该对象所有的键的数组。
- `Object.values(obj)` —— 返回一个包含该对象所有的值的数组。
- `Object.entries(obj)` —— 返回一个包含该对象所有 [key, value] 键值对的**数组**。

::: tip
- 注意 `我们上面说的这三种方法` 在普通对象这里返回的是**真正的数组**

为什么会这样？主要原因是灵活性。请记住，在 JavaScript 中，对象是所有复杂结构的基础。因此，我们可能有一个自己创建的对象，比如 data，并实现了它自己的 data.values() 方法。同时，我们依然可以对它调用 Object.values(data) 方法。

- 同时方法的前缀是 Object 而非我们具体定义的对象 obj （这主要是历史原因）

语法如：

``` Javascript
let user = {
  name: "John",
  age: 30
};

// 结果如下：

Object.keys(user) = ["name", "age"]
Object.values(user) = ["John", 30]
Object.entries(user) = [ ["name","John"], ["age",30] ]
```
:::
::: warning Object.keys/values/entries 会忽略 symbol 属性
就像 for..in 循环一样，这些方法会忽略使用 Symbol(...) 作为键的属性。

通常这很方便。但是，如果我们也想要 Symbol 类型的键，那么这儿有一个单独的方法 Object.getOwnPropertySymbols，它会返回一个只包含 Symbol 类型的键的数组。另外，还有一种方法 Reflect.ownKeys(obj)，它会返回 所有 键。

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys
:::

### 转换对象
对象缺少数组存在的许多方法，例如 map 和 filter 等。

如果我们想应用它们，那么我们可以使用 `Object.entries`，然后使用 `Object.fromEntries`：

1. 使用 Object.entries(obj) 从 obj 获取由键/值对组成的数组。
2. 对该数组使用数组方法，例如 map，对这些键/值对进行转换。
3. 对结果数组使用 Object.fromEntries(array) 方法，将结果转回成对象。

例如，我们有一个带有价格的对象，并想将它们加倍：

``` Javascript
let prices = {
  banana: 1,
  orange: 2,
  meat: 4,
};

let doublePrices = Object.fromEntries(
  // 将价格转换为数组，将每个键/值对映射为另一对
  // 然后通过 fromEntries 再将结果转换为对象
  Object.entries(prices).map(entry => [entry[0], entry[1] * 2])
);

alert(doublePrices.meat); // 8
```

## 解构赋值
JavaScript 中最常用的两种数据结构是 Object 和 Array。

- 对象是一种根据键存储数据的实体。
- 数组是一种直接存储数据的有序列表。

但是，当我们把它们传递给函数时，函数可能不需要整个对象/数组，而只需要其中一部分。

`解构赋值` 是一种特殊的语法，它使我们可以**将数组或对象“拆包”至一系列变量中**。有时这样做更方便。

**解构操作对那些具有很多参数和默认值等的函数也很奏效**。下面有一些例子。

### 数组的解构
这是一个将数组解构到变量中的例子：

``` Javascript
// 我们有一个存放了名字和姓氏的数组
let arr = ["John", "Smith"]

// 解构赋值
// 设置 firstName = arr[0]
// 以及 surname = arr[1]
let [firstName, surname] = arr;

alert(firstName); // John
alert(surname);  // Smith
```












































































































