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
``` javascript
let single = 'single-quoted';
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
``` javascript
alert( `My\n`.length ); // 3
```
### 访问字符
要获取在 pos 位置的一个字符，可以使用方括号 [pos] 或者调用 str.charAt(pos) 方法。第一个字符从零位置开始：
``` javascript
let str = `Hello`;

// 第一个字符
alert( str[0] ); // H
alert( str.charAt(0) ); // H

// 最后一个字符
alert( str[str.length - 1] ); // o
```
方括号是获取字符的一种现代化方法，而 charAt 是历史原因才存在的。

它们之间的唯一区别是，如果没有找到字符，[] 返回 undefined，而 charAt 返回一个空字符串。

我们也可以使用 for..of 遍历字符:
``` javascript
for (let char of "Hello") {
  alert(char); // H,e,l,l,o（char 变为 "H"，然后是 "e"，然后是 "l" 等）
}
```

### 字符串是不可变的
在 JavaScript 中，字符串不可更改。改变字符是不可能的。
``` javascript
let str = 'Hi';

str[0] = 'h'; // error
alert( str[0] ); // TypeError: Cannot assign to read only property '0' of string 'Hi'
```
### 改变大小写
`toLowerCase()` 和 `toUpperCase()` 方法可以改变大小写：
``` javascript
alert( 'Interface'.toUpperCase() ); // INTERFACE
alert( 'Interface'.toLowerCase() ); // interface

// 或者我们想要使一个字符变成小写：
alert( 'Interface'[0].toLowerCase() ); // 'i'
```
### 查找子字符串
在字符串中查找子字符串有很多种方法。
#### str.indexOf
第一个方法是 `str.indexOf(substr, pos)`。

它从给定位置 pos 开始，在 str 中查找 substr，如果没有找到，则返回 -1，否则返回匹配成功的位置，比如：

``` javascript
let str = 'Widget with id';

alert( str.indexOf('Widget') ); // 0，因为 'Widget' 一开始就被找到
alert( str.indexOf('widget') ); // -1，没有找到，检索是大小写敏感的

alert( str.indexOf("id") ); // 1，"id" 在位置 1 处（w - 0 | i - 1）

// 从位置 2 开始检索
alert( str.indexOf('id', 2) ) // 12
```
如果我们对所有存在位置都感兴趣，可以在一个循环中使用 indexOf。每一次新的调用都发生在上一匹配位置之后：
``` javascript
let str = 'As sly as a fox, as strong as an ox';

let target = 'as'; // 这是我们要查找的目标

let pos = 0;
while (true) {
  let foundPos = str.indexOf(target, pos);
  if (foundPos == -1) break;

  alert( `Found at ${foundPos}` );
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

``` javascript
alert( ~2 ); // -3，和 -(2+1) 相同
alert( ~1 ); // -2，和 -(1+1) 相同
alert( ~0 ); // -1，和 -(0+1) 相同
alert( ~-1 ); // 0，和 -(-1+1) 相同
```
因此，仅当 indexOf 的结果不是 -1 时，检查 if ( ~str.indexOf("...") ) 才为真。换句话说，当有匹配时。

人们用它来简写 indexOf 检查：
``` javascript
let str = "Widget";

if (~str.indexOf("Widget")) {
  alert( 'Found it!' ); // 正常运行
}
```
::: danger
通常不建议以非显而易见的方式使用语言特性，但这种特殊技巧在旧代码中仍被广泛使用，所以我们应该理解它。

只要记住：if (~str.indexOf(...)) 读作 “if found”。

现在我们只会在旧的代码中看到这个技巧，因为现代 JavaScript 提供了 .includes 方法（见下文）。
:::

#### includes，startsWith，endsWith


















































































