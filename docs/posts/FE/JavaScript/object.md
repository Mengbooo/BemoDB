---
title: Object（对象）
date: '2025-06-07'
tags:
- FE
---

# Object（对象）

我们在 数据类型 一章学到的，JavaScript 中有八种数据类型。有七种原始类型，因为它们的值只包含一种东西（字符串，数字或者其他），它们不能再被原子化。

对象则用来存储键值对和更复杂的实体。在 JavaScript 中，对象几乎渗透到了这门编程语言的方方面面。所以，在我们深入理解这门语言之前，必须先理解对象。

## 基础

我们可以用下面两种语法中的任一种来创建一个空的对象

```javascript
let user = new Object(); // “构造函数” 的语法
let user = {}; // “字面量” 的语法
```

通常用字面量的语法来创建对象，可以在创建对象的时候，立即将一些属性以键值对的形式放到 {...} 中。

```javascript
let user = {
  // 一个对象,包含两个属性
  name: "John", // 键 "name"，值 "John"
  age: 30, // 键 "age"，值 30
};
```

- 访问属性：可以使用点符号访问属性值 belike：`user.name`
- 声明属性：可以直接在字面量里声明，也可以像`user.isAdmin = true;`这样来声明或者修改 user 对象里的键
- 移除属性：可以用 delete 操作符移除属性`delete user.age;`
- 使用多字词语作为属性名：可以用多字词语来作为属性名，但**必须给它们加上引号**belike：`"likes birds": true`
  ::: tip 一个代码规范
  列表中的最后一个属性应以逗号结尾：

```javascript
let user = {
  name: "John",
  age: 30,
};
```

这叫做尾随（trailing）或悬挂（hanging）逗号。这样便于我们添加、删除和移动属性，因为所有的行都是相似的。
:::

::: warning 方括号的使用
对于多词属性，点操作就不能用了，点符号要求 key 是有效的变量标识符。这意味着：不包含空格，不以数字开头，也不包含特殊字符（允许使用 $ 和 \_）。需要使用方括号 belike：

```javascript
user["likes birds"] = true;
```

方括号同样提供了一种可以通过任意表达式来获取属性名的方式 belike：

```javascript
let user = {
  name: "John",
  age: 30,
};

let key = prompt("What do you want to know about the user?", "name");

// 访问变量
alert(user[key]); // John（如果输入 "name"）
```

当创建一个对象时，我们可以在对象字面量中使用方括号。这叫做 `计算属性`。belike：

```javascript
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // 属性名是从 fruit 变量中得到的
};

alert(bag.apple); // 5 如果 fruit="apple"

// 本质上，这跟下面的语法效果相同：
let fruit = prompt("Which fruit to buy?", "apple");
let bag = {};

// 从 fruit 变量中获取值
bag[fruit] = 5;
```

可以在方括号中使用更复杂的表达式：

```javascript
let fruit = "apple";
let bag = {
  [fruit + "Computers"]: 5, // bag.appleComputers = 5
};
```

**大部分时间里，当属性名是已知且简单的时候，就使用点符号。如果我们需要一些更复杂的内容，那么就用方括号。**
:::

### 属性值的简写

在实际开发中，我们通常用已存在的变量当做属性名。belike：

```javascript
function makeUser(name, age) {
  return {
    name: name,
    age: age,
    // ……其他的属性
  };
}

let user = makeUser("John", 30);
alert(user.name); // John
```

在上面的例子中，属性名跟变量名一样。这种通过变量生成属性的应用场景很常见，在这有一种特殊的 `属性值缩写` 方法，使属性名变得更短。

```javascript
function makeUser(name, age) {
  return {
    name, // 与 name: name 相同
    age, // 与 age: age 相同
    // ...
  };
}
```

### 属性名称限制

变量名不能是编程语言的某个保留字，如 “for”、“let”、“return” 等……

但对象的属性名并不受此限制：

```javascript
// 这些属性都没问题
let obj = {
  for: 1,
  let: 2,
  return: 3,
};

alert(obj.for + obj.let + obj.return); // 6
```

**属性名可以是任何字符串或者 symbol**，其他类型会被自动地转换为字符串。当数字 0 被用作对象的属性的键时，会被转换为字符串 "0"，例如：

```javascript
let obj = {
  0: "test", // 等同于 "0": "test"
};

// 都会输出相同的属性（数字 0 被转为字符串 "0"）
alert(obj["0"]); // test
alert(obj[0]); // test (相同的属性)
```

::: danger 名为 **proto** 的属性
名为 **proto** 的属性。我们不能将它设置为一个非对象的值，后面我们会在原型继承里面讲一下它的特殊性质，然后给出如何解决这个问题的方法：

```javascript
let obj = {};
obj.__proto__ = 5; // 分配一个数字
alert(obj.__proto__); // [object Object] —— 值为对象，与预期结果不同
```

:::

### 属性存在性测试

JavaScript 的对象有一个需要注意的特性：能够被访问任何属性。即使属性不存在也不会报错！

读取不存在的属性只会得到 undefined。所以我们可以很容易地判断一个属性是否存在：

```javascript
let user = {};

alert(user.noSuchProperty === undefined); // true 意思是没有这个属性
```

另外，我们有一个检查属性是否存在的操作符 `in` ，例如：

```javascript
"key" in object;

let user = { name: "John", age: 30 };

alert("age" in user); // true，user.age 存在
alert("blabla" in user); // false，user.blabla 不存在。
```

::: warning
in 的左边必须是 属性名。通常是一个带引号的字符串。如果我们省略引号，就意味着左边是一个变量，它应该包含要判断的实际属性名。
:::

啊那有人就要问了：为何会有 in 运算符呢？与 undefined 进行比较来判断还不够吗？属性存在，但存储的值是 undefined 的时候，那么比较运算就失效了，但是这种情况很少发生，因为通常情况下不应该给对象赋值 undefined。我们通常会用 null 来表示未知的或者空的值。

### "for..in" 循环

为了遍历一个对象的所有键（key），可以使用一个特殊形式的循环：for..in。语法为：

```javascript
for (key in object) {
  // 对此对象属性中的每个键执行的代码
}

// 举个详细点的例子：

let user = {
  name: "John",
  age: 30,
  isAdmin: true,
};

for (let key in user) {
  // keys
  alert(key); // name, age, isAdmin
  // 属性键的值
  alert(user[key]); // John, 30, true
}
```

::: tip 对象的顺序
对象有顺序吗？换句话说，如果我们遍历一个对象，我们获取属性的顺序是和属性添加时的顺序相同吗？这靠谱吗？
简短的回答是：“有特别的顺序”：整数属性会被进行排序以升序排列。所以我们看到的是 1, 41, 44, 49，其他属性则按照创建的顺序显示。详情如下：

```javascript
let codes = {
  49: "Germany",
  41: "Switzerland",
  44: "Great Britain",
  // ..,
  1: "USA",
};

for (let code in codes) {
  alert(code); // 1, 41, 44, 49
}
```

所以，为了解决电话号码的问题，我们可以使用非整数属性名来 欺骗 程序。只需要给每个键名加一个加号 "+" 前缀就行了。

```javascript
let codes = {
  "+49": "Germany",
  "+41": "Switzerland",
  "+44": "Great Britain",
  // ..,
  "+1": "USA",
};

for (let code in codes) {
  alert(+code); // 49, 41, 44, 1
}
```

:::

## 对象引用和复制

对象与原始类型的根本区别之一是，对象是“通过引用”存储和复制的，而原始类型：字符串、数字、布尔值等 —— 总是“作为一个整体”复制。简单地说，对象是**引用类型**。

我们来看看复制值的时候会发生什么：

```javascript
let message = "Hello!";
let phrase = message;
```

我们就有了两个独立的变量，每个都存储着字符串 "Hello!"。但是，对象不是这样的，赋值了对象的变量存储的不是对象本身，而是该对象“在内存中的地址” —— 换句话说就是对该对象的“引用”。

```javascript
let user = { name: "John" };

let admin = user; // 复制引用
```

我们可以通过其中任意一个变量来访问该对象并修改它的内容：

```javascript
let user = { name: "John" };

let admin = user;

admin.name = "Pete"; // 通过 "admin" 引用来修改

alert(user.name); // 'Pete'，修改能通过 "user" 引用看到
```

### 对象间的比较

- 仅当两个对象为同一对象时，两者才相等。例如， a 和 b 两个变量都引用同一个对象，它们相等
- 而两个独立的对象则并不相等，即使它们看起来很像（都为空）：

```javascript
let a = {};
let b = {}; // 两个独立的对象

alert(a == b); // false
```

### 克隆与合并，Object.assign

拷贝一个对象变量会又创建一个对相同对象的引用。如果我们想要全新地复制一个对象，那该怎么做呢？

1. 可以创建一个新对象，通过遍历已有对象的属性，并在原始类型值的层面复制它们，以实现对已有对象结构的复制。

```javascript
let user = {
  name: "John",
  age: 30,
};
let clone = {}; // 新的空对象
// 将 user 中所有的属性拷贝到其中
for (let key in user) {
  clone[key] = user[key];
}
// 现在 clone 是带有相同内容的完全独立的对象
clone.name = "Pete"; // 改变了其中的数据
alert(user.name); // 原来的对象中的 name 属性依然是 John
```

2. 但是这样显得笨重，可以使用 `Object.assign` 方法来达成同样的效果，这就是所谓的`浅拷贝`（嵌套对象被通过引用进行拷贝）,除了复制对象，还能合并多个对象，但是需要注意的是：**如果被拷贝的属性的属性名已经存在，那么它会被覆盖**：

```javascript
Object.assign(dest, [src1, src2, src3...])

// - 第一个参数 dest 是指目标对象。
// - 更后面的参数 src1, ..., srcN（可按需传递多个参数）是源对象。
// - 该方法将所有源对象的属性拷贝到目标对象 dest 中。
//   换句话说，从第二个开始的所有参数的属性都被拷贝到第一个参数的对象中。
// - 调用结果返回 dest。
```

所以要进行一个简单克隆的时候，我们就可以这样做：

```javascript
let user = {
  name: "John",
  age: 30,
};

// 将 user 中的所有属性拷贝到了一个空对象中，并返回这个新的对象。
let clone = Object.assign({}, user);
```

3. Spread 语法也能实现克隆对象的功能，我们将会在后面的章节：Rest 和 Spread 中讲到

### 深层克隆

到现在为止，我们都假设 user 的所有属性均为原始类型。但属性可以是对其他对象的引用。比如：

```javascript
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50,
  },
};

alert(user.sizes.height); // 182
```

如果我们用上面的 `Object.assign` 的方法来克隆它，那么克隆出来的新对象和原来的 user 对象会共用一个 sizes，因为 user.sizes 是个对象，它会以引用形式被拷贝。

为了解决这个问题，并让 user 和 clone 成为两个真正独立的对象，我们应该使用一个拷贝循环来检查 user[key] 的每个值，如果它是一个对象，那么也复制它的结构。这就是所谓的`深拷贝`。我们可以使用递归来实现它，可以采用现有的实现，例如 `lodash` 库的 `_.cloneDeep(obj)`。
::: tip
可以参考：https://blog.csdn.net/cc18868876837/article/details/114918262
:::

::: tip 使用 const 声明的对象也是可以被修改的
通过引用对对象进行存储的一个重要的副作用是声明为 `const` 的对象 **可以** 被修改。

```javascript
const user = {
  name: "John",
};

user.name = "Pete"; // (*)

alert(user.name); // Pete
```

也就是说：user 的值是一个常量，它必须始终引用同一个对象，**但该对象的属性可以被自由修改**。换句话说，只有当我们尝试将 `user=...` 作为**一个整体**进行赋值时，`const user` 才会报错。

如果我们真的需要创建常量对象属性，也可以，但使用的是完全不同的方法。我们将在 `属性标志和属性描述符` 中学习它。
:::

## 简单理解垃圾回收机制

原始值、对象、函数……这一切都会占用内存。当我们不再需要某个东西时会发生什么？JavaScript 引擎如何发现它并清理它？这就要提到 JavaScript 的垃圾回收机制。

### 可达性（Reachability）

JavaScript 中主要的内存管理概念是 可达性。简而言之，“可达”值是那些以某种方式可访问或可用的值。它们被存储在内存中。

- 什么值不能被释放？
  - 当前执行的函数，它的局部变量和参数
  - 当前嵌套调用链上的其他函数、它们的局部变量和参数
  - 全局变量
  - （还有一些其他的，内部实现）

这些值被称作 `根（roots）`。

- 如果一个值可以从根通过引用或者引用链进行访问，则认为该值是可达的。比方说，如果全局变量中有一个对象，并且该对象有一个属性引用了另一个对象，则 `该` 对象被认为是可达的。而且它引用的内容也是可达的。

举个例子：

```javascript
// user 具有对这个对象的引用
let user = {
  name: "John",
};
```

全局变量 "user" 引用了对象 `{name："John"}`（为简洁起见，我们称它为 John）。John 的 "name" 属性存储一个原始值，所以它被写在对象内部。如果 user 的值被重写了，这个引用就没了：垃圾回收器会认为 John 是垃圾数据并进行回收，然后释放内存。

### 两个引用

如果我们把 user 的引用复制给 admin：

```javascript
// user 具有对这个对象的引用
let user = {
  name: "John",
};

let admin = user;
```

如果我们又去尝试重写 user 的值，对象**仍然可以被通过 admin 这个全局变量访问到，因此它必须被保留在内存中**。如果我们又重写了 admin，对象就会被删除。

### 对于相互关联的对象···

我们来看一个更为复杂的例子：

```javascript
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;

  return {
    father: man,
    mother: woman,
  };
}

let family = marry(
  {
    name: "John",
  },
  {
    name: "Ann",
  }
);

// 其实，得到的对象是：

family = {
  father: {
    name: "John",
    wife: "Ann",
  },
  mother: {
    name: "Ann",
    husband: "John",
  },
};
```

marry 函数通过让两个对象相互引用使它们“结婚”了，并返回了一个包含这两个对象的新对象。所有对象都是可达的。

如果我们去删除两个引用：

```javascript
delete family.father;
delete family.mother.husband;

// 那么对象会变成：

family = {
  mother: {
    name: "Ann",
  },
};
```

那么我们可以看到再也没有对 John 的引用了：对外引用不重要，只有传入引用才可以使对象可达。所以，John 现在是不可达的，并且将被从内存中删除，同时 John 的所有数据也将变得不可达。

### 几个对象相互引用但是没有外部引用

几个对象相互引用，但外部没有对其任意对象的引用，这些对象也可能是不可达的，并被从内存中删除。

```javascript
// 比如我们还是有这个对象

family = {
  father: {
    name: "John",
    wife: "Ann",
  },
  mother: {
    name: "Ann",
    husband: "John",
  },
};

// 现在我们修改 family 的值

family = null;
```

John 和 Ann 仍然连着，都有传入的引用。但是，这样还不够。

前面说的 "family" 对象已经不再与根相连，没有了外部对其的引用，所以它变成了一座“孤岛”，并且将被从内存中删除。

### 垃圾回收的基本算法

垃圾回收的基本算法被称为 “mark-and-sweep”。

定期执行以下“垃圾回收”步骤：

- 垃圾收集器找到所有的根，并“标记”（记住）它们。
- 然后它遍历并“标记”来自它们的所有引用。
- 然后它遍历标记的对象并标记 它们的 引用。所有被遍历到的对象都会被记- 住，以免将来再次遍历到同一个对象。
- ……如此操作，直到所有可达的（从根部）引用都被访问到。
- 没有被标记的对象都会被删除。

![markSweep](markSweep.png)

::: tip 基础算法之外···
JavaScript 引擎做了许多优化，使垃圾回收运行速度更快，并且不会对代码执行引入任何延迟。

- 分代收集（Generational collection）—— 对象被分成两组：“新的”和“旧的”。在典型的代码中，许多对象的生命周期都很短：它们出现、完成它们的工作并很快死去，因此在这种情况下跟踪新对象并将其从内存中清除是有意义的。那些长期存活的对象会变得“老旧”，并且被检查的频次也会降低。

- 增量收集（Incremental collection）—— 如果有许多对象，并且我们试图一次遍历并标记整个对象集，则可能需要一些时间，并在执行过程中带来明显的延迟。因此，引擎将现有的整个对象集拆分为多个部分，然后将这些部分逐一清除。这样就会有很多小型的垃圾收集，而不是一个大型的。这需要它们之间有额外的标记来追踪变化，但是这样会带来许多微小的延迟而不是一个大的延迟。

- 闲时收集（Idle-time collection）—— 垃圾收集器只会在 CPU 空闲时尝试运行，以减少可能对代码执行的影响。
  :::

当需要底层的优化时，对引擎有深入了解将很有帮助。在熟悉了这门编程语言之后，把熟悉引擎作为下一步计划是明智之选，届时，我们可能才会去深入理解垃圾回收机制。

## 对象方法 与 this 关键字

对象往往是现实世界的实体抽象，这其实就是所谓的 `面向对象编程`，简称为 “OOP”。我们对实体进行操作，那么对象中的操作，我们则用属性中的函数来表示。

### 创建方法

我们给出一个简单的例子：

```javascript
let user = {
  name: "John",
  age: 30,
};

user.sayHi = function () {
  alert("Hello!");
};

user.sayHi(); // Hello!
```

这里我们使用函数表达式创建了一个函数，并将其指定给对象的 user.sayHi 属性。作为对象属性的函数被称为 `方法`。

我们还可以怎么去声明一个对象方法：

- 使用预先声明的函数：

```javascript
let user = {
  // ...
};

// 首先，声明函数
function sayHi() {
  alert("Hello!");
}

// 然后将其作为一个方法添加
user.sayHi = sayHi;

user.sayHi(); // Hello!
```

- 简写

```javascript
user = {
  sayHi: function () {
    alert("Hello");
  },
};

// 方法简写看起来更好，对吧？
let user = {
  sayHi() {
    // 与 "sayHi: function(){...}" 一样
    alert("Hello");
  },
};
```

::: tip
这种表示法还是有些不同。在对象继承方面有一些细微的差别（稍后将会介绍），但目前它们并不重要。在几乎所有的情况下，更短的语法是首选的。
:::

### 关于 this

通常，对象方法需要访问对象中存储的信息才能完成其工作。例如，user.sayHi() 中的代码可能需要用到 user 的 name 属性。为了访问该对象，方法中可以使用 this 关键字。

```javascript
let user = {
  name: "John",
  age: 30,

  sayHi() {
    // "this" 指的是“当前的对象”
    alert(this.name);
  },
};

user.sayHi(); // John
```

::: warning
也可以在不使用 this 的情况下，通过外部变量名来引用 sayHi() 方法：

```javascript
let user = {
  name: "John",
  age: 30,

  sayHi() {
    alert(user.name); // "user" 替代 "this"
  },
};
```

但这样的代码是不可靠的。如果我们决定将 user 复制给另一个变量，例如 admin = user，并赋另外的值给 user，那么它将访问到错误的对象。比如：

```javascript
let user = {
  name: "John",
  age: 30,

  sayHi() {
    alert(user.name); // 导致错误
  },
};

let admin = user;
user = null; // 重写让其更明显

admin.sayHi(); // TypeError: Cannot read property 'name' of null
```

如果我们在 alert 中以 this.name 替换 user.name，那么代码就会正常运行。
:::

### this 不受限制

在 JavaScript 中，this 关键字与其他大多数编程语言中的不同。JavaScript 中的 this 可以用于任何函数，即使它不是对象的方法。比如

```javascript
// 这也并不会有语法错误

function sayHi() {
  alert(this.name);
}
```

**this 的值是在代码运行时计算出来的，它取决于代码上下文。**例如：

```javascript
let user = { name: "John" };
let admin = { name: "Admin" };

function sayHi() {
  alert(this.name);
}

// 在两个对象中使用相同的函数
user.f = sayHi;
admin.f = sayHi;

// 这两个调用有不同的 this 值
// 函数内部的 "this" 是“点符号前面”的那个对象
user.f(); // John（this == user）
admin.f(); // Admin（this == admin）

admin["f"](); // Admin（使用点符号或方括号语法来访问这个方法，都没有关系。）
```

也就是：如果 obj.f() 被调用了，则 this 在 f 函数调用期间是 obj。所以在上面的例子中 this 先是 user，之后是 admin。

::: warning 在没有对象的情况下调用：this == undefined
我们甚至可以在没有对象的情况下调用函数：

```javascript
function sayHi() {
  alert(this);
}

sayHi(); // undefined
```

在这种情况下，严格模式下的 this 值为 undefined。如果我们尝试访问 this.name，将会报错。

在非严格模式的情况下，this 将会是 全局对象（浏览器中的 window）。这是一个历史行为，"use strict" 已经将其修复了。

通常这种调用是程序出错了。如果在一个函数内部有 this，那么通常意味着它是在对象上下文环境中被调用的。
:::
::: tip 解除 this 绑定的后果
如果你经常使用其他的编程语言，那么你可能已经习惯了“绑定 this”的概念，即在对象中定义的方法总是有指向该对象的 this。

在 JavaScript 中，this 是“自由”的，它的值是在调用时计算出来的，它的值并不取决于方法声明的位置，而是取决于在“点符号前”的是什么对象。

在运行时对 this 求值的这个概念既有优点也有缺点。一方面，函数可以被重用于不同的对象。另一方面，更大的灵活性造成了更大的出错的可能。

这里我们的立场并不是要评判编程语言的这个设计是好是坏。而是要了解怎样使用它，如何趋利避害。
:::

### 箭头函数没有自己的 “this”

箭头函数有些特别：它们没有自己的 this。如果我们在这样的函数中引用 this，this 值取决于外部“正常的”函数。

举个例子，这里的 arrow() 使用的 this 来自于外部的 user.sayHi() 方法：

```javascript
let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => alert(this.firstName);
    arrow();
  },
};

user.sayHi(); // Ilya
```

这是箭头函数的一个特性，当我们并不想要一个独立的 this，反而想从外部上下文中获取时，它很有用。后面再讲到箭头函数的时候我们会再讨论一下。

另外，JavaScript INFO 后面的三个小 Task 都挺有意思的：https://zh.javascript.info/object-methods 可以加深对 this 的理解。

## 构造器和操作符 new

我们经常需要**创建很多类似的对象**，例如多个用户或菜单项等。这可以使用构造函数和 "new" 操作符来实现。

### 构造函数

构造函数在技术上是常规函数。不过有两个约定：

1. 它们的命名以大写字母开头。
2. 它们只能由 "new" 操作符来执行。

比如：

```javascript
function User(name) {
  this.name = name;
  this.isAdmin = false;
}

let user = new User("Jack");

alert(user.name); // Jack
alert(user.isAdmin); // false

// 其实就是得到了对象：
user = {
  name: "Jack",
  isAdmin: false,
};
```

当一个函数被使用 new 操作符执行时，它按照以下步骤：

- 一个新的空对象被创建并分配给 this。
- 函数体执行。通常它会修改 this，为其添加新的属性。
- 返回 this 的值。

也就是：

```javascript
function User(name) {
  // this = {};（隐式创建）

  // 添加属性到 this
  this.name = name;
  this.isAdmin = false;

  // return this;（隐式返回）
}
```

现在，如果我们想创建其他用户，我们可以调用 new User("Ann")，new User("Alice") 等。比每次都使用字面量创建要短得多，而且更易于阅读。这是构造器的主要目的 —— **实现可重用的对象创建代码**。

让我们再强调一遍 —— 从技术上讲，任何函数（除了箭头函数，它没有自己的 this）都可以用作构造器。即可以通过 new 来运行，它会执行上面的算法。“首字母大写”是一个共同的约定，以明确表示一个函数将被使用 new 来运行。

::: tip `new function() { … }`
如果我们有许多行用于创建单个复杂对象的代码，我们可以将它们封装在一个立即调用的构造函数中，像这样：

```javascript
// 创建一个函数并立即使用 new 调用它
let user = new (function () {
  this.name = "John";
  this.isAdmin = false;

  // ……用于用户创建的其他代码
  // 也许是复杂的逻辑和语句
  // 局部变量等
})();
```

这个构造函数**不能被再次调用**，因为它不保存在任何地方，只是被创建和调用。因此，这个技巧旨在封装构建单个对象的代码，而无需将来重用。

还要注意，这个和 `new Function` 不是一个东西！我们会在后面的章节讲到 `new Function `
:::

### 关于 new.target

它其实很少被使用。不过还是提一嘴。

在一个函数内部，我们可以使用 new.target 属性来检查它是否被使用 new 进行调用了。对于常规调用，它为 undefined，对于使用 new 的调用，则等于该函数：

```javascript
function User() {
  alert(new.target);
}

// 不带 "new"：
User(); // undefined

// 带 "new"：
new User(); // function User { ... }
```

它可以被用在函数内部，来判断该函数是被通过 new 调用的“构造器模式”，还是没被通过 new 调用的“常规模式”。

我们也可以让 new 调用和常规调用做相同的工作，像这样：

```javascript
function User(name) {
  if (!new.target) {
    // 如果你没有通过 new 运行我
    return new User(name); // ……我会给你添加 new
  }

  this.name = name;
}

let john = User("John"); // 将调用重定向到新用户
alert(john.name); // John
```

这种方法有时被用在库中以使语法更加灵活。这样人们在调用函数时，无论是否使用了 new，程序都能工作。

不过，到处都使用它并不是一件好事，因为省略了 new 使得很难观察到代码中正在发生什么。而通过 new 我们都可以知道这创建了一个新对象。

### 构造器的 return

通常，构造器没有 return 语句。但是有 return 的时候：

- 如果 return 返回的是一个对象，则返回这个对象，而不是 this。
- 如果 return 返回的是一个原始类型，则忽略。

比如：

```JavaScript
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" };  // <-- 返回这个对象
}
alert( new BigUser().name );  // Godzilla，得到了那个对象

// return 为空（或者我们可以在它之后放置一个原始类型，没有什么影响）
function SmallUser() {
  this.name = "John";
  return; // <-- 返回 this
}
alert( new SmallUser().name );  // John
```

通常构造器没有 return 语句。这里我们主要为了完整性而提及返回对象的特殊行为。

### 构造器中的方法

使用构造函数来创建对象会带来很大的灵活性。构造函数可能有一些参数，这些参数定义了如何构造对象以及要放入什么。

当然，我们不仅可以将属性添加到 this 中，还可以添加方法。比如：

```javascript
function User(name) {
  this.name = name;

  this.sayHi = function () {
    alert("My name is: " + this.name);
  };
}

let john = new User("John");

john.sayHi(); // My name is: John

/* 相当于
john = {
   name: "John",
   sayHi: function() { ... }
}
*/
```

关于对象，我们在 `原型，继承` 和 `类` 章节中还会继续深入介绍它们

## 可选链 ?.

::: tip
可选链是在 ECMAScript 2020 中引入的一项功能，它简化了在中间属性可能为 null 或 undefined 时访问嵌套对象或数组的属性和方法的过程。
:::
可选链 ?. 是一种访问嵌套对象属性的安全的方式。即使中间的属性不存在，也不会出现错误。

### 先来讨论一下：“不存在的属性”

举个例子，假设我们有很多个 user 对象，其中存储了我们的用户数据。

我们大多数用户的地址都存储在 user.address 中，街道地址存储在 user.address.street 中，但有些用户没有提供这些信息。

在这种情况下，当我们尝试获取 user.address.street，而该用户恰好没提供地址信息，我们则会收到一个错误：

```javascript
let user = {}; // 一个没有 "address" 属性的 user 对象

alert(user.address.street); // Error!
```

**但是在很多实际场景中，我们更希望得到的是 undefined（表示没有 street 属性）而不是一个错误。**

又比如：

我们使用 dom 操作时（例如 document.querySelector('.elem')）**以对象的形式**获取一个网页元素，如果没有这种对象，则返回 null。

```javascript
// 如果 document.querySelector('.elem') 的结果为 null，则这里不存在这个元素
let html = document.querySelector(".elem").innerHTML;
// 如果 document.querySelector('.elem') 的结果为 null，这句代码则会出现错误
```

如果该元素不存在，则访问 null 的 .innerHTML 属性时会报错。在某些情况下，当元素的缺失是没问题的时候，我们希望避免出现这种错误，而是接受 html = null 作为结果。

OK，现在我们想在前者能得到 undefined ，后者能得到 null，那么可以分别写出下面的代码：

```javascript
// 1
let user = {};
alert(user.address ? user.address.street : undefined);

// 2
let html = document.querySelector(".elem")
  ? document.querySelector(".elem").innerHTML
  : null;

// 对于嵌套层次更深的属性，代码会变得更丑，因为需要更多的重复。
// 例如，让我们以相同的方式尝试获取 user.address.street.name
alert(
  user.address ? (user.address.street ? user.address.street.name : null) : null
);

// 当然也可以用 && 运算符
alert(user.address && user.address.street && user.address.street.name);

// 不过还是不够优雅
```

可选链 `?.` 被加入到了 JavaScript 这门编程语言中，就是为了简单地进行对整条路径上的属性使用与运算进行判断。

### 我该如何使用？

如果可选链 `?.` 前面的值为 undefined 或者 null，它会停止运算并返回 undefined。
::: tip 声明
为了简明起见，在接下来的内容中，我们会说如果一个属性既不是 null 也不是 undefined，那么它就“存在”。
:::

例如 `value?.prop`：

- 如果 value 存在，则结果与 value.prop 相同，
- 否则（当 value 为 undefined/null 时）则返回 undefined。

又比如我们想去安全地访问 user.address.street：

``` javascript
let user = {}; // user 没有 address 属性
alert( user?.address?.street ); // undefined（不报错）
```

对于 `document.querySelector`：
``` javascript
let html = document.querySelector('.elem')?.innerHTML; // 如果没有符合的元素，则为 undefined
```
::: tip
?. 语法使其前面的值成为可选值，但不会对其后面的起作用。

例如，在 user?.address.street.name 中，?. 允许 user 为 null/undefined（在这种情况下会返回 undefined）也不会报错，但这仅对于 user。更深层次的属性是通过常规方式访问的。如果我们希望它们中的一些也是可选的，那么我们需要使用更多的 ?. 来替换 .。
:::
::: warning 不要过度使用可选链
我们应该只将 ?. 使用在一些东西可以不存在的地方。

例如，如果根据我们的代码逻辑，user 对象必须存在，但 address 是可选的，那么我们应该这样写 user.address?.street，而不是这样 user?.address?.street。

那么，如果 user 恰巧为 undefined，我们会看到一个编程错误并修复它。否则，如果我们滥用 ?.，会导致代码中的错误在不应该被消除的地方消除了，这会导致调试更加困难。
:::
::: warning `?.` 前的变量必须已声明
如果未声明变量 user，那么 user?.anything 会触发一个错误：

```javascript
// ReferenceError: user is not defined
user?.address;
```
?. 前的变量必须已声明（例如 let/const/var user 或作为一个函数参数）。可选链**仅适用于已声明的变量**。
:::

### 短路效应
如果 ?. 左边部分不存在，就会立即停止运算（“短路效应”）。因此，如果在 ?. 的右侧有任何进一步的函数调用或操作，它们均不会执行。

### ?.() 和 ?.[]
可选链 ?. 不是一个运算符，而是一个特殊的语法结构。它还可以与函数和方括号一起使用。

例如，将 ?.() 用于调用一个可能不存在的函数。

在下面这段代码中，userAdmin 具有 admin 方法，而 userGuest 没有：

```javascript
let userAdmin = {
  admin() {
    alert("I am admin");
  }
};
let userGuest = {};
userAdmin.admin?.(); // I am admin
userGuest.admin?.(); // 啥都没发生（没有这样的方法）
```

如果我们想使用方括号 [] 而不是点符号 . 来访问属性，语法 ?.[] 也可以使用。跟前面的例子类似，它允许从一个可能不存在的对象上安全地读取属性。

```javascript
let key = "firstName";

let user1 = {
  firstName: "John"
};

let user2 = null;

alert( user1?.[key] ); // John
alert( user2?.[key] ); // undefined
```

我们还可以将 `?.` 跟 delete 一起使用，所以我们可以使用 `?.` 来安全地读取或删除，但不能写入：

```javascript
delete user?.name; // 如果 user 存在，则删除 user.name
```

### 总而言之：

- `obj?.prop` —— 如果 `obj` 存在则返回 `obj.prop`，否则返回 `undefined。`
- `obj?.[prop]` —— 如果 `obj` 存在则返回 `obj[prop]`，否则返回 `undefined。`
- `obj.method?.()` —— 如果 `obj`.method 存在则调用 `obj.method()`，否则返回 `undefined。`

## symbol 类型
我们前面说了：作为对象属性键只能用两种原始类型：字符串和symbol，我们这里来讲讲symbol，它能给我们带来什么。

**“symbol” 值表示唯一的标识符**。

可以使用 Symbol() 来创建这种类型的值：

``` javascript
let id1 = Symbol();

// 我们可以给 symbol 一个描述（也称为 symbol 名）
// 这在代码调试时非常有用：

// id 是描述为 "id" 的 symbol
let id2 = Symbol("id2");
```
symbol 保证是唯一的。即使我们创建了许多具有相同描述的 symbol，它们的值也是不同。描述只是一个标签，不影响任何东西。

总而言之，symbol 是`带有可选描述的“原始唯一值”`。让我们看看我们可以在哪里使用它们。

::: warning symbol 不会被自动转换为字符串
JavaScript 中的大多数值都支持字符串的隐式转换。例如，我们可以 alert 任何值，都可以生效。symbol 比较特殊，它不会被自动转换。

这是一种防止混乱的“语言保护”，因为字符串和 symbol 有本质上的不同，不应该意外地将它们转换成另一个。

如果我们真的想显示一个 symbol，我们需要在它上面调用 .toString()，比如：
``` javascript
let id = Symbol("id");
alert(id.toString()); // 输出：Symbol(id)
```

获取 symbol.description 属性，只显示描述（description）：
``` javascript
let id = Symbol("id");
alert(id.description); // id
```
:::

### “隐藏”属性
symbol 允许我们创建对象的“隐藏”属性，**代码的任何其他部分都不能意外访问或重写这些属性**。

比如：

``` javascript
let user = { // 假设user对象属于另一个代码库
  name: "John"
};
let id = Symbol("id");
user[id] = 1;
alert( user[id] ); // 我们可以使用 symbol 作为键来访问数据
```
使用 Symbol("id") 作为键，比起用字符串 "id" 来有什么好处呢？

由于 user 对象属于另一个代码库，所以向它们添加字段是不安全的，因为我们可能会影响代码库中的其他预定义行为。但 symbol 属性不会被意外访问到。第三方代码不会知道新定义的 symbol，因此将 symbol 添加到 user 对象是安全的。

如果我们要在对象字面量 {...} 中使用 symbol，则需要使用方括号把它括起来。

就像这样：

``` javascript
let id = Symbol("id");

let user = {
  name: "John",
  [id]: 123 // 而不是 "id"：123
};

// 这是因为我们需要变量 id 的值作为键，而不是字符串 “id”。
```
::: tip symbol 在 for…in 中会被跳过
symbol 属性不参与 for..in 循环。

比如：

``` javascript
let id = Symbol("id");
let user = {
  name: "John",
  age: 30,
  [id]: 123
};

for (let key in user) alert(key); // name, age（没有 symbol）

// 使用 symbol 任务直接访问
alert("Direct: " + user[id]); // Direct: 123
// Object.keys(user) 也会忽略它们。
// 这是一般“隐藏符号属性”原则的一部分。
// 如果另一个脚本或库遍历我们的对象，它不会意外地访问到符号属性。
```
但是，Object.assign 会同时复制字符串和 symbol 属性：
``` javascript
let id = Symbol("id");
let user = {
  [id]: 123
};

let clone = Object.assign({}, user);

alert( clone[id] ); // 123
```
这里并不矛盾，就是这样设计的。这里的想法是当我们**克隆或者合并**一个 object 时，通常希望 `所有` 属性被复制（包括像 id 这样的 symbol）。
:::

### 全局 symbol
正如我们所看到的，通常所有的 symbol 都是不同的，即使它们有相同的名字。但有时我们想要名字相同的 symbol 具有相同的实体。例如，应用程序的不同部分想要访问的 symbol "id" 指的是完全相同的属性。

我们可以通过 `全局 symbol 注册表` 来实现这个功能。

要从注册表中读取（不存在则创建）symbol，请使用 Symbol.for(key)。

该调用会检查全局注册表，如果有一个描述为 key 的 symbol，则返回该 symbol，否则将创建一个新 symbol（Symbol(key)），并通过给定的 key 将其存储在注册表中。

例如：

``` javascript
// 从全局注册表中读取
let id = Symbol.for("id"); // 如果该 symbol 不存在，则创建它

// 再次读取（可能是在代码中的另一个位置）
let idAgain = Symbol.for("id");

// 相同的 symbol
alert( id === idAgain ); // true
```
如果我们想要一个应用程序范围内的 symbol，可以在代码中随处访问 —— 这就是它们的用途。

相反，通过全局 symbol 返回一个名字，我们可以使用 Symbol.keyFor(sym)：

例如：
``` javascript
// 通过 name 获取 symbol
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// 通过 symbol 获取 name
alert( Symbol.keyFor(sym) ); // name
alert( Symbol.keyFor(sym2) ); // id
```
但是它仅仅适用于全局symbol,如果 symbol 不是全局的，它将无法找到它并返回 undefined。

### 系统 symbol
JavaScript 内部有很多“系统” symbol，我们可以使用它们来微调对象的各个方面。

`symbol` 有很多方法，比如 `Symbol.toPrimitive` 允许我们将对象描述为原始值转换。

::: tip 
从技术上说，symbol 不是 100% 隐藏的。有一个内建方法 Object.getOwnPropertySymbols(obj) 允许我们获取所有的 symbol。还有一个名为 Reflect.ownKeys(obj) 的方法可以返回一个对象的 所有 键，包括 symbol。但大多数库、内建方法和语法结构都没有使用这些方法。
:::

## 对象 —— 原始值转换

当对象相加 obj1 + obj2，相减 obj1 - obj2，或者使用 alert(obj) 打印时会发生什么？

JavaScript 不允许自定义运算符对对象的处理方式。与其他一些编程语言（Ruby，C++）不同，我们无法实现特殊的对象处理方法来处理加法（或其他运算）。

在此类运算的情况下，对象会被自动转换为原始值，然后对这些原始值进行运算，并得到运算结果（也是一个原始值）。

因此，由于我们从技术上无法实现此类运算，所以在实际项目中不存在对对象的数学运算。如果你发现有，除了极少数例外，通常是写错了。

我们有两个目的：

- 让我们在遇到类似的对对象进行数学运算的编程错误时，能够更加理解到底发生了什么。
- 也有例外，这些操作也可以是可行的。例如日期相减或比较（Date 对象）。我们稍后会遇到它们。

### 转换规则
现在我们已经掌握了方法（method）和 symbol 的相关知识，可以开始学习对象原始值转换了。

会发生什么？

- 没有转换为布尔值。所有的对象在布尔上下文（context）中均为 true，就这么简单。只有字符串和数字转换。
- 数字转换发生在对象相减或应用数学函数时。例如，Date 对象（将在 日期和时间 一章中介绍）可以相减，date1 - date2 的结果是两个日期之间的差值。
- 至于字符串转换 —— 通常发生在我们像 alert(obj) 这样输出一个对象和类似的上下文中。

我们可以使用特殊的对象方法，自己实现字符串和数字的转换。

现在让我们一起探究技术细节，因为这是深入讨论该主题的唯一方式。

### hint
JavaScript 是如何决定应用哪种转换的？

类型转换在各种情况下有三种变体。它们被称为 “hint”:

- `"string"`：对象到字符串的转换，当我们对期望一个字符串的对象执行操作时，如 “alert”
- `"number"`：对象到数字的转换，例如当我们进行数学运算时；大多数内建的数学函数也包括这种转换。
- `"default"`：在少数情况下发生，当运算符“不确定”期望值的类型时。例如，二元加法 + 可用于字符串（连接），也可以用于数字（相加）。因此，当二元加法得到对象类型的参数时，它将依据 "default" hint 来对其进行转换。此外，如果对象被用于与字符串、数字或 symbol 进行 == 比较，这时到底应该进行哪种转换也不是很明确，因此使用 "default" hint。

除了一种情况（Date 对象，我们稍后会讲到）之外，所有内建对象都以和 "number" 相同的方式实现 "default" 转换。

::: tip
为了进行转换，JavaScript 尝试查找并调用三个对象方法：

- 调用 obj[Symbol.toPrimitive]() —— 带有 symbol 键 Symbol.toPrimitive（系统 symbol）的方法，如果这个方法存在的话，
- 否则，如果 hint 是 "string" —— 尝试调用 obj.toString() 或 obj.valueOf()，无论哪个存在。
- 否则，如果 hint 是 "number" 或 "default" —— 尝试调用 obj.valueOf() 或 obj.toString()，无论哪个存在。
:::

### Symbol.toPrimitive
我们从第一个方法开始。有一个名为 Symbol.toPrimitive 的内建 symbol，它被用来给转换方法命名，像这样：
``` javascript
obj[Symbol.toPrimitive] = function(hint) {
  // 这里是将此对象转换为原始值的代码
  // 它必须返回一个原始值
  // hint = "string"、"number" 或 "default" 中的一个
}
```
如果 Symbol.toPrimitive 方法存在，则它会被用于所有 hint，无需更多其他方法。
``` javascript
// 例如这里 user 对象实现了它

let user = {
  name: "John",
  money: 1000,

  [Symbol.toPrimitive](hint) {
    alert(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};

// 转换演示：
alert(user); // hint: string -> {name: "John"}
alert(+user); // hint: number -> 1000
alert(user + 500); // 二元运算，为 default，hint: default -> 1500
```

### toString/valueOf
如果没有 Symbol.toPrimitive，那么 JavaScript 将尝试寻找 toString 和 valueOf 方法：

- 对于 "string" hint：调用 toString 方法，如果它不存在，则调用 valueOf 方法（因此，对于字符串转换，优先调用 toString）。
- 对于其他 hint：调用 valueOf 方法，如果它不存在，则调用 toString 方法（因此，对于数学运算，优先调用 valueOf 方法）。

`toString` 和 `valueOf` 方法很早己有了。它们不是 symbol（那时候还没有 symbol 这个概念），而是“常规的”字符串命名的方法。它们提供了一种可选的“老派”的实现转换的方法。

这些方法必须返回一个原始值。如果 toString 或 valueOf 返回了一个对象，那么返回值会被忽略（和这里没有方法的时候相同）。

默认情况下，普通对象具有 toString 和 valueOf 方法：

- `toString` 方法返回一个字符串 "[object Object]"。
- `valueOf` 方法返回对象自身。

例如：

``` javascript
let user = {
  name: "John",
  money: 1000,

  // 对于 hint="string"
  toString() {
    return `{name: "${this.name}"}`;
  },

  // 对于 hint="number" 或 "default"
  valueOf() {
    return this.money;
  }

};

alert(user); // toString -> {name: "John"}
alert(+user); // valueOf -> 1000
alert(user + 500); // valueOf -> 1500
```
::: warning 转换可以返回任何原始类型
关于所有原始转换方法，有一个重要的点需要知道，就是它们不一定会返回 “hint” 的原始值。

没有限制 toString() 是否返回字符串，或 Symbol.toPrimitive 方法是否为 "number" hint 返回数字。

唯一强制性的事情是：这些方法必须返回一个原始值，而不是对象。

由于历史原因，如果 toString 或 valueOf 返回一个对象，则不会出现 error，但是这种值会被忽略（就像这种方法根本不存在）。这是因为在 JavaScript 语言发展初期，没有很好的 “error” 的概念。

相反，Symbol.toPrimitive 更严格，它 必须 返回一个原始值，否则就会出现 error。
:::

### 进一步的转换
我们已经知道，许多运算符和函数执行类型转换，例如乘法 * 将操作数转换为数字。

如果我们将对象作为参数传递，则会出现两个运算阶段：

- 对象被转换为原始值（通过前面我们描述的规则）。
- 如果还需要进一步计算，则生成的原始值会被进一步转换。

例如：

``` javascript
let obj = {
  // toString 在没有其他方法的情况下处理所有转换
  toString() {
    return "2";
  }
};

alert(obj * 2); // 4，对象被转换为原始值字符串 "2"，之后它被乘法转换为数字 2。
```
- 乘法 obj * 2 首先将对象转换为原始值（字符串 “2”）。
- 之后 "2" * 2 变为 2 * 2（字符串被转换为数字）

二元加法在同样的情况下会将其连接成字符串，因为它更愿意接受字符串：

``` javascript
let obj = {
  toString() {
    return "2";
  }
};

alert(obj + 2); // 22（"2" + 2）被转换为原始值字符串 => 级联
```
### 总而言之：

对象到原始值的转换，是由许多期望以原始值作为值的内建函数和运算符自动调用的。

这里有三种类型（hint）：

- `"string"`（对于 alert 和其他需要字符串的操作）
- `"number"`（对于数学运算）
- `"default"`（少数运算符，通常对象以和 "number" 相同的方式实现 "default" 转换）
规范明确描述了哪个运算符使用哪个 hint。

转换算法是：

1. 调用 `obj[Symbol.toPrimitive](hint)` 如果这个方法存在，
2. 否则，如果 hint 是 "string"
  - 尝试调用 obj.toString() 或 obj.valueOf()，无论哪个存在。
3. 否则，如果 hint 是 "number" 或者 "default"
  - 尝试调用 obj.valueOf() 或 obj.toString()，无论哪个存在。
所有这些方法都必须返回一个原始值才能工作（如果已定义）。

在实际使用中，通常只实现 obj.toString() 作为字符串转换的“全能”方法就足够了，该方法应该返回对象的“人类可读”表示，用于日志记录或调试。
