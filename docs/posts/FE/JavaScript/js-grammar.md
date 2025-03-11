# JavaScript 基础

::: tip
这里顺顺 JavaScript 的一些基本语法，我们聚焦于这个语言的本身，然后来尝试一些 JavaScript Info 里的小练习。
:::

## 我该如何运行 JavaScript 文件？

我们需要做一些前置准备：我们需要一个工作环境来运行我们的脚本。

### By `<script>`

几乎可以使用 `<script>` 标签将 JavaScript 程序插入到 HTML 文档的任何位置。

### By Node

对于 Node，你只需要使用诸如 "node my.js" 的命令行来执行它。

## 自动分号插入（ASI）

在类如下面的代码中，JavaScript 会将换行符理解成“隐式”的分号：

```JavaScript
alert('Hello')
alert('World')
```

但是这并不代表所有情况都会进行自动分号插入，有时候 JavaScript 无法确定是否需要插入分号，故而最好在语句结束的时候**显式使用分号**，例如：

```JavaScript
alert("Hello")
[1, 2].forEach(alert);
// 会被引擎解析为：alert("Hello")[1, 2].forEach(alert);
```

## 注释

如上面的示例代码，注释就是 `//`，对于多行需要注释，可以使用`/* */`，但是需要注意的是，JavaScript**并不支持注释嵌套**（不要在 `/*...*/` 内嵌套另一个 `/*...*/` plz）

## 关于 “ use strict ”

我们在文档首页中提到了 JavaScript 的语言特性，一方面这解决了一部分兼容性问题，但是也保留了一些 JavaScript 的一些令人不愉快的使用体验。直到 ES5 的出现（它增加了新的语言特性和修改了一部分语言特性），添加了一个特殊**指令**，关闭时 ES5 的大部分修改不会生效，开启后则会激活这些新的特性。
使用时，我们需要注意：

- 确保 “ use strict ” 出现在脚本最顶部（其实也可以放在函数体内部的开头，但一般不这么做）
- 没有类似于 "no use strict" 这样的指令可以使程序返回默认模式：一旦进入了严格模式，就没有回头路了。
- 使用 DevTool 运行代码时，默认不会启用 “use strict”
- 在 ES6 及以后的版本中，JavaScript 引入了模块系统（import 和 export）。默认情况下，模块内部的代码会自动以严格模式运行，无需显式添加 use strict。
  ::: warning 我们应该使用 “use strict” 吗？
  MDN 参考：如果你想改变你的代码，让其工作在具有限制性 JavaScript 环境中，请参阅转换成严格模式：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode
:::
::: tip ESlint 与 use strict
ESLint 是静态代码分析工具，它在代码运行之前进行检查；而 use strict 是在代码运行时起作用，能捕获一些运行时才会出现的问题。例如，严格模式下对 this 值的处理更为严格，在某些情况下，只有在代码运行时才能发现 this 的使用是否符合严格模式的规则。除此之外，use strict 引入了一些 JavaScript 语言层面的特性改变，这些是 ESLint 无法通过规则完全模拟的，但是可以通过配置 ESlint 实现一部分的 use strict 功能
:::

## 变量

变量 是**数据的“命名存储”**。我们可以使用变量来保存各类信息，用 let 来声明变量（var 也可以，但是存在冒泡问题，后面会写一个小节来介绍它）

JavaScript 的变量命名有两个限制：

- 变量名称必须仅包含字母、数字、符号 $ 和 \_。
- 首字符必须非数字。
- 不要使用[保留字](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Keywords)

命名包括多个单词，通常采用驼峰式命名法（camelCase）嗯。就像括号里的英文词语一样。

## 常量

声明一个常数（不变）变量，可以使用 const 而非 let，它们不能被修改，如果你尝试修改就会发现报错，它的命名方式通常也采用驼峰式命名法（camelCase），但有的时候会采取大写命名。
::: details 我该什么时候使用大写命名常量
作为一个“常数”，意味着值永远不变。但是有些常量在执行之前就已知了（比如红色的十六进制值），还有些在执行期间被“计算”出来，但初始赋值之后就不会改变。
例如：

```Javascript
const pageLoadTime = /* 网页加载所需的时间 */;
```

pageLoadTime 的值在页面加载之前是未知的，所以采用常规命名。但是它仍然是个常量，因为赋值之后不会改变。

换句话说，大写命名的常量仅用作“硬编码（hard-coded）”值的别名。
:::

## 良好的命名方式

一些可以遵循的规则：

- 使用易读的命名，比如 userName 或者 shoppingCart。
- 离诸如 a、b、c 这种缩写和短名称远一点，除非你真的知道你在干什么。
- 变量名在能够准确描述变量的同时要足够简洁。不好的例子就是 data 和 value，这样的名称等于什么都没说。如果能够非常明显地从上下文知道数据和值所表达的含义，这样使用它们也是可以的。
- 脑海中的术语要和团队保持一致。如果网站的访客称为“用户”，则我们采用相关的变量命名，比如 currentUser 或者 newUser，而不要使用 currentVisitor 或者一个 newManInTown。
  ::: tip 重用还是新建？
  额外声明一个变量绝对是利大于弊的。

现代的 JavaScript 压缩器和浏览器都能够很好地对代码进行优化，所以不会产生性能问题。为不同的值使用不同的变量可以帮助引擎对代码进行优化。
:::

## 数据类型

JavaScript 的值都具有特定的类型：有 8 种基本的数据类型（7 种原始类型和 1 种引用类型）:

- 7 种原始数据类型（基本数据类型）：
  - number 用于任何类型的数字：整数或浮点数，在 ±(253-1) 范围内的整数，还包括所谓的“特殊数值（“special numeric values”）”也属于这种类型：Infinity、-Infinity 和 NaN
    - NaN 代表一个计算错误。它是一个不正确的或者一个未定义的数学操作所得到的结果
    - Infinity 代表数学概念中的 无穷大 ∞。是一个比任何数字都大的特殊值，可以用 1/0 得到。
  - bigint 用于任意长度的整数。
    - 可以通过将 n 附加到整数字段的末尾来创建 BigInt 值。
    - 是比较新的一种类型，我现在其实基本上没有接触到要使用它的场景
  - string 用于字符串：一个字符串可以包含 0 个或多个字符，所以没有单独的单字符类型。
    - 有三种包含字符串的方式：双引号、单引号、反引号
    - 其中反引号是 `功能扩展` 引号。它们允许我们通过将变量和表达式包装在`${…}`中，来将它们嵌入到字符串中。
  - boolean 用于表示 true 和 false
  - null 用于未知的值 —— 只有一个 null 值的独立类型
    - 不是一个“对不存在的 object 的引用”或者 “null 指针”。JavaScript 中的 null 仅仅是一个代表`“无”、“空”或“值未知”`的特殊值。
  - undefined 用于未定义的值 —— 只有一个 undefined 值的独立类型。
    - undefined 的含义是 `未被赋值`。
  - symbol 用于唯一的标识符。
- 以及 1 种非原始数据类型（复杂数据类型）：
  - object 用于更复杂的数据结构。

当我们想要分别处理不同类型值的时候，或者想快速进行数据类型检验时，就可以使用 `typeof` ，它是一个`运算符`，能够以`字符串`的形式来返回参数的类型：

```javascript
typeof x;
// or
typeof x;
```

::: details typeof 的特殊情况

- Math 是一个提供数学运算的内建 object。
- typeof null 的结果为 "object"。这是官方承认的 typeof 的错误，这个问题来自于 JavaScript 语言的早期阶段，并为了兼容性而保留了下来。null 绝对不是一个 object。null 有自己的类型，它是一个特殊值。typeof 的行为在这里是错误的。
- typeof alert 的结果是 "function"，因为 alert 在 JavaScript 语言中是一个函数。但是在 JavaScript 语言中没有一个特别的 “function” 类型。函数隶属于 object 类型。但是 typeof 会对函数区分对待，并返回 "function"。这也是来自于 JavaScript 语言早期的问题。从技术上讲，这种行为是不正确的，但在实际编程中却非常方便。
  :::
  ::: tip “动态类型”
  JavaScript 是个弱类型语言，它允许将任何类型的值存入变量，例如，一个变量可以在前一刻是个字符串，下一刻就存储一个数字，也就是说：

**定义的变量并不会在定义后，被限制为某一数据类型**

Typescript 则解决了这一点。
:::
::: details null 和 undefined 的使用场景

#### null

null 是一个原始值，表示有意为之的 “空值” 或 “无对象”。它通常是开发者主动将变量赋值为 null，用来明确表示这个变量不指向任何对象。

- **初始化变量**：当你需要一个变量在开始时不引用任何对象，后续可能会被赋值为一个有效的对象时，可以将其初始化为 null。
- **清空对象引用**：当你想要释放一个对象占用的内存，并且明确表示该变量不再指向任何对象时，可以将其赋值为 null。这样，JavaScript 的垃圾回收机制可以更有效地回收该对象所占用的内存。
- **函数返回值**：当函数没有合适的对象可以返回时，可以返回 null 来表示这种情况。

#### undefined

undefined 表示变量已声明但未赋值，或者函数没有返回值，又或者函数调用时缺少实参。它代表一种 “未定义” 的状态。

- **变量声明但未赋值**：当你声明一个变量但没有为其赋值时，该变量的默认值就是 undefined。
- **函数缺少返回值**：如果函数没有使用 return 语句返回值，那么函数的返回值就是 undefined。
- **函数调用时缺少实参**：当调用函数时，如果没有提供某个参数，那么该参数的值就是 undefined。
  :::

## 基本类型的转换

这里不包括对于对象类型的转换。类型转换的场景一般是我们主动的需要某个类型的值或者是在某些函数或者表达式中，类型会自动进行转换。

### 字符串转换

可以显式地调用 String(value) 来将 value 转换为字符串类型：

```javascript
let value = true;
value = String(value); // 现在，值是一个字符串形式的 "true"
alert(typeof value); // string
```

其他的还有 false 变成 "false"，null 变成 "null" 等。

### 数字转换

在算术函数/表达式中会进行自动的 number 类型转换，例如：

```javascript
alert("6" / "2"); // 3, string 类型的值被自动转换成 number 类型后进行计算
```

也可以使用 Number(value) 显式地将 value 转换为 number 类型

```javascript
let str = "123";
let num = Number(str); // 变成 number 类型 123

let age = Number("an arbitrary string instead of a number");
alert(age); // NaN，转换失败

let age = undefined;
Number(age); // 变成NaN

let age = null;
Number(age); // 变为0

let age = true;
Number(age); // 变为1

let age = false;
Number(age); // 变为0
```

::: details 对 string 类型的值进行数字转换会发生什么？
去掉首尾空白字符（空格、换行符 \n、制表符 \t 等）后的纯数字字符串中含有的数字。如果剩余字符串为空，则转换结果为 0。否则，将会从剩余字符串中“读取”数字。当类型转换出现 error 时返回 NaN。
:::

### 布尔类型的转换

转换规则如下：

- 直观上为“空”的值（如 0、空字符串、null、undefined 和 NaN）将变为 false。
- 其他值变成 true。
  e.g:

```javascript
alert(Boolean(1)); // true
alert(Boolean(0)); // false

alert(Boolean("hello")); // true
alert(Boolean("")); // false
```

::: warning 字符串 "0" 是 true
一些编程语言（比如 PHP）视 "0" 为 false。但在 JavaScript 中，非空的字符串总是 true。
:::

上述的三种类型转换是比较常用的类型转换，至于对象类型的转换，我们之后再讨论。

## 运算符和运算

其实运算都是那回事，不过不同的语言有不同的特性。

### 术语

在正式开始前，我们先简单浏览一下常用术语。

- 运算元 —— 运算符应用的对象。比如说乘法运算 5 \* 2，有两个运算元：左运算元 5 和右运算元 2。有时候人们也称其为“参数”而不是“运算元”。
- 如果一个运算符对应的只有一个运算元，那么它是 一元运算符。比如说一元负号运算符（unary negation）-，它的作用是对数字进行正负转换：

```javascript
let x = 1;

x = -x;
alert(x); // -1，一元负号运算符生效
```

如果一个运算符拥有两个运算元，那么它是 二元运算符。减号还存在二元运算符形式：

```javascript
let x = 1,
  y = 3;
alert(y - x); // 2，二元运算符减号做减运算
```

严格地说，在上面的示例中，我们使用一个相同的符号表征了两个不同的运算符：负号运算符，即反转符号的一元运算符，减法运算符，是从另一个数减去一个数的二元运算符。

### 支持的数学运算

- 加法 `+`
- 减法 `-`
- 乘法 `*`
- 除法 `/`
- 取余 `%`
- 求幂 `**`

前面五个在学习 C 语言时已经学习过了，我们只需要讨论一下乘幂：

求幂运算 a \*\* b 将 a 提升至 a 的 b 次幂，在数学运算中我们将其表示为 a^b，e.g:

```javascript
alert(2 ** 2); // 2² = 4
alert(2 ** 3); // 2³ = 8
alert(2 ** 4); // 2⁴ = 16
alert(4 ** (1 / 2)); // 2（1/2 次方与平方根相同)
alert(8 ** (1 / 3)); // 2（1/3 次方与立方根相同)
```

### 二元运算

来看一些学校算术未涉及的 JavaScript 运算符的特性：

加号 + 被应用于字符串，它将合并（连接）各个字符串：

```javascript
let s = "my" + "string";
alert(s); // mystring
```

::: warning
只要任意一个运算元是字符串，那么另一个运算元也将被转化为字符串,e.g:

```javascript
alert("1" + 2); // "12"
alert(2 + "1"); // "21"
```

第一个运算元和第二个运算元，哪个是字符串并不重要。

下面是一个更复杂的例子：

```javascript
alert(2 + 2 + "1"); // "41"，不是 "221"
```

在这里，运算符是按顺序工作。第一个 + 将两个数字相加，所以返回 4，然后下一个 + 将字符串 1 加入其中，所以就是 4 + '1' = '41'。

```javascript
alert("1" + 2 + 2); // "122"，不是 "14"
```

这里，第一个操作数是一个字符串，所以编译器将其他两个操作数也视为了字符串。2 被与 '1' 连接到了一起，也就是像 '1' + 2 = "12" 然后 "12" + 2 = "122" 这样。
二元`+`是唯一一个以这种方式支持字符串的运算符。其他算术运算符只对数字起作用，并且总是将其运算元转换为数字。

**JavaScript，很神奇吧**
:::

### 一元运算

加号 + 有两种形式。一种是上面我们刚刚讨论的二元运算符，还有一种是一元运算符。

一元运算符加号，或者说，加号 + 应用于单个值，对数字没有任何作用。但是如果运算元不是数字，加号 + 则会将其转化为数字，**它的效果和 Number(...) 相同**

```javascript
// 对数字无效
let x = 1;
alert(+x); // 1

let y = -2;
alert(+y); // -2

// 转化非数字
alert(+true); // 1
alert(+""); // 0
```

还有一个取负，在数字前面加一个 - 就能实现。

### 运算符优先级

如果一个表达式拥有超过一个运算符，执行的顺序则由 优先级 决定。换句话说，所有的运算符中都隐含着优先级顺序。

具体的优先级表可以参见 Mozilla 的[优先级表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_precedence)

日常使用，只需要记住一元运算符的优先级比二元运算符更高即可，遇到特殊问题时我们可以再去查表。

### 赋值

赋值也是一种运算，它的优先级很低，所以我们看到的是计算先执行再赋值。

虽然 JavaScript Info 中提到了赋值运算的几种情况，但我不打算写在这里面，我们一般只需要写类似于下面这样的代码，就能满足大部分需求，并且能保证代码的清晰。

```javascript
let x = (···)
// or
x = (···)
```

有时候，多写几行代码比少写几行代码更能体现所谓 “技术力”。

我们经常需要对一个变量做运算，并将新的结果存储在同一个变量中，我们可以这么做：

```javascript
let n = 2;
n += 5; // 现在 n = 7（等同于 n = n + 5）
n *= 2; // 现在 n = 14（等同于 n = n * 2）

alert(n); // 14

//所有算术和位运算符都有简短的“修改并赋值”运算符：/= 和 -= 等。

// 这类运算符的优先级与普通赋值运算符的优先级相同，所以它们在大多数其他运算之后执行：
```

### 自运算

有时候，我们会直接对变量本身进行运算：

#### 自增 ++ 将变量与 1 相加

```javascript
let counter = 2;
counter++; // 和 counter = counter + 1 效果一样，但是更简洁
alert(counter); // 3
```

#### 自减 -- 将变量与 1 相减

```javascript
let counter = 2;
counter++; // 和 counter = counter + 1 效果一样，但是更简洁
alert(counter); // 3
```

运算符 ++ 和 -- 可以置于变量前，也可以置于变量后。

- 当运算符置于变量后，被称为“后置形式”：counter++。
- 当运算符置于变量前，被称为“前置形式”：++counter。

那么他们的区别呢？

- 如果自增/自减的值不会被使用，那么两者形式没有区别：

```javascript
let counter = 0;
counter++;
++counter;
alert(counter); // 2，以上两行作用相同
```

- 如果我们想要对变量进行自增操作，并且 需要立刻使用自增后的值，那么我们需要使用前置形式：

```javascript
let counter = 0;
alert(++counter); // 1
```

- 如果我们想要将一个数加一，但是我们想使用其自增之前的值，那么我们需要使用后置形式：

```javascript
let counter = 0;
alert(counter++); // 0
```

### 位运算

位运算符把运算元当做 32 位整数，并在它们的二进制表现形式上操作。

- 按位与 ( & )
- 按位或 ( | )
- 按位异或 ( ^ )
- 按位非 ( ~ )
- 左移 ( << )
- 右移 ( >> )
- 无符号右移 ( >>> )

目前来看，似乎要用到这些运算符的场景大部分是算法题。之后再写一篇文章来专门研究这几种运算符（我真的会记住吗 😭）

### 逗号运算符

逗号运算符 `,` 是最少见最不常使用的运算符之一,它的优先级也非常低，比赋值运算符还低。有时候它会被用来写更简短的代码。

逗号运算符能让我们处理多个表达式，使用 `,` 将它们分开。每个表达式都运行了，但是只有最后一个的结果会被返回，例如：

```javascript
let a = (1 + 2, 3 + 4);

alert(a); // 7（3 + 4 的结果）
```

为什么我们需要这样一个运算符，它只返回最后一个值呢？有时候，人们会使用它把几个行为放在一行上来进行复杂的运算：例如在 for 的第一行：

```javascript
// 一行上有三个运算符
for (a = 1, b = 3, c = a * b; a < 10; a++) {
 ...
}
```

## 值的比较

所有比较运算符均返回布尔值：

- `true` —— 表示“yes（是）”，“correct（正确）”或“the truth（真）”。
- `false` —— 表示“no（否）”，“wrong（错误）”或“not the truth（非真）”。
  例如：

```javascript
alert(2 > 1); // true（正确）
alert(2 == 1); // false（错误）
alert(2 != 1); // true（正确）
let result = 5 > 4; // 把比较的结果赋值给 result
alert(result); // true
```

### 比较字符串时···

在比较字符串的大小时，JavaScript 会使用“字典（dictionary）”或“词典（lexicographical）”顺序进行判定。换言之，字符串是按字符（母）逐个进行比较的。
例如：

```javascript
alert("Z" > "A"); // true
alert("Glow" > "Glee"); // true
alert("Bee" > "Be"); // true
```

::: tip 字符串的比较算法

- 首先比较两个字符串的首位字符大小。
- 如果一方字符较大（或较小），则该字符串大于（或小于）另一个字符串。算法结束。
- 否则，如果两个字符串的首位字符相等，则继续取出两个字符串各自的后一位字符进行比较。
- 重复上述步骤进行比较，直到比较完成某字符串的所有字符为止。
- 如果两个字符串的字符同时用完，那么则判定它们相等，否则未结束（还有未比较的字符）的字符串更大。
- 比较是基于 **Unicode 编码顺序** 的
  :::

### 不同类型如何比较？

当对不同类型的值进行比较时，JavaScript 会首先将其转化为数字（number）再判定大小。例如：

```javascript
alert("2" > 1); // true，字符串 '2' 会被转化为数字 2
alert("01" == 1); // true，字符串 '01' 会被转化为数字 1

// 对于布尔类型值，true 会被转化为 1、false 转化为 0。
alert(true == 1); // true
alert(false == 0); // true
```

### `==` 与 `===`

在比较不同类型的值时，处于相等判断符号 == 两侧的值会先被转化为数字。空字符串和 false 也是如此，转化后它们都为数字 0。

如果我们需要区分 0 和 false，该怎么办？严格相等运算符 === 在进行比较时不会做任何的类型转换。如果 a 和 b 属于不同的数据类型，那么 a === b 不会做任何的类型转换而立刻返回 false。

同样的，与“不相等”符号 != 类似，“严格不相等”表示为 !==。

### undefined 和 null

当使用 null 或 undefined 与其他值进行比较时，其返回结果常常出乎你的意料。

当使用严格相等 === 比较二者时
它们不相等，因为它们属于不同的类型。

```javascript
alert(null === undefined); // false
```

当使用非严格相等 == 比较二者时
JavaScript 存在一个特殊的规则，会判定它们相等。它们俩就像“一对恋人”，仅仅等于对方而不等于其他任何的值（只在非严格相等下成立）。

```javascript
alert(null == undefined); // true
```

当使用数学式或其他比较方法 < > <= >= 时：
null/undefined 会被转化为数字：null 被转化为 0，undefined 被转化为 NaN。
::: warning 特殊情况

#### 奇怪的结果：null vs 0

通过比较 null 和 0 可得：

```javascript
alert(null > 0); // (1) false
alert(null == 0); // (2) false
alert(null >= 0); // (3) true
```

上面的结果完全打破了你对数学的认识。在最后一行代码显示“null 大于等于 0”的情况下，前两行代码中一定会有一个是正确的，然而事实表明它们的结果都是 false。

为什么会出现这种反常结果，这是因为相等性检查 == 和普通比较符 > < >= <= 的代码逻辑是相互独立的。进行值的比较时，null 会被转化为数字，因此它被转化为了 0。这就是为什么（3）中 null >= 0 返回值是 true，（1）中 null > 0 返回值是 false。

另一方面，undefined 和 null 在相等性检查 == 中不会进行任何的类型转换，它们有自己独立的比较规则，所以除了它们之间互等外，不会等于任何其他的值。这就解释了为什么（2）中 null == 0 会返回 false。

#### 特立独行的 undefined

undefined 不应该被与其他值进行比较：

```javascript
alert(undefined > 0); // false (1)
alert(undefined < 0); // false (2)
alert(undefined == 0); // false (3)
```

返回值都是 false，原因如下：

(1) 和 (2) 都返回 false 是因为 undefined 在比较中被转换为了 NaN，而 NaN 是一个特殊的数值型值，它与任何值进行比较都会返回 false。
(3) 返回 false 是因为这是一个相等性检查，而 undefined 只与 null 相等，不会与其他值相等。
:::

## if 和 “？”

if 和 “？”其实在 C 语言中已经学过了，这里就不写那么详细了。

需要注意的是的是 “？” 的非常规使用：

有时有人会使用问号 ? 来代替 if 语句：

```javascript
let company = prompt("Which company created JavaScript?", "");

company == "Netscape" ? alert("Right!") : alert("Wrong.");
```

::: warning
在这里我们不是把结果赋值给变量。而是根据条件执行不同的代码。

**不建议这样使用问号运算符。**
:::

## 逻辑运算符

JavaScript 中有四个逻辑运算符：||（或），&&（与），!（非），??（空值合并运算符），下面依次介绍：

### ||

```javascript
alert(true || true); // true
alert(false || true); // true
alert(true || false); // true
alert(false || false); // false
```

除了两个操作数都是 false 的情况，结果都是 true。如果操作数不是布尔值，那么它将会被转化为布尔值来参与运算。
::: tip 或运算寻找第一个真值
下面让我们看看 JavaScript 的“附加”特性。给定多个参与或运算的值：

```javascript
result = value1 || value2 || value3;
```

或运算符 || 做了如下的事情：

- 从左到右依次计算操作数。
- 处理每一个操作数时，都将其转化为布尔值。如果结果是 true，就停止计算，返回这个操作数的初始值。
- 如果所有的操作数都被计算过（也就是，转换结果都是 false），则返回最后一个操作数。

我们可以用来：

- 获取变量列表或者表达式中的第一个真值。
- 短路求值（Short-circuit evaluation），这指的是，|| 对其参数进行处理，直到达到第一个真值，然后立即返回该值，而无需处理其他参数。
  :::

### &&

和 || 相似，只不过它表示与运算。类似的我们可以用它来寻找第一个假肢值，但是需要注意的是：**与运算 && 的优先级比或运算 || 要高。**，也**不要尝试用 || 或 && 来取代 if**

### ！

感叹符号 `!` 表示布尔非运算符。逻辑非运算符接受一个参数，并按如下运作：

- 将操作数转化为布尔类型：true/false。
- 返回相反的值。

两个非运算 !! 有时候用来将某个值转化为布尔类型：

```javascript
alert(!!"non-empty string"); // true
alert(!!null); // false
```

也就是，第一个非运算将该值转化为布尔类型并取反，第二个非运算再次取反。最后我们就得到了一个任意值到布尔值的转化。

有一个方式也可以实现同样的效果 —— 一个内建的 Boolean 函数：

```javascript
alert(Boolean("non-empty string")); // true
alert(Boolean(null)); // false
```

### ??

空值合并运算符（nullish coalescing operator）的写法为两个问号 `??`。为简洁起见，当一个值既不是 null 也不是 undefined 时，我们将其称为“已定义的（defined）”。

a ?? b 的结果是：

- 如果 a 是已定义的，则结果为 a，
- 如果 a 不是已定义的，则结果为 b。

换句话说，如果第一个参数不是 null/undefined，则 ?? 返回第一个参数。否则，返回第二个参数。它只是一种获得两者中的第一个“已定义的”值的不错的语法。

?? 的常见使用场景是提供默认值。e.g:

```javascript
let user;
alert(user ?? "匿名"); // 匿名（user 未定义）

let user = "John";
alert(user ?? "匿名"); // John（user 已定义）
```

还可以使用 ?? 序列从一系列的值中选择出第一个非 null/undefined 的值。e.g:

```javascript
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// 显示第一个已定义的值：
alert(firstName ?? lastName ?? nickName ?? "匿名"); // Supercoder
```

::: tip

- || 返回第一个 **真** 值。
- ?? 返回第一个 **已定义的** 值。
  :::
  ::: warning
  出于安全原因，JavaScript 禁止将 ?? 运算符与 && 和 || 运算符一起使用，除非使用括号明确指定了优先级。这个限制无疑是值得商榷的，它被添加到语言规范中是为了避免人们从 || 切换到 ?? 时的编程错误。

可以明确地使用括号来解决这个问题：

```javascript
let x = (1 && 2) ?? 3; // 正常工作了
alert(x); // 2
```

:::

## 基础的循环

涵盖基础的循环：while，do..while 和 for(..; ..; ..)。

- 用于遍历对象属性的 for..in 循环请见后文的 `for…in`。
- 用于遍历数组和可迭代对象的循环分别请见后文的`for…of` 和 `iterables`

额但是基础的循环不太想写，各个语言之间这个都大差不差，哎呀不写了反正是自己看。

## "switch" 语句

switch 语句可以替代多个 if 判断。它为多分支选择的情况提供了一个更具描述性的方式。

switch 语句有至少一个 case 代码块和一个可选的 default 代码块。e.g:

```javascript
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}

// 比较 x 值与第一个 case（也就是 value1）是否严格相等，然后比较第二个 case（value2）以此类推。
// 如果相等，switch 语句就执行相应 case 下的代码块，直到遇到最靠近的 break 语句（或者直到 switch 语句末尾）。
// 如果没有符合的 case，则执行 default 代码块（如果 default 存在）。
// 如果没有 break，程序将**不经过任何检查**就会继续执行下一个 case。
```

**注意：**

- switch 和 case 都允许任意表达式
- 共享同一段代码的几个 case 分支可以被分为一组
- case 的相等是严格相等。被比较的值必须是相同的类型才能进行匹配。

## 函数

函数是程序的主要“构建模块”。函数使该段代码可以被调用很多次，而不需要写重复的代码。

使用 `函数声明` 创建函数。`function` 关键字首先出现，然后是 `函数名`，然后是括号之间的 `参数` 列表，最后是花括号之间的代码（即“函数体”）。e.g:

```javascript
function name(parameter1, parameter2, ... parameterN) {
  ...body...
}
```

::: tip 变量作用域
这一部分会在后面再详细介绍。

- 使用 let 在函数中声明的变量只在该函数内部可见。
- 函数可以访问外部变量，函数对外部变量拥有全部的访问权限。函数也可以修改外部变量。例如

```javascript
let userName = "John";
function showMessage() {
  let message = "Hello, " + userName;
  alert(message);
}
showMessage(); // Hello, John
```

- 如果在函数内部声明了同名变量，那么函数会 `遮蔽` 外部变量。

::: warning 注意
任何函数之外声明的变量，例如上述代码中的外部变量 userName，都被称为 全局 变量。

全局变量在任意函数中都是可见的（除非被局部变量遮蔽）。

减少全局变量的使用是一种很好的做法。现代的代码有很少甚至没有全局变量。大多数变量存在于它们的函数中。但是有时候，全局变量能够用于存储项目级别的数据。
:::

### 参数

可以通过参数将任意数据传递给函数。在如下示例中，函数有两个参数：from 和 text。

```javascript
function showMessage(from, text) {
  // 参数：from 和 text
  alert(from + ": " + text);
}

showMessage("Ann", "Hello!"); // Ann: Hello! (*)
showMessage("Ann", "What's up?"); // Ann: What's up? (**)
```

当函数在 `(*)` 和 `(**)` 行中被调用时，给定值**被复制**到了局部变量 from 和 text。然后函数使用它们进行计算。**函数修改的是复制的变量值副本**：

```javascript
function showMessage(from, text) {
  from = "*" + from + "*"; // 让 "from" 看起来更优雅
  alert(from + ": " + text);
}
let from = "Ann";
showMessage(from, "Hello"); // *Ann*: Hello
// "from" 值相同，函数修改了一个局部的副本。
alert(from); // Ann
```

::: tip parameter 和 argument
当一个值被作为函数参数（parameter）传递时，它也被称为 参数（argument）。

- 参数（parameter）是函数声明中括号内列出的变量（它是函数声明时的术语）。
- 参数（argument）是调用函数时传递给函数的值（它是函数调用时的术语）。

我们声明函数时列出它们的参数（parameters），然后调用它们传递参数（arguments）
:::

### 默认值

如果一个函数被调用，但有参数（argument）未被提供，那么相应的值就会变成 undefined。我们可以使用 = 为函数声明中的参数指定所谓的“默认”（如果对应参数的值未被传递则使用）值：

```javascript
function showMessage(from, text = "no text given") {
  alert(from + ": " + text);
}
showMessage("Ann"); // Ann: no text given

// 这里 "no text given" 是一个字符串，但它可以是更复杂的表达式，并且只会在缺少参数时才会被计算和分配。所以，这也是可能的：

function showMessage(from, text = anotherFunction()) {
  // anotherFunction() 仅在没有给定 text 时执行
  // 其运行结果将成为 text 的值
}
```

有些时候，将参数默认值的设置放在函数执行（相较更后期）而不是函数声明时，也行得通。可以使用：

- `if` 语句
- `||` 运算符
- `??` 运算符,它在大多数假值（例如 0）应该被视为“正常值”时更具优势

### 返回值

函数可以将一个值返回到调用代码中作为结果。指令 return 可以在函数的任意位置。当执行到达时，函数停止，并将值返回给调用代码；只使用 return 但没有返回值也是可行的。但这会导致函数立即退出。**注意：空值的 return 或没有 return 的函数返回值为 undefined**，**不要在 return 与返回值之间添加新行**

### 关于函数命名

函数就是行为（action）。所以它们的名字通常是动词。它应该简短且尽可能准确地描述函数的作用。这样读代码的人就能清楚地知道这个函数的功能。

一种普遍的做法是用动词前缀来开始一个函数，这个前缀模糊地描述了这个行为。团队内部必须就前缀的含义达成一致。例如

- "get…" —— 返回一个值，
- "calc…" —— 计算某些内容，
- "create…" —— 创建某些内容，
- "check…" —— 检查某些内容并返回 boolean 值，等。

::: tip 函数的各司其职
一个函数应该只包含函数名所指定的功能，而不是做更多与函数名无关的功能。我们如果能通过函数名（isPrime）就可以看出函数的行为，而不需要通过代码，那么通常把这样的代码称为 `自描述`。
:::

## 函数表达式

在 JavaScript 中，函数不是“神奇的语言结构”，而是一种**特殊的值**。我们在上一个小节使用的语法称为 `函数声明`，另一种创建函数的语法称为 `函数表达式`。它允许我们在任何表达式的中间创建一个新函数。代码如下：

```javascript
// 函数声明
function sayHi() {
  alert("Hello");
}

// 函数表达式 ，记住函数是一种特殊的值
let sayHi = function () {
  alert("Hello");
};
```

注意，function 关键字后面没有函数名。函数表达式允许省略函数名。
，这里我们立即将它赋值给变量，所以上面的两个代码示例的含义是一样的：**“创建一个函数并将其放入变量 sayHi 中”。**

在某些编程语言中，只要提到函数的名称都会导致函数的调用执行，但 JavaScript 可不是这样。在 JavaScript 中，函数是一个值，所以我们可以把它当成值对待。我们可以复制函数到其他变量：

```javascript
function sayHi() {
  // (1) 创建
  alert("Hello");
}
let func = sayHi; // (2) 复制
func(); // Hello     // (3) 运行复制的值（正常运行）！
sayHi(); // Hello    //     这里也能运行（为什么不行呢）
```

解释一下上段代码发生的细节：

- (1) 行声明创建了函数，并把它放入到变量 sayHi。
- (2) 行将 sayHi 复制到了变量 func。请注意：sayHi 后面没有括号。如果有括号，func = sayHi() 会把 sayHi() 的调用结果写进 func，而不是 sayHi 函数 本身。
- 现在函数可以通过 sayHi() 和 func() 两种方式进行调用。

嘻嘻，JavaScript 很神奇吧。

### 回调函数

我们来看看相关应用：
让我们多举几个例子，看看如何将函数作为值来传递以及如何使用函数表达式。

我们写一个包含三个参数的函数 ask(question, yes, no)：

- question 关于问题的文本
- yes 当回答为 “Yes” 时，要运行的脚本
- no 当回答为 “No” 时，要运行的脚本

函数需要提出 question（问题），并根据用户的回答，调用 yes() 或 no()：

```javascript
function ask(question, yes, no) {
  if (confirm(question)) yes();
  else no();
}
function showOk() {
  alert("You agreed.");
}
function showCancel() {
  alert("You canceled the execution.");
}
// 用法：函数 showOk 和 showCancel 被作为参数传入到 ask
ask("Do you agree?", showOk, showCancel);
```

ask 的两个参数值 showOk 和 showCancel 被称为 `回调函数` 或简称 `回调`。主要思想是我们传递一个函数，并期望在稍后必要时将其“回调”。在我们的例子中，showOk 是回答 “yes” 的回调，showCancel 是回答 “no” 的回调。

我们可以使用函数表达式来编写一个等价的、更简洁的函数：

```javascript
function ask(question, yes, no) {
  if (confirm(question)) yes();
  else no();
}

ask(
  "Do you agree?",
  function () {
    alert("You agreed.");
  },
  function () {
    alert("You canceled the execution.");
  }
);
```

这里直接在 ask(...) 调用内进行函数声明。这两个函数没有名字，所以叫 `匿名函数`。这样的函数在 ask 外无法访问（因为没有对它们分配变量），不过这正是我们想要的。

这样的代码在我们的脚本中非常常见，这正符合 JavaScript 语言的思想。
::: tip JavaScript 引擎会在什么时候创建函数？
**函数表达式是在代码执行到达时被创建，并且仅从那一刻起可用**

一旦代码执行到赋值表达式 let sum = function… 的右侧，此时就会开始创建该函数，并且可以从现在开始使用（分配，调用等）。

**在函数声明被定义之前，它就可以被调用**

例如，一个全局函数声明对整个脚本来说都是可见的，无论它被写在这个脚本的哪个位置。这是内部算法的缘故。当 JavaScript 准备 运行脚本时，首先会在脚本中寻找全局函数声明，并创建这些函数。我们可以将其视为“初始化阶段”。
:::
::: tip 函数声明的作用域
函数声明的另外一个特殊的功能是它的块级作用域。严格模式下，当一个函数声明在一个代码块内时，它在该代码块内的任何位置都是可见的。但在代码块外不可见。

如果使用函数表达式且正确赋值那么就能够在块级作用域外运行。
:::
::: tip 什么时候选择函数声明与函数表达式？
根据经验，当我们需要声明一个函数时，首先考虑函数声明语法。它能够为组织代码提供更多的灵活性。因为我们可以在声明这些函数之前调用这些函数。

这对代码可读性也更好，因为在代码中查找 function f(…) {…} 比 let f = function(…) {…} 更容易。函数声明更“醒目”。

……但是，如果由于某种原因而导致函数声明不适合我们（我们刚刚看过上面的例子），那么应该使用函数表达式。
:::

## 使用箭头函数创建函数

创建函数还有另外一种非常简单的语法，并且这种方法通常比函数表达式更好。它被称为“箭头函数”，因为它看起来像这样：

```javascript
let func = (arg1, arg2, ..., argN) => expression;
```

这里创建了一个函数 func，它接受参数 arg1..argN，然后使用参数对右侧的 expression 求值并返回其结果。它是下面这段代码的更短的版本：

```javascript
let func = function(arg1, arg2, ..., argN) {
  return expression;
};
// 具体的例子如：
let sum = (a, b) => a + b;
alert( sum(1, 2) ); // 3
```

对于箭头函数的参数说明：

- 如果我们只有一个参数，还可以省略掉参数外的圆括号，使代码更短。
- 如果没有参数，括号则是空的（但括号必须保留）

箭头函数对于简单的单行行为（action）来说非常方便。那么对于多行的箭头函数：我们可以使用花括号将它们括起来。主要区别在于，用花括号括起来之后，需要包含 return 才能返回值（就像常规函数一样）。belike：

```javascript
let sum = (a, b) => {
  // 花括号表示开始一个多行函数
  let result = a + b;
  return result; // 如果我们使用了花括号，那么我们需要一个显式的 “return”
};
alert(sum(1, 2)); // 3
```

在基础部分，我们简单认识了一下箭头函数，但是它还有很多有趣的特性，我们在后面的深入理解箭头函数再继续研究它。

## 总结

见[JavaScript Info JavaScript 特性](https://zh.javascript.info/javascript-specials)

## Task

这里记录一些比较有意思的小 Task。

### T1 运算符和运算

下面这些表达式的结果是什么？

```javascript
"" + 1 + 0 // "10"
⭐ "" - 1 + 0 // -1
true + false // 1
6 / "3" // 2
"2" * "3" // 6
4 + 5 + "px" // "9px"
"$" + 4 + 5 // "$45"
"4" - 2 // "2"
"4px" - 2 // NaN
⭐ "  -9  " + 5 // "-9 5"
"  -9  " - 5 // "-14"
null + 1 // 1
⭐ undefined + 1 // NaN
⭐ " \t \n" - 2 // -2
```

::: tip

- 有字符串的加法 "" + 1，首先会将数字 1 转换为一个字符串："" + 1 = "1"，然后我们得到 "1" + 0，再次应用同样的规则得到最终的结果。
- 减法 -（像大多数数学运算一样）只能用于数字，它会使空字符串 "" 转换为 0。
- 带字符串的加法会将数字 5 加到字符串之后。
- 减法始终将字符串转换为数字，因此它会使 " -9 " 转换为数字 -9（忽略了字符串首尾的空格）。
- null 经过数字转换之后会变为 0。
- undefined 经过数字转换之后会变为 NaN。
- 字符串转换为数字时，会忽略字符串的首尾处的空格字符。在这里，整个字符串由空格字符组成，包括 \t、\n 以及它们之间的“常规”空格。因此，类似于空字符串，所以会变为 0。
  :::
