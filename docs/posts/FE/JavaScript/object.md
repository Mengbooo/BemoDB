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
如果我们用上面的 `Object.assign` 的方法来克隆它，那么克隆出来的新对象和原来的user对象会共用一个sizes，因为user.sizes 是个对象，它会以引用形式被拷贝。

为了解决这个问题，并让 user 和 clone 成为两个真正独立的对象，我们应该使用一个拷贝循环来检查 user[key] 的每个值，如果它是一个对象，那么也复制它的结构。这就是所谓的` 深拷贝 `。我们可以使用递归来实现它，可以采用现有的实现，例如 `lodash` 库的 `_.cloneDeep(obj)`。

::: tip 使用 const 声明的对象也是可以被修改的
通过引用对对象进行存储的一个重要的副作用是声明为 `const` 的对象 **可以** 被修改。
```javascript
const user = {
  name: "John"
};

user.name = "Pete"; // (*)

alert(user.name); // Pete
```
也就是说：user 的值是一个常量，它必须始终引用同一个对象，**但该对象的属性可以被自由修改**。换句话说，只有当我们尝试将 `user=...` 作为**一个整体**进行赋值时，`const user` 才会报错。

如果我们真的需要创建常量对象属性，也可以，但使用的是完全不同的方法。我们将在 `属性标志和属性描述符` 中学习它。
:::







































